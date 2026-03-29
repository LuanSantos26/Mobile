import React from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';
import { BlurView } from 'expo-blur';

interface FundoAnimadoProps {
  uri: string;
  intensidade?: number;
  tint?: 'dark' | 'light' | 'default';
  overlayOpacity?: number;
}

export default function FundoAnimado({
  uri,
  intensidade = 75,
  tint = 'dark',
  overlayOpacity = 0.55,
}: FundoAnimadoProps) {
  return (
    <ImageBackground
      source={{ uri }}
      style={StyleSheet.absoluteFillObject}
      resizeMode="cover"
      pointerEvents="none"
    >
      <BlurView intensity={intensidade} tint={tint} style={StyleSheet.absoluteFillObject} />
      <View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: `rgba(5, 30, 15, ${overlayOpacity})` },
        ]}
      />
    </ImageBackground>
  );
}
