import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeTopPadding } from './src/utils/safeArea';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ConfirmDialogProvider } from './src/context/ConfirmDialogContext';
import { ProductsProvider } from './src/context/ProductsContext';
import { BarraquinhasProvider } from './src/context/BarraquinhasContext';
import { PurchaseCartProvider } from './src/context/PurchaseCartContext';
import { AnimationScreen } from './src/features/auth/screens/AnimationScreen';
import { WelcomeScreen } from './src/features/auth/screens/WelcomeScreen';
import { RegisterScreen } from './src/features/auth/screens/RegisterScreen';
import LoginScreen from './src/features/auth/screens/Login';
import HomeScreen from './src/features/catalog/screens/HomeScreen';
import { BarraquinhasScreen } from './src/features/catalog/screens/BarraquinhasScreen';
import { CartScreen } from './src/features/marketplace/screens/CartScreen';
import { CheckoutScreen } from './src/features/marketplace/screens/CheckoutScreen';
import { SacolaScreen } from './src/features/marketplace/screens/SacolaScreen';
import { PedidoAcompanhamentoScreen } from './src/features/marketplace/screens/PedidoAcompanhamentoScreen';
import { ConfiguracoesScreen } from './src/features/account/screens/ConfiguracoesScreen';
import { FormasPagamentoScreen } from './src/features/payments/screens/FormasPagamentoScreen';
import { EnderecosScreen } from './src/features/account/screens/EnderecosScreen';
import { ManageProductsScreen } from './src/features/catalog/screens/ManageProductsScreen';
import { CardsScreen } from './src/features/payments/screens/CardsScreen';
import { StoreVitrineScreen } from './src/features/marketplace/screens/StoreVitrineScreen';
import { ProductDetailScreen } from './src/features/marketplace/screens/ProductDetailScreen';
import { EmpresaVendasScreen } from './src/features/analytics/screens/EmpresaVendasScreen';
import { CamioneirosScreen } from './src/features/logistics/screens/CamioneirosScreen';
import { CadastroCamioneirosScreen } from './src/features/logistics/screens/CadastroCamioneirosScreen';
import { LogisticaScreen } from './src/features/logistics/screens/LogisticaScreen';

export type RootStackParamList = {
  Animation: undefined;
  Welcome: { mensagemSucesso?: string } | undefined;
  Register: undefined;
  Login: undefined;
  Home: undefined;
  Barraquinhas: undefined;
  Configuracoes: undefined;
  FormasPagamento: undefined;
  Enderecos: undefined;
  AddItem: undefined;
  Cart: { solicitacaoEnviada?: boolean; mensagemSucesso?: string } | undefined;
  Checkout: undefined;
  Sacola: undefined;
  PedidoAcompanhamento: {
    pedidoId: number;
    pedidoInicial?: import('./src/services/marketplaceService').SolicitacaoCompra;
    pedidosIds?: number[];
  };
  Cards: undefined;
  StoreVitrine: {
    fornecedorId: number;
    fornecedorNome: string;
    descricao?: string;
    logoUrl?: string;
    capaUrl?: string;
    tipo?: string;
  };
  ProductDetail: {
    produtoId: number;
    fornecedorId: number;
    fornecedorNome: string;
    productName: string;
    price: string;
    descricao?: string;
    imagemUrl?: string;
    unidade?: string;
    precoVenda?: number;
    estoque?: number;
    codigo?: string;
    origem?: 'catalogo' | 'marketplace';
    fornecedorDescricao?: string;
    fornecedorLogoUrl?: string;
    fornecedorTipo?: string;
  };
  EmpresaVendas: undefined;
  Camioneiros: undefined;
  CadastroCamioneiros: undefined;
  Logistica: undefined;
  VitrineScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AuthenticatedNavigator() {
  return (
    <ProductsProvider>
      <BarraquinhasProvider>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Barraquinhas" component={BarraquinhasScreen} />
            <Stack.Screen name="Configuracoes" component={ConfiguracoesScreen} />
            <Stack.Screen name="FormasPagamento" component={FormasPagamentoScreen} />
            <Stack.Screen name="Enderecos" component={EnderecosScreen} />
            <Stack.Screen name="AddItem" component={ManageProductsScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="Sacola" component={SacolaScreen} />
            <Stack.Screen name="PedidoAcompanhamento" component={PedidoAcompanhamentoScreen} />
            <Stack.Screen name="Cards" component={CardsScreen} />
            <Stack.Screen name="StoreVitrine" component={StoreVitrineScreen} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
            <Stack.Screen name="EmpresaVendas" component={EmpresaVendasScreen} />
            <Stack.Screen name="Camioneiros" component={CamioneirosScreen} />
            <Stack.Screen name="CadastroCamioneiros" component={CadastroCamioneirosScreen} />
            <Stack.Screen name="Logistica" component={LogisticaScreen} />
          </Stack.Navigator>
      </BarraquinhasProvider>
    </ProductsProvider>
  );
}

function GuestNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Animation" component={AnimationScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

function AppNavigator() {
  const { isLoading, isAuthenticated } = useAuth();
  const safeTopPadding = useSafeTopPadding();

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.loadingContainer, { paddingTop: safeTopPadding }]}
        edges={['left', 'right', 'bottom']}
      >
        <ActivityIndicator size="large" color="#F8B125" />
      </SafeAreaView>
    );
  }

  return isAuthenticated ? (
    <PurchaseCartProvider>
      <AuthenticatedNavigator />
    </PurchaseCartProvider>
  ) : (
    <GuestNavigator />
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <ConfirmDialogProvider>
          <AuthProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </AuthProvider>
        </ConfirmDialogProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
});
