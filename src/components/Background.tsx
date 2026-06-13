import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';

interface BackgroundProps {
  children: React.ReactNode;
  edges?: Edge[];
}

export function Background({ children, edges = ['top', 'left', 'right', 'bottom'] }: BackgroundProps) {
  return (
    <LinearGradient
      colors={['#5DB4CD', '#F1B95B', '#EFA037']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={edges}>
        {children}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
});