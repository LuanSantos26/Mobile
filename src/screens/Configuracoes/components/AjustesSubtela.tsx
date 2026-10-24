import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../context/AuthContext';
import { BackButton } from '../../../components/Header/BackButton';
import { ScreenHeader } from '../../../components/Header/ScreenHeader';
import { BottomTabBar, useBottomTabBarHeight } from '../../../components/layout/BottomTabBar';
import { BrandLogo } from '../../../components/brand/BrandLogo';
import { useAppGoBack } from '../../../hooks/useAppGoBack';
import { useHeaderTopPadding } from '../../../utils/safeArea';
import { CLIENTE_COLORS } from '../../../theme/theme';
import { clienteStyles, styles } from '../styles';

interface AjustesSubtelaProps {
  title: string;
  subtitle: string;
  /** Ícone do cabeçalho do card (visual do cliente). */
  icon: keyof typeof Ionicons.glyphMap;
  saveLabel: string;
  onSave: () => void;
  loading: boolean;
  error: string;
  success: string;
  children: React.ReactNode;
}

/** Layout das subtelas de Ajustes: cabeçalho, voltar, conteúdo e botão salvar, no visual do perfil ativo. */
export function AjustesSubtela({
  title,
  subtitle,
  icon,
  saveLabel,
  onSave,
  loading,
  error,
  success,
  children,
}: AjustesSubtelaProps) {
  const { perfilUso } = useAuth();
  const goBack = useAppGoBack('Configuracoes');
  const topPadding = useHeaderTopPadding(8);
  const tabBarHeight = useBottomTabBarHeight();

  if (perfilUso === 'Cliente') {
    return (
      <View style={clienteStyles.root}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: tabBarHeight + 16 }}
        >
          <View style={[clienteStyles.header, { paddingTop: topPadding }]}>
            <View style={clienteStyles.headerTop}>
              <BackButton onPress={goBack} iconColor={CLIENTE_COLORS.primary} />
              <BrandLogo variant="azul" height={34} />
              <View style={{ width: 32 }} />
            </View>
            <Text style={clienteStyles.title}>{title}</Text>
          </View>

          <View style={clienteStyles.sheet}>
            <View style={clienteStyles.card}>
              <View style={clienteStyles.sectionHeader}>
                <View style={clienteStyles.sectionIcon}>
                  <Ionicons name={icon} size={18} color={CLIENTE_COLORS.primary} />
                </View>
                <View>
                  <Text style={clienteStyles.sectionTitle}>{title}</Text>
                  <Text style={clienteStyles.sectionSubtitle}>{subtitle}</Text>
                </View>
              </View>
              {children}
            </View>

            {error ? <Text style={clienteStyles.errorText}>{error}</Text> : null}
            {success ? <Text style={clienteStyles.successText}>{success}</Text> : null}

            <TouchableOpacity
              style={[clienteStyles.saveButton, loading && clienteStyles.saveButtonDisabled]}
              onPress={onSave}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color={CLIENTE_COLORS.primary} />
              ) : (
                <Text style={clienteStyles.saveButtonText}>{saveLabel}</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>

        <BottomTabBar activeRoute="Configuracoes" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
    <SafeAreaView style={styles.container} edges={['left', 'right']}>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title={title} subtitle={subtitle} inset={16} style={{ marginBottom: 16 }} />

        <View style={styles.backRow}>
          <BackButton onPress={goBack} />
          <Text style={styles.backText}>Ajustes</Text>
        </View>

        <View style={styles.card}>{children}</View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {success ? <Text style={styles.successText}>{success}</Text> : null}

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={onSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.saveButtonText}>{saveLabel}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
    <BottomTabBar activeRoute="Configuracoes" />
    </View>
  );
}
