import React from 'react';
import { StatusBar } from 'react-native';
import QuickBarLoginScreen from './src/screens/QuickBarLoginScreen';

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#5ba3d0" />
      <QuickBarLoginScreen />
    </>
  );
}