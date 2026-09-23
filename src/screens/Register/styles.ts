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
  header: {
    width: '100%',
    marginBottom: 10,
  },
  content: {
    width: LAYOUT.formWidth,
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
});
