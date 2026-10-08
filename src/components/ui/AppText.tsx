import React from 'react';
import {
  Platform,
  Text as RNText,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  TextProps as RNTextProps,
  StyleProp,
  StyleSheet,
  TextStyle,
} from 'react-native';

export type TextProps = RNTextProps;
export type TextInputProps = RNTextInputProps;

// Android compact scale factor (tuned to deliver an ultra-sleek, small font look on Android)
const ANDROID_SCALE = 0.78;

function scaleTextStyle(style: StyleProp<TextStyle>): StyleProp<TextStyle> {
  if (Platform.OS !== 'android') return style;
  if (!style) return style;

  const flattened = StyleSheet.flatten(style);
  if (!flattened || typeof flattened.fontSize !== 'number') return style;

  const scaledFontSize = Math.max(
    Math.round(flattened.fontSize * ANDROID_SCALE * 10) / 10,
    7.0
  );
  const scaledLineHeight =
    typeof flattened.lineHeight === 'number'
      ? Math.max(Math.round(flattened.lineHeight * ANDROID_SCALE * 10) / 10, scaledFontSize + 2)
      : undefined;

  return [
    style,
    {
      fontSize: scaledFontSize,
      ...(scaledLineHeight ? { lineHeight: scaledLineHeight } : {}),
    },
  ];
}

export const Text = React.forwardRef<RNText, TextProps>(function Text(
  { allowFontScaling = false, maxFontSizeMultiplier = 1.0, style, ...rest },
  ref
) {
  const scaledStyle = scaleTextStyle(style);

  return (
    <RNText
      ref={ref}
      allowFontScaling={allowFontScaling}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      style={scaledStyle}
      {...rest}
    />
  );
});
Text.displayName = 'Text';

export const TextInput = React.forwardRef<RNTextInput, TextInputProps>(function TextInput(
  { allowFontScaling = false, maxFontSizeMultiplier = 1.0, style, ...rest },
  ref
) {
  const scaledStyle = scaleTextStyle(style);

  return (
    <RNTextInput
      ref={ref}
      allowFontScaling={allowFontScaling}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      style={scaledStyle}
      {...rest}
    />
  );
});
TextInput.displayName = 'TextInput';

export const AppText = Text;
export default Text;
