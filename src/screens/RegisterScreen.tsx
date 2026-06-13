import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Background } from '../components/Background';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { WelcomeHeader } from '../components/welcomeHeader';
import { cadastrarConta } from '../services/authService';
import { LAYOUT } from '../theme/theme';
import { RootStackParamList } from '../../App';
export function RegisterScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const scrollRef = useRef<ScrollView>(null);
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [telefone, setTelefone] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');

    if (!nomeEmpresa.trim() || !cnpj.trim()) {
      setError('Preencha o nome e o CNPJ da empresa.');
      return;
    }

    if (!nome.trim() || !email.trim() || !senha.trim()) {
      setError('Preencha nome, e-mail e senha.');
      return;
    }

    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      await cadastrarConta({
        empresa: {
          nome: nomeEmpresa.trim(),
          cnpj: cnpj.trim(),
          telefone: telefone.trim() || undefined,
        },
        usuario: {
          nome: nome.trim(),
          email: email.trim().toLowerCase(),
          senha,
        },
      });

      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Welcome',
            params: {
              mensagemSucesso: 'Conta criada com sucesso! Você já pode entrar.',
            },
          },
        ],
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao criar conta. Tente novamente.';
      setError(message);
      scrollRef.current?.scrollTo({ y: 0, animated: true });    } finally {
      setLoading(false);
    }
  };

  return (
    <Background>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <WelcomeHeader />
          </View>

          <View style={styles.content}>
            <View style={styles.form}>
              <CustomInput
                iconName="briefcase"
                placeholder="Nome da empresa"
                value={nomeEmpresa}
                onChangeText={setNomeEmpresa}
              />
              <CustomInput
                iconName="file-text"
                placeholder="CNPJ"
                keyboardType="numeric"
                value={cnpj}
                onChangeText={setCnpj}
              />
              <CustomInput
                iconName="phone"
                placeholder="Telefone (opcional)"
                keyboardType="phone-pad"
                value={telefone}
                onChangeText={setTelefone}
              />
              <CustomInput
                iconName="user"
                placeholder="Nome completo"
                value={nome}
                onChangeText={setNome}
              />
              <CustomInput
                iconName="mail"
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              <CustomInput
                iconName="lock"
                placeholder="Senha"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
              />
              <CustomInput
                iconName="lock"
                placeholder="Confirmar senha"
                secureTextEntry
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
              />

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              {loading ? (
                <ActivityIndicator color="#FFF" style={styles.loader} />
              ) : (
                <CustomButton title="Criar conta" onPress={handleRegister} />
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
  header: {
    width: '100%',
    marginBottom: 10,
  },
  content: {
    width: LAYOUT.formWidth,
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
});
