const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Fix for web bundling issues
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json', 'mjs'];
config.resolver.assetExts = ['glb', 'gltf', 'obj', 'mtl', 'png', 'jpg', 'jpeg', 'mp3', 'wav'];

// Create mocks for missing modules
const mockDomGlobal = `
module.exports = {
  addGlobalDomEventListener: () => () => {},
  removeGlobalDomEventListener: () => {},
};
`;

const mockExpoDom = `
module.exports = {
  // Mock DOM functions
};
`;

const mockGoogleGenerativeAI = `
module.exports = {
  GoogleGenerativeAI: class {
    constructor() {}
    getGenerativeModel() {
      return {
        generateContent: async () => ({
          response: { text: () => '{"status": "healthy", "issues": [], "optimization_suggestions": []}' }
        })
      };
    }
  }
};
`;

const mockRadixReactSlot = `
module.exports = {
  Slot: ({ children }) => children,
};
`;

const mockFirebasePostinstall = `
export const getDefaultsFromPostinstall = () => ({});
`;

const mockReactNativeReanimated = `
module.exports = {
  createAnimatedComponent: (Component) => Component,
  Animated: {
    View: 'div',
    Text: 'span',
    Image: 'img',
    ScrollView: 'div',
    createAnimatedComponent: (Component) => Component,
    Value: class AnimatedValue {
      constructor(value) { this._value = value; }
      setValue(value) { this._value = value; }
      getValue() { return this._value; }
    },
    timing: () => ({ start: () => {}, stop: () => {} }),
    spring: () => ({ start: () => {}, stop: () => {} }),
    decay: () => ({ start: () => {}, stop: () => {} }),
  },
  default: {
    createAnimatedComponent: (Component) => Component,
    Animated: {
      View: 'div',
      Text: 'span',
      Image: 'img',
      ScrollView: 'div',
      createAnimatedComponent: (Component) => Component,
      Value: class AnimatedValue {
        constructor(value) { this._value = value; }
        setValue(value) { this._value = value; }
        getValue() { return this._value; }
      },
      timing: () => ({ start: () => {}, stop: () => {} }),
      spring: () => ({ start: () => {}, stop: () => {} }),
      decay: () => ({ start: () => {}, stop: () => {} }),
    },
  },
};
`;

const mockReactHooks = `
const React = require('react');
if (!React.use) {
  React.use = (promise) => {
    const [state, setState] = React.useState({ loading: true, value: null, error: null });
    React.useEffect(() => {
      promise
        .then(value => setState({ loading: false, value, error: null }))
        .catch(error => setState({ loading: false, value: null, error }));
    }, [promise]);
    if (state.loading) throw promise;
    if (state.error) throw state.error;
    return state.value;
  };
}
module.exports = React;
`;

const mockExpoRouterStore = `
const React = require('react');
const mockStore = {
  linking: {
    prefixes: [],
    config: {},
  },
  getInitialState: () => ({}),
  getStateForRouteNamesChange: () => ({}),
  getStateForAction: () => ({}),
};
const mockContext = React.createContext(mockStore);
const useExpoRouterStore = () => mockStore;
module.exports = {
  useExpoRouterStore,
  ExpoRouterContext: mockContext,
  default: mockStore,
};
`;

// Custom resolver to handle missing modules
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Handle Firebase postinstall issue
  if (moduleName === './postinstall.mjs' && context.originModulePath.includes('@firebase/util')) {
    return {
      filePath: path.resolve(__dirname, 'mock-firebase-postinstall.mjs'),
      type: 'sourceFile',
    };
  }
  
  if (moduleName === 'expo/dom/global') {
    return {
      filePath: path.resolve(__dirname, 'mock-expo-dom-global.js'),
      type: 'sourceFile',
    };
  }
  if (moduleName === 'expo/dom') {
    return {
      filePath: path.resolve(__dirname, 'mock-expo-dom.js'),
      type: 'sourceFile',
    };
  }
  // Force real Gemini SDK from node_modules (never use mock — Zen needs live API)
  if (moduleName === '@google/generative-ai') {
    const realPath = path.resolve(__dirname, 'node_modules', '@google', 'generative-ai', 'dist', 'index.js');
    const fallback = path.resolve(__dirname, 'node_modules', '@google', 'generative-ai', 'index.js');
    const fs = require('fs');
    const resolved = fs.existsSync(realPath) ? realPath : fallback;
    return { filePath: resolved, type: 'sourceFile' };
  }
  if (moduleName === '@radix-ui/react-slot') {
    return {
      filePath: path.resolve(__dirname, 'mock-radix-react-slot.js'),
      type: 'sourceFile',
    };
  }
  if (moduleName === 'react-native-reanimated') {
    return {
      filePath: path.resolve(__dirname, 'metro-mock-react-native-reanimated.js'),
      type: 'sourceFile',
    };
  }
  // REMOVED: React mock was causing circular dependency and breaking createContext
  // if (moduleName === 'react') {
  //   return {
  //     filePath: path.resolve(__dirname, 'mock-react-hooks.js'),
  //     type: 'sourceFile',
  //   };
  // }
  // TEMPORARILY DISABLED: expo-router storeContext mock - may be causing React loading issues
  // if (moduleName === './storeContext' && context.originModulePath.includes('expo-router')) {
  //   return {
  //     filePath: path.resolve(__dirname, 'mock-expo-router-store.js'),
  //     type: 'sourceFile',
  //   };
  // }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;