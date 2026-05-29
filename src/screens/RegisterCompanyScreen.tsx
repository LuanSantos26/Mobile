import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';

export function RegisterCompanyScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <LinearGradient 
          colors={['#4FA7D3', '#E5BF2E']} 
          style={styles.container}
        >
          
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            
            {/* --- CABEÇALHO --- */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Ionicons name="cart-outline" size={45} color="#FFF" style={styles.cartIcon} />
                <Text style={styles.logoText}>Quickstock</Text>
              </View>
              <Text style={styles.subtitle}>BEM-VINDO AO QUICKSTOCK</Text>
              <Text style={styles.description}>Gerenciamento inteligente</Text>
            </View>

            {/* --- FORMULÁRIO --- */}
            <View style={styles.form}>
              <CustomInput iconName="briefcase" placeholder="Nome da Empresa" />
              <CustomInput iconName="mail" placeholder="E-mail" keyboardType="email-address" />
              <CustomInput iconName="lock" placeholder="Senha" secureTextEntry />
              <CustomInput iconName="file-text" placeholder="CNPJ" keyboardType="numeric" />
              <CustomInput iconName="phone" placeholder="Telefone" keyboardType="phone-pad" />

              <CustomButton title="Criar conta" style={{ marginTop: 15 }} />
            </View>

          </ScrollView>

          {/* --- CACTUS --- */}
          <View style={styles.cactusContainer}>
            <Ionicons name="leaf" size={100} color="#DDAA22" opacity={0.3} />
          </View>

        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40, 
  },

  header: {
    alignItems: 'center',
    marginBottom: 40, 
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cartIcon: {
    marginRight: 10,
  },
  logoText: {
    fontSize: 38,
    color: '#FFF',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: 'bold',
    letterSpacing: 1,
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    color: '#FFF',
    marginTop: 2,
  },

  form: {
    width: '85%', 
    alignItems: 'center',
    zIndex: 2, 
  },

  cactusContainer: {
    position: 'absolute',
    bottom: -10, 
    right: -20, 
    zIndex: 1,
  }
});