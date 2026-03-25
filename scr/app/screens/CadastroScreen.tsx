import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
  Animated,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import { useAuth } from '../context/AuthContext';
import { COLORS, FONTES, ESPACOS, BORDAS, SOMBRAS } from '../constants/theme';
import { RootStackParamList } from '../navigation/RootNavigator';

interface CadastroScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Cadastro'>;
}

export default function CadastroScreen({ navigation }: CadastroScreenProps) {
  const { cadastrar, carregando } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');

  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmarVisivel, setConfirmarVisivel] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const sacudir = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const validar = (): string | null => {
    if (!nome.trim()) return 'Informe seu nome completo.';
    if (!email.includes('@')) return 'Informe um e-mail válido.';
    if (senha.length < 6) return 'A senha deve ter pelo menos 6 caracteres.';
    if (senha !== confirmar) return 'As senhas não coincidem.';
    return null;
  };

  const aoCadastrar = async () => {
    const erro = validar();
    if (erro) {
      sacudir();
      Alert.alert('Atenção', erro);
      return;
    }
    const ok = await cadastrar({
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      senha,
      telefone,
    });
    if (!ok) {
      sacudir();
      Alert.alert('Erro', 'Não foi possível criar a conta. Tente novamente.');
    }
  };

  const forcaSenha = (): { nivel: number; label: string; cor: string } => {
    if (senha.length === 0) return { nivel: 0, label: '', cor: 'transparent' };
    if (senha.length < 4) return { nivel: 1, label: 'Fraca', cor: COLORS.erro };
    if (senha.length < 6) return { nivel: 2, label: 'Média', cor: COLORS.alerta };
    if (senha.length < 10) return { nivel: 3, label: 'Boa', cor: COLORS.azul };
    return { nivel: 4, label: 'Forte', cor: COLORS.sucesso };
  };
  const { nivel, label, cor } = forcaSenha();

  return (
    <View style={estilos.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800' }}
        style={estilos.imagemFundo}
        resizeMode="cover"
        pointerEvents="none"
      >
        <BlurView intensity={75} tint="dark" style={StyleSheet.absoluteFillObject} />
        <View style={estilos.overlay} />
      </ImageBackground>

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            contentContainerStyle={estilos.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity
              style={estilos.voltarBtn}
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Feather name="arrow-left" size={22} color={COLORS.branco} />
            </TouchableOpacity>

            <View style={estilos.cabecalho}>
              <Text style={estilos.titulo}>Criar conta</Text>
              <Text style={estilos.subtitulo}>Preencha os dados para começar a usar o QuickBar</Text>
            </View>

            <Animated.View style={[estilos.card, { transform: [{ translateX: shakeAnim }] }]}>
              <BlurView intensity={40} tint="light" style={estilos.cardBlur}>
                <Text style={estilos.label}>Nome completo</Text>
                <View style={estilos.campoWrapper}>
                  <Feather name="user" size={17} color={COLORS.azul} style={estilos.campoIcone} />
                  <TextInput
                    style={estilos.input}
                    placeholder="Seu nome"
                    placeholderTextColor={COLORS.cinzaMedio}
                    autoCapitalize="words"
                    value={nome}
                    onChangeText={setNome}
                    selectionColor={COLORS.azul}
                    editable={!carregando}
                  />
                </View>

                <Text style={estilos.label}>E-mail</Text>
                <View style={estilos.campoWrapper}>
                  <Feather name="mail" size={17} color={COLORS.azul} style={estilos.campoIcone} />
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

                <Text style={estilos.label}>
                  Telefone <Text style={estilos.opcional}>(opcional)</Text>
                </Text>
                <View style={estilos.campoWrapper}>
                  <Feather name="phone" size={17} color={COLORS.azul} style={estilos.campoIcone} />
                  <TextInput
                    style={estilos.input}
                    placeholder="(00) 00000-0000"
                    placeholderTextColor={COLORS.cinzaMedio}
                    keyboardType="phone-pad"
                    value={telefone}
                    onChangeText={setTelefone}
                    selectionColor={COLORS.azul}
                    editable={!carregando}
                  />
                </View>

                <Text style={estilos.label}>Senha</Text>
                <View style={estilos.campoWrapper}>
                  <Feather name="lock" size={17} color={COLORS.azul} style={estilos.campoIcone} />
                  <TextInput
                    style={[estilos.input, { flex: 1 }]}
                    placeholder="Mínimo 6 caracteres"
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
                      size={17}
                      color={COLORS.cinzaMedio}
                    />
                  </TouchableOpacity>
                </View>

                {senha.length > 0 && (
                  <View style={estilos.forcaContainer}>
                    {[1, 2, 3, 4].map(n => (
                      <View
                        key={n}
                        style={[
                          estilos.forcaBarra,
                          { backgroundColor: n <= nivel ? cor : COLORS.cinzaClaro },
                        ]}
                      />
                    ))}
                    <Text style={[estilos.forcaLabel, { color: cor }]}>{label}</Text>
                  </View>
                )}

                <Text style={estilos.label}>Confirmar senha</Text>
                <View style={estilos.campoWrapper}>
                  <Feather name="shield" size={17} color={COLORS.azul} style={estilos.campoIcone} />
                  <TextInput
                    style={[estilos.input, { flex: 1 }]}
                    placeholder="Repita a senha"
                    placeholderTextColor={COLORS.cinzaMedio}
                    secureTextEntry={!confirmarVisivel}
                    value={confirmar}
                    onChangeText={setConfirmar}
                    selectionColor={COLORS.azul}
                    editable={!carregando}
                  />
                  <TouchableOpacity
                    onPress={() => setConfirmarVisivel(!confirmarVisivel)}
                    style={estilos.olhoBtn}
                    disabled={carregando}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Feather
                      name={confirmarVisivel ? 'eye' : 'eye-off'}
                      size={17}
                      color={COLORS.cinzaMedio}
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[estilos.botao, carregando && estilos.botaoDesabilitado]}
                  onPress={aoCadastrar}
                  activeOpacity={0.85}
                  disabled={carregando}
                >
                  {carregando ? (
                    <ActivityIndicator color={COLORS.branco} size="small" />
                  ) : (
                    <>
                      <Feather name="user-plus" size={18} color={COLORS.branco} />
                      <Text style={estilos.botaoTexto}>Criar minha conta</Text>
                    </>
                  )}
                </TouchableOpacity>
              </BlurView>
            </Animated.View>

            <View style={estilos.rodape}>
              <Text style={estilos.rodapeTexto}>Já tem uma conta?</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                disabled={carregando}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={estilos.rodapeLink}> Entrar</Text>
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
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 30, 15, 0.55)',
  },
  scroll: {
    paddingHorizontal: ESPACOS.lg,
    paddingTop: ESPACOS.lg,
    paddingBottom: ESPACOS.xxl,
  },
  voltarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ESPACOS.lg,
  },
  cabecalho: {
    marginBottom: ESPACOS.lg,
  },
  titulo: {
    fontSize: FONTES.xxxl,
    fontWeight: FONTES.extrabold,
    color: COLORS.branco,
    marginBottom: ESPACOS.xs,
  },
  subtitulo: {
    fontSize: FONTES.sm,
    color: 'rgba(255,255,255,0.68)',
    lineHeight: 20,
  },
  card: {
    borderRadius: BORDAS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
    ...SOMBRAS.forte,
  },
  cardBlur: {
    padding: ESPACOS.lg,
  },
  label: {
    fontSize: FONTES.sm,
    fontWeight: FONTES.semibold,
    color: COLORS.preto,
    marginBottom: 6,
    marginTop: ESPACOS.sm,
  },
  opcional: {
    color: COLORS.cinzaMedio,
    fontWeight: FONTES.regular,
  },
  campoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: BORDAS.xl,
    paddingHorizontal: ESPACOS.md,
    paddingVertical: Platform.OS === 'ios' ? 13 : 10,
    borderWidth: 1,
    borderColor: 'rgba(59,189,212,0.20)',
    minHeight: 50,
  },
  campoIcone: {
    marginRight: ESPACOS.sm,
  },
  input: {
    flex: 1,
    fontSize: FONTES.md,
    color: COLORS.preto,
    paddingVertical: 0,
  },
  olhoBtn: {
    padding: ESPACOS.xs,
  },
  forcaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    marginBottom: 4,
  },
  forcaBarra: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  forcaLabel: {
    fontSize: FONTES.xs,
    fontWeight: FONTES.bold,
    minWidth: 40,
    textAlign: 'right',
  },
  botao: {
    flexDirection: 'row',
    backgroundColor: COLORS.azul,
    borderRadius: BORDAS.circulo,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: ESPACOS.md,
    ...SOMBRAS.media,
  },
  botaoDesabilitado: {
    opacity: 0.65,
  },
  botaoTexto: {
    color: COLORS.branco,
    fontSize: FONTES.lg,
    fontWeight: FONTES.bold,
    letterSpacing: 0.5,
  },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: ESPACOS.lg,
  },
  rodapeTexto: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: FONTES.md,
  },
  rodapeLink: {
    color: COLORS.amarelo,
    fontSize: FONTES.md,
    fontWeight: FONTES.bold,
  },
});
