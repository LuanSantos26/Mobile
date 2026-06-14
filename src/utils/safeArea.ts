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

const ANDROID_NAV_BAR_MIN = 48;

/** Inset inferior confiável (barra de gestos / botões virtuais do Android). */
export function getBottomInset(insetBottom: number): number {
  if (Platform.OS === 'android') {
    return Math.max(insetBottom, ANDROID_NAV_BAR_MIN);
  }
  return insetBottom;
}

/** Padding superior para telas/cabeçalhos (respeita notch e barra de status no Android). */
export function useHeaderTopPadding(extraSpacing = SPACING.md): number {
  const insets = useSafeAreaInsets();
  return getHeaderTopPadding(insets.top, extraSpacing);
}

/** Padding inferior reservado pelo sistema operacional. */
export function useBottomInset(): number {
  const insets = useSafeAreaInsets();
  return getBottomInset(insets.bottom);
}

/** Padding superior mínimo, sem espaço extra (telas sem cabeçalho dedicado). */
export function useSafeTopPadding(): number {
  const insets = useSafeAreaInsets();
  return getHeaderTopPadding(insets.top, 0);
}
