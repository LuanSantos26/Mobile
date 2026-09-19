import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AnimationScreen } from '../screens/Animation/AnimationScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen/WelcomeScreen';
import { RegisterScreen } from '../screens/Register/RegisterScreen';
import LoginScreen from '../screens/Login/Login';
import EscolhaUsuarioScreen from '../components/Header/Cli_For';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AuthNavigator() {
  return <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Animation" component={AnimationScreen} />
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="Cli_For" component={EscolhaUsuarioScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>;
}
