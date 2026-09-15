import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface IconActionButtonProps {
  name: keyof typeof Ionicons.glyphMap;
  color?: string;
  size?: number;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function IconActionButton({
  name,
  color = '#D64545',
  size = 20,
  onPress,
  style,
  accessibilityLabel,
}: IconActionButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
      onPress={onPress}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Ionicons name={name} size={size} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 40,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  pressed: {
    opacity: 0.65,
    backgroundColor: 'rgba(214, 69, 69, 0.08)',
  },
});
