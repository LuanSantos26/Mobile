import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Background } from '../components/Background';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { WelcomeHeader } from '../components/welcomeHeader';

export function RegisterCompanyScreen() {
  return (
    <Background>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <WelcomeHeader />
        </View>

        <View style={styles.form}>
          <CustomInput iconName="briefcase" placeholder="Nome da Empresa" />
          <CustomInput iconName="mail" placeholder="E-mail" keyboardType="email-address" />
          <CustomInput iconName="lock" placeholder="Senha" secureTextEntry />
          <CustomInput iconName="file-text" placeholder="CNPJ" keyboardType="numeric" />
          <CustomInput iconName="phone" placeholder="Telefone" keyboardType="phone-pad" />

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
    color: '#FFF',
    fontWeight: 'bold'
  },

  subtitle: {
    fontSize: 12,
    color: '#FFF',
    marginTop: 5
  },

  description: {
    fontSize: 12,
    color: '#FFF'
  },

  form: {
    width: '90%',
    alignItems: 'center'
  },
});