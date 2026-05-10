import React from 'react';

import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Background } from '../components/Background';
import { WelcomeHeader } from '../components/welcomeHeader';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#4FA7D3', '#E5BF2E']}
        style={styles.gradient}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <WelcomeHeader />
          </View>

        
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

       
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

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

  button: {
    width: '80%',
    height: 45,
    backgroundColor: '#F2BC1B',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  forgotPassword: {
    marginTop: 15,
    color: 'white',
    textDecorationLine: 'underline',
    fontSize: 12,
  },

});