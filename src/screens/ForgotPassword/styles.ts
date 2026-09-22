import { StyleSheet } from 'react-native';
import { LAYOUT } from '../../theme/theme';

export const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 40,
  },
  content: {
    width: LAYOUT.formWidth,
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  form: {
    width: '100%',
  },
  title: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  errorText: {
    color: '#FFE0E0',
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 14,
  },
  successText: {
    color: '#E8F5E9',
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
    color: 'white',
    textDecorationLine: 'underline',
    fontSize: 14,
    textAlign: 'center',
  },
});
