import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { BarChart3, TrendingUp, Calendar, Zap, Moon } from 'lucide-react-native';
import { supabase } from '../../../services/supabase';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface MetricDay {
  date: string; // YYYY-MM-DD
  dayLabel: string;
  score: number;
  sleepMinutes: number;
}

export function InsightsScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState<MetricDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<MetricDay | null>(null);
  const [averages, setAverages] = useState({ avgScore: 0, avgSleep: '0h00' });

  // Generate localized date strings for the past 7 days (as calendar comparison buckets)
  const getLast7DaysLabels = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      
      const tzoffset = d.getTimezoneOffset() * 60000;
      const localISO = new Date(d.getTime() - tzoffset).toISOString().split('T')[0];
      
      result.push({
        date: localISO,
        dayLabel: days[d.getDay()],
      });
    }
    return result;
  };

  useEffect(() => {
    async function fetchHistoricalTrends() {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const dateRange = getLast7DaysLabels();
        const startDate = dateRange[0].date;
        const endDate = dateRange[dateRange.length - 1].date;

        // Query using the native 'created_at' timestamp column instead of 'date'
        const { data, error } = await supabase
          .from('daily_metrics')
          .select('created_at, recovery_score, sleep_minutes')
          .eq('user_id', user.id)
          .gte('created_at', `${startDate}T00:00:00.000Z`)
          .lte('created_at', `${endDate}T23:59:59.999Z`)
          .order('created_at', { ascending: true });

        if (error) throw error;

        let totalScore = 0;
        let totalSleep = 0;
        let loggedDaysCount = 0;

        // Map timestamp-based records safely against our local calendar day buckets
        const compiledWeek: MetricDay[] = dateRange.map((bucket) => {
          const matchingMatch = data?.find((row) => {
            if (!row.created_at) return false;
            // Extract just the YYYY-MM-DD portion from the ISO timestamp string
            const rowDateStr = row.created_at.split('T')[0];
            return rowDateStr === bucket.date;
          });

          const score = matchingMatch?.recovery_score ?? 0;
          const sleepMinutes = matchingMatch?.sleep_minutes ?? 0;

          if (score > 0) {
            totalScore += score;
            totalSleep += sleepMinutes;
            loggedDaysCount++;
          }

          return {
            date: bucket.date,
            dayLabel: bucket.dayLabel,
            score,
            sleepMinutes
          };
        });

        setWeeklyData(compiledWeek);
        setSelectedDay(compiledWeek[compiledWeek.length - 1]);

        if (loggedDaysCount > 0) {
          const rawAvgSleep = Math.round(totalSleep / loggedDaysCount);
          const hrs = Math.floor(rawAvgSleep / 60);
          const mins = rawAvgSleep % 60;
          
          setAverages({
            avgScore: Math.round(totalScore / loggedDaysCount),
            avgSleep: `${hrs}h${mins.toString().padStart(2, '0')}`
          });
        }

      } catch (err) {
        console.error('Error compiling analytics engine:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHistoricalTrends();
  }, []);

  const formatSleepTime = (totalMinutes: number) => {
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hrs}h${mins.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B82FF" />
        <Text style={styles.loadingText}>Compiling visual matrix...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Insights</Text>
          <Text style={styles.subtitle}>Historical autonomic nervous system trends</Text>
        </View>
        <BarChart3 color="#4B82FF" size={24} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.chartCard}>
          <View style={styles.chartHeaderRow}>
            <View>
              <Text style={styles.chartTitle}>7-Day Recovery Mapping</Text>
              <Text style={styles.chartSub}>Tap specific nodes to break down vectors</Text>
            </View>
            <Calendar color="#52525A" size={16} />
          </View>

          <View style={styles.chartVisualWrapper}>
            <View style={styles.chartYAxis}>
              <Text style={styles.axisText}>100</Text>
              <Text style={styles.axisText}>50</Text>
              <Text style={styles.axisText}>0</Text>
            </View>

            <View style={styles.barsContainer}>
              {weeklyData.map((item, index) => {
                const isFocused = selectedDay?.date === item.date;
                const barHeight = item.score > 0 ? `${item.score}%` : '4%'; 
                
                let barColor = '#1D1D21';
                if (item.score >= 85) barColor = '#22C55E';
                else if (item.score >= 70) barColor = '#4B82FF';
                else if (item.score >= 50) barColor = '#F59E0B';
                else if (item.score > 0) barColor = '#EF4444';

                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.9}
                    onPress={() => setSelectedDay(item)}
                    style={styles.barColumn}
                  >
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.barFill,
                          ({
                            height: barHeight,
                            backgroundColor: barColor,
                            opacity: isFocused ? 1 : 0.5,
                          } as any),
                        ]}
                      />
                    </View>
                    <Text style={[styles.barLabel, isFocused && styles.barLabelActive]}>
                      {item.dayLabel}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {selectedDay && (
          <View style={styles.inspectorCard}>
            <Text style={styles.inspectorDate}>
              Metric Resolution • {selectedDay.date}
            </Text>
            <View style={styles.inspectorGrid}>
              <View style={styles.inspectorItem}>
                <Text style={styles.inspectorLabel}>Recovery Score</Text>
                <Text style={[
                  styles.inspectorValue, 
                  { color: selectedDay.score >= 70 ? '#4B82FF' : '#A1A1AA' }
                ]}>
                  {selectedDay.score > 0 ? selectedDay.score : '--'}
                </Text>
              </View>
              <View style={styles.inspectorItem}>
                <Text style={styles.inspectorLabel}>Sleep Tracked</Text>
                <Text style={styles.inspectorValue}>
                  {selectedDay.sleepMinutes > 0 ? formatSleepTime(selectedDay.sleepMinutes) : '--'}
                </Text>
              </View>
            </View>
          </View>
        )}

        <Text style={styles.sectionHeader}>Rolling Averages</Text>

        <View style={styles.gridRow}>
          <View style={styles.metricSquare}>
            <View style={styles.squareHeader}>
              <Zap color="#4B82FF" size={16} />
              <Text style={styles.squareTitle}>Avg Recovery</Text>
            </View>
            <Text style={styles.squareMetric}>{averages.avgScore}%</Text>
            <Text style={styles.squareStatus}>
              {averages.avgScore >= 70 ? 'Optimal System Load' : 'Accumulating Strain'}
            </Text>
          </View>

          <View style={styles.metricSquare}>
            <View style={styles.squareHeader}>
              <Moon color="#22C55E" size={16} />
              <Text style={styles.squareTitle}>Avg Sleep</Text>
            </View>
            <Text style={styles.squareMetric}>{averages.avgSleep}</Text>
            <Text style={styles.squareStatus}>Duration Baseline</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0D',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0B0B0D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#52525A',
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1D1D21',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#52525A',
    marginTop: 4,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 120,
  },
  chartCard: {
    backgroundColor: '#111115',
    borderWidth: 1,
    borderColor: '#1D1D21',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  chartHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E4E4E7',
  },
  chartSub: {
    fontSize: 12,
    color: '#52525A',
    marginTop: 2,
  },
  chartVisualWrapper: {
    flexDirection: 'row',
    height: 160,
    alignItems: 'stretch',
  },
  chartYAxis: {
    justifyContent: 'space-between',
    paddingRight: 12,
    paddingBottom: 24, 
  },
  axisText: {
    fontSize: 10,
    color: '#3F3F46',
    fontWeight: '600',
    textAlign: 'right',
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  barTrack: {
    flex: 1,
    width: 14,
    backgroundColor: '#1A1A1F',
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 8,
  },
  barLabel: {
    fontSize: 11,
    color: '#52525A',
    fontWeight: '500',
    marginTop: 8,
  },
  barLabelActive: {
    color: '#4B82FF',
    fontWeight: '700',
  },
  inspectorCard: {
    backgroundColor: '#0E0E12',
    borderWidth: 1,
    borderColor: '#1A1A20',
    borderRadius: 12,
    padding: 16,
    marginBottom: 28,
  },
  inspectorDate: {
    fontSize: 11,
    fontWeight: '600',
    color: '#52525A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  inspectorGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inspectorItem: {
    flex: 1,
  },
  inspectorLabel: {
    fontSize: 12,
    color: '#A1A1AA',
  },
  inspectorValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 4,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#52525A',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricSquare: {
    flex: 1,
    backgroundColor: '#111115',
    borderWidth: 1,
    borderColor: '#1D1D21',
    borderRadius: 12,
    padding: 16,
  },
  squareHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  squareTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#A1A1AA',
  },
  squareMetric: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  squareStatus: {
    fontSize: 11,
    color: '#52525A',
    marginTop: 4,
    fontWeight: '500',
  },
});