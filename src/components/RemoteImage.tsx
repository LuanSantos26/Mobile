import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { getAvatarFallbackUrl } from '../utils/imageFallback';

interface RemoteImageProps {
  uri?: string | null;
  style?: StyleProp<ImageStyle>;
  fallbackLabel: string;
  fallbackStyle?: StyleProp<ViewStyle>;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
}

export function RemoteImage({
  uri,
  style,
  fallbackLabel,
  resizeMode = 'cover',
}: RemoteImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [uri]);

  const resolvedUri = !failed && uri ? uri : getAvatarFallbackUrl(fallbackLabel);

  return (
    <Image
      source={{ uri: resolvedUri }}
      style={style}
      resizeMode={resizeMode}
      onError={() => {
        if (!failed) setFailed(true);
      }}
    />
  );
}
