import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthBrand } from '../../components/auth/AuthBrand';
import { BottlesHero } from '../../components/auth/BottlesHero';
import { AUTH_GOLD, AUTH_NAVY } from '../../theme/authTheme';

export function AnimationScreen() {
  const navigation = useNavigation<any>();
  const [phase, setPhase] = useState<'loading' | 'splash'>('loading');
  const progress = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const run = Animated.sequence([
      Animated.timing(progress, {
        toValue: 1,
        duration: 1600,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(fade, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }),
    ]);

    run.start(() => {
      setPhase('splash');
      fade.setValue(0);
      Animated.timing(fade, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }).start();
    });

    const timeout = setTimeout(() => navigation.replace('Welcome'), 3400);
    return () => {
      run.stop();
      clearTimeout(timeout);
    };
  }, [fade, navigation, progress]);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['8%', '100%'],
  });

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.center, { opacity: fade }]}>
        {phase === 'loading' ? (
          <>
            <View style={styles.cartWrap}>
              <Ionicons name="cart" size={72} color="#7EB6F0" />
              <View style={styles.cartBottles}>
                <Ionicons name="wine-outline" size={22} color={AUTH_GOLD} />
                <Ionicons name="beer-outline" size={24} color="#E23B3B" />
                <Ionicons name="flask-outline" size={20} color="#4DA3E8" />
              </View>
            </View>
            <View style={styles.track}>
              <Animated.View style={[styles.fill, { width: barWidth }]} />
            </View>
            <Text style={styles.loading}>Carregando...</Text>
          </>
        ) : (
          <>
            <AuthBrand light size="lg" />
            <Text style={styles.tagline}>Agilidade que conecta negócios</Text>
            <View style={styles.splashArt}>
              <BottlesHero compact />
            </View>
          </>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AUTH_NAVY,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  cartWrap: {
    alignItems: 'center',
    marginBottom: 28,
  },
  cartBottles: {
    flexDirection: 'row',
    gap: 4,
    marginTop: -8,
  },
  track: {
    width: 180,
    height: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.18)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 8,
    backgroundColor: AUTH_GOLD,
  },
  loading: {
    marginTop: 14,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  tagline: {
    marginTop: 10,
    color: 'rgba(255,255,255,0.85)',
    fontSize: 16,
    textAlign: 'center',
  },
  splashArt: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
  },
});
