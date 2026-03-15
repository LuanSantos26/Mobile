import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';

// Importação dos componentes que criou
import Dashboard from './scr/app/Dashboard';
import QuickBar from './scr/app/components/QuickBar';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F9FC" />
      
      {/* O ecrã principal (Dashboard) fica ao fundo */}
      <Dashboard />

      {/* A QuickBar fica renderizada por cima do Dashboard devido à sua posição absoluta */}
      <QuickBar />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC', // Cor de fundo que combina com o Dashboard
  },
});