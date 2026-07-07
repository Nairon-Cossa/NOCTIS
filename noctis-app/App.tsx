import React from 'react';
import { ScrollView, View, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import './global.css';
import { AuthProvider } from './src/providers/AuthProvider';

// Core UI Design System Imports
import { Colors } from './src/theme/theme';
import { Typography } from './src/components/ui/Typography';
import { Card } from './src/components/ui/Card';
import { Button } from './src/components/ui/Button';
import { ProgressRing } from './src/components/ui/ProgressRing';

export default function App() {
  return (
    // Explicit inline layout style prevents the view from collapsing to 0 height or defaulting to white
    <AuthProvider>
    <SafeAreaView 
      style={{ flex: 1, backgroundColor: '#0B0B0D' }} 
      className="flex-1 bg-background"
    >
      <StatusBar style="light" />
      
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View className="mb-8">
          <Typography variant="caption" color="accent" weight="semibold" className="tracking-widest uppercase mb-1">
            System Diagnostics
          </Typography>
          <Typography variant="heading" weight="bold">
            Design Library
          </Typography>
          <Typography variant="body" color="secondary" className="mt-1">
            Visual verification of Sprint 1 system components.
          </Typography>
        </View>

        {/* 1. Recovery Engine Ring Showcase */}
        <Typography variant="title" weight="semibold" className="mb-4">
          Core Engine Metrics
        </Typography>
        <Card className="items-center justify-center py-10 mb-8">
          <ProgressRing progress={84} ringColor={Colors.success} />
          <Typography variant="subtitle" weight="semibold" className="mt-6">
            Optimal Recovery Found
          </Typography>
          <Typography variant="small" color="secondary" className="text-center mt-1 px-4">
            Your cardiovascular system shows strong readiness markers for physical adaptation.
          </Typography>
        </Card>

        {/* 2. Typography Scale Showcase */}
        <Typography variant="title" weight="semibold" className="mb-4">
          Typography Hierarchy
        </Typography>
        <Card padding="md" className="space-y-4 mb-8 gap-y-3">
          <View>
            <Typography variant="display" weight="bold">Display 40px</Typography>
            <Typography variant="caption" color="disabled">Metric readouts & primary scores</Typography>
          </View>
          <View className="border-t border-surface/50 pt-2">
            <Typography variant="heading" weight="bold">Heading 30px</Typography>
            <Typography variant="caption" color="disabled">Primary view dashboards</Typography>
          </View>
          <View className="border-t border-surface/50 pt-2">
            <Typography variant="title" weight="semibold">Title 22px</Typography>
            <Typography variant="caption" color="disabled">Section groupings</Typography>
          </View>
          <View className="border-t border-surface/50 pt-2">
            <Typography variant="body">Body copy text configuration layout 16px</Typography>
            <Typography variant="caption" color="disabled">Explanatory metrics sentences</Typography>
          </View>
        </Card>

        {/* 3. Interactive Surfaces Showcase */}
        <Typography variant="title" weight="semibold" className="mb-4">
          Interactive Surfaces
        </Typography>
        <View className="gap-y-3">
          <Button 
            title="Primary Action Button" 
            onPress={() => console.log('Primary click')} 
          />
          <Button 
            title="Secondary Dashboard Component" 
            variant="secondary" 
            onPress={() => console.log('Secondary click')} 
          />
          <Button 
            title="Loading Simulation System" 
            isLoading={true} 
            variant="outline" 
          />
        </View>

      </ScrollView>
    </SafeAreaView>
    </AuthProvider>
  );
}