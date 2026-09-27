import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, Edge, useSafeAreaInsets } from 'react-native-safe-area-context';
import { getHeaderTopPadding } from '../../utils/safeArea';

type GradientColors = readonly [string, string, ...string[]];

const DEFAULT_GRADIENT: GradientColors = ['#5DB4CD', '#F1B95B', '#EFA037'];

interface BackgroundProps {
  children: React.ReactNode;
  edges?: Edge[];
  colors?: GradientColors;
  locations?: readonly [number, number, ...number[]];
}

export function Background({
  children,
  edges = ['top', 'left', 'right', 'bottom'],
  colors = DEFAULT_GRADIENT,
  locations,
}: BackgroundProps) {
  const insets = useSafeAreaInsets();
  const includeTop = edges.includes('top');
  const safeEdges = includeTop
    ? (edges.filter((edge) => edge !== 'top') as Edge[])
    : edges;

  return (
    <LinearGradient
      colors={[...colors]}
      locations={locations ? [...locations] : undefined}
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