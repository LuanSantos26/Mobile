import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthScreenShell } from '../../components/auth/AuthScreenShell';
import { CustomButton } from '../../components/Button/CustomButton';
import { RootStackParamList } from '../../navigation/types';
import type { PerfilCadastro } from '../../types/auth';
import { AUTH_NAVY } from '../../theme/authTheme';
import { styles } from './styles';

const AUTH_OPTIONS: {
  perfil: PerfilCadastro;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { perfil: 'Cliente', label: 'Sou cliente', icon: 'person-outline' },
  { perfil: 'Fornecedor', label: 'Sou fornecedor', icon: 'storefront-outline' },
  { perfil: 'ClienteFornecedor', label: 'Cliente e fornecedor', icon: 'people-outline' },
];

export default function EscolhaUsuarioScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [escolha, setEscolha] = useState<PerfilCadastro | null>(null);

  const handleContinuar = () => {
    if (!escolha) return;
    navigation.navigate('Register', { perfil: escolha });
  };

  return (
    <AuthScreenShell subtitle="">
      <Text style={styles.authQuestion}>Olá!{'\n'}Você é cliente ou fornecedor?</Text>
      <Text style={styles.authHint}>Escolha o perfil para criar sua conta.</Text>

      {AUTH_OPTIONS.map((option) => {
        const selected = escolha === option.perfil;
        return (
          <TouchableOpacity
            key={option.perfil}
            style={[styles.authOption, selected && styles.authOptionSelected]}
            onPress={() => setEscolha(option.perfil)}
            activeOpacity={0.85}
          >
            <View style={styles.optionIcon}>
              <Ionicons name={option.icon} size={20} color={AUTH_NAVY} />
            </View>
            <Text style={styles.authOptionText}>{option.label}</Text>
            <Ionicons name="chevron-forward" size={18} color="#C5CAD3" />
          </TouchableOpacity>
        );
      })}

      <CustomButton
        title="Continuar"
        onPress={handleContinuar}
        disabled={!escolha}
      />
    </AuthScreenShell>
  );
}
