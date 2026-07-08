import { create } from 'zustand';
import { supabase } from '../services/supabase';

interface DailyMetrics {
  id?: string;
  user_id: string;
  hrv_ms: number;
  rhr_bpm: number;
  sleep_minutes: number;
  sleep_efficiency: number;
  recovery_score: number;
  created_at?: string;
}

interface MetricState {
  currentMetrics: DailyMetrics | null;
  historicalMetrics: DailyMetrics[];
  isLoading: boolean;
  error: string | null;
  fetchTodayMetrics: (userId: string) => Promise<void>;
  fetchHistoricalMetrics: (userId: string) => Promise<void>;
  saveDailyMetrics: (userId: string, data: Omit<DailyMetrics, 'user_id' | 'recovery_score'>) => Promise<void>;
}

export const useMetricStore = create<MetricState>((set, get) => ({
  currentMetrics: null,
  historicalMetrics: [],
  isLoading: false,
  error: null,

  fetchTodayMetrics: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('daily_metrics')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', `${today}T00:00:00`)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      set({ currentMetrics: data && data.length > 0 ? data[0] : null });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchHistoricalMetrics: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('daily_metrics')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(7);

      if (error) throw error;
      set({ historicalMetrics: data || [] });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  saveDailyMetrics: async (userId, data) => {
    set({ isLoading: true, error: null });
    try {
      // Production Recovery Calculation Engine (Weighted Index)
      // Sleep Duration (35%), Efficiency (25%), RHR (20%), HRV (20%)
      const sleepScore = Math.min(35, (data.sleep_minutes / 480) * 35);
      const efficiencyScore = Math.min(25, (data.sleep_efficiency / 100) * 25);
      
      // RHR: Lower is better. Optimized benchmark at 50 bpm.
      const rhrScore = data.rhr_bpm > 0 ? Math.max(0, Math.min(20, ((80 - data.rhr_bpm) * 0.5) + 10)) : 12;
      
      // HRV: Higher is better. Optimized benchmark at 80 ms.
      const hrvScore = data.hrv_ms > 0 ? Math.min(20, (data.hrv_ms / 80) * 20) : 12;

      const finalRecoveryScore = Math.round(sleepScore + efficiencyScore + rhrScore + hrvScore);

      const payload = {
        user_id: userId,
        hrv_ms: data.hrv_ms,
        rhr_bpm: data.rhr_bpm,
        sleep_minutes: data.sleep_minutes,
        sleep_efficiency: data.sleep_efficiency,
        recovery_score: finalRecoveryScore,
      };

      // Check if entry for today already exists to perform an upsert or fresh insert
      const today = new Date().toISOString().split('T')[0];
      const { data: existing } = await supabase
        .from('daily_metrics')
        .select('id')
        .eq('user_id', userId)
        .gte('created_at', `${today}T00:00:00`)
        .limit(1);

      let resultError;
      if (existing && existing.length > 0) {
        const { error } = await supabase
          .from('daily_metrics')
          .update(payload)
          .eq('id', existing[0].id);
        resultError = error;
      } else {
        const { error } = await supabase
          .from('daily_metrics')
          .insert([payload]);
        resultError = error;
      }

      if (resultError) throw resultError;
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
}));