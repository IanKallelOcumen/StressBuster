import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { safeHaptics, ImpactFeedbackStyle, NotificationFeedbackType } from '../../utils/haptics';
import { scaleMinigameReward } from '../../utils/zenTokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard from '../ui/GlassCard';
import GradientBackground from '../ui/GradientBackground';

const WORDS = [
  'apple', 'agenda', 'about', 'above', 'actor', 'adult', 'after', 'again', 'agent', 'agree', 'ahead', 'alarm', 'album', 'alien', 'alike', 'alive', 'allow', 'alone', 'along', 'alter', 'among', 'angel', 'anger', 'angle', 'angry', 'apart', 'apple', 'apply', 'arena', 'argue', 'arise', 'array', 'aside', 'asset', 'audio', 'audit', 'avoid', 'award', 'aware',
  'bacon', 'badge', 'baker', 'basic', 'basis', 'beach', 'begin', 'being', 'below', 'bench', 'billy', 'birth', 'black', 'blame', 'blank', 'blast', 'blend', 'block', 'blood', 'board', 'boost', 'booth', 'bound', 'brain', 'brand', 'bread', 'break', 'breed', 'brick', 'brief', 'bring', 'broad', 'brown', 'brush', 'buddy', 'build', 'built', 'buyer',
  'cable', 'calif', 'carry', 'catch', 'cause', 'chain', 'chair', 'chart', 'chase', 'cheap', 'check', 'chest', 'chief', 'child', 'china', 'chips', 'choir', 'civil', 'claim', 'class', 'clean', 'clear', 'click', 'clock', 'close', 'coach', 'coast', 'could', 'count', 'court', 'cover', 'craft', 'crash', 'cream', 'crime', 'cross', 'crowd', 'crown', 'curve', 'cycle',
  'daily', 'dance', 'dated', 'dealt', 'death', 'debut', 'delay', 'depth', 'doing', 'doubt', 'dozen', 'draft', 'drama', 'drawn', 'dream', 'dress', 'drill', 'drink', 'drive', 'drove', 'dying',
  'eager', 'early', 'earth', 'eight', 'elite', 'empty', 'enemy', 'enjoy', 'enter', 'entry', 'equal', 'error', 'event', 'every', 'exact', 'exist', 'extra',
  'faith', 'false', 'fault', 'fiber', 'field', 'fifth', 'fifty', 'fight', 'final', 'first', 'fixed', 'flash', 'fleet', 'floor', 'fluid', 'focus', 'force', 'forth', 'forty', 'forum', 'found', 'frame', 'frank', 'fraud', 'fresh', 'front', 'fruit', 'fully', 'funny',
  'giant', 'given', 'glass', 'globe', 'going', 'grace', 'grade', 'grand', 'grant', 'grass', 'great', 'green', 'gross', 'group', 'grown', 'guard', 'guess', 'guest', 'guide',
  'happy', 'harry', 'heart', 'heavy', 'hence', 'henry', 'horse', 'hotel', 'house', 'human',
  'ideal', 'image', 'index', 'inner', 'input', 'issue', 'irony', 'item',
  'japan', 'jimmy', 'joint', 'jones', 'judge', 'juice', 'jump',
  'keep', 'kind', 'king', 'knife', 'knock', 'known',
  'label', 'large', 'laser', 'later', 'laugh', 'layer', 'learn', 'lease', 'least', 'leave', 'legal', 'level', 'lewis', 'light', 'limit', 'links', 'lives', 'local', 'logic', 'loose', 'lower', 'lucky', 'lunch', 'lying',
  'magic', 'major', 'maker', 'march', 'maria', 'match', 'maybe', 'mayor', 'meant', 'media', 'metal', 'might', 'minor', 'minus', 'mixed', 'model', 'money', 'month', 'moral', 'motor', 'mount', 'mouse', 'mouth', 'movie', 'music',
  'needs', 'never', 'newly', 'night', 'noise', 'north', 'note', 'novel', 'nurse',
  'occur', 'ocean', 'offer', 'often', 'order', 'other', 'ought',
  'paint', 'panel', 'paper', 'party', 'peace', 'peter', 'phase', 'phone', 'photo', 'piece', 'pilot', 'pitch', 'place', 'plain', 'plane', 'plant', 'plate', 'play', 'plaza', 'point', 'polar', 'pound', 'power', 'press', 'price', 'pride', 'prime', 'print', 'prior', 'prize', 'proof', 'proud', 'prove', 'queen', 'quick', 'quiet', 'quite',
  'radio', 'raise', 'range', 'rapid', 'ratio', 'reach', 'ready', 'refer', 'right', 'rival', 'river', 'robin', 'roger', 'roman', 'rough', 'round', 'route', 'royal', 'rural',
  'scale', 'scene', 'scope', 'score', 'sense', 'serve', 'seven', 'shall', 'shape', 'share', 'sharp', 'sheet', 'shelf', 'shell', 'shift', 'shirt', 'shock', 'shoot', 'short', 'shown', 'sight', 'since', 'sixth', 'sixty', 'sized', 'skill', 'sleep', 'slide', 'small', 'smart', 'smile', 'smith', 'smoke', 'solid', 'solve', 'sorry', 'sound', 'south', 'space', 'spare', 'speak', 'speed', 'spend', 'spent', 'split', 'spoke', 'sport', 'staff', 'stage', 'stake', 'stand', 'start', 'state', 'steam', 'steel', 'stick', 'still', 'stock', 'stone', 'stood', 'store', 'storm', 'story', 'strip', 'stuck', 'study', 'stuff', 'style', 'sugar', 'suite', 'super', 'sweet',
  'table', 'taken', 'taste', 'taxes', 'teach', 'teeth', 'terry', 'texas', 'thank', 'theft', 'their', 'theme', 'there', 'these', 'thick', 'thing', 'think', 'third', 'those', 'three', 'threw', 'throw', 'tight', 'times', 'tired', 'title', 'today', 'topic', 'total', 'touch', 'tough', 'tower', 'track', 'trade', 'train', 'treat', 'trend', 'trial', 'tried', 'tries', 'truck', 'truly', 'trust', 'truth', 'twice',
  'under', 'undue', 'union', 'unity', 'until', 'upper', 'upset', 'urban', 'usage', 'usual',
  'valid', 'value', 'video', 'virus', 'visit', 'vital', 'voice',
  'waste', 'watch', 'water', 'wheel', 'where', 'which', 'while', 'white', 'whole', 'whose', 'woman', 'women', 'world', 'worry', 'worse', 'worst', 'worth', 'would', 'wound', 'write', 'wrong',
  'yard', 'yeah', 'year', 'yellow', 'yield', 'young', 'youth',
  'zebra', 'zero', 'zone', 'zoom'
];

