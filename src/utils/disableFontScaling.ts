import React from 'react';
import * as ReactNative from 'react-native';

/**
 * BharatSponge - Global Font Scaling Handler
 *
 * Disables system-level font scaling (Display size / Font size setting on Android/iOS)
 * across the entire application to ensure the UI remains crisp, proportional, and does not break
 * when users have 'Default', 'Large', or 'Largest' font settings on their mobile devices.
 */

if (!(globalThis as any).__fontScalingDisabled) {
  (globalThis as any).__fontScalingDisabled = true;

  const RN = ReactNative as any;
  const OriginalText = RN.Text;
  const OriginalTextInput = RN.TextInput;

  // 1. Classical defaultProps configuration (for React Native engines/subsystems that check defaultProps)
  if (OriginalText) {
    if (!OriginalText.defaultProps) {
      OriginalText.defaultProps = {};
    }
    OriginalText.defaultProps.allowFontScaling = false;
    OriginalText.defaultProps.maxFontSizeMultiplier = 1.0;
  }

  if (OriginalTextInput) {
    if (!OriginalTextInput.defaultProps) {
      OriginalTextInput.defaultProps = {};
    }
    OriginalTextInput.defaultProps.allowFontScaling = false;
    OriginalTextInput.defaultProps.maxFontSizeMultiplier = 1.0;
  }

  // 2. React 19 JSX-Runtime component wrapper:
  // In React 19, jsx/jsxDEV does not read defaultProps for function components.
  // We wrap Text and TextInput to inject allowFontScaling={false} & maxFontSizeMultiplier={1.0}
  // unless explicitly provided by the caller.
  if (OriginalText) {
    const PatchedText = React.forwardRef<any, ReactNative.TextProps>(
      function PatchedText(props, ref) {
        return React.createElement(OriginalText, {
          allowFontScaling: false,
          maxFontSizeMultiplier: 1.0,
          ...props,
          ref,
        });
      }
    );
    PatchedText.displayName = 'Text';

    try {
      Object.defineProperty(RN, 'Text', {
        configurable: true,
        enumerable: true,
        get: () => PatchedText,
      });
    } catch {
      RN.Text = PatchedText;
    }
  }

  if (OriginalTextInput) {
    const PatchedTextInput = React.forwardRef<any, ReactNative.TextInputProps>(
      function PatchedTextInput(props, ref) {
        return React.createElement(OriginalTextInput, {
          allowFontScaling: false,
          maxFontSizeMultiplier: 1.0,
          ...props,
          ref,
        });
      }
    );
    PatchedTextInput.displayName = 'TextInput';

    try {
      Object.defineProperty(RN, 'TextInput', {
        configurable: true,
        enumerable: true,
        get: () => PatchedTextInput,
      });
    } catch {
      RN.TextInput = PatchedTextInput;
    }
  }
}
