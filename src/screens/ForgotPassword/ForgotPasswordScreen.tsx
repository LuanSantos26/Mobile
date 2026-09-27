import React, { useState } from 'react';
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthScreenShell } from '../../components/auth/AuthScreenShell';
import { CustomInput } from '../../components/Input/CustomInput';
import { CustomButton } from '../../components/Button/CustomButton';
import { recuperarSenha } from '../../services/authService';
import { RootStackParamList } from '../../navigation/types';
import { AUTH_NAVY } from '../../theme/authTheme';
import { styles } from './styles';

export function ForgotPasswordScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ForgotPassword'>>();

  const [email, setEmail] = useState(route.params?.email ?? '');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const handleRecuperar = async () => {
    setError('');
    const emailNormalizado = email.trim().toLowerCase();

    if (!emailNormalizado) {
      setError('Informe o e-mail cadastrado.');
      return;
    }
    if (!emailNormalizado.includes('@')) {
      setError('Informe um e-mail válido.');
      return;
    }
    if (novaSenha.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      await recuperarSenha({ email: emailNormalizado, novaSenha });
      setSucesso(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Não foi possível redefinir a senha. Tente novamente.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenShell subtitle="RECUPERAR ACESSO">
      <Text style={styles.title}>Esqueceu a senha</Text>
      <Text style={styles.subtitle}>
        Informe o e-mail da conta e defina uma nova senha para voltar a entrar.
      </Text>

      {sucesso ? (
        <>
          <Text style={styles.successText}>
            Senha redefinida. Você já pode entrar com o e-mail e a nova senha.
          </Text>
          <CustomButton title="Voltar ao login" onPress={() => navigation.navigate('Login')} />
        </>
      ) : (
        <>
          <CustomInput
            iconName="mail"
            placeholder="E-mail cadastrado"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <CustomInput
            iconName="lock"
            placeholder="Nova senha"
            secureTextEntry
            value={novaSenha}
            onChangeText={setNovaSenha}
          />
          <CustomInput
            iconName="lock"
            placeholder="Confirmar nova senha"
            secureTextEntry
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {loading ? (
            <ActivityIndicator color={AUTH_NAVY} style={styles.loader} />
          ) : (
            <CustomButton title="Redefinir senha" onPress={handleRecuperar} />
          )}
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.backToLogin}>Voltar ao login</Text>
          </TouchableOpacity>
        </>
      )}
    </AuthScreenShell>
  );
}
