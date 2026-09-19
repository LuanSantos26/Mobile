import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProductsProvider } from '../context/ProductsContext';
import { BarraquinhasProvider } from '../context/BarraquinhasContext';
import HomeScreen from '../screens/Home/HomeScreen';
import { BarraquinhasScreen } from '../screens/Barraquinhas/BarraquinhasScreen';
import { CartScreen } from '../screens/Cart/CartScreen';
import { CheckoutScreen } from '../screens/Checkout/CheckoutScreen';
import { SacolaScreen } from '../screens/Sacola/SacolaScreen';
import { PedidoAcompanhamentoScreen } from '../screens/PedidoAcompanhamento/PedidoAcompanhamentoScreen';
import { ConfiguracoesScreen } from '../screens/Configuracoes/ConfiguracoesScreen';
import { FormasPagamentoScreen } from '../screens/FormasPagamento/FormasPagamentoScreen';
import { EnderecosScreen } from '../screens/Enderecos/EnderecosScreen';
import { ManageProductsScreen } from '../screens/ManageProducts/ManageProductsScreen';
import { CardsScreen } from '../screens/Cards/CardsScreen';
import { StoreVitrineScreen } from '../screens/StoreVitrine/StoreVitrineScreen';
import { ProductDetailScreen } from '../screens/ProductDetail/ProductDetailScreen';
import { EmpresaVendasScreen } from '../screens/EmpresaVendas/EmpresaVendasScreen';
import { CamioneirosScreen } from '../screens/Logistica/CamioneirosScreen';
import { CadastroCamioneirosScreen } from '../screens/Logistica/CadastroCamioneirosScreen';
import { LogisticaScreen } from '../screens/Logistica/LogisticaScreen';
import EscolhaUsuarioScreen from '../screens/Cli_For/Cli_For';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function MainNavigator() {
  return <ProductsProvider><BarraquinhasProvider><Stack.Navigator screenOptions={{ headerShown: false }}>
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
    <Stack.Screen name="Cli_For" component={EscolhaUsuarioScreen} />
    <Stack.Screen name="Logistica" component={LogisticaScreen} />
  </Stack.Navigator></BarraquinhasProvider></ProductsProvider>;
}
