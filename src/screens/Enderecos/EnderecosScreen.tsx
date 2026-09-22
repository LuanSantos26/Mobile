import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { TabScreenLayout } from '../../components/layout/TabScreenLayout';
import { PagePrimaryButton } from '../../components/Button/PagePrimaryButton';
import { BottomTabBar } from '../../components/layout/BottomTabBar';
import { EnderecoFormModal } from '../../components/Card/EnderecoFormModal';
import { useAuth } from '../../context/AuthContext';
import { EnderecoEntrega, listarEnderecos } from '../../services/enderecoService';
import { styles } from './styles';

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
        wrapContent={false}
        tabBar={<BottomTabBar activeRoute="Home" />}
      >
        <PagePrimaryButton
          label="Adicionar endereço"
          icon="add-circle-outline"
          onPress={() => setModalVisible(true)}
          compact
          light
          style={styles.addButton}
        />

        {loading ? (
          <ActivityIndicator color="#F8B125" style={{ marginTop: 24 }} />
        ) : error ? (
          <View style={styles.sectionCard}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={carregar}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : enderecos.length === 0 ? (
          <View style={styles.sectionCard}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="location-outline" size={22} color="#F8B125" />
            </View>
            <Text style={styles.emptyTitle}>Nenhum endereço cadastrado</Text>
            <Text style={styles.emptyText}>
              Adicione um endereço para receber seus pedidos do marketplace.
            </Text>
          </View>
        ) : (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Cadastrados</Text>
              <Text style={styles.sectionSubtitle}>
                {enderecos.length} endereço(s) de entrega
              </Text>
            </View>
            {enderecos.map((endereco, index) => (
              <View
                key={endereco.id}
                style={[styles.enderecoCard, index === enderecos.length - 1 && styles.cardLast]}
              >
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
                    <View style={styles.principalPill}>
                      <Text style={styles.enderecoPrincipal}>Principal</Text>
                    </View>
                  ) : null}
                </View>
                <Ionicons name="chevron-forward" size={16} color="#D4B56A" />
              </View>
            ))}
          </View>
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
