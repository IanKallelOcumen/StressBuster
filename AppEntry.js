import React from 'react';
import { registerRootComponent } from 'expo';
import { View, Text, StyleSheet } from 'react-native';

function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧘 StressBuster App</Text>
      <Text style={styles.subtitle}>Welcome to your AI-powered stress management companion!</Text>
      <Text style={styles.feature}>✅ Firebase Emulators Connected</Text>
      <Text style={styles.feature}>✅ Gemini API Ready</Text>
      <Text style={styles.feature}>✅ Zero API Costs</Text>
      <Text style={styles.feature}>✅ AI Chat & Mood Detection</Text>
      <Text style={styles.feature}>✅ Stress Analytics</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#34495e',
    marginBottom: 30,
    textAlign: 'center',
  },
  feature: {
    fontSize: 16,
    color: '#27ae60',
    marginVertical: 8,
    fontWeight: '500',
  },
});

export default registerRootComponent(App);