import { StyleSheet } from 'react-native';
import { CLIENTE_COLORS, COMPANY_COLORS } from '../../theme/theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COMPANY_COLORS.pageBackground,
  },
  container: {
    flex: 1,
    backgroundColor: COMPANY_COLORS.pageBackground,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COMPANY_COLORS.primary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COMPANY_COLORS.primaryBorder,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
    marginTop: 8,
  },
  hint: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: COMPANY_COLORS.primaryBorder,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
    backgroundColor: COMPANY_COLORS.primarySoft,
  },
  errorText: {
    color: '#D64545',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  successText: {
    color: '#2E7D32',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: COMPANY_COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  navCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COMPANY_COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navSubtitle: {
    fontSize: 12,
    color: '#888',
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  backText: {
    fontSize: 15,
    fontWeight: '600',
    color: COMPANY_COLORS.primary,
  },
  capaBox: {
    height: 140,
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 4,
    backgroundColor: COMPANY_COLORS.primarySoft,
    borderWidth: 1,
    borderColor: COMPANY_COLORS.primaryBorder,
  },
  capaImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  imagePlaceholderText: {
    fontSize: 13,
    color: '#888',
  },
  imageEditBadge: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    backgroundColor: COMPANY_COLORS.primary,
    borderRadius: 12,
    padding: 5,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -32,
    marginLeft: 12,
    marginBottom: 4,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFF',
    backgroundColor: COMPANY_COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  imageActions: {
    marginLeft: 14,
    marginTop: 32,
    gap: 4,
  },
  imageActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COMPANY_COLORS.primary,
  },
  imageRemoveText: {
    fontSize: 13,
    color: '#D64545',
  },
  textArea: {
    minHeight: 90,
  },
  counter: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    marginTop: 4,
  },
});

const PRIMARY = CLIENTE_COLORS.primary;
const GOLD = '#FFAD19';
const PAGE_BG = '#F3F5F8';

export const clienteStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  header: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 20,
    paddingBottom: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  sheet: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: PRIMARY,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#8A93A3',
    marginTop: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: PRIMARY,
    marginBottom: 6,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F7FB',
    borderRadius: 16,
    paddingHorizontal: 12,
    minHeight: 48,
    marginBottom: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    paddingVertical: 10,
  },
  saveButton: {
    backgroundColor: GOLD,
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
  },
  errorText: {
    color: '#C62828',
    fontSize: 13,
    marginBottom: 8,
    textAlign: 'center',
  },
  successText: {
    color: '#2E7D32',
    fontSize: 13,
    marginBottom: 8,
    textAlign: 'center',
  },
  fotoWrap: {
    alignItems: 'center',
    marginBottom: 16,
    gap: 4,
  },
  fotoBox: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#EEF2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  fotoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
  },
  fotoBadge: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    backgroundColor: GOLD,
    borderRadius: 14,
    padding: 6,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  fotoAction: {
    fontSize: 14,
    fontWeight: '700',
    color: PRIMARY,
  },
  fotoRemove: {
    fontSize: 13,
    color: '#C62828',
  },
});
