import { StyleSheet } from 'react-native';
import { AUTH_NAVY } from '../../theme/authTheme';

export const styles = StyleSheet.create({
  authQuestion: {
    color: AUTH_NAVY,
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 8,
  },
  authHint: {
    marginBottom: 22,
    color: '#8A93A3',
    fontSize: 14,
    textAlign: 'center',
  },
  authOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 12,
    gap: 12,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  authOptionSelected: {
    borderColor: AUTH_NAVY,
  },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authOptionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: AUTH_NAVY,
  },
});
