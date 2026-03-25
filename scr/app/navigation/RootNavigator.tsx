import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import Login     from '../screens/LoginScreen';
import Cadastro  from '../screens/CadastroScreen';
import AppPrincipal from './AppNavigator';

export type RootStackParamList = {
  Login:    undefined;
  Cadastro: undefined;
  App:      undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { logado } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {logado ? (
          <Stack.Screen name="App" component={AppPrincipal} />
        ) : (
          <>
            <Stack.Screen name="Login"    component={Login} />
            <Stack.Screen name="Cadastro" component={Cadastro} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
