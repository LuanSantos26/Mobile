import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export default function App() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <LinearGradient
      // As cores originais do seu degradê
      colors={['#4ba3c3', '#77a9a1', '#d6b856']}
      style={styles.container}
    >
      <SafeAreaView style={styles.content}>
        
        {/* Cabeçalho Fiel à Imagem Original */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Feather name="shopping-cart" size={56} color="#FFF" />
            <Text style={styles.logoText}>QuickBar</Text>
          </View>
          <Text style={styles.subtitle}>BEM-VINDO AO QUICKBAR</Text>
          <Text style={styles.description}>Gerenciamento inteligente</Text>
        </View>

        {/* Formulário Original */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Feather name="user" size={20} color="#F4B41A" style={styles.icon} />
            <TextInput 
              style={styles.input} 
              placeholder="Digite seu usuário" 
              placeholderTextColor="#77a9a1"
              value={usuario}
              onChangeText={setUsuario}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Feather name="lock" size={20} color="#F4B41A" style={styles.icon} />
            <TextInput 
              style={styles.input} 
              placeholder="Digite sua senha" 
              placeholderTextColor="#77a9a1"
              value={senha}
              onChangeText={setSenha}
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

        {/* Cacto posicionado no canto inferior direito */}
        <View style={styles.cactusContainer}>
           <MaterialCommunityIcons name="cactus" size={130} color="#2d6a4f" />
        </View>

      </SafeAreaView>

      {/* Rodapé Original de Criar Conta */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Feather name="user-plus" size={22} color="#4ba3c3" />
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
    zIndex: 2,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: Platform.OS === 'android' ? 40 : 0,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  logoText: {
    fontSize: 52,
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
    zIndex: 3,
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
    outlineStyle: 'none', // Remove a borda padrão do navegador web
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
  cactusContainer: {
    position: 'absolute',
    bottom: -15,
    right: -15,
    zIndex: 1,
    opacity: 0.8,
  },
  footer: {
    backgroundColor: '#E5E5E5',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 4,
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