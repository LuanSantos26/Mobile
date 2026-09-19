import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function ScreenTopGradient() {
  return (
    <LinearGradient
      pointerEvents="none"
      colors={['#F8B125', '#FAFAFA']}
      style={styles.topGradient}
    />
  );
}

const styles = StyleSheet.create({
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 350,
  },
});
