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
  errorText: {
    color: '#FFE0E0',
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 14,
  },
  loader: {
    marginTop: 20,
  },
  forgotPassword: {
    marginTop: 20,
    color: 'white',
    textDecorationLine: 'underline',
    fontSize: 14,
    textAlign: 'center',
  },
});
