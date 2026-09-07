import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { TabScreenLayout } from '../../../components/TabScreenLayout';
import { PagePrimaryButton } from '../../../components/PagePrimaryButton';
import { BottomTabBar } from '../../../components/BottomTabBar';
import { EnderecoFormModal } from '../../../components/EnderecoFormModal';
import { useAuth } from '../../../context/AuthContext';
import { EnderecoEntrega, listarEnderecos } from '../../../services/enderecoService';

export function EnderecosScreen() {
  const { user } = useAuth();
  const empresaId = user?.empresa?.id;

  const [enderecos, setEnderecos] = useState<EnderecoEntrega[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const carregar = useCallback(async () => {
    if (!empresaId) return;
    setLoading(true);
    setError('');
    try {
      const lista = await listarEnderecos(empresaId);
      setEnderecos(lista);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar endereços.');
    } finally {
      setLoading(false);
    }
  }, [empresaId]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  const handleEnderecoSalvo = async () => {
    await carregar();
  };

  return (
    <>
      <TabScreenLayout
        title="Endereços"
        subtitle="Gerencie os endereços de entrega usados nos seus pedidos."
        tabBar={<BottomTabBar activeRoute="Home" />}
      >
        <PagePrimaryButton
          label="Adicionar endereço"
          icon="add-circle-outline"
          onPress={() => setModalVisible(true)}
        />

        {loading ? (
          <ActivityIndicator color="#F8B125" style={{ marginTop: 24 }} />
        ) : error ? (
          <View style={styles.emptyState}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={carregar}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : enderecos.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="location-outline" size={56} color="#F8B125" />
            <Text style={styles.emptyTitle}>Nenhum endereço cadastrado</Text>
            <Text style={styles.emptyText}>
              Adicione um endereço para receber seus pedidos do marketplace.
            </Text>
          </View>
        ) : (
          enderecos.map((endereco) => (
            <View key={endereco.id} style={styles.enderecoCard}>
              <View style={styles.enderecoIconWrap}>
                <Ionicons name="location-outline" size={22} color="#F8B125" />
              </View>
              <View style={styles.enderecoInfo}>
                <Text style={styles.enderecoApelido}>{endereco.apelido}</Text>
                <Text style={styles.enderecoResumo} numberOfLines={2}>
                  {endereco.resumo}
                </Text>
                <Text style={styles.enderecoCep}>CEP {endereco.cep}</Text>
                {endereco.principal ? (
                  <Text style={styles.enderecoPrincipal}>Principal</Text>
                ) : null}
              </View>
            </View>
          ))
        )}
      </TabScreenLayout>

      {empresaId ? (
        <EnderecoFormModal
          visible={modalVisible}
          empresaId={empresaId}
          isFirstAddress={enderecos.length === 0}
          onClose={() => setModalVisible(false)}
          onSaved={handleEnderecoSalvo}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  enderecoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  enderecoIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF8E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  enderecoInfo: {
    flex: 1,
  },
  enderecoApelido: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  enderecoResumo: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    lineHeight: 18,
  },
  enderecoCep: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  enderecoPrincipal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F8B125',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
    marginTop: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 24,
  },
  errorText: {
    color: '#D64545',
    fontSize: 14,
    textAlign: 'center',
  },
  retryText: {
    color: '#F8B125',
    fontWeight: '600',
    marginTop: 10,
  },
});
