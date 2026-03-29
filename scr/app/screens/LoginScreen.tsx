import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  StatusBar,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/RootNavigator';
import { COLORS, FONTES, ESPACOS, BORDAS, SOMBRAS } from '../constants/theme';

import FundoAnimado     from '../components/FundoAnimado';
import CampoTexto       from '../components/CampoTexto';
import BotaoPrincipal   from '../components/BotaoPrincipal';
import RodapeNavegacao  from '../components/RodapeNavegacao';

interface LoginScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { login, carregando } = useAuth();

  const [email, setEmail] = React.useState('');
  const [senha, setSenha] = React.useState('');


  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const sacudir = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6,   duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const animarBotao = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1,    duration: 100, useNativeDriver: true }),
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

      <FundoAnimado
        uri="https://wallpapers.com/images/featured-full/imagens-incriveis-k287z98ruunquo28.jpg"
        intensidade={0}     
        overlayOpacity={0.5}
      />

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
                <CampoTexto
                  icone="mail"
                  placeholder="seu@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoComplete="email"
                  editable={!carregando}
                />

                <Text style={estilos.label}>Senha</Text>
                <CampoTexto
                  icone="lock"
                  placeholder="Sua senha"
                  value={senha}
                  onChangeText={setSenha}
                  secureText
                  mostrarOlho
                  editable={!carregando}
                />

                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                  <BotaoPrincipal
                    texto="Entrar"
                    icone="log-in"
                    onPress={handleLogin}
                    carregando={carregando}
                  />
                </Animated.View>
              </View>
            </Animated.View>
            <RodapeNavegacao
              texto="Não tem uma conta?"
              textoLink=" Cadastre-se"
              onPress={() => navigation.navigate('Cadastro')}
              desabilitado={carregando}
              corLink={COLORS.azul}
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
});
