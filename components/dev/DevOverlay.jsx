import { useContext, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useDev } from '../../context/DevContext';
import { ThemeContext } from '../../context/ThemeContext';

// Developer Mode Overlay Component
const DevOverlay = ({ auth, db, onBypassLogin }) => {
  const { colors } = useContext(ThemeContext);
  const { env, setEnv, runDiagnostics, simulateDelay, setSimulateDelay } = useDev();
  const [visible, setVisible] = useState(false);
  const [bypassEmail, setBypassEmail] = useState('whatthe@gmail.com');
  const [bypassPass, setBypassPass] = useState('Kallel90121');
  const [showValidationErrors, setShowValidationErrors] = useState(true);
  const [runningDiagnostics, setRunningDiagnostics] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState(null);

  // Toggle visibility with keyboard shortcut (Ctrl+F for web) or hidden gesture
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleKeyDown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
          e.preventDefault();
          setVisible(v => !v);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  if (!visible) {
    // Hidden trigger area for mobile (top-right corner)
    return (
      <TouchableOpacity 
        style={styles.hiddenTrigger} 
        onLongPress={() => setVisible(true)}
        delayLongPress={2000}
      />
    );
  }

  const logEvent = (event, data) => {
    console.log(`[AUTH_DEV_LOG] ${event}:`, data);
  };

  const handleBypass = () => {
    logEvent('BYPASS_LOGIN', { email: bypassEmail });
    if (onBypassLogin) onBypassLogin({ email: bypassEmail, password: bypassPass });
  };

  const handleReset = () => {
    setBypassEmail('whatthe@gmail.com');
    setBypassPass('Kallel90121');
    setEnv('production');
    logEvent('RESET_FORM', {});
  };

  const handleDiagnostics = async () => {
    setRunningDiagnostics(true);
    setDiagnosticResult(null);
    try {
        const result = await runDiagnostics();
        setDiagnosticResult(result);
    } catch (e) {
        Alert.alert("Error", "Diagnostics failed");
    } finally {
        setRunningDiagnostics(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlayContainer}>
        <View style={[styles.panel, { backgroundColor: colors.tileBg, borderColor: colors.accent }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Developer Tools</Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text style={{ color: colors.subtext, fontSize: 20 }}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Environment Switcher */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.subtext }]}>Environment</Text>
              <View style={styles.row}>
                {['prod', 'dev', 'stage'].map(e => (
                  <TouchableOpacity 
                    key={e}
                    onPress={() => setEnv(e)}
                    style={[
                      styles.chip, 
                      { 
                        backgroundColor: env === e ? colors.accent : colors.glassBg,
                        borderColor: env === e ? colors.accent : colors.subtext
                      }
                    ]}
                  >
                    <Text style={{ color: env === e ? '#fff' : colors.text, fontSize: 12 }}>{e.toUpperCase()}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* AI Diagnostics */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.subtext }]}>AI Data Integrity Check</Text>
              <TouchableOpacity 
                style={[styles.button, { backgroundColor: colors.icon.purple, marginBottom: 8 }]}
                onPress={handleDiagnostics}
                disabled={runningDiagnostics}
              >
                 {runningDiagnostics ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.buttonText}>Run Diagnostics (Gemini)</Text>}
              </TouchableOpacity>
              
              {diagnosticResult && (
                <View style={{ backgroundColor: colors.glassBg, padding: 10, borderRadius: 8, marginTop: 8 }}>
                    <Text style={{ color: diagnosticResult.status === 'healthy' ? colors.icon.green : colors.icon.red, fontWeight: 'bold', marginBottom: 4 }}>
                        Status: {diagnosticResult.status?.toUpperCase()}
                    </Text>
                    {diagnosticResult.issues?.map((issue, i) => (
                        <Text key={i} style={{ color: colors.text, fontSize: 11 }}>• {issue}</Text>
                    ))}
                    {diagnosticResult.optimization_suggestions?.length > 0 && (
                        <Text style={{ color: colors.subtext, fontSize: 11, marginTop: 4, fontStyle: 'italic' }}>
                            Suggestion: {diagnosticResult.optimization_suggestions[0]}
                        </Text>
                    )}
                </View>
              )}
            </View>

            {/* Bypass Login */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.subtext }]}>Bypass Login</Text>
              <TextInput 
                style={[styles.input, { color: colors.text, borderColor: colors.glassBorder }]}
                value={bypassEmail}
                onChangeText={setBypassEmail}
                placeholder="Test Email"
                placeholderTextColor={colors.subtext}
              />
               <TextInput 
                style={[styles.input, { color: colors.text, borderColor: colors.glassBorder }]}
                value={bypassPass}
                onChangeText={setBypassPass}
                placeholder="Test Password"
                placeholderTextColor={colors.subtext}
              />
              <TouchableOpacity 
                style={[styles.button, { backgroundColor: colors.icon.green }]}
                onPress={handleBypass}
              >
                <Text style={styles.buttonText}>Simulate Login</Text>
              </TouchableOpacity>
            </View>

            {/* Toolbar */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.subtext }]}>Toolbar</Text>
              <View style={styles.row}>
                <TouchableOpacity onPress={handleReset} style={[styles.toolButton, { backgroundColor: colors.icon.orange }]}>
                  <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => logEvent('FILL_DATA', {})} style={[styles.toolButton, { backgroundColor: colors.icon.blue }]}>
                  <Text style={styles.buttonText}>Fill Data</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.switchRow}>
                <Text style={{ color: colors.text }}>Simulate Delay</Text>
                <Switch value={simulateDelay} onValueChange={setSimulateDelay} />
              </View>
              <View style={styles.switchRow}>
                <Text style={{ color: colors.text }}>Show Errors</Text>
                <Switch value={showValidationErrors} onValueChange={setShowValidationErrors} />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  hiddenTrigger: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    zIndex: 9999,
  },
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  panel: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 4px 10px 0 rgba(0,0,0,0.3)',
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 10,
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    fontSize: 14,
  },
  button: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  toolButton: {
    padding: 8,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
});

export default DevOverlay;
