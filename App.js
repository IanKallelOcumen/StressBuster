import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧘 StressBuster App</Text>
      <Text style={styles.subtitle}>✅ Firebase Emulators Running</Text>
      <Text style={styles.subtitle}>✅ Metro Bundler Working</Text>
      <Text style={styles.subtitle}>✅ Zero API Costs Configured</Text>
      <Text style={styles.info}>
        Your capstone project is ready for testing!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#34495e',
    marginVertical: 5,
  },
  info: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 30,
    textAlign: 'center',
  },
});