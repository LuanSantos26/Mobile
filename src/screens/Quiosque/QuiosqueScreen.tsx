import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { TabScreenLayout } from '../../components/Header/TabScreenLayout';
import { BottomTabBar } from '../../components/Header/BottomTabBar';
import { BarracaCard } from '../../components/Card/BarracaCard';
import { BarracaFormModal } from '../../components/Card/BarracaFormModal';
import { useAuth } from '../../context/AuthContext';
import { useConfirmDialog } from '../../context/ConfirmDialogContext';
import { useQuiosques } from '../../context/QuiosqueContext';
import { useProdutos } from '../../context/ProductsContext';
import { Quiosque, removerQuiosque } from '../../services/barracaService';

export function QuiosqueScreen() {
  const { user } = useAuth();
  const { quiosques, loading, error, refresh } = useQuiosques();
  const { refresh: refreshProdutos } = useProdutos();
  const { confirm } = useConfirmDialog();
  const empresaId = user?.empresa?.id;
  const responsavelId = user?.id;

  const [busca, setBusca] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [quiosqueEmEdicao, setQuiosqueEmEdicao] = useState<Quiosque | null>(null);

  useFocusEffect(
    useCallback(() => {
      refresh();
      refreshProdutos();
    }, [refresh, refreshProdutos]),
  );

  const listaFiltrada = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return quiosques;
    return quiosques.filter((item) => item.nome.toLowerCase().includes(termo));
  }, [quiosques, busca]);

  const abrirNova = () => {
    setQuiosqueEmEdicao(null);
    setModalVisible(true);
  };

  const abrirEdicao = (quiosque: Quiosque) => {
    setQuiosqueEmEdicao(quiosque);
    setModalVisible(true);
  };

  const confirmarRemocao = (quiosque: Quiosque) => {
    if (!empresaId) return;

    confirm({
      title: 'Remover quiosque',
      message: `Deseja remover "${quiosque.nome}"?`,
      confirmText: 'Remover',
      destructive: true,
      onConfirm: async () => {
        await removerQuiosque(quiosque.id, empresaId);
        await refresh();
      },
    });
  };

  return (
    <>
      <TabScreenLayout
        title="Quiosques"
        subtitle="Filiais e quiosques da empresa com estoque disponível."
        wrapContent={false}
        scrollContentStyle={styles.scrollContent}
        tabBar={<BottomTabBar activeRoute="Quiosque" />}
      >
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#F8B125" />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar quiosque..."
            placeholderTextColor="#999"
            value={busca}
            onChangeText={setBusca}
          />
        </View>

        <TouchableOpacity style={styles.addButton} onPress={abrirNova} activeOpacity={0.85}>
          <Ionicons name="add-circle-outline" size={18} color="#FFF" />
          <Text style={styles.addButtonText}>Adicionar Quiosque</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator color="#F8B125" style={styles.loader} />
        ) : error ? (
          <View style={styles.emptyState}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={refresh}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : listaFiltrada.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {busca.trim()
                ? 'Nenhum quiosque encontrado para a busca.'
                : 'Nenhum quiosque cadastrado.'}
            </Text>
            {!busca.trim() ? (
              <TouchableOpacity onPress={abrirNova}>
                <Text style={styles.retryText}>Cadastrar primeiro quiosque</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : (
          listaFiltrada.map((quiosque) => (
            <BarracaCard
              key={quiosque.id}
              quiosque={quiosque}
              onPress={() => abrirEdicao(quiosque)}
              onDelete={() => confirmarRemocao(quiosque)}
            />
          ))
        )}
      </TabScreenLayout>

      {empresaId && responsavelId ? (
        <BarracaFormModal
          visible={modalVisible}
          empresaId={empresaId}
          responsavelId={responsavelId}
          quiosque={quiosqueEmEdicao}
          onClose={() => setModalVisible(false)}
          onSaved={refresh}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
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
