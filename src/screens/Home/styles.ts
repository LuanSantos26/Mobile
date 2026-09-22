import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ==========================================
  // ESTRUTURA E CONFIGURAÇÕES GERAIS
  // ==========================================
  container: { 
    flex: 1, 
    backgroundColor: '#FAFAFA',
  },
  root: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollView: {
    flex: 1,
  },
  topGradient: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    height: 350,
  },
  scrollContent: {
  },
  emptyProductsText: {
    color: '#666',
    fontSize: 14,
    paddingVertical: 12,
  },

  // ==========================================
  // CABEÇALHO (HEADER) — ver ScreenHeader
  // ==========================================
  // FILTRO / BARRA DE PESQUISA
  // ==========================================
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    marginHorizontal: 15, 
    marginTop: 8, 
    marginBottom: 16, 
    paddingHorizontal: 12, 
    height: 40, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#F0E6CC',
  },
  searchInput: { 
    flex: 1, 
    marginLeft: 8, 
    fontSize: 14,
    color: '#333',
    paddingVertical: 0,
  },

  // ==========================================
  // CARDS PRINCIPAIS (MAIN CARD)
  // ==========================================
  mainCard: { 
    backgroundColor: '#FFF', 
    marginHorizontal: 15, 
    borderRadius: 20, 
    padding: 16, 
    marginBottom: 16, 
    elevation: 8, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.15, 
    shadowRadius: 10,
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    marginBottom: 12,
  },
  cardTitleBlock: {
    flex: 1,
    marginRight: 8,
  },
  cardTitleContainer: { 
    flexDirection: 'row', 
    alignItems: 'center',
  },
  dot: { 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    marginRight: 8,
  },
  cardTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#F8B125',
  },
  cardSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#888',
  },
  financeHeader: {
    marginBottom: 14,
  },
  tagsContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tag: { 
    backgroundColor: '#FFFDF7',
    borderWidth: 1, 
    borderColor: '#F3E3B1', 
    borderRadius: 16, 
    paddingHorizontal: 10, 
    paddingVertical: 5,
  },
  tagText: { 
    fontSize: 11, 
    color: '#666',
    fontWeight: '600',
  },

  // ==========================================
  // ELEMENTOS DE ITENS DO ESTOQUE
  // ==========================================
  horizontalScroll: { 
    flexDirection: 'row',
  },
  horizontalScrollContent: {
    paddingVertical: 4,
    paddingRight: 4,
  },
  stockItemCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    borderWidth: 1.5, 
    borderColor: '#F8B125', 
    borderRadius: 25, 
    padding: 10, 
    marginRight: 10, 
    minWidth: 160,
  },
  stockIcon: { 
    marginRight: 8,
  },
  stockTextContainer: { 
    justifyContent: 'center',
  },
  stockItemName: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#000',
  },
  stockItemTotal: { 
    fontSize: 12, 
    color: '#000', 
    fontWeight: 'bold',
  },
  stockItemTotalNumber: { 
    color: '#F8B125', 
    fontSize: 16,
  },

  // ==========================================
  // SESSÃO FINANCEIRA E GRÁFICOS
  // ==========================================
  financialContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 4,
  },
  financialBox: { 
    flex: 1,
    backgroundColor: '#FFFDF7', 
    borderWidth: 1, 
    borderColor: '#F3E3B1', 
    borderRadius: 16, 
    paddingVertical: 12, 
    paddingHorizontal: 12, 
    alignItems: 'flex-start',
  },
  financialBoxSpend: {
    borderLeftWidth: 4,
    borderLeftColor: '#D64545',
  },
  financialBoxProfit: {
    borderLeftWidth: 4,
    borderLeftColor: '#32CD32',
  },
  financialLabel: { 
    fontSize: 12, 
    color: '#888',
  },
  financialValue: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#333', 
    marginTop: 4,
  },
  quickActionsSection: {
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    marginTop: 8,
    marginBottom: 18,
    borderRadius: 20,
    padding: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  quickActionsHeader: {
    marginBottom: 14,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8B125',
  },
  quickActionsSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#888',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF7',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F3E3B1',
  },
  quickActionCardWide: {
    width: '100%',
  },
  quickActionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF6DE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  quickActionCopy: {
    flex: 1,
  },
  quickActionText: {
    color: '#333',
    fontWeight: '700',
    fontSize: 13,
  },
  quickActionHint: {
    marginTop: 2,
    color: '#999',
    fontSize: 11,
  },

  // ==========================================
  // BARRA DE NAVEGAÇÃO INFERIOR (BOTTOM BAR)
  // ==========================================
  bottomBar: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    height: 70, 
    backgroundColor: '#F8B125', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 15,
  },
  tabItem: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  floatingButtonContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  floatingButton: { 
    width: 76, 
    height: 76, 
    borderRadius: 38, 
    backgroundColor: '#FFF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    position: 'absolute', 
    bottom: -15, 
    borderWidth: 2, 
    borderColor: '#F8B125', 
    elevation: 6, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 5,
  },
});