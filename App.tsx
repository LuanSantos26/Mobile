import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importando todas as 4 telas
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { AccountTypeScreen } from './src/screens/AccountTypeScreen';
import { RegisterUserScreen } from './src/screens/RegisterUserScreen';
import { RegisterCompanyScreen } from './src/screens/RegisterCompanyScreen';

//  rotas para o TypeScript
export type RootStackParamList = {
  Welcome: undefined;
  AccountType: undefined;
  RegisterUser: undefined;
  RegisterCompany: undefined;
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}