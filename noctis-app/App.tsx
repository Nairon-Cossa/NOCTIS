// App.tsx
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { Colors, Typography, Spacing } from './src/theme/theme';

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.brandText}>NOCTIS</Text>
        <Text style={styles.statusText}>Operating System for Recovery</Text>
        <Text style={styles.developmentNotice}>
          Ready for Sprint 1 component building.
        </Text>
        <StatusBar style="light" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background, // True luxury black backdrop [cite: 82, 83]
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl, // Balanced side safe gaps [cite: 373]
  },
  brandText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.heading, // 30px clear branding [cite: 129]
    fontWeight: Typography.weights.bold, // 700 bold [cite: 125, 374]
    color: Colors.text, // Clear premium contrast white [cite: 95, 96]
    letterSpacing: 2,
    marginBottom: Spacing.xs,
  },
  statusText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.body, // 16px clean text [cite: 129]
    fontWeight: Typography.weights.medium, // 500 semi-emphasis [cite: 123, 374]
    color: Colors.secondary, // Muted slate gray secondary text [cite: 97, 98]
    marginBottom: Spacing.xxl,
  },
  developmentNotice: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.small, // 14px secondary [cite: 129]
    fontWeight: Typography.weights.regular, // 400 default [cite: 122, 374]
    color: Colors.disabled, // Ghosted state text label [cite: 100]
    textAlign: 'center',
  },
});