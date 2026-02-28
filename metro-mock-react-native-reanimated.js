// Mock for react-native-reanimated
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