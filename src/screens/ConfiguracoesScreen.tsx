import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { ScreenHeader } from '../components/ScreenHeader';
import { atualizarEmpresa, atualizarUsuario } from '../services/authService';

export function ConfiguracoesScreen() {
  const { user, updateUser } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) return;
    setNome(user.nome ?? '');
    setEmail(user.email ?? '');
    setTelefone(user.empresa?.telefone ?? '');
  }, [user]);

  const handleSalvar = async () => {
    setError('');
    setSuccess('');

    if (!user?.id || !user.empresa?.id) {
      setError('Usuário não identificado.');
      return;
    }

    const nomeTrim = nome.trim();
    const emailTrim = email.trim().toLowerCase();

    if (!nomeTrim) {
      setError('Informe seu nome.');
      return;
    }
    if (!emailTrim) {
      setError('Informe seu e-mail.');
      return;
    }

    if (senha || confirmarSenha) {
      if (senha.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres.');
        return;
      }
      if (senha !== confirmarSenha) {
        setError('As senhas não coincidem.');
        return;
      }
    }

    setLoading(true);
    try {
      const payloadUsuario: { nome: string; email: string; senha?: string } = {
        nome: nomeTrim,
        email: emailTrim,
      };
      if (senha) payloadUsuario.senha = senha;

      const usuarioAtualizado = await atualizarUsuario(user.id, payloadUsuario);

      const empresaAtualizada = await atualizarEmpresa(user.empresa.id, {
        nome: user.empresa.nome,
        cnpj: user.empresa.cnpj,
        telefone: telefone.trim() || undefined,
      });

      await updateUser({
        ...usuarioAtualizado,
        empresa: {
          ...usuarioAtualizado.empresa,
          telefone: empresaAtualizada.telefone,
        },
      });

      setSenha('');
      setConfirmarSenha('');
      setSuccess('Configurações salvas com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar configurações.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <LinearGradient colors={['#F8B125', '#FAFAFA']} style={styles.topGradient} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader />

        <Text style={styles.pageTitle}>Configurações</Text>

        <Text style={styles.sectionTitle}>Dados pessoais</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Seu nome"
            autoCapitalize="words"
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <Text style={styles.sectionTitle}>Alterar senha</Text>
        <View style={styles.card}>
          <Text style={styles.hint}>Deixe em branco para manter a senha atual.</Text>
          <Text style={styles.label}>Nova senha</Text>
          <TextInput
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
          />

          <Text style={styles.label}>Confirmar senha</Text>
          <TextInput
            style={styles.input}
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            placeholder="Repita a nova senha"
            secureTextEntry
          />
        </View>

        <Text style={styles.sectionTitle}>Empresa</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Nome da empresa</Text>
          <TextInput
            style={[styles.input, styles.inputReadonly]}
            value={user?.empresa?.nome ?? ''}
            editable={false}
          />

          <Text style={styles.label}>CNPJ</Text>
          <TextInput
            style={[styles.input, styles.inputReadonly]}
            value={user?.empresa?.cnpj ?? ''}
            editable={false}
          />

          <Text style={styles.label}>Telefone</Text>
          <TextInput
            style={styles.input}
            value={telefone}
            onChangeText={setTelefone}
            placeholder="(00) 00000-0000"
            keyboardType="phone-pad"
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {success ? <Text style={styles.successText}>{success}</Text> : null}

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSalvar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#333" />
          ) : (
            <Text style={styles.saveButtonText}>Salvar alterações</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
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
    height: 350,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
    marginTop: 8,
  },
  hint: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#FFF',
  },
  inputReadonly: {
    backgroundColor: '#F5F5F5',
    color: '#777',
  },
  errorText: {
    color: '#D64545',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  successText: {
    color: '#2E7D32',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#F8B125',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
});