export const WordChain = ({ onBack, colors, updateTokens, sfxEnabled }) => {
  const [word, setWord] = useState('');
  const [chain, setChain] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('Start by typing any word');
  const insets = useSafeAreaInsets();

  const submit = () => {
    if (!word.trim()) return;

    const lowerWord = word.toLowerCase().trim();

    // Check if word in our list
    if (!WORDS.includes(lowerWord)) {
      if (sfxEnabled) safeHaptics.notificationAsync(NotificationFeedbackType.Error);
      setMessage('❌ Word not recognized');
      return;
    }

    // Check if already used
    if (chain.includes(lowerWord)) {
      if (sfxEnabled) safeHaptics.notificationAsync(NotificationFeedbackType.Error);
      setMessage('🔄 Word already used');
      return;
    }

    // Check if starts with last letter of previous word
    if (chain.length > 0) {
      const lastWord = chain[chain.length - 1];
      if (lastWord[lastWord.length - 1] !== lowerWord[0]) {
        if (sfxEnabled) safeHaptics.notificationAsync(NotificationFeedbackType.Error);
        setMessage(`❌ Must start with '${lastWord[lastWord.length - 1]}'`);
        return;
      }
    }

    if (sfxEnabled) safeHaptics.notificationAsync(NotificationFeedbackType.Success);
    setChain([...chain, lowerWord]);
    const points = lowerWord.length;
    const reward = scaleMinigameReward(points);
    setScore(s => s + points);
    updateTokens(reward, 'word_chain');
    setMessage(`✓ '${lowerWord}' added! (+${reward})`);
    setWord('');
  };

  const reset = () => {
    if (sfxEnabled) safeHaptics.impactAsync(ImpactFeedbackStyle.Medium);
    setWord('');
    setChain([]);
    setScore(0);
    setMessage('Start by typing any word');
  };

  return (
    <GradientBackground colors={colors}>
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 68, paddingHorizontal: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
      <View style={{ gap: 20 }}>
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text }}>Word Chain</Text>
          <Text style={{ fontSize: 13, color: colors.subtext }}>Connect words that start with the last letter</Text>
        </View>

        <GlassCard
          colors={colors}
          color={colors.tileBg}
          style={{
          borderColor: colors.accent,
          borderWidth: 2,
          borderRadius: 16,
          paddingVertical: 16,
          paddingHorizontal: 20,
          alignItems: 'center',
          gap: 8
        }}>
          <Text style={{ color: colors.subtext, fontSize: 12 }}>Score</Text>
          <Text style={{ color: colors.accent, fontSize: 42, fontWeight: '800' }}>{score}</Text>
          <Text style={{ color: colors.subtext, fontSize: 11 }}>Words: {chain.length}</Text>
        </GlassCard>

        <View style={{ gap: 10 }}>
          <GlassCard
            colors={colors}
            color={colors.tileBg}
            intensity={20}
            style={{ borderRadius: 12, padding: 4 }}>
            <TextInput
              value={word}
              onChangeText={setWord}
              placeholder={chain.length > 0 ? `Starts with '${chain[chain.length - 1].slice(-1)}'...` : "Type any word..."}
              placeholderTextColor={colors.subtext}
              style={{
                backgroundColor: 'transparent',
                paddingVertical: 16,
                paddingHorizontal: 20,
                fontSize: 18,
                color: colors.text,
                fontWeight: '600'
              }}
              autoCapitalize="none"
              autoCorrect={false}
              onSubmitEditing={submit}
              returnKeyType="done"
            />
          </GlassCard>
          
          <TouchableOpacity onPress={submit} activeOpacity={0.8}>
            <GlassCard
              colors={colors}
              color={colors.accent}
              intensity={40}
              style={{
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Submit Word</Text>
            </GlassCard>
          </TouchableOpacity>
        </View>

        <Text style={{ textAlign: 'center', color: message.startsWith('❌') ? '#ff4444' : message.startsWith('✓') ? '#44ff44' : colors.subtext, fontWeight: '600' }}>
          {message}
        </Text>

        {chain.length > 0 && (
          <View style={{ gap: 10 }}>
            <Text style={{ color: colors.subtext, fontWeight: '600', marginLeft: 4 }}>History</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {chain.slice().reverse().map((w, i) => (
                <GlassCard
                  key={i}
                  colors={colors}
                  color={colors.tileBg}
                  intensity={15}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: i === 0 ? colors.accent : 'transparent'
                  }}>
                  <Text style={{ color: i === 0 ? colors.accent : colors.subtext, fontWeight: '600' }}>{w}</Text>
                </GlassCard>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity onPress={reset} style={{ marginTop: 20, alignSelf: 'center' }}>
          <Text style={{ color: colors.subtext, fontSize: 13, textDecorationLine: 'underline' }}>Reset Game</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </GradientBackground>
  );
};
