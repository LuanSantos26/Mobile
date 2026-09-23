import { StyleSheet } from 'react-native';
import { LAYOUT } from '../../theme/theme';

export const styles = StyleSheet.create({
  successBanner: {
    marginTop: 8,
    marginHorizontal: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  successText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    width: LAYOUT.formWidth,
    alignSelf: 'center',
    paddingBottom: 40,
  },
});
