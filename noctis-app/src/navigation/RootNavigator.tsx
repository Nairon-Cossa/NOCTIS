import React, { useEffect, useState } from 'react';
import { View, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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

// 1. Fully Implemented Telemetry Dashboard
function DummyHomeScreen() {
  const { signOut, user } = useAuth();
  const { currentMetrics, fetchTodayMetrics, saveDailyMetrics, isLoading } = useMetricStore();

  const [hrv, setHrv] = useState('65');
  const [rhr, setRhr] = useState('58');
  const [sleep, setSleep] = useState('420'); // Minutes (7 hours)
  const [efficiency, setEfficiency] = useState('88'); // Percentage

  useEffect(() => {
    if (user?.id) {
      fetchTodayMetrics(user.id);
    }
  }, [user?.id]);

  const handleSync = async () => {
    if (!user?.id) return;
    try {
      await saveDailyMetrics(user.id, {
        hrv_ms: parseInt(hrv) || 0,
        rhr_bpm: parseInt(rhr) || 0,
        sleep_minutes: parseInt(sleep) || 0,
        sleep_efficiency: parseInt(efficiency) || 0,
      });
      Alert.alert('Metrics Synchronized', 'Engine state recalculation successful.');
    } catch (err: any) {
      Alert.alert('Sync failure', err.message);
    }
  };

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: '#0B0B0D' }}
      contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 64 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="mb-6 flex-row justify-between items-center">
        <View>
          <Typography variant="caption" color="secondary" className="uppercase tracking-widest">
            Telemetry Feed
          </Typography>
          <Typography variant="title" weight="bold">
            Biometric Control
          </Typography>
        </View>
        <Button title="Sign Out" variant="outline" className="h-10 px-4" onPress={signOut} />
      </View>

      {/* Real-time Dynamic Processing Ring Visualization */}
      <Card className="items-center py-8 mb-6">
        {isLoading ? (
          <View style={{ height: 140 }} className="justify-center items-center">
            <ActivityIndicator size="small" color="#4B82FF" />
          </View>
        ) : (
          <ProgressRing 
            progress={currentMetrics?.recovery_score ?? 0} 
            ringColor={currentMetrics && currentMetrics.recovery_score > 75 ? Colors.success : Colors.accent} 
          />
        )}
        <Typography variant="subtitle" weight="semibold" className="mt-4">
          Calculated System Recovery
        </Typography>
        <Typography variant="small" color="secondary" className="mt-1 text-center px-4">
          Data stream bound directly to cloud storage vectors.
        </Typography>
      </Card>

      {/* Manual Override Form */}
      <Typography variant="small" color="secondary" weight="semibold" className="mb-3 uppercase tracking-widest">
        Biometric Calibration Overrides
      </Typography>

      <View className="flex-row gap-x-3">
        <View className="flex-1">
          <Input label="HRV (ms)" keyboardType="numeric" value={hrv} onChangeText={setHrv} />
        </View>
        <View className="flex-1">
          <Input label="RHR (bpm)" keyboardType="numeric" value={rhr} onChangeText={setRhr} />
        </View>
      </View>

      <View className="flex-row gap-x-3">
        <View className="flex-1">
          <Input label="Sleep (min)" keyboardType="numeric" value={sleep} onChangeText={setSleep} />
        </View>
        <View className="flex-1">
          <Input label="Efficiency (%)" keyboardType="numeric" value={efficiency} onChangeText={setEfficiency} />
        </View>
      </View>

      <Button title="Save & Compute Recovery" className="mt-2" isLoading={isLoading} onPress={handleSync} />
    </ScrollView>
  );
}

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
          <Stack.Screen name="Home" component={DummyHomeScreen} />
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