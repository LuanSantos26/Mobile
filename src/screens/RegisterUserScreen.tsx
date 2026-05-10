import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Background } from '../components/Background';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { WelcomeHeader } from '../components/welcomeHeader';

export function RegisterUserScreen() {
  return (
    <Background>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent} 
      >
        <View style={styles.header}>
          <WelcomeHeader/>
        </View>

        <View style={styles.form}>
          <CustomInput iconName="mail" placeholder="Digite seu E-mail" />
          <CustomInput iconName="user" placeholder="Crie um usuário" />
          <CustomInput iconName="phone" placeholder="Telefone" keyboardType="phone-pad" />
          <CustomInput iconName="lock" placeholder="Crie uma senha" secureTextEntry />
          <CustomInput iconName="lock" placeholder="Confirmar Senha" secureTextEntry />
          
          <CustomButton title="Criar conta" style={{ marginTop: 20 }} />
        </View>
      </ScrollView>
    </Background>
  );
}

const styles = StyleSheet.create({
  scroll: { width: '100%' },

  scrollContent: { 
    alignItems: 'center', 
    paddingBottom: 40 
  },

  header: { 
    alignItems: 'center', 
    marginTop: 40, 
    marginBottom: 30 
  },

  title: { 
    fontSize: 32, 
    color: '#f8ebeb', 
    fontWeight: 'bold' 
  },

  subtitle: { 
    fontSize: 14, 
    color: '#FFF', 
    marginTop: 5 
  },

  form: { 
    width: '90%', 
    alignItems: 'center' 
  }, 
});