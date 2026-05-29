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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Importando seus componentes personalizados
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';

export function RegisterUserScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Fundo Gradiente idêntico ao da imagem */}
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
                <Ionicons name="cart-outline" size={50} color="#FFF" style={styles.cartIcon} />
                <Text style={styles.logoText}>Quickstock</Text>
              </View>
              <Text style={styles.subtitle}>BEM-VINDO AO QUICKSTOCK</Text>
              <Text style={styles.description}>Gerenciamento inteligente</Text>
            </View>

            {/* --- FORMULÁRIO (E-mail, Usuário, Telefone, Senhas) --- */}
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
  container: {
    flex: 1,
  },
  
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 60, 
    paddingBottom: 100, 
  },

  // --- Estilos do Cabeçalho ---
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
    fontSize: 42, // Fonte grande igual ao design
    color: '#FFF',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    color: '#FFF',
    marginTop: 4,
  },

  // --- Estilos do Formulário ---
  form: {
    width: '85%', 
    alignItems: 'center',
    zIndex: 2, 
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