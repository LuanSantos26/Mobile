import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ImageBackground,
  Animated,
  StatusBar,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';

import { RootStackParamList } from '../navigation/RootNavigator';
import { COLORS, FONTES, ESPACOS, BORDAS, SOMBRAS } from '../constants/theme';

interface LoginScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { login, carregando } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const sacudir = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const animarBotao = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleLogin = async () => {
    if (!email || !senha) {
      sacudir();
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }
    animarBotao();
    const sucesso = await login(email, senha);
    if (!sucesso) {
      sacudir();
      Alert.alert('Erro', 'E-mail ou senha inválidos.');
    }
  };

  return (
    <View style={estilos.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800' }}
        style={estilos.imagemFundo}
        resizeMode="cover"
        pointerEvents="none"
      >
        <View style={estilos.blurOverlay} />
      </ImageBackground>

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            contentContainerStyle={estilos.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={estilos.cabecalho}>
              <Text style={estilos.titulo}>QuickBar</Text>
              <Text style={estilos.subtitulo}>Bem-vindo de volta!</Text>
            </View>

            <Animated.View style={[estilos.card, { transform: [{ translateX: shakeAnim }] }]}>
              <View style={estilos.cardContent}>
                <Text style={estilos.label}>E-mail</Text>
                <View style={estilos.campoWrapper}>
                  <Feather name="mail" size={18} color={COLORS.azul} style={estilos.campoIcone} />
                  <TextInput
                    style={estilos.input}
                    placeholder="seu@email.com"
                    placeholderTextColor={COLORS.cinzaMedio}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    value={email}
                    onChangeText={setEmail}
                    selectionColor={COLORS.azul}
                    editable={!carregando}
                  />
                </View>

                <Text style={estilos.label}>Senha</Text>
                <View style={estilos.campoWrapper}>
                  <Feather name="lock" size={18} color={COLORS.azul} style={estilos.campoIcone} />
                  <TextInput
                    style={[estilos.input, { flex: 1 }]}
                    placeholder="Sua senha"
                    placeholderTextColor={COLORS.cinzaMedio}
                    secureTextEntry={!senhaVisivel}
                    value={senha}
                    onChangeText={setSenha}
                    selectionColor={COLORS.azul}
                    editable={!carregando}
                  />
                  <TouchableOpacity
                    onPress={() => setSenhaVisivel(!senhaVisivel)}
                    style={estilos.olhoBtn}
                    disabled={carregando}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Feather
                      name={senhaVisivel ? 'eye' : 'eye-off'}
                      size={18}
                      color={COLORS.cinzaMedio}
                    />
                  </TouchableOpacity>
                </View>

                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                  <TouchableOpacity
                    style={[estilos.botao, carregando && estilos.botaoDesabilitado]}
                    onPress={handleLogin}
                    activeOpacity={0.85}
                    disabled={carregando}
                  >
                    {carregando ? (
                      <ActivityIndicator color={COLORS.branco} size="small" />
                    ) : (
                      <>
                        <Feather name="log-in" size={18} color={COLORS.branco} />
                        <Text style={estilos.botaoTexto}>Entrar</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </Animated.View>

                <TouchableOpacity style={estilos.esqueceuBtn} disabled={carregando}>
                  <Text style={estilos.esqueceuTexto}>Esqueceu a senha?</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            <View style={estilos.rodape}>
              <Text style={estilos.rodapeTexto}>Não tem uma conta?</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Cadastro')}
                disabled={carregando}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={estilos.rodapeLink}> Cadastre-se</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d2a1f',
  },
  imagemFundo: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: ESPACOS.lg,
    paddingTop: ESPACOS.lg,
    paddingBottom: ESPACOS.lg,
  },
  cabecalho: {
    alignItems: 'center',
    marginBottom: ESPACOS.xxl,
    marginTop: ESPACOS.lg,
  },
  titulo: {
    fontSize: FONTES.hero,
    fontWeight: '800',
    color: COLORS.branco,
    marginBottom: ESPACOS.sm,
  },
  subtitulo: {
    fontSize: FONTES.lg,
    color: COLORS.cinzaClaro,
    fontWeight: '500',
  },
  card: {
    borderRadius: BORDAS.lg,
    overflow: 'hidden',
    ...SOMBRAS.forte,
  },
  cardContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: ESPACOS.lg,
    borderRadius: BORDAS.lg,
  },
  label: {
    fontSize: FONTES.md,
    fontWeight: '600',
    color: COLORS.preto,
    marginBottom: ESPACOS.sm,
    marginTop: ESPACOS.md,
  },
  campoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.fundoCampo,
    borderRadius: BORDAS.md,
    paddingHorizontal: ESPACOS.md,
    marginBottom: ESPACOS.md,
    borderWidth: 1,
    borderColor: 'rgba(59, 189, 212, 0.2)',
    height: 50,
  },
  campoIcone: {
    marginRight: ESPACOS.md,
  },
  input: {
    flex: 1,
    fontSize: FONTES.md,
    color: COLORS.preto,
    padding: 0,
  },
  olhoBtn: {
    padding: ESPACOS.sm,
    marginLeft: ESPACOS.sm,
  },
  botao: {
    height: 52,
    backgroundColor: COLORS.azul,
    borderRadius: BORDAS.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: ESPACOS.lg,
    ...SOMBRAS.media,
  },
  botaoDesabilitado: {
    opacity: 0.7,
  },
  botaoTexto: {
    color: COLORS.branco,
    fontSize: FONTES.lg,
    fontWeight: '700',
    marginLeft: ESPACOS.sm,
  },
  esqueceuBtn: {
    alignItems: 'center',
    marginTop: ESPACOS.md,
    paddingVertical: ESPACOS.md,
  },
  esqueceuTexto: {
    color: COLORS.azul,
    fontSize: FONTES.md,
    fontWeight: '600',
  },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: ESPACOS.lg,
  },
  rodapeTexto: {
    color: COLORS.cinzaClaro,
    fontSize: FONTES.md,
  },
  rodapeLink: {
    color: COLORS.azul,
    fontSize: FONTES.md,
    fontWeight: '700',
  },
});
