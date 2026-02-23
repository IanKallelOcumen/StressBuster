import Constants from 'expo-constants';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore';
import { useRef, useState } from 'react';
import { ActivityIndicator, Alert, PanResponder, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import GlassCard from '../ui/GlassCard';
import GradientBackground from '../ui/GradientBackground';
import { useDev } from '../../context/DevContext';
import { safeHaptics, ImpactFeedbackStyle, NotificationFeedbackType } from '../../utils/haptics';
import { scaleMinigameReward } from '../../utils/zenTokens';

const MandalaDraw = ({ onBack, colors, updateTokens, sfxEnabled }) => {
  const { getPath, isDevMode } = useDev();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const size = Math.min(width - 32, 360);
  const center = size / 2;
  
  // Drawing State
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  
  // Tool State
  const [color, setColor] = useState('#FF2D55');
  const [brushSize, setBrushSize] = useState(3);
  const [brushOpacity, setBrushOpacity] = useState(1);
  const [symmetry, setSymmetry] = useState(8);
  const [showGrid, setShowGrid] = useState(true);
  const [activeTool, setActiveTool] = useState('color'); // color, size, opacity, symmetry
  const [saving, setSaving] = useState(false);

  const currentPathRef = useRef([]);
  const settingsRef = useRef({ color, brushSize, brushOpacity, symmetry });
  settingsRef.current = { color, brushSize, brushOpacity, symmetry };

  const autoScrollRef = useRef(null);

  // ...

  const handleColorPress = (c, index) => {
    setColor(c);
    // Optional: Auto-scroll to center the selected color
    autoScrollRef.current?.scrollTo({ x: index * 44 - 100, animated: true });
  };const palette = [
    '#FF2D55', '#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#4CD964', '#007AFF',
    '#5AC8FA', '#5856D6', '#AF52DE', '#8E8E93', '#000000', '#FFFFFF'
  ]; // Unique colors only
  const SYMMETRY_OPTIONS = [4, 6, 8, 12, 16, 32];

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        currentPathRef.current = [];
        setCurrentPath([]);
        setRedoStack([]); // Clear redo on new action
      },
      onPanResponderMove: (evt) => {
        // Use locationX/Y which are relative to the view responding to the pan
        const { locationX, locationY } = evt.nativeEvent;
        
        // Add boundary checks
        if (locationX >= 0 && locationX <= size && locationY >= 0 && locationY <= size) {
          const point = { x: locationX, y: locationY };
          currentPathRef.current.push(point);
          // Throttle updates if needed, but for now direct set is fine
          setCurrentPath([...currentPathRef.current]);
        }
      },
      onPanResponderRelease: () => {
        if (currentPathRef.current.length > 0) {
          const { color: sColor, brushSize: sSize, brushOpacity: sOpacity, symmetry: sSym } = settingsRef.current;
          const newPath = {
            points: currentPathRef.current,
            color: sColor,
            width: sSize,
            opacity: sOpacity,
            symmetry: sSym
          };
          setPaths(prev => [...prev, newPath]);
          setCurrentPath([]);
          currentPathRef.current = [];
          if (sfxEnabled) safeHaptics.selectionAsync();
        }
      }
    })
  ).current;

  // --- Drawing Logic ---

  const rotatePoint = (x, y, angleRad) => {
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    const dx = x - center;
    const dy = y - center;
    return {
      x: center + (dx * cos - dy * sin),
      y: center + (dx * sin + dy * cos)
    };
  };

  const createPathD = (points, symCount) => {
    if (points.length < 2) return '';
    
    let d = '';
    const angleStep = (2 * Math.PI) / symCount;

    for (let i = 0; i < symCount; i++) {
      const angle = i * angleStep;
      
      // Start point
      const p0 = rotatePoint(points[0].x, points[0].y, angle);
      d += `M${p0.x.toFixed(1)},${p0.y.toFixed(1)} `;

      // Line segments
      for (let j = 1; j < points.length; j++) {
        const p = rotatePoint(points[j].x, points[j].y, angle);
        d += `L${p.x.toFixed(1)},${p.y.toFixed(1)} `;
      }
    }
    return d;
  };

  // --- Actions ---

  const undo = () => {
    if (paths.length === 0) return;
    const last = paths[paths.length - 1];
    setPaths(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, last]);
    if (sfxEnabled) safeHaptics.impactAsync(ImpactFeedbackStyle.Light);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setPaths(prev => [...prev, next]);
    if (sfxEnabled) safeHaptics.impactAsync(ImpactFeedbackStyle.Light);
  };

  const clearCanvas = () => {
    Alert.alert("Clear Canvas", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Clear", 
        style: "destructive", 
        onPress: () => {
          setPaths([]);
          setRedoStack([]);
          if (sfxEnabled) safeHaptics.notificationAsync(NotificationFeedbackType.Warning);
        }
      }
    ]);
  };

  const saveMandala = async () => {
    if (paths.length === 0) return;
    setSaving(true);
    try {
      const db = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user) {
        const appId = Constants.expoConfig.extra.firebaseAppId;
        const path = getPath(`artifacts/${appId}/users/${user.uid}/mandalas`);
        await addDoc(collection(db, path), {
          paths: JSON.stringify(paths),
          createdAt: serverTimestamp(),
          symmetry,
          colors: [...new Set(paths.map(p => p.color))]
        });
        
        const reward = scaleMinigameReward(15);
        if (updateTokens) updateTokens(reward, 'mandala_creation');
        Alert.alert(isDevMode ? "Saved (DEV)!" : "Saved!", `Your masterpiece has been saved to your gallery. +${reward} Tokens`);
        if (sfxEnabled) safeHaptics.notificationAsync(NotificationFeedbackType.Success);
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not save your mandala.");
    } finally {
      setSaving(false);
    }
  };

  // --- UI Components ---

  const GridOverlay = () => {
    if (!showGrid) return null;
    const lines = [];
    const angleStep = (2 * Math.PI) / symmetry;
    
    for (let i = 0; i < symmetry; i++) {
      const angle = i * angleStep;
      const x2 = center + (size * Math.cos(angle));
      const y2 = center + (size * Math.sin(angle));
      lines.push(
        <Line
          key={i}
          x1={center}
          y1={center}
          x2={x2}
          y2={y2}
          stroke={colors.text}
          strokeOpacity={0.1}
          strokeWidth={1}
        />
      );
    }
    
    // Concentric circles
    lines.push(<Circle key="c1" cx={center} cy={center} r={size * 0.2} stroke={colors.text} strokeOpacity={0.05} fill="none" />);
    lines.push(<Circle key="c2" cx={center} cy={center} r={size * 0.35} stroke={colors.text} strokeOpacity={0.05} fill="none" />);
    
    return <>{lines}</>;
  };

  const ToolButton = ({ label, icon, active, onPress }) => (
    <TouchableOpacity 
      onPress={onPress}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 16,
        backgroundColor: active ? colors.accent : colors.tileBg,
        borderWidth: 1,
        borderColor: active ? colors.accent : colors.text + '10',
        minWidth: 60,
        alignItems: 'center'
      }}
    >
      <Text style={{ fontSize: 18, marginBottom: 2 }}>{icon}</Text>
      <Text style={{ fontSize: 10, fontWeight: '600', color: active ? '#fff' : colors.text }}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <GradientBackground colors={colors}>
      <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }]}>
        
        {/* Top Bar */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
            <Text style={{ fontSize: 20 }}>←</Text>
          </TouchableOpacity>
          
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity onPress={undo} disabled={paths.length === 0} style={{ opacity: paths.length ? 1 : 0.3 }}>
              <Text style={{ fontSize: 24 }}>↩️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={redo} disabled={redoStack.length === 0} style={{ opacity: redoStack.length ? 1 : 0.3 }}>
              <Text style={{ fontSize: 24 }}>↪️</Text>
            </TouchableOpacity>
          </View>
          
          <View style={{ flexDirection: 'row', gap: 12 }}>
             <TouchableOpacity onPress={() => setShowGrid(!showGrid)} style={{ opacity: showGrid ? 1 : 0.5 }}>
              <Text style={{ fontSize: 24 }}>🕸️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={saveMandala} disabled={saving} style={{ opacity: saving ? 0.5 : 1 }}>
              {saving ? <ActivityIndicator size="small" color={colors.text} /> : <Text style={{ fontSize: 24 }}>💾</Text>}
            </TouchableOpacity>
          </View>
        </View>

        {/* Canvas */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <GlassCard 
            colors={colors}
            color={colors.tileBg}
            style={[styles.canvasContainer, { borderColor: colors.text + '20', width: size, height: size }]}
          >
            <Svg height={size} width={size}>
              <GridOverlay />
              
              {paths.map((p, i) => (
                <Path
                  key={i}
                  d={createPathD(p.points, p.symmetry)}
                  stroke={p.color}
                  strokeWidth={p.width}
                  strokeOpacity={p.opacity}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
              
              {currentPath.length > 0 && (
                <Path
                  d={createPathD(currentPath, symmetry)}
                  stroke={color}
                  strokeWidth={brushSize}
                  strokeOpacity={brushOpacity}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </Svg>
            
            {/* Gesture Capture Overlay */}
            <View 
              style={[StyleSheet.absoluteFill, { cursor: 'crosshair', touchAction: 'none' }]}
              {...panResponder.panHandlers}
            />
          </GlassCard>
          <Text style={{ color: colors.subtext, fontSize: 12, marginTop: 12 }}>
            {paths.length} layers • {symmetry}x symmetry
          </Text>
        </View>

        {/* Controls Area */}
        <GlassCard style={styles.controlsContainer} colors={colors}>
          
          {/* Active Tool Config */}
          <View style={styles.toolConfigArea}>
            {activeTool === 'color' && (
              <ScrollView 
                ref={autoScrollRef}
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={{ gap: 8, paddingHorizontal: 4 }}
              >
                {palette.map((c, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[styles.colorBtn, { backgroundColor: c, borderWidth: color === c ? 3 : 0, borderColor: colors.text }]}
                    onPress={() => handleColorPress(c, i)}
                  />
                ))}
              </ScrollView>
            )}

            {activeTool === 'size' && (
              <View style={styles.sliderRow}>
                <Text style={{ color: colors.text, width: 40 }}>{brushSize}px</Text>
                {[2, 4, 6, 8, 12, 16].map(s => (
                  <TouchableOpacity 
                    key={s} 
                    onPress={() => setBrushSize(s)}
                    style={{ 
                      width: 36, height: 36, borderRadius: 18, 
                      backgroundColor: brushSize === s ? colors.accent : colors.tileBg,
                      justifyContent: 'center', alignItems: 'center'
                    }}
                  >
                    <View style={{ width: s, height: s, borderRadius: s/2, backgroundColor: brushSize === s ? '#fff' : colors.text }} />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {activeTool === 'opacity' && (
              <View style={styles.sliderRow}>
                 <Text style={{ color: colors.text, width: 40 }}>{Math.round(brushOpacity * 100)}%</Text>
                 {[0.1, 0.3, 0.5, 0.8, 1.0].map(o => (
                  <TouchableOpacity 
                    key={o} 
                    onPress={() => setBrushOpacity(o)}
                    style={{ 
                      paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12,
                      backgroundColor: brushOpacity === o ? colors.accent : colors.tileBg,
                    }}
                  >
                    <Text style={{ color: brushOpacity === o ? '#fff' : colors.text, fontWeight: 'bold' }}>{o * 100}%</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {activeTool === 'symmetry' && (
               <View style={styles.sliderRow}>
                <Text style={{ color: colors.text, width: 40 }}>{symmetry}x</Text>
                {SYMMETRY_OPTIONS.map(s => (
                  <TouchableOpacity 
                    key={s} 
                    onPress={() => setSymmetry(s)}
                    style={{ 
                      width: 36, height: 36, borderRadius: 18, 
                      backgroundColor: symmetry === s ? colors.accent : colors.tileBg,
                      justifyContent: 'center', alignItems: 'center',
                      borderWidth: 1, borderColor: colors.text + '10'
                    }}
                  >
                    <Text style={{ color: symmetry === s ? '#fff' : colors.text, fontWeight: 'bold', fontSize: 12 }}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Tool Selector Bar */}
          <View style={styles.toolBar}>
            <ToolButton label="Color" icon="🎨" active={activeTool === 'color'} onPress={() => setActiveTool('color')} />
            <ToolButton label="Size" icon="✏️" active={activeTool === 'size'} onPress={() => setActiveTool('size')} />
            <ToolButton label="Opacity" icon="💧" active={activeTool === 'opacity'} onPress={() => setActiveTool('opacity')} />
            <ToolButton label="Symmetry" icon="❄️" active={activeTool === 'symmetry'} onPress={() => setActiveTool('symmetry')} />
            <TouchableOpacity 
              onPress={clearCanvas} 
              style={{ width: 44, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ fontSize: 20 }}>🗑️</Text>
            </TouchableOpacity>
          </View>

        </GlassCard>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 10,
    zIndex: 10
  },
  iconBtn: {
    width: 40, height: 40,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  canvasContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 4px 12px 0 rgba(0,0,0,0.15)',
    } : {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    }),
  },
  controlsContainer: {
    width: '94%',
    padding: 12,
    gap: 12,
    marginBottom: 10
  },
  toolConfigArea: {
    height: 44,
    justifyContent: 'center'
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4
  },
  toolBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)'
  },
  colorBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});

export default MandalaDraw;
