import React from 'react';
import {
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Background } from '../components/Background';
import { WelcomeHeader } from '../components/welcomeHeader';
// 1. Importe o seu botão reutilizável aqui (ajuste o caminho da pasta se precisar)
import { CustomButton } from '../components/CustomButton'; 

export default function LoginScreen() {

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handleLogin = () => {
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#4FA7D3', '#E5BF2E']}
        style={styles.gradient}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={{ width: '100%' }} // Adicionado para garantir que o ScrollView ocupe a tela toda no celular
        >
          <View style={styles.header}>
            <WelcomeHeader />
          </View>

          {/* Campo de Usuário */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#D4A017"
              style={styles.icon}
            />
            <TextInput
              placeholder="Digite seu usuário"
              placeholderTextColor="#7DA4C2"
              style={styles.input}
            />
          </View>

          {/* Campo de Senha */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#D4A017"
              style={styles.icon}
            />
            <TextInput
              placeholder="Digite sua senha"
              placeholderTextColor="#7DA4C2"
              secureTextEntry
              style={styles.input}
            />
          </View>

          {/* Botão de Login usando seu componente CustomButton */}
          <View style={styles.buttonWrapper}>
            <CustomButton 
              title="Login" 
              onPress={handleLogin} 
            />
          </View>

          {/* Esqueci a Senha */}
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>
              Esqueceu a senha
            </Text>
          </TouchableOpacity>
          
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  gradient: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
  },
  scrollContent: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
  },
  inputContainer: {
    width: '80%',
    height: 45,
    backgroundColor: '#F3F3F3',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E5BF2E',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#333',
  },
  // Nova View para segurar o botão e garantir o tamanho correto
  buttonWrapper: {
    width: '80%',
    marginTop: 15,
  },
  forgotPassword: {
    marginTop: 20, 
    color: 'white',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
});