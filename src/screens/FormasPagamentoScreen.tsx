import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { TabScreenLayout } from '../components/TabScreenLayout';
import { PagePrimaryButton } from '../components/PagePrimaryButton';
import { BottomTabBar } from '../components/BottomTabBar';
import { CartoesCadastradosModal } from '../components/CartoesCadastradosModal';
import { PixCadastradosModal } from '../components/PixCadastradosModal';
import { useAuth } from '../context/AuthContext';
import { TipoCartao } from '../services/cartaoPagamentoService';
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

function isTipoCartao(tipo: TipoPagamento): tipo is TipoCartao {
  return tipo === 'credito' || tipo === 'debito';
}

function isFormaComDetalhes(tipo: TipoPagamento): boolean {
  return tipo === 'pix' || isTipoCartao(tipo);
}

function hintForma(tipo: TipoPagamento): string {
  if (tipo === 'pix') return ' · Toque para ver chaves PIX';
  if (isTipoCartao(tipo)) return ' · Toque para ver cartões';
  return '';
}

export function FormasPagamentoScreen() {
  const { user } = useAuth();
  const empresaId = user?.empresa?.id;
  const cnpjEmpresa = user?.empresa?.cnpj;

  const [formas, setFormas] = useState<FormaPagamentoSalva[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [tipoSelecionado, setTipoSelecionado] = useState<TipoPagamento>('pix');
  const [apelido, setApelido] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [modalErro, setModalErro] = useState('');
  const [cartoesModalVisible, setCartoesModalVisible] = useState(false);
  const [cartoesModalTipo, setCartoesModalTipo] = useState<TipoCartao>('credito');
  const [pixModalVisible, setPixModalVisible] = useState(false);

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

  const abrirCartoes = (tipo: TipoCartao) => {
    setCartoesModalTipo(tipo);
    setCartoesModalVisible(true);
  };

  const abrirPix = () => {
    setPixModalVisible(true);
  };

  const handlePressForma = (forma: FormaPagamentoSalva) => {
    if (forma.tipo === 'pix') {
      abrirPix();
      return;
    }
    if (isTipoCartao(forma.tipo)) {
      abrirCartoes(forma.tipo);
    }
  };

  const handleSelecionarTipo = (tipo: TipoPagamento) => {
    setTipoSelecionado(tipo);
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
    <>
      <TabScreenLayout
        title="Formas de pagamento"
        subtitle="Cadastre as formas que deseja usar no checkout da sacola."
        tabBar={<BottomTabBar activeRoute="FormasPagamento" />}
      >
        <PagePrimaryButton
          label="Adicionar forma"
          icon="add-circle-outline"
          onPress={abrirModal}
          compact
          light
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
            <TouchableOpacity
              key={forma.id}
              style={styles.formaCard}
              activeOpacity={isFormaComDetalhes(forma.tipo) ? 0.75 : 1}
              onPress={() => handlePressForma(forma)}
              disabled={!isFormaComDetalhes(forma.tipo)}
            >
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
                  {hintForma(forma.tipo)}
                </Text>
              </View>
              {isFormaComDetalhes(forma.tipo) ? (
                <Ionicons name="chevron-forward" size={20} color="#999" style={styles.chevron} />
              ) : null}
              <TouchableOpacity
                onPress={() => confirmarRemocao(forma)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="trash-outline" size={22} color="#D64545" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </TabScreenLayout>

      {empresaId ? (
        <>
          <CartoesCadastradosModal
            visible={cartoesModalVisible}
            empresaId={empresaId}
            tipo={cartoesModalTipo}
            onClose={() => setCartoesModalVisible(false)}
          />
          <PixCadastradosModal
            visible={pixModalVisible}
            empresaId={empresaId}
            cnpjEmpresa={cnpjEmpresa}
            onClose={() => setPixModalVisible(false)}
          />
        </>
      ) : null}

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
                    onPress={() => handleSelecionarTipo(tipo.id)}
                  >
                    <Text style={[styles.tipoChipText, selected && styles.tipoChipTextSelected]}>
                      {tipo.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {tipoSelecionado === 'pix' ? (
              <TouchableOpacity
                style={styles.verCartoesBtn}
                onPress={abrirPix}
              >
                <Ionicons name="phone-portrait-outline" size={18} color="#F8B125" />
                <Text style={styles.verCartoesText}>Ver chaves PIX cadastradas</Text>
                <Ionicons name="chevron-forward" size={16} color="#F8B125" />
              </TouchableOpacity>
            ) : null}

            {isTipoCartao(tipoSelecionado) ? (
              <TouchableOpacity
                style={styles.verCartoesBtn}
                onPress={() => abrirCartoes(tipoSelecionado)}
              >
                <Ionicons name="card-outline" size={18} color="#F8B125" />
                <Text style={styles.verCartoesText}>Ver cartões cadastrados</Text>
                <Ionicons name="chevron-forward" size={16} color="#F8B125" />
              </TouchableOpacity>
            ) : null}

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
    </>
  );
}

const styles = StyleSheet.create({
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
  chevron: {
    marginRight: 8,
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
  verCartoesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#FFF8E7',
    borderWidth: 1,
    borderColor: '#F8B125',
  },
  verCartoesText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
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
