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
import { CheckCircle2, Moon } from 'lucide-react-native';
import { useAuth } from '../../../providers/AuthProvider';
import { supabase } from '../../../services/supabase';

interface HabitTag {
  id: string;
  label: string;
  category: 'diet' | 'activity' | 'mindset';
}

export function JournalScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const tags: HabitTag[] = [
    { id: 'caffeine_late', label: 'Late Caffeine', category: 'diet' },
    { id: 'alcohol', label: 'Alcohol', category: 'diet' },
    { id: 'late_meal', label: 'Heavy Late Meal', category: 'diet' },
    { id: 'hydration', label: 'Optimal Hydration', category: 'diet' },
    
    { id: 'intense_training', label: 'Intense Training', category: 'activity' },
    { id: 'active_recovery', label: 'Active Recovery', category: 'activity' },
    { id: 'wind_down', label: 'Mobility / Wind-down', category: 'activity' },
    
    { id: 'breathwork', label: 'Breathwork / Med', category: 'mindset' },
    { id: 'high_stress', label: 'High Mental Stress', category: 'mindset' },
    { id: 'screen_late', label: 'Screens > 10 PM', category: 'mindset' },
    { id: 'blue_blockers', label: 'Blue Light Blockers', category: 'mindset' },
  ];

  const handleToggleTag = (id: string) => {
    setSelectedHabits(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleCompleteLog = async () => {
    if (!user?.id) return;
    setIsSaving(true);

    try {
      const todayIso = new Date().toISOString().split('T')[0];
      
      await supabase.from('daily_journals').upsert({
        user_id: user.id,
        date: todayIso,
        habits: selectedHabits,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,date' });

      setIsSaving(false);
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
      console.error('Journal entry tracking fault:', err);
      setIsSaving(false);
    }
  };

  const renderSection = (category: 'diet' | 'activity' | 'mindset', title: string) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.tagGrid}>
        {tags.filter(t => t.category === category).map((tag) => {
          const isSelected = selectedHabits.includes(tag.id);
          return (
            <TouchableOpacity
              key={tag.id}
              activeOpacity={0.7}
              onPress={() => handleToggleTag(tag.id)}
              style={[
                styles.tagElement,
                isSelected && styles.tagElementSelected
              ]}
            >
              <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>
                {tag.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Daily Log</Text>
            <Text style={styles.subtitle}>Track variables impacting tonight's recovery</Text>
          </View>
          <Moon color="#4B82FF" size={22} />
        </View>

        {renderSection('diet', 'Diet & Stimulants')}
        {renderSection('activity', 'Activity & Strain')}
        {renderSection('mindset', 'Mindset & Environment')}

        <TouchableOpacity 
          activeOpacity={0.8} 
          onPress={handleCompleteLog}
          disabled={isSaving}
          style={styles.completeBtn}
        >
          {isSaving ? (
            <ActivityIndicator color="#0B0B0D" />
          ) : (
            <Text style={styles.completeBtnText}>Complete Entry</Text>
          )}
        </TouchableOpacity>

      </ScrollView>

      {showSuccess && (
        <Animated.View style={[styles.successOverlay, { opacity: fadeAnim }]}>
          <CheckCircle2 color="#22C55E" size={54} strokeWidth={1.5} />
          <Text style={styles.successHeadline}>Timeline Logged</Text>
          <Text style={styles.successSubline}>Lifestyle matrices pushed to the ledger node.</Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0D' },
  scrollContent: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 120 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 },
  title: { fontSize: 32, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: '#52525A', marginTop: 4, fontWeight: '500' },
  sectionContainer: { marginBottom: 28 },
  sectionTitle: { fontSize: 10, fontWeight: '700', color: '#3F3F46', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 14 },
  tagGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tagElement: { backgroundColor: '#111115', borderWidth: 1, borderColor: '#1D1D21', paddingHorizontal: 16, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  tagElementSelected: { borderColor: '#4B82FF', backgroundColor: 'rgba(75, 130, 255, 0.04)' },
  tagText: { color: '#A1A1AA', fontSize: 13, fontWeight: '500' },
  tagTextSelected: { color: '#4B82FF', fontWeight: '600' },
  completeBtn: { backgroundColor: '#FFFFFF', height: 54, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  completeBtnText: { color: '#0B0B0D', fontSize: 15, fontWeight: '700' },
  successOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#0B0B0D', zIndex: 999, alignItems: 'center', justifyContent: 'center' },
  successHeadline: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginTop: 20, letterSpacing: -0.2 },
  successSubline: { fontSize: 13, color: '#52525A', marginTop: 6 }
});