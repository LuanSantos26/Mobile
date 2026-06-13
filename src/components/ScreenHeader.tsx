import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HamburgerButton } from './HamburgerButton';
import { HeaderActions } from './HeaderActions';

interface ScreenHeaderProps {
  name?: string;
  greeting?: string;
  showGreeting?: boolean;
  showCartBadge?: boolean;
  cartItemCount?: number;
  onCartPress?: () => void;
  style?: ViewStyle;
}

export function ScreenHeader({
  name,
  greeting = 'Bom dia.',
  showGreeting = false,
  showCartBadge,
  cartItemCount,
  onCartPress,
  style,
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }, style]}>
      <View style={styles.topRow}>
        <HamburgerButton />
        <HeaderActions
          showCalendar={showGreeting}
          showCartBadge={showCartBadge}
          cartItemCount={cartItemCount}
          onCartPress={onCartPress}
        />
      </View>

      {showGreeting ? (
        <View style={styles.greetingRow}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={24} color="#F8B125" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.greetingText}>{greeting}</Text>
            <Text style={styles.userName}>{name ?? 'Usuário'}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingBottom: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
