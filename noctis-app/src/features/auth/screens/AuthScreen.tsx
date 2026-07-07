import React, { useState } from 'react';
import { View, SafeAreaView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Typography } from '../../../components/ui/Typography';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { supabase } from '../../../services/supabase';
import { useRoute } from '@react-navigation/native';

export function AuthScreen() {
  const route = useRoute<any>();
  const initialMode = route.params?.mode || 'login';
  
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
    } catch (error: any) {
      Alert.alert('Authentication Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 px-6 justify-center"
      >
        <Typography variant="heading" weight="bold" className="mb-2">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </Typography>
        <Typography variant="body" color="secondary" className="mb-8">
          {isLogin ? 'Enter your details to continue.' : 'Start your recovery journey.'}
        </Typography>

        <Input 
          label="Email Address" 
          placeholder="nairon@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        
        <Input 
          label="Password" 
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Button 
          title={isLogin ? 'Sign In' : 'Create Account'} 
          className="mt-4"
          isLoading={loading}
          onPress={handleAuth}
        />

        <Button 
          title={isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"} 
          variant="outline" 
          className="mt-4 border-transparent"
          onPress={() => setIsLogin(!isLogin)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}