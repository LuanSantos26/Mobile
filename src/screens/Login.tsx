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
import { Background } from '../components/Background';
import { CustomInput } from '../components/CustomInput';
import { WelcomeHeader, WelcomeBackButton } from '../components/welcomeHeader';
import { CustomButton } from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';
import { LAYOUT } from '../theme/theme';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');

    if (!email.trim() || !senha.trim()) {
      setError('Preencha e-mail e senha.');
      return;
    }

    setLoading(true);

    try {
      await signIn({ email, senha });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao fazer login. Tente novamente.';
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
              <CustomInput
                iconName="mail"
                placeholder="Digite seu e-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              <CustomInput
                iconName="lock"
                placeholder="Digite sua senha"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
              />

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              {loading ? (
                <ActivityIndicator color="#FFF" style={styles.loader} />
              ) : (
                <CustomButton title="Login" onPress={handleLogin} />
              )}

              <TouchableOpacity>
                <Text style={styles.forgotPassword}>Esqueceu a senha</Text>
              </TouchableOpacity>
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
  errorText: {
    color: '#FFE0E0',
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 14,
  },
  loader: {
    marginTop: 20,
  },
  forgotPassword: {
    marginTop: 20,
    color: 'white',
    textDecorationLine: 'underline',
    fontSize: 14,
    textAlign: 'center',
  },
});
