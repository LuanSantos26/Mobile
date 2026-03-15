import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function QuickBarLoginScreen() {
  const [usuario, setUsuario] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [senhaVisivel, setSenhaVisivel] = useState<boolean>(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.headerContainer}>
          <View style={styles.logoSection}>
            <MaterialCommunityIcons name="shopping-cart" size={50} color="#ffffff" />
            <Text style={styles.logoText}>QuickBar</Text>
          </View>

          
          <Text style={styles.subtitle}>BEM-VINDO AO QUICKBAR</Text>
          <Text style={styles.description}>Gerenciamento inteligente</Text>

          
          <View style={styles.inputSection}>
           
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="account" size={24} color="#4a90e2" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Digite seu usuário"
                placeholderTextColor="#b0b0b0"
                value={usuario}
                onChangeText={setUsuario}
              />
            </View>

           
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="lock" size={24} color="#4a90e2" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                placeholderTextColor="#b0b0b0"
                secureTextEntry={!senhaVisivel}
                value={senha}
                onChangeText={setSenha}
              />
              <TouchableOpacity
                onPress={() => setSenhaVisivel(!senhaVisivel)}
                style={styles.eyeIcon}
              >
                <MaterialCommunityIcons
                  name={senhaVisivel ? 'eye-off' : 'eye'}
                  size={24}
                  color="#4a90e2"
                />
              </TouchableOpacity>
            </View>
          </View>

          
          <TouchableOpacity style={styles.loginButton} activeOpacity={0.8}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          
          <TouchableOpacity style={styles.forgotPasswordButton}>
            <Text style={styles.forgotPasswordText}>Esqueceu a senha</Text>
          </TouchableOpacity>
        </View>

        
        <View style={styles.cactusSection}>
          
          <View style={styles.cactusContainer}>
            <MaterialCommunityIcons name="cactus" size={120} color="#4a90e2" />
          </View>
        </View>

        
        <View style={styles.footerContainer}>
          <TouchableOpacity style={styles.createAccountButton}>
            <MaterialCommunityIcons name="account-plus" size={24} color="#4a90e2" />
            <Text style={styles.createAccountText}>Cria conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  headerContainer: {
    backgroundColor: '#5ba3d0',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#e8f4f8',
    textAlign: 'center',
    marginBottom: 25,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  eyeIcon: {
    padding: 5,
  },
  loginButton: {
    backgroundColor: '#ffc107',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  forgotPasswordButton: {
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#ffffff',
    textDecorationLine: 'underline',
  },
  cactusSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    background: 'linear-gradient(180deg, #5ba3d0 0%, #a8d963 50%, #ffc107 100%)',
  },
  cactusContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContainer: {
    backgroundColor: '#e8e8e8',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  createAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createAccountText: {
    fontSize: 16,
    color: '#4a90e2',
    fontWeight: '600',
    marginLeft: 8,
  },
});
