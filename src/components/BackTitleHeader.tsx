import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { BackButton, BACK_BUTTON_SIZE, backButtonSpacerStyle } from './BackButton';
import { useHeaderTopPadding } from '../utils/safeArea';

interface BackTitleHeaderProps {
  title: string;
  onBack: () => void;
  rightSlot?: React.ReactNode;
  style?: ViewStyle;
}

export function BackTitleHeader({
  title,
  onBack,
  rightSlot,
  style,
}: BackTitleHeaderProps) {
  const topPadding = useHeaderTopPadding(6);

  return (
    <View style={[styles.container, { paddingTop: topPadding }, style]}>
      <View style={styles.row}>
        <BackButton onPress={onBack} />

        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        {rightSlot ?? <View style={backButtonSpacerStyle} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 8,
    paddingRight: 12,
    paddingBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: BACK_BUTTON_SIZE,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginHorizontal: 6,
  },
});
