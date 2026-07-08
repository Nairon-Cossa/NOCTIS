import React, { useState } from 'react';
import { View, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Typography } from '../../../components/ui/Typography';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

// UPDATE THIS PATH to wherever your Supabase client instance lives
import { supabase } from '../../../services/supabase'; 

export function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Required Fields', 'Please enter your email and password.');
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!name || !age) {
          Alert.alert('Profile Required', 'Please provide your name and age to calibrate your baseline.');
          setIsLoading(false);
          return;
        }

        // Supabase SignUp with metadata injection
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              age: parseInt(age) || null,
            }
          }
        });

        if (error) throw error;
        Alert.alert('Access Granted', 'Your biometric profile has been initialized. Please check your email to verify (if enabled).');
      } else {
        // Standard Sign In
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      }
    } catch (err: any) {
      Alert.alert('Authentication Error', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0B0D' }} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView 
          contentContainerStyle={{ paddingHorizontal: 24, justifyContent: 'center', flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Dynamic Header */}
          <View className="mb-10">
            <Typography variant="caption" color="secondary" className="uppercase tracking-widest mb-2">
              {isSignUp ? 'System Initialization' : 'Welcome Back'}
            </Typography>
            <Typography variant="heading" weight="bold">
              {isSignUp ? 'Establish Identity' : 'Authenticate Access'}
            </Typography>
          </View>

          {/* Form Inputs */}
          <View className="gap-y-5 mb-8">
            {isSignUp && (
              <>
                <Input 
                  label="Preferred Name" 
                  value={name} 
                  onChangeText={setName} 
                  placeholder="What should we call you?" 
                  autoCapitalize="words"
                />
                <Input 
                  label="Age (For Baseline Calibration)" 
                  value={age} 
                  onChangeText={setAge} 
                  placeholder="e.g. 25" 
                  keyboardType="numeric"
                />
              </>
            )}
            
            <Input 
              label="Email Address" 
              value={email} 
              onChangeText={setEmail} 
              placeholder="Enter your secure email" 
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <Input 
              label="Password" 
              value={password} 
              onChangeText={setPassword} 
              placeholder="Enter your secure password" 
              secureTextEntry
            />
          </View>

          {/* Primary Action Button */}
          <Button 
            title={isSignUp ? 'Initialize Profile' : 'Access System'} 
            isLoading={isLoading} 
            onPress={handleAuth} 
            className="h-12 bg-[#4B82FF] mb-6"
          />

          {/* Toggle Login/Signup State */}
          <View className="flex-row justify-center items-center">
            <Typography variant="small" color="secondary">
              {isSignUp ? 'Already calibrated? ' : 'No profile found? '}
            </Typography>
            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} className="p-2">
              <Typography variant="small" weight="bold" style={{ color: '#4B82FF' }}>
                {isSignUp ? 'Sign In' : 'Create Account'}
              </Typography>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}