import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Use this specific import
import { Typography } from '../../../components/ui/Typography';
import { Button } from '../../../components/ui/Button';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export function WelcomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    // Explicit flex layout prevents collapsing
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0B0D' }} edges={['top', 'bottom']}>
      <View style={{ flex: 1, justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 48 }}>
        
        {/* Top Content */}
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Typography variant="display" weight="bold" className="mb-2">
            Master the Night.
          </Typography>
          <Typography variant="subtitle" color="secondary">
            Premium sleep and recovery, designed for tomorrow.
          </Typography>
        </View>

        {/* Bottom Actions */}
        <View className="w-full gap-y-4">
          <Button 
            title="Get Started" 
            onPress={() => navigation.navigate('Auth', { mode: 'register' })} 
          />
          <Button 
            title="I already have an account" 
            variant="outline" 
            onPress={() => navigation.navigate('Auth', { mode: 'login' })} 
          />
        </View>
      </View>
    </SafeAreaView>
  );
}