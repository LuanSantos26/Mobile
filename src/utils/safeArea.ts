import { Platform, StatusBar } from 'react-native';
import { SPACING } from '../theme/theme';

const ANDROID_STATUS_BAR_FALLBACK = 24;

/** Espaço mínimo abaixo da barra de status/notificações para cabeçalhos. */
export function getHeaderTopPadding(insetTop: number, extraSpacing = SPACING.md): number {
  const statusBarHeight =
    Platform.OS === 'android'
      ? StatusBar.currentHeight ?? ANDROID_STATUS_BAR_FALLBACK
      : 0;

  return Math.max(insetTop, statusBarHeight) + extraSpacing;
}
