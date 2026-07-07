import React from 'react';
import { StatusBar } from 'expo-status-bar';
import './global.css';

import { AuthProvider } from './src/providers/AuthProvider';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </AuthProvider>
  );
}