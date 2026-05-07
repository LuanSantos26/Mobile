import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Background } from '../components/Background';
import { CustomButton } from '../components/CustomButton';
import { useNavigation } from '@react-navigation/native';

export function WelcomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <Background>
      <View style={styles.content}>
        {}
        {}
        
        <Text style={styles.title}>Quickstock</Text>
        <Text style={styles.subtitle}>BEM-VINDO AO QUICKSTOCK</Text>
        <Text style={styles.description}>Gerenciamento inteligente</Text>
      </View>

      <View style={styles.footer}>
        <CustomButton title="Entrar" onPress={() => console.log('Login')} />
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

  title: 
  { fontSize: 40, 
    color: '#FFF', 
    fontWeight: 'bold', 
    marginBottom: 10 },

  subtitle: 
  { fontSize: 16, 
    color: '#FFF', 
    letterSpacing: 1 },

  description: 
  { fontSize: 14, 
    color: '#FFF', 
    marginBottom: 40 },

  footer: 
  { width: '100%', 
    paddingBottom: 40 },
});