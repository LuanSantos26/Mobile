import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ProductsProvider } from './src/context/ProductsContext';
import { BarraquinhasProvider } from './src/context/BarraquinhasContext';
import { PurchaseCartProvider } from './src/context/PurchaseCartContext';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import LoginScreen from './src/screens/Login';
import HomeScreen from './src/screens/HomeScreen';
import { BarraquinhasScreen } from './src/screens/BarraquinhasScreen';
import { CartScreen } from './src/screens/CartScreen';
import { CheckoutScreen } from './src/screens/CheckoutScreen';
import { SacolaScreen } from './src/screens/SacolaScreen';
import { PedidoAcompanhamentoScreen } from './src/screens/PedidoAcompanhamentoScreen';
import { ConfiguracoesScreen } from './src/screens/ConfiguracoesScreen';
import { FormasPagamentoScreen } from './src/screens/FormasPagamentoScreen';
import { ManageProductsScreen } from './src/screens/ManageProductsScreen';
import { CardsScreen } from './src/screens/CardsScreen';
import { StoreVitrineScreen } from './src/screens/StoreVitrineScreen';
import { ProductDetailScreen } from './src/screens/ProductDetailScreen';

export type RootStackParamList = {
  Welcome: { mensagemSucesso?: string } | undefined;
  Register: undefined;
  Login: undefined;
  Home: undefined;
  Barraquinhas: undefined;
  Configuracoes: undefined;
  FormasPagamento: undefined;
  AddItem: undefined;
  Cart: { solicitacaoEnviada?: boolean } | undefined;
  Checkout: undefined;
  Sacola: undefined;
  PedidoAcompanhamento: {
    pedidoId: number;
    pedidoInicial?: import('./src/services/marketplaceService').SolicitacaoCompra;
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
    fornecedorDescricao?: string;
    fornecedorLogoUrl?: string;
    fornecedorTipo?: string;
  };
  VitrineScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AuthenticatedNavigator() {
  return (
    <ProductsProvider>
      <BarraquinhasProvider>
        <PurchaseCartProvider>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Barraquinhas" component={BarraquinhasScreen} />
            <Stack.Screen name="Configuracoes" component={ConfiguracoesScreen} />
            <Stack.Screen name="FormasPagamento" component={FormasPagamentoScreen} />
            <Stack.Screen name="AddItem" component={ManageProductsScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="Sacola" component={SacolaScreen} />
            <Stack.Screen name="PedidoAcompanhamento" component={PedidoAcompanhamentoScreen} />
            <Stack.Screen name="Cards" component={CardsScreen} />
            <Stack.Screen name="StoreVitrine" component={StoreVitrineScreen} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          </Stack.Navigator>
        </PurchaseCartProvider>
      </BarraquinhasProvider>
    </ProductsProvider>
  );
}

function GuestNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

function AppNavigator() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F8B125" />
      </View>
    );
  }

  return isAuthenticated ? <AuthenticatedNavigator /> : <GuestNavigator />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
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
