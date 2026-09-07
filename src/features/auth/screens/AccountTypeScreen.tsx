import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Background } from '../../../components/Background';
import { useNavigation } from '@react-navigation/native';
import { WelcomeHeader, WelcomeBackButton } from '../../../components/welcomeHeader';

export function AccountTypeScreen() {
  const navigation = useNavigation<any>();

  return (
    <Background edges={['left', 'right', 'bottom']}>
      <WelcomeBackButton />

      <View style={styles.container}>
        <View style={styles.header}>
          <WelcomeHeader hideReturnButton />
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
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  label: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 20,
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
    shadowOffset: { width: 0, height: 4 },
  },
});
