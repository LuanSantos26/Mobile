import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Background } from '../components/Background';
import { CustomButton } from '../components/CustomButton';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { WelcomeHeader } from '../components/welcomeHeader';
import { LAYOUT } from '../theme/theme';
import { RootStackParamList } from '../../App';

export function WelcomeScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RootStackParamList, 'Welcome'>>();
  const [mensagemSucesso, setMensagemSucesso] = useState(
    route.params?.mensagemSucesso,
  );

  useEffect(() => {
    if (!route.params?.mensagemSucesso) return;

    setMensagemSucesso(route.params.mensagemSucesso);

    const timer = setTimeout(() => {
      setMensagemSucesso(undefined);
    }, 4000);

    return () => clearTimeout(timer);
  }, [route.params?.mensagemSucesso]);

  return (
    <Background>
      {mensagemSucesso ? (
        <View style={styles.successBanner}>
          <Text style={styles.successText}>{mensagemSucesso}</Text>
        </View>
      ) : null}

      <View style={styles.content}>
        <WelcomeHeader hideReturnButton={true} />
      </View>

      <View style={styles.footer}>
        <CustomButton
          title="Entrar"
          onPress={() => navigation.navigate('Login')}
        />
        <CustomButton
          title="Criar conta"
          variant="secondary"
          onPress={() => navigation.navigate('Register')}
        />
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  successBanner: {
    marginTop: 8,
    marginHorizontal: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  successText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    width: LAYOUT.formWidth,
    alignSelf: 'center',
    paddingBottom: 40,
  },
});
