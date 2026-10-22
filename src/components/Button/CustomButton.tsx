import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AUTH_GOLD, AUTH_NAVY } from '../../theme/authTheme';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  showArrow?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function CustomButton({
  title,
  variant = 'primary',
  showArrow = false,
  style,
  ...rest
}: CustomButtonProps) {
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isSecondary && styles.buttonSecondary,
        isOutline && styles.buttonOutline,
        rest.disabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      <View style={styles.inner}>
        <Text
          style={[
            styles.text,
            isSecondary && styles.textSecondary,
            isOutline && styles.textOutline,
          ]}
        >
          {title}
        </Text>
        {showArrow ? (
          <Ionicons
            name="arrow-forward"
            size={18}
            color={isSecondary || isOutline ? (isSecondary ? '#FFF' : AUTH_NAVY) : AUTH_NAVY}
          />
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: AUTH_GOLD,
    width: '100%',
    height: 55,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  buttonOutline: {
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: AUTH_NAVY,
  },
  disabled: {
    opacity: 0.45,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    color: AUTH_NAVY,
    fontSize: 17,
    fontWeight: '800',
  },
  textSecondary: {
    color: '#FFF',
  },
  textOutline: {
    color: AUTH_NAVY,
  },
});
