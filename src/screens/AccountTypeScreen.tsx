import React from 'react'; 
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { Background } from '../components/Background';
import { useNavigation } from '@react-navigation/native';
import { WelcomeHeader } from '../components/welcomeHeader';

export function AccountTypeScreen() {
  const navigation = useNavigation<any>(); 

  return (
    <Background>
      
      <View style={styles.header}>
        <WelcomeHeader/>
      </View>

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
    </Background>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginTop: 40 },

  title: { 
    fontSize: 32, 
    color: '#FFF', 
    fontWeight: 'bold' 
  },

  subtitle: { 
    fontSize: 14, 
    color: '#FFF', 
    marginTop: 5 },

  description: { 
    fontSize: 14, 
    color: '#FFF' 
},
  content: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: '100%',
    paddingBottom: 40
  },

  label: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 15, 
    marginTop: 20 
  },

  circleButton: { width: 140, height: 140, backgroundColor: '#FFFFFF', borderRadius: 70, elevation: 5, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
});