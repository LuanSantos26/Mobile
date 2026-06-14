import { Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

/** Padding superior para telas/cabeçalhos (respeita notch e barra de status no Android). */
export function useHeaderTopPadding(extraSpacing = SPACING.md): number {
  const insets = useSafeAreaInsets();
  return getHeaderTopPadding(insets.top, extraSpacing);
}

/** Padding superior mínimo, sem espaço extra (telas sem cabeçalho dedicado). */
export function useSafeTopPadding(): number {
  const insets = useSafeAreaInsets();
  return getHeaderTopPadding(insets.top, 0);
}
