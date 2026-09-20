import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Background } from '../../components/Header/Background';
import { CustomInput } from '../../components/Input/CustomInput';
import { WelcomeHeader, WelcomeBackButton } from '../../components/Header/welcomeHeader';
import { CustomButton } from '../../components/Button/CustomButton';
import { recuperarSenha } from '../../services/authService';
import { LAYOUT } from '../../theme/theme';
import { RootStackParamList } from '../../navigation/types';

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
      const message =
        err instanceof Error ? err.message : 'Não foi possível redefinir a senha. Tente novamente.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background edges={['left', 'right', 'bottom']}>
      <WelcomeBackButton />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <WelcomeHeader hideReturnButton />
            <View style={styles.form}>
              <Text style={styles.title}>Esqueceu a senha</Text>
              <Text style={styles.subtitle}>
                Informe o e-mail da conta e defina uma nova senha para voltar a entrar.
              </Text>

              {sucesso ? (
                <>
                  <Text style={styles.successText}>
                    Senha redefinida. Você já pode entrar com o e-mail e a nova senha.
                  </Text>
                  <CustomButton
                    title="Voltar ao login"
                    onPress={() => navigation.navigate('Login')}
                  />
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
                    <ActivityIndicator color="#FFF" style={styles.loader} />
                  ) : (
                    <CustomButton title="Redefinir senha" onPress={handleRecuperar} />
                  )}

                  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.backToLogin}>Voltar ao login</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Background>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 40,
  },
  content: {
    width: LAYOUT.formWidth,
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  form: {
    width: '100%',
  },
  title: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  errorText: {
    color: '#FFE0E0',
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 14,
  },
  successText: {
    color: '#E8F5E9',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 15,
    lineHeight: 22,
  },
  loader: {
    marginTop: 20,
  },
  backToLogin: {
    marginTop: 20,
    color: 'white',
    textDecorationLine: 'underline',
    fontSize: 14,
    textAlign: 'center',
  },
});
