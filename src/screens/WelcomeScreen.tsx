import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Background } from '../components/Background';
import { CustomButton } from '../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { WelcomeHeader } from '../components/welcomeHeader';

export function WelcomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <Background>
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
          onPress={() => navigation.navigate('AccountType')}
        />
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  content:
  {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  footer:
  {
    width: '100%',
    paddingBottom: 40
  },
});