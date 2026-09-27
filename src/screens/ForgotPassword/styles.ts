import { StyleSheet } from 'react-native';
import { AUTH_NAVY } from '../../theme/authTheme';

export const styles = StyleSheet.create({
  title: {
    color: AUTH_NAVY,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#8A93A3',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  errorText: {
    color: '#C62828',
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 14,
  },
  successText: {
    color: '#1B7A4A',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 15,
    lineHeight: 22,
  },
  loader: {
    marginTop: 20,
  },
  backToLogin: {
    marginTop: 20,
    color: AUTH_NAVY,
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
  },
});
