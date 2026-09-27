import React, { useState } from 'react';
import { Text, ActivityIndicator } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthScreenShell } from '../../components/auth/AuthScreenShell';
import { CustomInput } from '../../components/Input/CustomInput';
import { CustomButton } from '../../components/Button/CustomButton';
import { cadastrarConta } from '../../services/authService';
import { savePerfilUso } from '../../services/perfilStorage';
import { RootStackParamList } from '../../navigation/types';
import {
  formatarCnpjInput,
  formatarCpfInput,
  formatarTelefoneInput,
  normalizarDocumento,
} from '../../utils/pixUtils';
import { AUTH_NAVY } from '../../theme/authTheme';
import { styles } from './styles';

export function RegisterScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Register'>>();
  const perfil = route.params?.perfil ?? 'Fornecedor';
  const isCliente = perfil === 'Cliente';
  const isAmbos = perfil === 'ClienteFornecedor';
  const isFornecedor = perfil === 'Fornecedor';

  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');

    if (!nome.trim() || !email.trim() || !senha.trim()) {
      setError('Preencha nome, e-mail e senha.');
      return;
    }

    if (isCliente || isAmbos) {
      const cpfDigits = normalizarDocumento(cpf);
      if (cpfDigits.length !== 11) {
        setError('Informe um CPF válido com 11 dígitos.');
        return;
      }
      if (!telefone.trim()) {
        setError('Informe o telefone.');
        return;
      }
    }

    if (isFornecedor || isAmbos) {
      if (!nomeEmpresa.trim() || !cnpj.trim()) {
        setError('Preencha o nome e o CNPJ da empresa.');
        return;
      }
    }

    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      const cpfDigits = normalizarDocumento(cpf);

      await cadastrarConta({
        empresa: isCliente
          ? {
              nome: nome.trim(),
              cnpj: cpfDigits,
              telefone: telefone.trim() || undefined,
            }
          : {
              nome: nomeEmpresa.trim(),
              cnpj: cnpj.trim(),
              telefone: telefone.trim() || undefined,
            },
        usuario: {
          nome: nome.trim(),
          email: email.trim().toLowerCase(),
          senha,
          ...((isCliente || isAmbos) ? { cpf: cpfDigits } : {}),
        },
      });

      await savePerfilUso(email.trim().toLowerCase(), perfil);

      navigation.navigate('Welcome', {
        mensagemSucesso: 'Conta criada com sucesso. Faça login para continuar.',
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao criar conta. Tente novamente.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const subtitle = isCliente
    ? 'SOU CLIENTE'
    : isAmbos
      ? 'CLIENTE E FORNECEDOR'
      : 'SOU FORNECEDOR';

  return (
    <AuthScreenShell subtitle={subtitle}>
      {isCliente ? (
        <>
          <CustomInput iconName="user" placeholder="Nome completo" value={nome} onChangeText={setNome} />
          <CustomInput
            iconName="file-text"
            placeholder="CPF"
            keyboardType="numeric"
            value={cpf}
            onChangeText={(text) => setCpf(formatarCpfInput(text))}
            maxLength={14}
          />
          <CustomInput
            iconName="phone"
            placeholder="Telefone"
            keyboardType="phone-pad"
            value={telefone}
            onChangeText={(text) => setTelefone(formatarTelefoneInput(text))}
            maxLength={15}
          />
        </>
      ) : (
        <>
          <CustomInput
            iconName="business-outline"
            placeholder="Nome da empresa"
            value={nomeEmpresa}
            onChangeText={setNomeEmpresa}
          />
          <CustomInput
            iconName="file-text"
            placeholder="CNPJ"
            keyboardType="numeric"
            value={cnpj}
            onChangeText={(text) => setCnpj(formatarCnpjInput(text))}
            maxLength={18}
          />
          <CustomInput
            iconName="phone"
            placeholder="Telefone"
            keyboardType="phone-pad"
            value={telefone}
            onChangeText={(text) => setTelefone(formatarTelefoneInput(text))}
            maxLength={15}
          />
          <CustomInput
            iconName="user"
            placeholder="Nome do responsável"
            value={nome}
            onChangeText={setNome}
          />
          {isAmbos ? (
            <CustomInput
              iconName="file-text"
              placeholder="CPF"
              keyboardType="numeric"
              value={cpf}
              onChangeText={(text) => setCpf(formatarCpfInput(text))}
              maxLength={14}
            />
          ) : null}
        </>
      )}

      <CustomInput
        iconName="mail"
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <CustomInput iconName="lock" placeholder="Senha" secureTextEntry value={senha} onChangeText={setSenha} />
      <CustomInput
        iconName="lock"
        placeholder="Confirmar senha"
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {loading ? (
        <ActivityIndicator color={AUTH_NAVY} style={styles.loader} />
      ) : (
        <CustomButton title="Criar conta" onPress={handleRegister} />
      )}
    </AuthScreenShell>
  );
}
