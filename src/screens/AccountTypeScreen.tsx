import React from 'react'; 
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Background } from '../components/Background';
import { useNavigation } from '@react-navigation/native';
import { WelcomeHeader } from '../components/welcomeHeader';

export function AccountTypeScreen() {
  const navigation = useNavigation<any>(); 

  return (
    <Background>
      <View style={styles.container}>
        
        {/* Header fixado no topo para não empurrar os botões para baixo */}
        <View style={styles.header}>
          <WelcomeHeader/>
        </View>

        {/* Conteúdo flex: 1 ocupa a tela toda e centraliza só as esferas no meio exato */}
        <View style={styles.content}>
          <Text style={styles.label}>SOU EMPRESA</Text>
          <TouchableOpacity 
            style={styles.circleButton}
            onPress={() => navigation.navigate('RegisterCompany')}
          />

          <Text style={styles.label}>SOU EMPREENDEDOR</Text>
          <TouchableOpacity 
            style={styles.circleButton}
            onPress={() => navigation.navigate('RegisterUser')}
          />
        </View>

      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },

  header: { 
    position: 'absolute', // Faz o header "flutuar" sem ocupar espaço no cálculo do centro
    top: 60, // Distância do topo da tela (pode ajustar esse número se quiser mais alto ou mais baixo)
    width: '100%',
    alignItems: 'center', 
    zIndex: 1, // Garante que o header fique na frente
  },

  content: { 
    flex: 1, // Faz a View das esferas usar 100% da altura da tela
    justifyContent: 'center', // Crava tudo no meio verticalmente
    alignItems: 'center', // Centraliza horizontalmente
    width: '100%',
  },

  label: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 15, 
    marginTop: 20 
  },

  circleButton: { 
    width: 140, 
    height: 140, 
    backgroundColor: '#FFFFFF', 
    borderRadius: 70, 
    elevation: 5, 
    shadowColor: '#000', 
    shadowOpacity: 0.15, 
    shadowRadius: 10, 
    shadowOffset: { width: 0, height: 4 } 
  },
});