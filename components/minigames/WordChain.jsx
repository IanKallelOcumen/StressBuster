import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WORDS = ['peace', 'elastic', 'cinema', 'agenda', 'apple', 'energy', 'yellow', 'wonder', 'relax', 'xyz'];

export const WordChain = ({ onBack, colors, updateTokens }) => {
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
      setMessage('❌ Word not recognized');
      return;
    }

    // Check if already used
    if (chain.includes(lowerWord)) {
      setMessage('🔄 Word already used');
      return;
    }

    // Check if starts with last letter of previous word
    if (chain.length > 0) {
      const lastWord = chain[chain.length - 1];
      if (lastWord[lastWord.length - 1] !== lowerWord[0]) {
        setMessage(`❌ Must start with '${lastWord[lastWord.length - 1]}'`);
        return;
      }
    }

    setChain([...chain, lowerWord]);
    setScore(s => s + word.length);
    setMessage(`✓ '${lowerWord}' added!`);
    setWord('');
  };

  const reset = () => {
    setWord('');
    setChain([]);
    setScore(0);
    setMessage('Start by typing any word');
    updateTokens(score, 'word_chain');
  };

  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 68, paddingHorizontal: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
      <View style={{ gap: 20 }}>
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text }}>Word Chain</Text>
          <Text style={{ fontSize: 13, color: colors.subtext }}>Connect words that start with the last letter</Text>
        </View>

        <View style={{ backgroundColor: colors.accent + '12', borderColor: colors.accent, borderWidth: 2, borderRadius: 16, paddingVertical: 16, paddingHorizontal: 20, alignItems: 'center', gap: 8 }}>
          <Text style={{ color: colors.subtext, fontSize: 12 }}>Score</Text>
          <Text style={{ color: colors.accent, fontSize: 42, fontWeight: '800' }}>{score}</Text>
          <Text style={{ color: colors.subtext, fontSize: 11 }}>Words: {chain.length}</Text>
        </View>

        <View style={{ gap: 10 }}>
          <TextInput
            value={word}
            onChangeText={setWord}
            placeholder="Enter word"
            placeholderTextColor={colors.subtext}
            style={{
              backgroundColor: colors.tileBg,
              borderColor: colors.accent + '20',
              borderWidth: 1,
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 12,
              color: colors.text,
              fontSize: 16
            }}
            onSubmitEditing={submit}
          />
          <TouchableOpacity
            onPress={submit}
            style={{
              backgroundColor: colors.accent,
              paddingVertical: 13,
              borderRadius: 12,
              alignItems: 'center',
              shadowColor: colors.accent,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4
            }}>
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>Add Word</Text>
          </TouchableOpacity>
        </View>

        <View style={{ backgroundColor: colors.tileBg, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 }}>
          <Text style={{ color: colors.subtext, fontSize: 12, marginBottom: 4 }}>Message:</Text>
          <Text style={{ color: colors.text, fontSize: 13 }}>{message}</Text>
        </View>

        {chain.length > 0 && (
          <View style={{ backgroundColor: colors.accent + '10', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, gap: 8 }}>
            <Text style={{ color: colors.subtext, fontSize: 12, fontWeight: '500' }}>Chain:</Text>
            <Text style={{ color: colors.text, fontSize: 14, fontStyle: 'italic', lineHeight: 22 }}>
              {chain.join(' → ')}
            </Text>
          </View>
        )}

        {chain.length > 0 && (
          <TouchableOpacity
            onPress={reset}
            style={{
              backgroundColor: colors.icon.green,
              paddingVertical: 13,
              borderRadius: 12,
              alignItems: 'center'
            }}>
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>Finish & Earn Tokens</Text>
          </TouchableOpacity>
        )}

        <View style={{ backgroundColor: colors.tileBg, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 }}>
          <Text style={{ color: colors.subtext, fontSize: 12, lineHeight: 18 }}>
            Available words: peace, elastic, cinema, agenda, apple, energy, yellow, wonder, relax
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};
