import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

export default function LoginScreen() {
  return (
    <LinearGradient
      // Cores do degradê: do azul escuro, passando pelo verde água, até o amarelo
      colors={['#4ba3c3', '#77a9a1', '#d6b856']}
      style={styles.container}
    >
      <SafeAreaView style={styles.content}>
        
        {/* Cabeçalho com Logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Feather name="shopping-cart" size={50} color="#FFF" />
            <Text style={styles.logoText}>QuickBar</Text>
          </View>
          <Text style={styles.subtitle}>BEM-VINDO AO QUICKBAR</Text>
          <Text style={styles.description}>Gerenciamento inteligente</Text>
        </View>

        {/* Formulário de Login */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Feather name="user" size={20} color="#F4B41A" style={styles.icon} />
            <TextInput 
              style={styles.input} 
              placeholder="Digite seu usuário" 
              placeholderTextColor="#77a9a1"
            />
          </View>

          <View style={styles.inputContainer}>
            <Feather name="lock" size={20} color="#F4B41A" style={styles.icon} />
            <TextInput 
              style={styles.input} 
              placeholder="Digite sua senha" 
              placeholderTextColor="#77a9a1"
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Esqueceu a senha</Text>
          </TouchableOpacity>
        </View>

        {/* Imagem do Cacto - Comentada para evitar o erro de arquivo não encontrado */}
        {/* <Image 
          source={require('../assets/cacto.png')}
          style={styles.cactusImage}
          resizeMode="contain"
        /> 
        */}

      </SafeAreaView>

      {/* Rodapé fixo na parte inferior */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Feather name="user-plus" size={20} color="#4ba3c3" />
          <Text style={styles.footerText}>Cria conta</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  logoText: {
    fontSize: 42,
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  subtitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    color: '#FFF',
    fontSize: 14,
    marginTop: 2,
  },
  form: {
    width: '100%',
    zIndex: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#F4B41A', 
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#FFF',
    textAlign: 'center',
    marginTop: 15,
    textDecorationLine: 'underline',
  },
  cactusImage: {
    position: 'absolute',
    bottom: -35,
    right: 0,
    width: 130,
    height: 220,
    zIndex: 1,
  },
  footer: {
    backgroundColor: '#E5E5E5',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 3,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    color: '#4ba3c3',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  }
});