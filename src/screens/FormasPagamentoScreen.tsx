import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenHeader } from '../components/ScreenHeader';
import { BottomTabBar } from '../components/BottomTabBar';
import { useAuth } from '../context/AuthContext';
import {
  FormaPagamentoSalva,
  TipoPagamento,
  criarFormaPagamento,
  iconeTipoPagamento,
  labelTipoPagamento,
  listarFormasPagamento,
  removerFormaPagamento,
} from '../services/formaPagamentoService';

const TIPOS_DISPONIVEIS: { id: TipoPagamento; label: string }[] = [
  { id: 'pix', label: 'PIX' },
  { id: 'credito', label: 'Crédito' },
  { id: 'debito', label: 'Débito' },
  { id: 'dinheiro', label: 'Dinheiro' },
];

export function FormasPagamentoScreen() {
  const { user } = useAuth();
  const empresaId = user?.empresa?.id;

  const [formas, setFormas] = useState<FormaPagamentoSalva[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [tipoSelecionado, setTipoSelecionado] = useState<TipoPagamento>('pix');
  const [apelido, setApelido] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [modalErro, setModalErro] = useState('');

  const carregar = useCallback(async () => {
    if (!empresaId) return;
    setLoading(true);
    setError('');
    try {
      const lista = await listarFormasPagamento(empresaId);
      setFormas(lista);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar formas de pagamento.');
    } finally {
      setLoading(false);
    }
  }, [empresaId]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  const abrirModal = () => {
    setTipoSelecionado('pix');
    setApelido('');
    setModalErro('');
    setModalVisible(true);
  };

  const handleSalvar = async () => {
    if (!empresaId) return;

    const apelidoTrim = apelido.trim();
    if (!apelidoTrim) {
      setModalErro('Informe um apelido para a forma de pagamento.');
      return;
    }

    setSalvando(true);
    setModalErro('');
    try {
      await criarFormaPagamento({
        empresaId,
        tipo: tipoSelecionado,
        apelido: apelidoTrim,
      });
      setModalVisible(false);
      await carregar();
    } catch (err) {
      setModalErro(err instanceof Error ? err.message : 'Erro ao salvar forma de pagamento.');
    } finally {
      setSalvando(false);
    }
  };

  const confirmarRemocao = (forma: FormaPagamentoSalva) => {
    if (!empresaId) return;

    Alert.alert(
      'Remover forma de pagamento',
      `Deseja remover "${forma.apelido}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await removerFormaPagamento(forma.id, empresaId);
              await carregar();
            } catch (err) {
              Alert.alert(
                'Erro',
                err instanceof Error ? err.message : 'Erro ao remover forma de pagamento.',
              );
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

        <Text style={styles.pageTitle}>Formas de pagamento</Text>
        <Text style={styles.pageSubtitle}>
          Cadastre as formas que deseja usar no checkout da sacola.
        </Text>

        <TouchableOpacity style={styles.addButton} onPress={abrirModal}>
          <Ionicons name="add-circle-outline" size={22} color="#FFF" />
          <Text style={styles.addButtonText}>Adicionar forma</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator color="#F8B125" style={{ marginTop: 24 }} />
        ) : error ? (
          <View style={styles.emptyState}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={carregar}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : formas.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="wallet-outline" size={56} color="#F8B125" />
            <Text style={styles.emptyTitle}>Nenhuma forma cadastrada</Text>
            <Text style={styles.emptyText}>
              Adicione PIX, cartão ou dinheiro para finalizar pedidos na sacola.
            </Text>
          </View>
        ) : (
          formas.map((forma) => (
            <View key={forma.id} style={styles.formaCard}>
              <View style={styles.formaIconWrap}>
                <Ionicons
                  name={iconeTipoPagamento(forma.tipo)}
                  size={22}
                  color="#F8B125"
                />
              </View>
              <View style={styles.formaInfo}>
                <Text style={styles.formaApelido}>{forma.apelido}</Text>
                <Text style={styles.formaTipo}>
                  {forma.label || labelTipoPagamento(forma.tipo)}
                  {forma.principal ? ' · Principal' : ''}
                </Text>
              </View>
              <TouchableOpacity onPress={() => confirmarRemocao(forma)}>
                <Ionicons name="trash-outline" size={22} color="#D64545" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      <BottomTabBar activeRoute="FormasPagamento" />

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Nova forma de pagamento</Text>

            <Text style={styles.modalLabel}>Tipo</Text>
            <View style={styles.tipoRow}>
              {TIPOS_DISPONIVEIS.map((tipo) => {
                const selected = tipoSelecionado === tipo.id;
                return (
                  <TouchableOpacity
                    key={tipo.id}
                    style={[styles.tipoChip, selected && styles.tipoChipSelected]}
                    onPress={() => setTipoSelecionado(tipo.id)}
                  >
                    <Text style={[styles.tipoChipText, selected && styles.tipoChipTextSelected]}>
                      {tipo.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.modalLabel}>Apelido</Text>
            <TextInput
              style={styles.modalInput}
              value={apelido}
              onChangeText={setApelido}
              placeholder='Ex: "Meu PIX"'
              autoCapitalize="sentences"
            />

            {modalErro ? <Text style={styles.modalErro}>{modalErro}</Text> : null}

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSave, salvando && styles.modalSaveDisabled]}
                onPress={handleSalvar}
                disabled={salvando}
              >
                {salvando ? (
                  <ActivityIndicator color="#333" />
                ) : (
                  <Text style={styles.modalSaveText}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginTop: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
    marginBottom: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F8B125',
    borderRadius: 10,
    paddingVertical: 12,
    marginBottom: 20,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  formaCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  formaIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF8E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  formaInfo: {
    flex: 1,
  },
  formaApelido: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  formaTipo: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: 32,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginTop: 8,
  },
  tipoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tipoChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F8B125',
    backgroundColor: '#FFF',
  },
  tipoChipSelected: {
    backgroundColor: '#F8B125',
  },
  tipoChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F8B125',
  },
  tipoChipTextSelected: {
    color: '#333',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
  },
  modalErro: {
    color: '#D64545',
    fontSize: 13,
    marginTop: 10,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalCancel: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  modalSave: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F8B125',
  },
  modalSaveDisabled: {
    opacity: 0.7,
  },
  modalSaveText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
});
