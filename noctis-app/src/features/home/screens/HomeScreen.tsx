import React, { useEffect, useState } from 'react';
import { View, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Moon, Eye, EyeOff, Activity, AlertCircle, Lightbulb } from 'lucide-react-native';

import { Typography } from '../../../components/ui/Typography';
import { Card } from '../../../components/ui/Card';
import { ProgressRing } from '../../../components/ui/ProgressRing';
import { Colors } from '../../../theme/theme';

import { useAuth } from '../../../providers/AuthProvider';
import { useMetricStore } from '../../../store/useMetricStore';
import { supabase } from '../../../services/supabase';

// Human-friendly translation map for database keys
const HABIT_LABELS: Record<string, string> = {
  caffeine_late: 'Late Caffeine',
  alcohol: 'Alcohol',
  late_meal: 'Heavy Late Meal',
  screen_late: 'Screens > 10 PM',
  high_stress: 'High Mental Stress',
};

export function HomeScreen() {
  const { user } = useAuth();
  const { currentMetrics, fetchTodayMetrics, isLoading: storeLoading } = useMetricStore();
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isBrainAnalyzing, setIsBrainAnalyzing] = useState(false);
  const [computedFocusInsight, setComputedFocusInsight] = useState<string | null>(null);

  // Dynamic Premium Greeting Engine
  const getDynamicGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning,';
    if (hour < 18) return 'Good Afternoon,';
    return 'Good Evening,';
  };

  // The Correlation Brain Execution Loop
  const runCorrelationBrain = async (userId: string) => {
    setIsBrainAnalyzing(true);
    try {
      // 1. Fetch trailing 14 days of physiological metrics
      const { data: metricsData } = await supabase
        .from('daily_metrics')
        .select('created_at, recovery_score')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(14);

      // 2. Fetch trailing 14 days of lifestyle variables
      const { data: journalData } = await supabase
        .from('daily_journals')
        .select('date, habits')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(14);

      if (!metricsData || !journalData || metricsData.length < 3) {
        // Fallback to primary strategic baseline if historical entries are scarce
        setComputedFocusInsight('Go to bed before 22:30 tonight to optimize your tomorrow.');
        return;
      }

      // 3. Normalize dates and group entries together into single-day objects
      const dayMap: Record<string, { score: number; habits: string[] }> = {};

      metricsData.forEach(m => {
        const dateStr = m.created_at.split('T')[0];
        dayMap[dateStr] = { score: m.recovery_score, habits: [] };
      });

      journalData.forEach(j => {
        if (dayMap[j.date]) {
          dayMap[j.date].habits = j.habits || [];
        }
      });

      // 4. Calculate mathematical impacts for tracked bad habits
      const targetHabits = ['caffeine_late', 'alcohol', 'late_meal', 'screen_late', 'high_stress'];
      let baselineScores: number[] = [];
      const habitScoresMap: Record<string, number[]> = {};

      targetHabits.forEach(h => { habitScoresMap[h] = []; });

      Object.values(dayMap).forEach(day => {
        if (day.habits.length === 0) {
          baselineScores.push(day.score);
        } else {
          day.habits.forEach(h => {
            if (habitScoresMap[h]) habitScoresMap[h].push(day.score);
          });
        }
      });

      // Compute general average when clean of primary disruptors
      const avgBaseline = baselineScores.length > 0 
        ? baselineScores.reduce((a, b) => a + b, 0) / baselineScores.length 
        : 70;

      let worstHabit = '';
      let maximumImpactDelta = 0;

      // Identify the worst statistical performance anomaly
      targetHabits.forEach(habit => {
        const scores = habitScoresMap[habit];
        if (scores && scores.length >= 2) {
          const avgWithHabit = scores.reduce((a, b) => a + b, 0) / scores.length;
          const delta = avgBaseline - avgWithHabit;
          
          if (delta > maximumImpactDelta) {
            maximumImpactDelta = delta;
            worstHabit = habit;
          }
        }
      });

      // 5. Output true computed insight card contexts
      if (worstHabit && maximumImpactDelta > 3) {
        const humanName = HABIT_LABELS[worstHabit] || worstHabit;
        setComputedFocusInsight(
          `Your recovery is limited by ${humanName}. It correlates with an average ${Math.round(maximumImpactDelta)}% drop in your system readiness.`
        );
      } else {
        // Secondary data context condition fallback
        setComputedFocusInsight('Hydrate well. Your recovery baseline indicates a well-balanced metabolic timeline.');
      }
    } catch (err) {
      console.error('Correlation Brain Engine Fault:', err);
    } finally {
      setIsBrainAnalyzing(false);
    }
  };

  const syncAllDataPoints = () => {
    if (user?.id) {
      fetchTodayMetrics(user.id);
      runCorrelationBrain(user.id);
    }
  };

  useEffect(() => {
    syncAllDataPoints();
  }, [user?.id]);

  const score = currentMetrics?.recovery_score ?? 0;
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Sir';

  let classification = 'No Data';
  let actionStatement = 'Log your biometrics to calibrate today\'s recovery ring.';
  let ringColor = '#1D1D21';

  if (currentMetrics) {
    if (score >= 85) {
      classification = 'Excellent Recovery';
      actionStatement = "Your system is fully primed. Ideal for peak physical or creative execution.";
      ringColor = '#22C55E';
    } else if (score >= 70) {
      classification = 'Good Recovery';
      actionStatement = "You're ready for a normal day. Avoid compounding extreme stressors.";
      ringColor = '#4B82FF';
    } else if (score >= 50) {
      classification = 'Fair Recovery';
      actionStatement = "Avoid very intense training or deep stress overloads today.";
      ringColor = '#F59E0B';
    } else {
      classification = 'Critical Rest Required';
      actionStatement = "System indicates biological exhaustion. Prioritize down-regulation.";
      ringColor = '#EF4444';
    }
  }

  const formatSleepTime = (totalMinutes: number | undefined) => {
    if (!totalMinutes) return '0h00';
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hrs}h${mins.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0B0D' }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 24, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={storeLoading} onRefresh={syncAllDataPoints} tintColor="#4B82FF" />
        }
      >
        {/* Header Layout */}
        <View className="mb-8">
          <Typography variant="heading" weight="regular" style={{ color: '#A1A1AA', fontSize: 28, lineHeight: 34 }}>
            {getDynamicGreeting()}
          </Typography>
          <Typography variant="heading" weight="bold" style={{ fontSize: 32, lineHeight: 38, marginTop: 2 }}>
            {firstName}
          </Typography>
        </View>

        {/* Master Actionable Score Dial */}
        <Card className="items-center py-8 mb-5 border border-[#1D1D21] bg-[#111115]">
          <ProgressRing progress={currentMetrics ? score : 0} ringColor={ringColor} size={165} strokeWidth={12} />
          
          <Typography variant="title" weight="bold" className="mt-5 text-xl">
            {classification}
          </Typography>
          <Typography variant="small" color="secondary" className="text-center mt-1.5 px-6 text-xs leading-5">
            {actionStatement}
          </Typography>
        </Card>

        {/* The Live Computed Correlation Brain Banner */}
        <View className="mb-6 rounded-xl p-4 border border-[#4B82FF]/20 bg-[#0F172A]">
          <View className="flex-row items-center mb-1">
            <Lightbulb color="#4B82FF" size={14} style={{ marginRight: 6 }} />
            <Typography variant="caption" weight="bold" className="text-[#4B82FF] uppercase tracking-widest">
              Today's Focus
            </Typography>
          </View>
          {isBrainAnalyzing ? (
            <ActivityIndicator size="small" color="#4B82FF" style={{ alignItems: 'flex-start', marginTop: 4 }} />
          ) : (
            <Typography variant="small" weight="medium" className="text-[#E4E4E7] leading-5 mt-1">
              {computedFocusInsight}
            </Typography>
          )}
        </View>

        {/* Clear Actionable Clean Readouts */}
        <Typography variant="small" weight="bold" className="mb-3 uppercase tracking-widest text-[#71717A]">
          Today's Vital Readout
        </Typography>
        
        <View className="gap-y-3">
          {/* Sleep Block */}
          <Card className="p-4 flex-row items-center justify-between bg-[#111115] border border-[#1D1D21]">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-lg bg-[#1A1A24] items-center justify-center mr-3">
                <Moon color="#4B82FF" size={16} />
              </View>
              <Typography variant="small" weight="semibold">Sleep</Typography>
            </View>
            <Typography variant="subtitle" weight="bold" className="text-[#E4E4E7]">
              {currentMetrics ? formatSleepTime(currentMetrics.sleep_minutes) : '--'}
            </Typography>
          </Card>

          {/* Resting HR Block */}
          <Card className="p-4 flex-row items-center justify-between bg-[#111115] border border-[#1D1D21]">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-lg bg-[#241A1A] items-center justify-center mr-3">
                <Heart color="#EF4444" size={16} />
              </View>
              <Typography variant="small" weight="semibold">Resting HR</Typography>
            </View>
            <Typography variant="subtitle" weight="bold" className="text-[#E4E4E7]">
              {currentMetrics?.rhr_bpm ? `${currentMetrics.rhr_bpm} bpm` : 'Not Logged'}
            </Typography>
          </Card>

          {/* Expandable Advanced Telemetry Segment */}
          <TouchableOpacity 
            onPress={() => setShowAdvanced(!showAdvanced)} 
            className="flex-row items-center justify-between py-2 mt-2 px-1"
            activeOpacity={0.7}
          >
            <Typography variant="caption" color="secondary" className="font-semibold tracking-wider uppercase">
              {showAdvanced ? 'Hide Advanced Telemetry' : 'View Advanced Telemetry'}
            </Typography>
            {showAdvanced ? <EyeOff color="#71717A" size={14} /> : <Eye color="#71717A" size={14} />}
          </TouchableOpacity>

          {showAdvanced && (
            <View className="gap-y-3 mt-1">
              {/* HRV Advanced Block */}
              <Card className="p-4 bg-[#0E0E12] border border-[#1A1A20]">
                <View className="flex-row items-center justify-between mb-1">
                  <Typography variant="caption" weight="bold" color="secondary">Heart Rate Variability (HRV)</Typography>
                  <Typography variant="small" weight="bold" className={currentMetrics?.hrv_ms ? "text-[#E4E4E7]" : "text-[#71717A]"}>
                    {currentMetrics?.hrv_ms ? `${currentMetrics.hrv_ms} ms` : 'Not Available'}
                  </Typography>
                </View>
                {!currentMetrics?.hrv_ms && (
                  <Typography variant="caption" style={{ color: '#52525B', fontSize: 11, marginTop: 2 }}>
                    HRV calculation requires a compatible luxury wearable tracker.
                  </Typography>
                )}
              </Card>

              {/* Sleep Efficiency Advanced Block */}
              <Card className="p-4 bg-[#0E0E12] border border-[#1A1A20]">
                <View className="flex-row items-center justify-between mb-1">
                  <Typography variant="caption" weight="bold" color="secondary">Sleep Efficiency</Typography>
                  <Typography variant="small" weight="bold" className={currentMetrics?.sleep_efficiency ? "text-[#E4E4E7]" : "text-[#71717A]"}>
                    {currentMetrics?.sleep_efficiency ? `${currentMetrics.sleep_efficiency}%` : 'Not Available'}
                  </Typography>
                </View>
                {!currentMetrics?.sleep_efficiency && (
                  <Typography variant="caption" style={{ color: '#52525B', fontSize: 11, marginTop: 2 }}>
                    Sleep efficiency parses micro-movements via smartwatch integration.
                  </Typography>
                )}
              </Card>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}