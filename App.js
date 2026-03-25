import React from 'react';
import { AuthProvider } from './scr/app/context/AuthContext';
import RootNavigator from './scr/app/navigation/RootNavigator';

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
