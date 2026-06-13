import React from 'react';
import { 
  View, 
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
import { WelcomeHeader } from '../components/welcomeHeader';

export function RegisterCompanyScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
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

            <View style={styles.headerContainer}>
              <WelcomeHeader />
            </View>

            <View style={styles.form}>
              <CustomInput iconName="briefcase" placeholder="Nome da Empresa" />
              <CustomInput iconName="mail" placeholder="E-mail" keyboardType="email-address" />
              <CustomInput iconName="lock" placeholder="Senha" secureTextEntry />
              <CustomInput iconName="file-text" placeholder="CNPJ" keyboardType="numeric" />
              <CustomInput iconName="phone" placeholder="Telefone" keyboardType="phone-pad" />

              <CustomButton title="Criar conta" style={styles.submitButton} />
            </View>

          </ScrollView>

          <View style={styles.cactusContainer}>
            <Ionicons name="leaf" size={100} color="#DDAA22" opacity={0.3} />
          </View>

        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ==========================================
  // ESTRUTURA GERAIS
  // ==========================================
  safeArea: { 
    flex: 1, 
  },
  keyboardView: { 
    flex: 1, 
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 30 : 10, 
    paddingBottom: 40, 
  },

  // ==========================================
  // CABEÇALHO COMPENSADO NO TOPO
  // ==========================================
  headerContainer: {
    width: '100%',
    paddingHorizontal: 40, 
    marginTop: 20,      
    marginBottom: 10,      
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ==========================================
  // FORMULÁRIO E COMPONENTES
  // ==========================================
  form: {
    width: '85%', 
    alignItems: 'center',
    zIndex: 2, 
    flex: 1,              
    justifyContent: 'center', 
  },
  submitButton: { 
    marginTop: 15,
  },

  // ==========================================
  // DECORAÇÃO BACKGROUND
  // ==========================================
  cactusContainer: {
    position: 'absolute',
    bottom: -10, 
    right: -20, 
    zIndex: 1,
  }
});