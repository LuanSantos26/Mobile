import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  CartaoSalvo,
  TipoCartao,
  listarCartoesPorTipo,
  removerCartao,
} from '../services/cartaoPagamentoService';
import { formatarCartaoExibicao } from '../utils/cartaoUtils';
import { CartaoFormModal } from './CartaoFormModal';

interface CartoesCadastradosModalProps {
  visible: boolean;
  empresaId: number;
  tipo: TipoCartao;
  onClose: () => void;
}

export function CartoesCadastradosModal({
  visible,
  empresaId,
  tipo,
  onClose,
}: CartoesCadastradosModalProps) {
  const [cartoes, setCartoes] = useState<CartaoSalvo[]>([]);
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const lista = await listarCartoesPorTipo(empresaId, tipo);
      setCartoes(lista);
    } finally {
      setLoading(false);
    }
  }, [empresaId, tipo]);

  useEffect(() => {
    if (visible) {
      carregar();
    } else {
      setFormVisible(false);
    }
  }, [visible, carregar]);

  const confirmarRemocao = (cartao: CartaoSalvo) => {
    Alert.alert(
      'Remover cartão',
      `Deseja remover "${cartao.apelido}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            await removerCartao(empresaId, cartao.id);
            await carregar();
          },
        },
      ],
    );
  };

  const titulo = tipo === 'credito' ? 'Cartões de crédito' : 'Cartões de débito';

  return (
    <>
      <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <Pressable style={styles.overlay} onPress={onClose}>
          <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.title}>{titulo}</Text>
            <Text style={styles.subtitle}>
              Dados protegidos — exibimos apenas informações mascaradas.
            </Text>

            {loading ? (
              <ActivityIndicator color="#F8B125" style={styles.loader} />
            ) : cartoes.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="card-outline" size={48} color="#F8B125" />
                <Text style={styles.emptyTitle}>Nenhum cartão cadastrado</Text>
                <Text style={styles.emptyText}>
                  Adicione um cartão para vincular a esta forma de pagamento.
                </Text>
              </View>
            ) : (
              cartoes.map((cartao) => (
                <View key={cartao.id} style={styles.cartaoCard}>
                  <View style={styles.cartaoIconWrap}>
                    <Ionicons name="card-outline" size={22} color="#F8B125" />
                  </View>
                  <View style={styles.cartaoInfo}>
                    <Text style={styles.cartaoApelido}>{cartao.apelido}</Text>
                    <Text style={styles.cartaoNumero}>
                      {formatarCartaoExibicao(cartao.ultimosDigitos)}
                    </Text>
                    <Text style={styles.cartaoMeta}>
                      {cartao.bandeira} · {cartao.titularMascarado} · Val. {cartao.validadeMascarada}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => confirmarRemocao(cartao)}>
                    <Ionicons name="trash-outline" size={20} color="#D64545" />
                  </TouchableOpacity>
                </View>
              ))
            )}

            <TouchableOpacity style={styles.addBtn} onPress={() => setFormVisible(true)}>
              <Ionicons name="add-circle-outline" size={20} color="#F8B125" />
              <Text style={styles.addBtnText}>Adicionar cartão</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>Fechar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      <CartaoFormModal
        visible={formVisible}
        empresaId={empresaId}
        tipo={tipo}
        onClose={() => setFormVisible(false)}
        onSaved={carregar}
      />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: 32,
    maxHeight: '80%',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
  },
  loader: {
    marginVertical: 24,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginTop: 12,
  },
  emptyText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 16,
  },
  cartaoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  cartaoIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF8E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cartaoInfo: {
    flex: 1,
  },
  cartaoApelido: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  cartaoNumero: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  cartaoMeta: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#F8B125',
    borderRadius: 12,
  },
  addBtnText: {
    color: '#F8B125',
    fontWeight: '700',
    fontSize: 14,
  },
  closeBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 4,
  },
  closeBtnText: {
    color: '#888',
    fontWeight: '600',
  },
});
