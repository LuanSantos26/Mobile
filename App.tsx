import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { AccountTypeScreen } from './src/screens/AccountTypeScreen';
import { RegisterUserScreen } from './src/screens/RegisterUserScreen';
import { RegisterCompanyScreen } from './src/screens/RegisterCompanyScreen';
import LoginScreen from './src/screens/Login';


export type RootStackParamList = {
  Welcome: undefined;
  AccountType: undefined;
  RegisterUser: undefined;
  RegisterCompany: undefined;
  Login: undefined; 
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
      </Stack.Navigator> </NavigationContainer>
  );
}