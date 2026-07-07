import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';

import { useAuth } from '../providers/AuthProvider';
import { WelcomeScreen } from '../features/auth/screens/WelcomeScreen';
import { AuthScreen } from '../features/auth/screens/AuthScreen';
import { Typography } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';

const Stack = createNativeStackNavigator();

// Temporary Home Screen until we build the real Dashboard in Sprint 5
function DummyHomeScreen() {
  const { signOut, user } = useAuth();
  return (
    <View className="flex-1 bg-background items-center justify-center px-6">
      <Typography variant="heading" weight="bold" className="mb-4 text-center">
        Daily Command Center
      </Typography>
      <Typography variant="body" color="primary" className="mb-8">
        Authenticated as: {user?.email}
      </Typography>
      <Button title="Sign Out" variant="secondary" onPress={signOut} />
    </View>
  );
}

export function RootNavigator() {
  const { session, isLoading } = useAuth();

  // Prevent white flashes while checking encrypted storage for the token
  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#4B82FF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session ? (
          // User is signed in
          <Stack.Screen name="Home" component={DummyHomeScreen} />
        ) : (
          // User is NOT signed in
          <Stack.Group>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Auth" component={AuthScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}