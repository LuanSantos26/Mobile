import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ScreenTopGradient } from '../../components/layout/ScreenTopGradient';
import { BackTitleHeader } from '../../components/Header/BackTitleHeader';
import { useAppGoBack } from '../../hooks/useAppGoBack';
import { styles } from './styles';

type Perfil = 'Fornecedor' | 'Cliente';

export default function EscolhaUsuarioScreen() {
  const navigation = useNavigation<any>();
  const goBack = useAppGoBack('Home');
  const [escolha, setEscolha] = useState<Perfil | null>(null);

  const handleContinuar = () => {
    if (escolha) navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScreenTopGradient />
      <BackTitleHeader title="Perfis" onBack={goBack} />

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.kicker}>Conta</Text>
          <Text style={styles.title}>Escolha seu perfil</Text>
          <Text style={styles.subtitle}>
            Selecione como você vai usar o QuickStock neste acesso.
          </Text>

          <TouchableOpacity
            style={[styles.option, escolha === 'Fornecedor' && styles.optionSelected]}
            onPress={() => setEscolha('Fornecedor')}
            activeOpacity={0.85}
          >
            <View style={[styles.iconWrap, escolha === 'Fornecedor' && styles.iconWrapSelected]}>
              <Ionicons
                name="storefront-outline"
                size={22}
                color={escolha === 'Fornecedor' ? '#FFF' : '#F8B125'}
              />
            </View>
            <View style={styles.optionCopy}>
              <Text style={[styles.optionText, escolha === 'Fornecedor' && styles.optionTextSelected]}>
                Fornecedor
              </Text>
              <Text style={[styles.optionHint, escolha === 'Fornecedor' && styles.optionHintSelected]}>
                Vender e gerenciar o catálogo
              </Text>
            </View>
            {escolha === 'Fornecedor' ? (
              <Ionicons name="checkmark-circle" size={22} color="#FFF" />
            ) : (
              <Ionicons name="chevron-forward" size={16} color="#D4B56A" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, styles.optionLast, escolha === 'Cliente' && styles.optionSelected]}
            onPress={() => setEscolha('Cliente')}
            activeOpacity={0.85}
          >
            <View style={[styles.iconWrap, escolha === 'Cliente' && styles.iconWrapSelected]}>
              <Ionicons
                name="person-outline"
                size={22}
                color={escolha === 'Cliente' ? '#FFF' : '#F8B125'}
              />
            </View>
            <View style={styles.optionCopy}>
              <Text style={[styles.optionText, escolha === 'Cliente' && styles.optionTextSelected]}>
                Cliente
              </Text>
              <Text style={[styles.optionHint, escolha === 'Cliente' && styles.optionHintSelected]}>
                Comprar de distribuidoras
              </Text>
            </View>
            {escolha === 'Cliente' ? (
              <Ionicons name="checkmark-circle" size={22} color="#FFF" />
            ) : (
              <Ionicons name="chevron-forward" size={16} color="#D4B56A" />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, !escolha && styles.buttonDisabled]}
          onPress={handleContinuar}
          disabled={!escolha}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
