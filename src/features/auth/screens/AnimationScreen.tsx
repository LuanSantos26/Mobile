import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Background } from '../../../components/Background';

export function AnimationScreen() {
  const navigation = useNavigation<any>();
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.75)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 28,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(1300),
      Animated.timing(logoOpacity, {
        toValue: 0,
        duration: 500,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.delay(1200),
    ]);

    animation.start(() => navigation.replace('Welcome'));

    return () => animation.stop();
  }, [logoOpacity, logoScale, titleOpacity, navigation]);

  return (
    <Background>
      <Animated.View style={styles.container}>
        <Animated.Image
          source={require('../../../../assets/favicon.png')}
          style={[
            styles.logo,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        />
        <Animated.Text style={[styles.brandText, { opacity: titleOpacity }]}>
          QUICKSTOCK
        </Animated.Text>
        <Animated.Text style={[styles.subtitle, { opacity: titleOpacity }]}>
          Agilidade que Conecta Mercados
        </Animated.Text>
      </Animated.View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  logo: {
    width: 210,
    height: 210,
    resizeMode: 'contain',
  },
  brandText: {
    marginTop: 18,
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 2,
  },
  subtitle: {
    marginTop: 4,
    color: '#FFFFFF',
    fontSize: 16,
  },
});
