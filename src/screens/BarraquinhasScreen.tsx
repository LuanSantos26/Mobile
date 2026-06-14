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
import { TabScreenLayout } from '../components/TabScreenLayout';
import { BottomTabBar } from '../components/BottomTabBar';
import { BarracaCard } from '../components/BarracaCard';
import { BarracaFormModal } from '../components/BarracaFormModal';
import { useAuth } from '../context/AuthContext';
import { useConfirmDialog } from '../context/ConfirmDialogContext';
import { useBarraquinhas } from '../context/BarraquinhasContext';
import { useProdutos } from '../context/ProductsContext';
import { Barraquinha, removerBarraquinha } from '../services/barracaService';

export function BarraquinhasScreen() {
  const { user } = useAuth();
  const { barraquinhas, loading, error, refresh } = useBarraquinhas();
  const { refresh: refreshProdutos } = useProdutos();
  const { confirm } = useConfirmDialog();
  const empresaId = user?.empresa?.id;
  const responsavelId = user?.id;

  const [busca, setBusca] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [barraquinhaEmEdicao, setBarraquinhaEmEdicao] = useState<Barraquinha | null>(null);

  useFocusEffect(
    useCallback(() => {
      refresh();
      refreshProdutos();
    }, [refresh, refreshProdutos]),
  );

  const listaFiltrada = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return barraquinhas;
    return barraquinhas.filter((item) => item.nome.toLowerCase().includes(termo));
  }, [barraquinhas, busca]);

  const abrirNova = () => {
    setBarraquinhaEmEdicao(null);
    setModalVisible(true);
  };

  const abrirEdicao = (barraquinha: Barraquinha) => {
    setBarraquinhaEmEdicao(barraquinha);
    setModalVisible(true);
  };

  const confirmarRemocao = (barraquinha: Barraquinha) => {
    if (!empresaId) return;

    confirm({
      title: 'Remover barraquinha',
      message: `Deseja remover "${barraquinha.nome}"?`,
      confirmText: 'Remover',
      destructive: true,
      onConfirm: async () => {
        await removerBarraquinha(barraquinha.id, empresaId);
        await refresh();
      },
    });
  };

  return (
    <>
      <TabScreenLayout
        title="Barraquinhas"
        subtitle="Filiais e quiosques da empresa com estoque disponível."
        wrapContent={false}
        scrollContentStyle={styles.scrollContent}
        tabBar={<BottomTabBar activeRoute="Barraquinhas" />}
      >
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#F8B125" />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar barraquinha..."
            placeholderTextColor="#999"
            value={busca}
            onChangeText={setBusca}
          />
        </View>

        <TouchableOpacity style={styles.addButton} onPress={abrirNova} activeOpacity={0.85}>
          <Ionicons name="add-circle-outline" size={18} color="#FFF" />
          <Text style={styles.addButtonText}>Adicionar barraquinha</Text>
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
                ? 'Nenhuma barraquinha encontrada para a busca.'
                : 'Nenhuma barraquinha cadastrada.'}
            </Text>
            {!busca.trim() ? (
              <TouchableOpacity onPress={abrirNova}>
                <Text style={styles.retryText}>Cadastrar primeira barraquinha</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : (
          listaFiltrada.map((barraquinha) => (
            <BarracaCard
              key={barraquinha.id}
              barraquinha={barraquinha}
              onPress={() => abrirEdicao(barraquinha)}
              onDelete={() => confirmarRemocao(barraquinha)}
            />
          ))
        )}
      </TabScreenLayout>

      {empresaId && responsavelId ? (
        <BarracaFormModal
          visible={modalVisible}
          empresaId={empresaId}
          responsavelId={responsavelId}
          barraquinha={barraquinhaEmEdicao}
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
