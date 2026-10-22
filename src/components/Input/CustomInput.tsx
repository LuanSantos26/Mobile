import React, { useState } from 'react';
import { View, TextInput, TextInputProps, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { AUTH_MUTED, AUTH_NAVY } from '../../theme/authTheme';

interface CustomInputProps extends TextInputProps {
  iconName: keyof typeof Feather.glyphMap | 'business-outline';
}

export function CustomInput({ iconName, secureTextEntry, ...rest }: CustomInputProps) {
  const [hidden, setHidden] = useState(!!secureTextEntry);

  return (
    <View style={styles.container}>
      {iconName === 'business-outline' ? (
        <Ionicons name="business-outline" size={20} color={AUTH_NAVY} style={styles.icon} />
      ) : (
        <Feather name={iconName} size={20} color={AUTH_NAVY} style={styles.icon} />
      )}
      <TextInput
        style={styles.input}
        placeholderTextColor={AUTH_MUTED}
        secureTextEntry={secureTextEntry ? hidden : false}
        {...rest}
      />
      {secureTextEntry ? (
        <TouchableOpacity onPress={() => setHidden((v) => !v)} hitSlop={8}>
          <Ionicons name={hidden ? 'eye-off-outline' : 'eye-outline'} size={20} color={AUTH_MUTED} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2F7',
    borderRadius: 16,
    width: '100%',
    minHeight: 52,
    marginBottom: 14,
    paddingHorizontal: 14,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: AUTH_NAVY,
    paddingVertical: 12,
  },
});
