# StressBuster (Zen Companion) 🧘

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_2.0_Flash-8E75B2?style=for-the-badge&logo=google&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)

> A gamified mental wellness application built with React Native. It combines offline-first relaxation tools with an AI-powered therapeutic companion to help users de-escalate stress in real-time.

## 📱 Project Overview

**StressBuster** is designed to make mental health maintenance engaging and accessible. Unlike traditional meditation apps, it uses a **Token Economy** system where users "earn" therapeutic sessions by completing healthy activities (like breathing exercises or tactile mini-games).

The app features a "Zen" persona powered by **Google's Gemini 2.0 Flash API**, providing low-latency, empathetic conversation. The interface is built on a custom **Glassmorphism** design system, ensuring a calm, clutter-free visual experience.

## ✨ Key Features

### 🧠 AI Companion ("Zen")
* **Powered by Gemini 2.0 Flash:** Delivers context-aware, therapeutic responses.
* **Token System:** Users spend "Zen Tokens" to chat, gamifying the process of self-care.
* **Contextual Persona:** The AI is fine-tuned to act as a calm mental health companion.

### 🎮 Gamified Stress Relief (Fidget Tools)
A suite of haptic-enabled mini-games designed to ground the user:
* **Zen Match:** A memory card game to focus the mind (+10 Tokens).
* **Pop Bubbles:** Virtual bubble wrap with satisfying physics (+1 Token/pop).
* **Switches & Color Calm:** Repetitive tactile tasks utilizing `expo-haptics` for physical grounding.
* **Daily Fortune:** A "cookie cracker" offering daily affirmations.

### 🛠️ Wellness Toolkit
* **Soundscapes:** Background-compatible audio loops (Rain, Forest, Waves) using `expo-av`.
* **Focus Timer:** A minimalist 25-minute productivity timer.
* **Mood Log:** Emoji-based emotional tracking with cloud sync.
* **Journal:** Offline-capable text entry for private reflection.

### 💎 UI/UX Design
* **Glassmorphism:** Custom `GlassCard` components using `expo-blur` to create a modern, transparent aesthetic.
* **Dynamic Theming:** Full support for Light and Dark modes.
* **Haptic Feedback:** Integrated tactile responses for interactions to enhance the "feel" of the app.

## 🏗️ Architecture & Tech Stack

* **Frontend:** React Native (Expo SDK 50+)
* **Backend:** Firebase v9 (Authentication & Firestore)
* **State Management:** React Context API
* **Persistence:** `@react-native-async-storage/async-storage` (Offline-first capability)
* **AI Model:** Gemini 2.0 Flash via REST API

## 🚀 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/yourusername/stressbuster.git](https://github.com/yourusername/stressbuster.git)
    cd stressbuster
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure API Keys**
    * Note: The project requires a Firebase project and a Google Gemini API key.
    * Update the `firebaseConfig` object and `GEMINI_API_KEY` constant in the source code or move them to an `.env` file.

4.  **Run the application**
    ```bash
    npx expo start
    ```

## 📸 Screenshots

| Home Dashboard | AI Chat ("Zen") | Mini-Games |
|:---:|:---:|:---:|
| *(Add Screenshot)* | *(Add Screenshot)* | *(Add Screenshot)* |

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you would like to change.

## 📄 License

[MIT](https://choosealicense.com/licenses/mit/)
