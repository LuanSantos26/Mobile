import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { AccountTypeScreen } from './src/screens/AccountTypeScreen';
import { RegisterUserScreen } from './src/screens/RegisterUserScreen';
import { RegisterCompanyScreen } from './src/screens/RegisterCompanyScreen';
import LoginScreen from './src/screens/Login';
import HomeScreen from './src/screens/HomeScreen';
import { ProductsScreen } from './src/screens/ProductsScreen';
import { CartScreen } from './src/screens/CartScreen';
import { CardsScreen } from './src/screens/CardsScreen';

// --- VERIFIQUE SE ESTAS DUAS LINHAS ESTÃO AQUI ---
import { StoreVitrineScreen } from './src/screens/StoreVitrineScreen';
import { ProductDetailScreen } from './src/screens/ProductDetailScreen';

export type RootStackParamList = {
  Welcome: undefined;
  AccountType: undefined;
  RegisterUser: undefined;
  RegisterCompany: undefined;
  Login: undefined;
  Home: undefined;
  Products: undefined;
  Cart: undefined;
  Cards: undefined;
  AddItem: undefined;
  StoreVitrine: { storeName: string }; 
  ProductDetail: { productName: string, price: string }; // <-- Essa linha avisa o TS que a rota existe
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome" 
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="AccountType" component={AccountTypeScreen} />
        <Stack.Screen name="RegisterUser" component={RegisterUserScreen} />
        <Stack.Screen name="RegisterCompany" component={RegisterCompanyScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Products" component={ProductsScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Cards" component={CardsScreen} />
        
        {/* --- VERIFIQUE SE ESTAS DUAS LINHAS ESTÃO AQUI EMBAIXO --- */}
        <Stack.Screen name="StoreVitrine" component={StoreVitrineScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}