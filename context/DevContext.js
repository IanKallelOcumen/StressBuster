import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import Constants from 'expo-constants';
import { GoogleGenerativeAI } from "@google/generative-ai";

const DevContext = createContext({
  env: 'prod',
  setEnv: () => {},
  getPath: (path) => path,
  runDiagnostics: async () => {},
  isDevMode: false,
  simulateDelay: false,
  setSimulateDelay: () => {},
});

export const useDev = () => useContext(DevContext);

export const DevProvider = ({ children, user, db, profile }) => {
  const [env, setEnv] = useState('prod'); // 'prod', 'dev', 'stage'
  const [simulateDelay, setSimulateDelay] = useState(false);
  
  // Initialize AI for diagnostics
  const getModel = () => {
    try {
      const key = Constants.expoConfig?.extra?.geminiApiKey;
      if (!key || key.includes("...")) return null;
      const genAI = new GoogleGenerativeAI(key);
      return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    } catch { return null; }
  };
  const model = getModel();

  const getPath = (basePath) => {
    if (env === 'prod') return basePath;
    return `${env}_${basePath}`;
  };

  const runDiagnostics = async () => {
    if (!user || !profile) {
      Alert.alert("Diagnostics", "No user profile loaded to analyze.");
      return;
    }

    try {
      const prompt = `
        Analyze this user profile data for anomalies or data integrity issues. 
        Context: Mental Health App 'StressBuster'.
        Data: ${JSON.stringify(profile)}
        
        Return a JSON object: { "status": "healthy" | "warning" | "critical", "issues": ["issue 1", ...], "optimization_suggestions": ["suggestion 1", ...] }
      `;
      
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      // Simple parsing of JSON from markdown code blocks if present
      const jsonStr = text.replace(/```json|```/g, '').trim();
      const analysis = JSON.parse(jsonStr);
      
      return analysis;
    } catch (e) {
      console.error("AI Diagnostics failed", e);
      return { status: "error", issues: ["AI Service Unavailable"] };
    }
  };

  return (
    <DevContext.Provider value={{ 
      env, 
      setEnv, 
      getPath, 
      runDiagnostics, 
      isDevMode: env !== 'prod',
      simulateDelay,
      setSimulateDelay
    }}>
      {children}
    </DevContext.Provider>
  );
};
