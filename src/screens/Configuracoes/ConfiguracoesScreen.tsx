import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { BackButton } from '../../components/Header/BackButton';
import { ScreenHeader } from '../../components/Header/ScreenHeader';
import { BottomTabBar, useBottomTabBarHeight } from '../../components/layout/BottomTabBar';
import { AlternarPerfilCard } from '../../components/Perfil/AlternarPerfilCard';
import { useAppGoBack } from '../../hooks/useAppGoBack';
import { useHeaderTopPadding } from '../../utils/safeArea';
import { AjustesMenuItem } from './components/AjustesMenuItem';
import { clienteStyles, styles } from './styles';
import { CLIENTE_COLORS } from '../../theme/theme';
import { BrandLogo } from '../../components/brand/BrandLogo';

const PRIMARY = CLIENTE_COLORS.primary;

/** Menu de Ajustes: cada item abre uma subtela com o próprio botão de salvar. */
export function ConfiguracoesScreen() {
  const { perfilUso } = useAuth();
  const isCliente = perfilUso === 'Cliente';
  const goBack = useAppGoBack(isCliente ? 'Perfil' : 'Home');
  const topPadding = useHeaderTopPadding(8);
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<any>();

  if (isCliente) {
    return (
      <View style={clienteStyles.root}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: tabBarHeight + 16 }}
        >
          <View style={[clienteStyles.header, { paddingTop: topPadding }]}>
            <View style={clienteStyles.headerTop}>
              <BackButton onPress={goBack} iconColor={PRIMARY} />
              <BrandLogo variant="azul" height={34} />
              <View style={{ width: 32 }} />
            </View>
            <Text style={clienteStyles.title}>Dados do cliente</Text>
          </View>

          <View style={clienteStyles.sheet}>
            <AlternarPerfilCard />

            <AjustesMenuItem
              icon="person-outline"
              title="Dados pessoais"
              subtitle="Nome e e-mail da conta"
              onPress={() => navigation.navigate('DadosPessoais')}
            />
            <AjustesMenuItem
              icon="business-outline"
              title="Dados do negócio"
              subtitle="Nome e CNPJ do estabelecimento"
              onPress={() => navigation.navigate('DadosEmpresa')}
            />
            <AjustesMenuItem
              icon="lock-closed-outline"
              title="Alterar senha"
              subtitle="Defina uma nova senha"
              onPress={() => navigation.navigate('AlterarSenha')}
            />
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
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="Ajustes"
          subtitle="Perfil da loja, dados da conta e da empresa."
          inset={16}
          style={{ marginBottom: 16 }}
        />

        <AlternarPerfilCard />

        <AjustesMenuItem
          icon="storefront-outline"
          title="Perfil da loja"
          subtitle="Foto, capa e descrição"
          onPress={() => navigation.navigate('PerfilLoja')}
        />
        <AjustesMenuItem
          icon="person-outline"
          title="Dados pessoais"
          subtitle="Nome e e-mail da conta"
          onPress={() => navigation.navigate('DadosPessoais')}
        />
        <AjustesMenuItem
          icon="lock-closed-outline"
          title="Alterar senha"
          subtitle="Defina uma nova senha"
          onPress={() => navigation.navigate('AlterarSenha')}
        />
        <AjustesMenuItem
          icon="business-outline"
          title="Dados da empresa"
          subtitle="Nome, CNPJ e telefone"
          onPress={() => navigation.navigate('DadosEmpresa')}
        />
      </ScrollView>
    </SafeAreaView>
    <BottomTabBar activeRoute="Configuracoes" />
    </View>
  );
}
