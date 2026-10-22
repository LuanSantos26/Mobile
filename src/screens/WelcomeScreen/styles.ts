import { StyleSheet } from 'react-native';
import { AUTH_CREAM, AUTH_NAVY } from '../../theme/authTheme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AUTH_NAVY,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  kicker: {
    marginTop: 14,
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  description: {
    marginTop: 6,
    color: 'rgba(255,255,255,0.78)',
    fontSize: 15,
  },
  successBanner: {
    position: 'absolute',
    top: 8,
    left: 20,
    right: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  successText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  sheet: {
    backgroundColor: AUTH_CREAM,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 40,
  },
});
