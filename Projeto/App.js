import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Login from './scr/app/Login'; // Importando a sua tela de Login

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Login />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});