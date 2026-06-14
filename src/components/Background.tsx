import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, Edge, useSafeAreaInsets } from 'react-native-safe-area-context';
import { getHeaderTopPadding } from '../utils/safeArea';

interface BackgroundProps {
  children: React.ReactNode;
  edges?: Edge[];
}

export function Background({ children, edges = ['top', 'left', 'right', 'bottom'] }: BackgroundProps) {
  const insets = useSafeAreaInsets();
  const includeTop = edges.includes('top');
  const safeEdges = includeTop
    ? (edges.filter((edge) => edge !== 'top') as Edge[])
    : edges;

  return (
    <LinearGradient
      colors={['#5DB4CD', '#F1B95B', '#EFA037']}
      style={styles.container}
    >
      <SafeAreaView
        style={[
          styles.safeArea,
          includeTop && { paddingTop: getHeaderTopPadding(insets.top, 0) },
        ]}
        edges={safeEdges}
      >
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