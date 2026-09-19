import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBar } from '../../components/Header/BottomTabBar';

type Navigation = {
  navigate: (screen: string) => void;
};

export default function EscolhaUsuarioScreen({
  navigation,
}: {
  navigation: Navigation;
}) {
  const [escolha, setEscolha] = useState<"Fornecedor" | "Cliente" | null>(null);

  const handleContinuar = () => {
    if (escolha) navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha seu perfil</Text>

      <TouchableOpacity
        style={[
          styles.option,
          escolha === "Fornecedor" && styles.optionSelected
        ]}
        onPress={() => setEscolha("Fornecedor")}
      >
        <Text style={styles.optionText}>Fornecedor</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.option,
          escolha === "Cliente" && styles.optionSelected
        ]}
        onPress={() => setEscolha("Cliente")}
      >
        <Text style={styles.optionText}>Cliente</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, !escolha && styles.buttonDisabled]}
        onPress={handleContinuar}
        disabled={!escolha}
      >
        <BottomTabBar />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  option: {
    width: "80%",
    padding: 20,
    marginVertical: 10,
    backgroundColor: "#ddd",
    borderRadius: 10,
    alignItems: "center",
  },
  optionSelected: {
    backgroundColor: "#4CAF50",
  },
  optionText: {
    fontSize: 18,
    color: "#000",
  },
  button: {
    marginTop: 30,
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    width: "60%",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#aaa",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
