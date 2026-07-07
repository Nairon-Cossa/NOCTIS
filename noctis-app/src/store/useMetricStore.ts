import { create } from 'zustand';
import { supabase } from '../services/supabase';

export interface DailyMetric {
  id?: string;
  hrv_ms: number;
  rhr_bpm: number;
  sleep_minutes: number;
  sleep_efficiency: number;
  recovery_score: number;
  logged_date?: string;
}

interface MetricState {
  currentMetrics: DailyMetric | null;
  isLoading: boolean;
  fetchTodayMetrics: (userId: string) => Promise<void>;
  saveDailyMetrics: (userId: string, data: Omit<DailyMetric, 'recovery_score'>) => Promise<void>;
}

// Algorithmic processing engine to weigh biometric variances against arbitrary baseline targets
function calculateRecovery(hrv: number, rhr: number, duration: number, efficiency: number): number {
  // Baseline targets: HRV: 80ms, RHR: 50bpm, Duration: 480 mins (8 hours), Efficiency: 90%
  const hrvScore = Math.min((hrv / 80) * 100, 100);
  const rhrScore = Math.max(0, Math.min(((100 - rhr) / (100 - 50)) * 100, 100));
  const durationScore = Math.min((duration / 480) * 100, 100);
  const efficiencyScore = Math.min((efficiency / 90) * 100, 100);

  // Weighted composition allocation
  const finalScore = (hrvScore * 0.30) + (rhrScore * 0.20) + (durationScore * 0.30) + (efficiencyScore * 0.20);
  return Math.round(Math.max(0, Math.min(finalScore, 100)));
}

export const useMetricStore = create<MetricState>((set) => ({
  currentMetrics: null,
  isLoading: false,

  fetchTodayMetrics: async (userId) => {
    set({ isLoading: true });
    const todayStr = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('daily_metrics')
      .select('*')
      .eq('user_id', userId)
      .eq('logged_date', todayStr)
      .maybeSingle();

    if (!error && data) {
      set({ currentMetrics: data, isLoading: false });
    } else {
      set({ currentMetrics: null, isLoading: false });
    }
  },

  saveDailyMetrics: async (userId, data) => {
    set({ isLoading: true });
    const todayStr = new Date().toISOString().split('T')[0];
    const computedScore = calculateRecovery(data.hrv_ms, data.rhr_bpm, data.sleep_minutes, data.sleep_efficiency);

    const payload = {
      user_id: userId,
      logged_date: todayStr,
      ...data,
      recovery_score: computedScore,
    };

    const { error } = await supabase
      .from('daily_metrics')
      .upsert(payload, { onConflict: 'user_id,logged_date' });

    if (error) {
      set({ isLoading: false });
      throw error;
    }

    set({ currentMetrics: payload as DailyMetric, isLoading: false });
  },
}));