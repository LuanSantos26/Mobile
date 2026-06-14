import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TipoCartao, salvarCartao } from '../services/cartaoPagamentoService';
import {
  detectarBandeira,
  extrairUltimosDigitos,
  formatarNumeroCartaoInput,
  formatarValidadeInput,
  mascararTitular,
  mascararValidade,
  numeroCartaoValido,
  validadeValida,
} from '../utils/cartaoUtils';

interface CartaoFormModalProps {
  visible: boolean;
  empresaId: number;
  tipo: TipoCartao;
  onClose: () => void;
  onSaved: () => void;
}

const EMPTY = {
  apelido: '',
  numero: '',
  validade: '',
  titular: '',
};

export function CartaoFormModal({
  visible,
  empresaId,
  tipo,
  onClose,
  onSaved,
}: CartaoFormModalProps) {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!visible) return;
    setForm(EMPTY);
    setError('');
  }, [visible, tipo]);

  const update = (field: keyof typeof EMPTY, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setError('');

    if (!form.apelido.trim()) {
      setError('Informe um apelido para o cartão.');
      return;
    }
    if (!numeroCartaoValido(form.numero)) {
      setError('Informe um número de cartão válido.');
      return;
    }
    if (!validadeValida(form.validade)) {
      setError('Informe a validade no formato MM/AA.');
      return;
    }
    if (!form.titular.trim()) {
      setError('Informe o nome do titular.');
      return;
    }

    setLoading(true);
    try {
      const ultimosDigitos = extrairUltimosDigitos(form.numero);
      await salvarCartao({
        empresaId,
        apelido: form.apelido.trim(),
        tipo,
        bandeira: detectarBandeira(form.numero),
        ultimosDigitos,
        titularMascarado: mascararTitular(form.titular),
        validadeMascarada: mascararValidade(),
      });
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar cartão.');
    } finally {
      setLoading(false);
    }
  };

  const titulo = tipo === 'credito' ? 'Novo cartão de crédito' : 'Novo cartão de débito';

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardWrap}
        >
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.handle} />
            <Text style={styles.title}>{titulo}</Text>
            <Text style={styles.subtitle}>
              Apenas os últimos 4 dígitos e dados mascarados serão armazenados.
            </Text>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={styles.label}>Apelido</Text>
              <TextInput
                style={styles.input}
                value={form.apelido}
                onChangeText={(v) => update('apelido', v)}
                placeholder="Ex: Cartão principal"
              />

              <Text style={styles.label}>Número do cartão</Text>
              <TextInput
                style={styles.input}
                value={form.numero}
                onChangeText={(v) => update('numero', formatarNumeroCartaoInput(v))}
                placeholder="0000 0000 0000 0000"
                keyboardType="number-pad"
                maxLength={19}
              />

              <View style={styles.row}>
                <View style={styles.rowItem}>
                  <Text style={styles.label}>Validade</Text>
                  <TextInput
                    style={styles.input}
                    value={form.validade}
                    onChangeText={(v) => update('validade', formatarValidadeInput(v))}
                    placeholder="MM/AA"
                    keyboardType="number-pad"
                    maxLength={5}
                  />
                </View>
                <View style={styles.rowItemWide}>
                  <Text style={styles.label}>Titular</Text>
                  <TextInput
                    style={styles.input}
                    value={form.titular}
                    onChangeText={(v) => update('titular', v)}
                    placeholder="Nome impresso no cartão"
                    autoCapitalize="characters"
                  />
                </View>
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </ScrollView>

            <TouchableOpacity
              style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.saveBtnText}>Salvar cartão</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  keyboardWrap: { width: '100%' },
  sheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 24,
    maxHeight: '92%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 12,
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 13, color: '#666', marginTop: 4, marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', color: '#555', marginBottom: 4, marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#FAFAFA',
  },
  row: { flexDirection: 'row', gap: 10 },
  rowItem: { flex: 1 },
  rowItemWide: { flex: 2 },
  errorText: { color: '#D64545', marginTop: 10, textAlign: 'center' },
  saveBtn: {
    backgroundColor: '#F8B125',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  saveBtnDisabled: { opacity: 0.7 },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  cancelBtn: { alignItems: 'center', paddingVertical: 12 },
  cancelBtnText: { color: '#888', fontWeight: '600' },
});
