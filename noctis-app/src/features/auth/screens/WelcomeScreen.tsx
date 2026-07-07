import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { Typography } from '../../../components/ui/Typography';
import { Button } from '../../../components/ui/Button';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export function WelcomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 justify-between py-12">
        {/* Top Spacer */}
        <View className="flex-1 justify-center">
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