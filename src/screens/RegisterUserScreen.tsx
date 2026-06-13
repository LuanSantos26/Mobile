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
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Removido Ionicons pois não estava em uso
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { WelcomeHeader } from '../components/welcomeHeader';

export function RegisterUserScreen() {
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
            {/* CORREÇÃO: Agora o headerContainer está mapeado corretamente no StyleSheet */}
            <View style={styles.headerContainer}>
              <WelcomeHeader />
            </View>

            <View style={styles.form}>
              <CustomInput iconName="mail" placeholder="Digite seu E-mail" keyboardType="email-address" />
              <CustomInput iconName="user" placeholder="Crie um usuário" />
              <CustomInput iconName="phone" placeholder="Telefone" keyboardType="phone-pad" />
              <CustomInput iconName="lock" placeholder="Crie uma senha" secureTextEntry />
              <CustomInput iconName="lock" placeholder="Confirmar Senha" secureTextEntry />

              <CustomButton title="Criar conta" style={styles.buttonSpacing} />
            </View>

          </ScrollView>

          {/* --- CACTO (Decoração no canto inferior direito) --- */}
          <View style={styles.cactusContainer}>
            <MaterialCommunityIcons name="cactus" size={160} color="#4A7C59" style={styles.cactusIcon} />
          </View>

          {/* --- BARRA BRANCA VAZIA NO FUNDO --- */}
          <View style={styles.whiteBottomBar} />

        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // --- Estrutura Global ---
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
    paddingTop: Platform.OS === 'android' ? 20 : 10, 
    paddingBottom: 120, // Garante que a barra branca não cubra o botão "Criar conta"
  },

  // --- NOVO: Estilo do Cabeçalho Adicionado ---
  headerContainer: {
    width: '100%',
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 20,
  },

  // --- Estilos do Formulário ---
  form: {
    width: '85%', 
    alignItems: 'center',
    zIndex: 2, 
    flex: 1,
    justifyContent: 'center',
  },
  buttonSpacing: {
    marginTop: 20, 
  },

  // --- Estilos da Decoração (Cacto) ---
  cactusContainer: {
    position: 'absolute',
    bottom: 50, 
    right: -20, 
    zIndex: 1,
  },
  cactusIcon: {
    opacity: 0.85, 
  },

  // --- Estilos da Barra Branca Inferior ---
  whiteBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70, 
    backgroundColor: '#FFF',
    borderTopLeftRadius: 15, 
    borderTopRightRadius: 15,
    zIndex: 3,
  }
});