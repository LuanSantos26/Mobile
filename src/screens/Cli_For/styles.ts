import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.pageBackground,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 8,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  kicker: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primaryGold,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cream,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
  },
  optionLast: {
    marginBottom: 0,
  },
  optionSelected: {
    backgroundColor: COLORS.primaryGold,
    borderColor: COLORS.primaryGold,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.creamSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  iconWrapSelected: {
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  optionCopy: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  optionTextSelected: {
    color: COLORS.textWhite,
  },
  optionHint: {
    marginTop: 2,
    fontSize: 12,
    color: '#888',
  },
  optionHintSelected: {
    color: 'rgba(255,255,255,0.9)',
  },
  button: {
    marginTop: 18,
    backgroundColor: COLORS.primaryGold,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: '700',
  },
});
