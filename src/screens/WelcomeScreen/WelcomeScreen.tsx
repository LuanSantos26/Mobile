import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Background } from '../../components/layout/Background';
import { CustomButton } from '../../components/Button/CustomButton';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { WelcomeHeader } from '../../components/Header/welcomeHeader';
import { LAYOUT } from '../../theme/theme';
import { RootStackParamList } from '../../navigation/types';
import { styles } from './styles';

export function WelcomeScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RootStackParamList, 'Welcome'>>();
  const [mensagemSucesso, setMensagemSucesso] = useState(route.params?.mensagemSucesso);

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
