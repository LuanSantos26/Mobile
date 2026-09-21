import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { TabScreenLayout } from '../../components/Header/TabScreenLayout';
import { PagePrimaryButton } from '../../components/Button/PagePrimaryButton';
import { BottomTabBar } from '../../components/Header/BottomTabBar';
import { IconActionButton } from '../../components/Button/IconActionButton';
import { CartoesCadastradosModal } from '../../components/Card/CartoesCadastradosModal';
import { PixCadastradosModal } from '../../components/Card/PixCadastradosModal';
import { useAuth } from '../../context/AuthContext';
import { useConfirmDialog } from '../../context/ConfirmDialogContext';
import { TipoCartao } from '../../services/cartaoPagamentoService';
import {
  FormaPagamentoSalva,
  TipoPagamento,
  criarFormaPagamento,
  iconeTipoPagamento,
  labelTipoPagamento,
  listarFormasPagamento,
  removerFormaPagamento,
} from '../../services/formaPagamentoService';

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
  const { confirm } = useConfirmDialog();

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

    confirm({
      title: 'Remover forma de pagamento',
      message: `Deseja remover "${forma.apelido}"?`,
      confirmText: 'Remover',
      destructive: true,
      onConfirm: async () => {
        await removerFormaPagamento(forma.id, empresaId);
        await carregar();
      },
    });
  };

  return (
    <>
      <TabScreenLayout
        title="Formas de pagamento"
        subtitle="Cadastre as formas que deseja usar no checkout da sacola."
        wrapContent={false}
        tabBar={<BottomTabBar activeRoute="FormasPagamento" />}
      >
        <PagePrimaryButton
          label="Adicionar forma"
          icon="add-circle-outline"
          onPress={abrirModal}
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
        ) : formas.length === 0 ? (
          <View style={styles.sectionCard}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="wallet-outline" size={22} color="#F8B125" />
            </View>
            <Text style={styles.emptyTitle}>Nenhuma forma cadastrada</Text>
            <Text style={styles.emptyText}>
              Adicione PIX, cartão ou dinheiro para finalizar pedidos na sacola.
            </Text>
          </View>
        ) : (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Cadastradas</Text>
              <Text style={styles.sectionSubtitle}>
                {formas.length} forma(s) de pagamento
              </Text>
            </View>
            {formas.map((forma, index) => (
              <View
                key={forma.id}
                style={[styles.formaCard, index === formas.length - 1 && styles.cardLast]}
              >
                <TouchableOpacity
                  style={styles.formaMain}
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
                    <Ionicons name="chevron-forward" size={16} color="#D4B56A" style={styles.chevron} />
                  ) : null}
                </TouchableOpacity>
                <IconActionButton
                  name="trash-outline"
                  size={20}
                  accessibilityLabel="Remover forma de pagamento"
                  onPress={() => confirmarRemocao(forma)}
                />
              </View>
            ))}
          </View>
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
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setModalVisible(false)} />
          <View style={styles.modalContent}>
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
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  addButton: {
    marginHorizontal: 15,
    marginBottom: 16,
  },
  sectionCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    marginBottom: 16,
    borderRadius: 20,
    padding: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8B125',
  },
  sectionSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#888',
  },
  formaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF7',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F3E3B1',
  },
  cardLast: {
    marginBottom: 0,
  },
  formaMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  formaIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF6DE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  formaInfo: {
    flex: 1,
  },
  formaApelido: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  formaTipo: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  chevron: {
    marginRight: 4,
  },
  emptyIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF6DE',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
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
    textAlign: 'center',
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
    zIndex: 1,
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
