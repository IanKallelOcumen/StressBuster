// Load environment variables from .env file
require('dotenv').config();

const { decrypt } = require('./utils/encryption.js');

// Resolve API key: plain KEY or decrypt KEY_ENCRYPTED with ENCRYPTION_SECRET
function getApiKey(plainEnv, encryptedEnv) {
  const plain = process.env[plainEnv];
  if (plain && plain.trim() && !plain.startsWith('your_') && !plain.includes('...')) {
    return plain.trim();
  }
  const encrypted = process.env[encryptedEnv];
  const secret = process.env.ENCRYPTION_SECRET;
  if (encrypted && secret) {
    const decrypted = decrypt(encrypted, secret);
    if (decrypted) return decrypted;
  }
  return process.env[plainEnv] || undefined;
}

function getGeminiApiKey() {
  return getApiKey('GEMINI_API_KEY', 'GEMINI_API_KEY_ENCRYPTED');
}

function getGroqApiKey() {
  return getApiKey('GROQ_API_KEY', 'GROQ_API_KEY_ENCRYPTED');
}

function getOpenAiApiKey() {
  return getApiKey('OPENAI_API_KEY', 'OPENAI_API_KEY_ENCRYPTED');
}

function getFirebaseApiKey() {
  return getApiKey('FIREBASE_API_KEY', 'FIREBASE_API_KEY_ENCRYPTED');
}

function getZenProviders() {
  const raw = process.env.ZEN_PROVIDERS || 'gemini';
  return raw.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
}

module.exports = {
  expo: {
    name: "StressBuster",
    slug: "StressBuster",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "stressbuster",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false
    },
    web: {
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000"
          }
        }
      ],
      "expo-audio",
      "expo-asset"
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true
    },
    extra: {
      geminiApiKey: getGeminiApiKey(),
      groqApiKey: getGroqApiKey(),
      openAiApiKey: getOpenAiApiKey(),
      zenProviders: getZenProviders(),
      firebaseApiKey: getFirebaseApiKey(),
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID,
    }
  }
};
