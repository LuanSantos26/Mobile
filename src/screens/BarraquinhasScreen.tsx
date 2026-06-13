import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ScreenHeader } from '../components/ScreenHeader';
import { BottomTabBar } from '../components/BottomTabBar';
import { BarracaCard } from '../components/BarracaCard';
import { BarracaFormModal } from '../components/BarracaFormModal';
import { useAuth } from '../context/AuthContext';
import { useBarraquinhas } from '../context/BarraquinhasContext';
import { Barraquinha, removerBarraquinha } from '../services/barracaService';

export function BarraquinhasScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { barraquinhas, loading, error, refresh } = useBarraquinhas();
  const empresaId = user?.empresa?.id;
  const responsavelId = user?.id;

  const [busca, setBusca] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [barraquinhaEmEdicao, setBarraquinhaEmEdicao] = useState<Barraquinha | null>(null);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
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

    Alert.alert(
      'Remover barraquinha',
      `Deseja remover "${barraquinha.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await removerBarraquinha(barraquinha.id, empresaId);
              await refresh();
            } catch (err) {
              const message =
                err instanceof Error ? err.message : 'Erro ao remover barraquinha.';
              Alert.alert('Erro', message);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <LinearGradient colors={['#F8B125', '#FAFAFA']} style={styles.topGradient} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ScreenHeader />

        <Text style={styles.pageTitle}>Barraquinhas</Text>
        <Text style={styles.pageSubtitle}>
          Filiais e quiosques da empresa com estoque disponível.
        </Text>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={24} color="#F8B125" />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar barraquinha..."
            value={busca}
            onChangeText={setBusca}
          />
        </View>

        <TouchableOpacity style={styles.addButton} onPress={abrirNova}>
          <Ionicons name="add-circle-outline" size={22} color="#FFF" />
          <Text style={styles.addButtonText}>Adicionar barraquinha</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator color="#F8B125" style={{ marginTop: 20 }} />
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
      </ScrollView>

      <BottomTabBar activeRoute="Barraquinhas" />

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 350,
  },
  scrollContent: { paddingBottom: 120 },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 15,
    marginTop: 12,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 15,
    marginTop: 4,
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    marginBottom: 12,
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#F8B125',
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8B125',
    borderRadius: 14,
    paddingVertical: 12,
    marginHorizontal: 15,
    marginBottom: 16,
    gap: 8,
  },
  addButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  emptyState: { alignItems: 'center', marginTop: 24, paddingHorizontal: 20 },
  emptyText: { color: '#666', textAlign: 'center', marginBottom: 8 },
  errorText: { color: '#D64545', textAlign: 'center', marginBottom: 8 },
  retryText: { color: '#F8B125', fontWeight: '600' },
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
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  tabItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  floatingButtonContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
