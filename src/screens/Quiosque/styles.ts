import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  scrollContent: {},
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    marginBottom: 10,
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8B125',
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 15,
    marginBottom: 16,
    gap: 6,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  loader: {
    marginTop: 24,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 20,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 14,
  },
  errorText: {
    color: '#D64545',
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 14,
  },
  retryText: {
    color: '#F8B125',
    fontWeight: '600',
    fontSize: 14,
  },
});
