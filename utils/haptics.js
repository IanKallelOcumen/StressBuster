/**
 * Platform-aware haptics wrapper
 * Haptics are not available on web, so we check the platform before calling
 */
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const isHapticsAvailable = Platform.OS !== 'web';

export const safeHaptics = {
  selectionAsync: () => {
    if (isHapticsAvailable && typeof Haptics.selectionAsync === 'function') {
      try {
        Haptics.selectionAsync();
      } catch (e) {
        // Silently fail on platforms where haptics aren't available
        console.debug('[Haptics] selectionAsync not available:', e.message);
      }
    }
  },
  
  impactAsync: (style) => {
    if (isHapticsAvailable && typeof Haptics.impactAsync === 'function') {
      try {
        Haptics.impactAsync(style);
      } catch (e) {
        // Silently fail on platforms where haptics aren't available
        console.debug('[Haptics] impactAsync not available:', e.message);
      }
    }
  },
  
  notificationAsync: (type) => {
    if (isHapticsAvailable && typeof Haptics.notificationAsync === 'function') {
      try {
        Haptics.notificationAsync(type);
      } catch (e) {
        // Silently fail on platforms where haptics aren't available
        console.debug('[Haptics] notificationAsync not available:', e.message);
      }
    }
  }
};

// Re-export Haptics constants for use in components
// Provide fallback values if constants are not available (e.g., on web)
let ImpactFeedbackStyleValue, NotificationFeedbackTypeValue;

try {
  ImpactFeedbackStyleValue = Haptics.ImpactFeedbackStyle;
  NotificationFeedbackTypeValue = Haptics.NotificationFeedbackType;
} catch (e) {
  // Fallback values if Haptics constants are not available
  ImpactFeedbackStyleValue = {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy'
  };
  NotificationFeedbackTypeValue = {
    Success: 'success',
    Warning: 'warning',
    Error: 'error'
  };
}

export const ImpactFeedbackStyle = ImpactFeedbackStyleValue;
export const NotificationFeedbackType = NotificationFeedbackTypeValue;
