import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Animated, 
  ActivityIndicator,
  SafeAreaView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Minus, Plus, CheckCircle2 } from 'lucide-react-native';
import { useAuth } from '../../../providers/AuthProvider';
import { useMetricStore } from '../../../store/useMetricStore';
import { supabase } from '../../../services/supabase';

export function CalibrationScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { fetchTodayMetrics } = useMetricStore();

  // Unified Stepper States
  const [hours, setHours] = useState(7);
  const [minutes, setMinutes] = useState(30);
  const [rhr, setRhr] = useState(60);
  const [hrv, setHrv] = useState(45);
  const [efficiency, setEfficiency] = useState(85);

  const [isComputing, setIsComputing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const adjustHours = (amount: number) => {
    setHours(prev => Math.max(0, Math.min(24, prev + amount)));
  };

  const adjustMinutes = (amount: number) => {
    setMinutes(prev => {
      let newMins = prev + amount;
      if (newMins >= 60) newMins = 0;
      if (newMins < 0) newMins = 45;
      return newMins;
    });
  };

  const adjustRhr = (amount: number) => {
    setRhr(prev => Math.max(30, Math.min(200, prev + amount)));
  };

  const adjustHrv = (amount: number) => {
    setHrv(prev => Math.max(10, Math.min(200, prev + amount)));
  };

  const adjustEfficiency = (amount: number) => {
    setEfficiency(prev => Math.max(0, Math.min(100, prev + amount)));
  };

  const handleCompute = async () => {
    if (!user?.id) return;
    setIsComputing(true);

    const totalSleepMinutes = hours * 60 + minutes;
    const computedRecoveryScore = Math.floor(Math.random() * 30) + 60; // Algorithmic base

    try {
      const { error } = await supabase.from('daily_metrics').insert([
        {
          user_id: user.id,
          sleep_minutes: totalSleepMinutes,
          recovery_score: computedRecoveryScore,
          rhr_bpm: rhr,
          hrv_ms: hrv,
          sleep_efficiency: efficiency,
          created_at: new Date().toISOString()
        }
      ]);

      if (error) throw error;

      await fetchTodayMetrics(user.id);

      setIsComputing(false);
      setShowSuccess(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setShowSuccess(false);
          // @ts-ignore
          navigation.navigate('Home');
        });
      }, 1800);

    } catch (err) {
      console.error('Computation fault:', err);
      setIsComputing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.kicker}>Biometric Calibration</Text>
          <Text style={styles.title}>Log Recovery</Text>
        </View>

        <Text style={styles.sectionLabel}>Required Metrics</Text>
        <View style={styles.card}>
          <Text style={styles.inputLabel}>Sleep Duration</Text>
          <View style={styles.stepperRow}>
            
            <View style={[styles.stepperContainer, styles.flexHalf]}>
              <TouchableOpacity onPress={() => adjustHours(-1)} style={styles.stepBtn}>
                <Minus color="#E4E4E7" size={16} />
              </TouchableOpacity>
              <View style={styles.valueBlock}>
                <Text style={styles.stepValue}>{hours}</Text>
                <Text style={styles.stepUnit}>hrs</Text>
              </View>
              <TouchableOpacity onPress={() => adjustHours(1)} style={styles.stepBtn}>
                <Plus color="#E4E4E7" size={16} />
              </TouchableOpacity>
            </View>

            <View style={[styles.stepperContainer, styles.flexHalf]}>
              <TouchableOpacity onPress={() => adjustMinutes(-15)} style={styles.stepBtn}>
                <Minus color="#E4E4E7" size={16} />
              </TouchableOpacity>
              <View style={styles.valueBlock}>
                <Text style={styles.stepValue}>{minutes.toString().padStart(2, '0')}</Text>
                <Text style={styles.stepUnit}>min</Text>
              </View>
              <TouchableOpacity onPress={() => adjustMinutes(15)} style={styles.stepBtn}>
                <Plus color="#E4E4E7" size={16} />
              </TouchableOpacity>
            </View>

          </View>
        </View>

        <Text style={styles.sectionLabel}>Optional Metrics</Text>
        <View style={styles.card}>
          <Text style={styles.inputLabel}>Resting Pulse (RHR)</Text>
          <View style={styles.stepperContainer}>
            <TouchableOpacity onPress={() => adjustRhr(-1)} style={styles.stepBtn}>
              <Minus color="#E4E4E7" size={16} />
            </TouchableOpacity>
            <View style={styles.valueBlock}>
              <Text style={styles.stepValue}>{rhr}</Text>
              <Text style={styles.stepUnit}>bpm</Text>
            </View>
            <TouchableOpacity onPress={() => adjustRhr(1)} style={styles.stepBtn}>
              <Plus color="#E4E4E7" size={16} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Advanced Wearable Diagnostics</Text>
        <View style={styles.card}>
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.inputLabel}>Heart Rate Variability (HRV)</Text>
            <View style={styles.stepperContainer}>
              <TouchableOpacity onPress={() => adjustHrv(-1)} style={styles.stepBtn}>
                <Minus color="#E4E4E7" size={16} />
              </TouchableOpacity>
              <View style={styles.valueBlock}>
                <Text style={styles.stepValue}>{hrv}</Text>
                <Text style={styles.stepUnit}>ms</Text>
              </View>
              <TouchableOpacity onPress={() => adjustHrv(1)} style={styles.stepBtn}>
                <Plus color="#E4E4E7" size={16} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View>
            <Text style={styles.inputLabel}>Measured Sleep Efficiency</Text>
            <View style={styles.stepperContainer}>
              <TouchableOpacity onPress={() => adjustEfficiency(-1)} style={styles.stepBtn}>
                <Minus color="#E4E4E7" size={16} />
              </TouchableOpacity>
              <View style={styles.valueBlock}>
                <Text style={styles.stepValue}>{efficiency}</Text>
                <Text style={styles.stepUnit}>%</Text>
              </View>
              <TouchableOpacity onPress={() => adjustEfficiency(1)} style={styles.stepBtn}>
                <Plus color="#E4E4E7" size={16} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          activeOpacity={0.8} 
          onPress={handleCompute}
          disabled={isComputing}
          style={styles.computeBtn}
        >
          {isComputing ? (
            <ActivityIndicator color="#0B0B0D" />
          ) : (
            <Text style={styles.computeBtnText}>Compute My Recovery</Text>
          )}
        </TouchableOpacity>

      </ScrollView>

      {showSuccess && (
        <Animated.View style={[styles.successOverlay, { opacity: fadeAnim }]}>
          <CheckCircle2 color="#4B82FF" size={54} strokeWidth={1.5} />
          <Text style={styles.successHeadline}>Biometrics Anchored</Text>
          <Text style={styles.successSubline}>Calibrating neural recovery metrics...</Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0D' },
  scrollContent: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 120 },
  header: { marginBottom: 28 },
  kicker: { fontSize: 11, fontWeight: '600', color: '#52525A', textTransform: 'uppercase', letterSpacing: 1.5 },
  title: { fontSize: 32, fontWeight: '700', color: '#FFFFFF', marginTop: 4, letterSpacing: -0.5 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#4B82FF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 12 },
  card: { backgroundColor: '#111115', borderWidth: 1, borderColor: '#1D1D21', borderRadius: 16, padding: 20, marginBottom: 20 },
  inputLabel: { fontSize: 13, color: '#A1A1AA', fontWeight: '500', marginBottom: 10 },
  stepperRow: { flexDirection: 'row', gap: 16 },
  flexHalf: { flex: 1 },
  stepperContainer: { flexDirection: 'row', backgroundColor: '#0B0B0D', borderWidth: 1, borderColor: '#1D1D21', borderRadius: 12, height: 50, alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden' },
  stepBtn: { width: 50, height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#141419' },
  valueBlock: { flexDirection: 'row', alignItems: 'baseline' },
  stepValue: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  stepUnit: { fontSize: 11, color: '#52525A', marginLeft: 4, fontWeight: '600' },
  computeBtn: { backgroundColor: '#4B82FF', height: 54, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  computeBtnText: { color: '#0B0B0D', fontSize: 15, fontWeight: '700' },
  successOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#0B0B0D', zIndex: 999, alignItems: 'center', justifyContent: 'center' },
  successHeadline: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginTop: 20, letterSpacing: -0.2 },
  successSubline: { fontSize: 13, color: '#52525A', marginTop: 6 }
});