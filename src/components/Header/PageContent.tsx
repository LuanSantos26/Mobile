import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';

interface PageContentProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function PageContent({ children, style }: PageContentProps) {
  return <View style={[styles.content, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 15,
  },
});
