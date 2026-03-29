import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  Animated,
  SafeAreaView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import { useAuth } from '../context/AuthContext';
import { COLORS, FONTES, ESPACOS, BORDAS, SOMBRAS } from '../constants/theme';
import { RootStackParamList } from '../navigation/RootNavigator';

import FundoAnimado    from '../components/FundoAnimado';
import CampoTexto      from '../components/CampoTexto';
import BotaoPrincipal  from '../components/BotaoPrincipal';
import RodapeNavegacao from '../components/RodapeNavegacao';

interface CadastroScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Cadastro'>;
}

export default function CadastroScreen({ navigation }: CadastroScreenProps) {
  const { cadastrar, carregando } = useAuth();

  const [nome, setNome]         = useState('');
  const [email, setEmail]       = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha]       = useState('');
  const [confirmar, setConfirmar] = useState('');

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const sacudir = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6,   duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const validar = (): string | null => {
    if (!nome.trim())          return 'Informe seu nome completo.';
    if (!email.includes('@'))  return 'Informe um e-mail válido.';
    if (senha.length < 6)      return 'A senha deve ter pelo menos 6 caracteres.';
    if (senha !== confirmar)   return 'As senhas não coincidem.';
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
    if (senha.length === 0)  return { nivel: 0, label: '',       cor: 'transparent' };
    if (senha.length < 4)    return { nivel: 1, label: 'Fraca',  cor: COLORS.erro };
    if (senha.length < 6)    return { nivel: 2, label: 'Média',  cor: COLORS.alerta };
    if (senha.length < 10)   return { nivel: 3, label: 'Boa',    cor: COLORS.azul };
    return                          { nivel: 4, label: 'Forte',  cor: COLORS.sucesso };
  };
  const { nivel, label, cor } = forcaSenha();

  return (
    <View style={estilos.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <FundoAnimado
        uri="https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/Reuters_Direct_Media/BrazilOnlineReportWorldNews/tagreuters.com2024binary_LYNXMPEK0S0QB-FILEDIMAGE.jpg"
        intensidade={75}
        overlayOpacity={0.55}
      />

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
                <CampoTexto
                  icone="user"
                  placeholder="Seu nome"
                  value={nome}
                  onChangeText={setNome}
                  autoCapitalize="words"
                  editable={!carregando}
                />

                <Text style={estilos.label}>E-mail</Text>
                <CampoTexto
                  icone="mail"
                  placeholder="seu@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoComplete="email"
                  editable={!carregando}
                />

                <Text style={estilos.label}>
                  Telefone <Text style={estilos.opcional}>(opcional)</Text>
                </Text>
                <CampoTexto
                  icone="phone"
                  placeholder="(00) 00000-0000"
                  value={telefone}
                  onChangeText={setTelefone}
                  keyboardType="phone-pad"
                  editable={!carregando}
                />

                <Text style={estilos.label}>Senha</Text>
                <CampoTexto
                  icone="lock"
                  placeholder="Mínimo 6 caracteres"
                  value={senha}
                  onChangeText={setSenha}
                  secureText
                  mostrarOlho
                  editable={!carregando}
                />

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
                <CampoTexto
                  icone="shield"
                  placeholder="Repita a senha"
                  value={confirmar}
                  onChangeText={setConfirmar}
                  secureText
                  mostrarOlho
                  editable={!carregando}
                />

                <BotaoPrincipal
                  texto="Criar minha conta"
                  icone="user-plus"
                  onPress={aoCadastrar}
                  carregando={carregando}
                />
              </BlurView>
            </Animated.View>

            <RodapeNavegacao
              texto="Já tem uma conta?"
              textoLink=" Entrar"
              onPress={() => navigation.navigate('Login')}
              desabilitado={carregando}
            />
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
});
