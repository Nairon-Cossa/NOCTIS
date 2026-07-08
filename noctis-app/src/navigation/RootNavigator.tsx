import React, { useEffect, useState } from 'react';
import { View, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';

// Context & State Stores
import { useAuth } from '../providers/AuthProvider';
import { useMetricStore } from '../store/useMetricStore';

// Screen Feature Components
import { WelcomeScreen } from '../features/auth/screens/WelcomeScreen';
import { AuthScreen } from '../features/auth/screens/AuthScreen';

// Core UI Design System Components
import { Typography } from '../components/ui/Typography';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ProgressRing } from '../components/ui/ProgressRing';
import { Colors } from '../theme/theme';

const Stack = createNativeStackNavigator();

// 2. Global Root Navigation Gateway Router
export function RootNavigator() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0B0B0D' }} className="items-center justify-center">
        <ActivityIndicator size="large" color="#4B82FF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session ? (
          <Stack.Screen name="MainTabs" component={TabNavigator} />
        ) : (
          <Stack.Group>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Auth" component={AuthScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}