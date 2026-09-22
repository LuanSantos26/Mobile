import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { BackTitleHeader } from '../../components/Header/BackTitleHeader';
import { useAppGoBack } from '../../hooks/useAppGoBack';
import { atualizarEmpresa, atualizarUsuario } from '../../services/authService';
import { formatarCnpjInput, formatarTelefoneInput, normalizarDocumento } from '../../utils/pixUtils';
import { styles } from './styles';

export function ConfiguracoesScreen() {
  const goBack = useAppGoBack('Home');
  const { user, updateUser } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [cnpjEmpresa, setCnpjEmpresa] = useState('');
  const [telefoneEmpresa, setTelefoneEmpresa] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) return;
    setNome(user.nome ?? '');
    setEmail(user.email ?? '');
    setNomeEmpresa(user.empresa?.nome ?? '');
    setCnpjEmpresa(user.empresa?.cnpj ?? '');
    setTelefoneEmpresa(user.empresa?.telefone ?? '');
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
    const nomeEmpresaTrim = nomeEmpresa.trim();
    const cnpjDigits = normalizarDocumento(cnpjEmpresa);

    if (!nomeTrim) {
      setError('Informe seu nome.');
      return;
    }
    if (!emailTrim) {
      setError('Informe seu e-mail.');
      return;
    }
    if (!nomeEmpresaTrim) {
      setError('Informe o nome da empresa.');
      return;
    }
    if (cnpjDigits.length !== 14) {
      setError('Informe um CNPJ válido com 14 dígitos.');
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
        nome: nomeEmpresaTrim,
        cnpj: formatarCnpjInput(cnpjDigits),
        telefone: telefoneEmpresa.trim() || undefined,
      });

      await updateUser({
        ...usuarioAtualizado,
        empresa: {
          ...usuarioAtualizado.empresa,
          nome: empresaAtualizada.nome,
          cnpj: empresaAtualizada.cnpj,
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
        <BackTitleHeader
          title="Configurações da conta"
          onBack={goBack}
        />

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Dados pessoais</Text>
          <Text style={styles.sectionSubtitle}>Nome e e-mail da conta</Text>
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

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Alterar senha</Text>
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

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Dados da empresa</Text>
          <Text style={styles.sectionSubtitle}>Informações usadas nos pedidos</Text>
          <Text style={styles.label}>Nome da empresa</Text>
          <TextInput
            style={styles.input}
            value={nomeEmpresa}
            onChangeText={setNomeEmpresa}
            placeholder="Razão social ou nome fantasia"
            autoCapitalize="words"
          />

          <Text style={styles.label}>CNPJ</Text>
          <TextInput
            style={styles.input}
            value={cnpjEmpresa}
            onChangeText={(text) => setCnpjEmpresa(formatarCnpjInput(text))}
            placeholder="00.000.000/0000-00"
            keyboardType="number-pad"
            maxLength={18}
          />

          <Text style={styles.label}>Telefone</Text>
          <TextInput
            style={styles.input}
            value={telefoneEmpresa}
            onChangeText={(text) => setTelefoneEmpresa(formatarTelefoneInput(text))}
            placeholder="(00) 00000-0000"
            keyboardType="phone-pad"
            maxLength={15}
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
