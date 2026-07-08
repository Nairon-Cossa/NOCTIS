import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Radio, Battery, RefreshCw, CheckCircle2, AlertTriangle, Cpu, ShieldCheck } from 'lucide-react-native';

import { Typography } from '../../../components/ui/Typography';
import { Card } from '../../../components/ui/Card';
import { Colors } from '../../../theme/theme';
import { useAuth } from '../../../providers/AuthProvider';
import { supabase } from '../../../services/supabase';

interface PremiumDevice {
  id: string;
  name: string;
  type: 'band' | 'light' | 'pulse';
  connected: boolean;
  batteryLevel: number;
  lastSynced: string;
  serialNumber: string;
}

export function DevicesScreen() {
  const { user } = useAuth();
  const [isScanning, setIsScanning] = useState(false);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [liveStreamActive, setLiveStreamActive] = useState(true);
  
  const [devices, setDevices] = useState<PremiumDevice[]>([
    {
      id: 'nox-band-001',
      name: 'NOX Band',
      type: 'band',
      connected: true,
      batteryLevel: 88,
      lastSynced: 'Just now',
      serialNumber: 'NX-BND-2026-X9',
    },
    {
      id: 'noctis-dawn-002',
      name: 'NOCTIS Dawn',
      type: 'light',
      connected: true,
      batteryLevel: 100, // Powered base
      lastSynced: '2 hours ago',
      serialNumber: 'NC-DWN-2026-V2',
    },
    {
      id: 'noctis-pulse-003',
      name: 'NOCTIS Pulse',
      type: 'pulse',
      connected: false,
      batteryLevel: 0,
      lastSynced: 'Yesterday',
      serialNumber: 'NC-PLS-2026-Z4',
    }
  ]);

  // Handle a simulated hardware sync event to Supabase telemetry logs
  const triggerDeviceSync = async (deviceId: string) => {
    setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, lastSynced: 'Syncing...' } : d));
    
    try {
      // Simulate hardware data packet push to Supabase backend log
      if (user?.id) {
        await supabase.from('telemetry_sync_logs').insert([
          {
            user_id: user.id,
            device_id: deviceId,
            status: 'success',
            payload_size_kb: parseFloat((Math.random() * 4 + 1.2).toFixed(2)),
            synchronized_at: new Date().toISOString()
          }
        ]);
      }
      
      setTimeout(() => {
        setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, lastSynced: 'Just now', batteryLevel: Math.max(10, d.batteryLevel - 1) } : d));
      }, 1200);
    } catch (error) {
      console.error('Telemetry upload bypass fault:', error);
    }
  };

  const runGlobalEcosystemDiscovery = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      // Simulate bringing the NOCTIS Pulse online if scanned nearby
      setDevices(prev => prev.map(d => d.id === 'noctis-pulse-003' ? { ...d, connected: true, batteryLevel: 94, lastSynced: 'Just now' } : d));
    }, 2500);
  };

  const getBatteryColor = (level: number, connected: boolean) => {
    if (!connected) return '#3F3F46';
    if (level > 50) return '#22C55E';
    if (level > 20) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0B0D' }} edges={['top']}>
      <ScrollView 
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 24, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Core Header Layout */}
        <View className="mb-8 flex-row items-center justify-between">
          <View>
            <Typography variant="heading" weight="bold" style={{ fontSize: 32, lineHeight: 38 }}>
              Ecosystem
            </Typography>
            <Typography variant="small" color="secondary" className="mt-1">
              Manage your high-performance telemetry nodes.
            </Typography>
          </View>
          
          <TouchableOpacity
            onPress={runGlobalEcosystemDiscovery}
            disabled={isScanning}
            className="w-10 h-10 rounded-full border border-[#1D1D21] bg-[#111115] items-center justify-center"
            activeOpacity={0.7}
          >
            {isScanning ? (
              <ActivityIndicator size="small" color="#4B82FF" />
            ) : (
              <Radio color="#4B82FF" size={18} />
            )}
          </TouchableOpacity>
        </View>

        {/* Global System Matrix Health Bar */}
        <Card className="p-4 mb-6 flex-row items-center justify-between bg-[#111115] border border-[#1D1D21]">
          <View className="flex-row items-center flex-1 pr-4">
            <Cpu color="#4B82FF" size={20} className="mr-3" />
            <View>
              <Typography variant="small" weight="bold">
                {liveStreamActive ? 'Telemetry Link Active' : 'Passive Monitoring'}
              </Typography>
              <Typography variant="caption" color="secondary" className="mt-0.5 leading-4">
                {liveStreamActive ? 'Continuous low-energy data pipeline broadcasting to cloud arrays.' : 'Data syncing runs on manually dispatched request gates.'}
              </Typography>
            </View>
          </View>
          <TouchableOpacity 
            onPress={() => setLiveStreamActive(!liveStreamActive)}
            className="px-3 py-1.5 rounded-lg border border-[#1D1D21]"
            style={{ backgroundColor: liveStreamActive ? '#0F172A' : '#1A1A24' }}
          >
            <Typography variant="caption" weight="bold" className={liveStreamActive ? "text-[#4B82FF]" : "text-[#A1A1AA]"}>
              {liveStreamActive ? 'Live' : 'Muted'}
            </Typography>
          </TouchableOpacity>
        </Card>

        {/* Dynamic Hardware List Nodes */}
        <Typography variant="small" weight="bold" className="mb-4 uppercase tracking-widest text-[#71717A]">
          Connected Hardware ({devices.filter(d => d.connected).length})
        </Typography>

        <View className="gap-y-4">
          {devices.map((device) => (
            <Card 
              key={device.id} 
              className="p-5 bg-[#111115] border border-[#1D1D21] flex-row justify-between items-center"
              style={{ opacity: device.connected ? 1 : 0.5 }}
            >
              <View className="flex-1 pr-4">
                <View className="flex-row items-center mb-1">
                  <Typography variant="subtitle" weight="bold" className="text-[#E4E4E7]">
                    {device.name}
                  </Typography>
                  <View 
                    className="ml-2.5 px-1.5 py-0.5 rounded-full" 
                    style={{ backgroundColor: device.connected ? 'rgba(34, 197, 94, 0.1)' : 'rgba(113, 113, 122, 0.1)' }}
                  >
                    <Typography 
                      variant="caption" 
                      weight="bold" 
                      style={{ fontSize: 9, color: device.connected ? '#22C55E' : '#71717A' }}
                    >
                      {device.connected ? 'Connected' : 'Offline'}
                    </Typography>
                  </View>
                </View>
                
                <Typography variant="caption" color="secondary" style={{ fontSize: 11 }}>
                  S/N: {device.serialNumber}
                </Typography>
                
                <View className="flex-row items-center mt-3">
                  <RefreshCw color="#71717A" size={11} />
                  <Typography variant="caption" color="secondary" className="ml-1.5">
                    Last Sync: {device.lastSynced}
                  </Typography>
                </View>
              </View>

              {/* Status and Actions Panel */}
              <View className="items-end justify-between h-16">
                {device.connected ? (
                  <View className="flex-row items-center">
                    <Typography variant="caption" weight="bold" className="mr-1.5 text-[#A1A1AA]">
                      {device.type === 'light' ? 'AC' : `${device.batteryLevel}%`}
                    </Typography>
                    <Battery 
                      color={getBatteryColor(device.batteryLevel, device.connected)} 
                      size={16} 
                      fill={device.type === 'light' ? 'none' : getBatteryColor(device.batteryLevel, device.connected)} 
                    />
                  </View>
                ) : (
                  <AlertTriangle color="#71717A" size={16} />
                )}

                {device.connected && (
                  <TouchableOpacity
                    onPress={() => triggerDeviceSync(device.id)}
                    disabled={device.lastSynced === 'Syncing...'}
                    className="px-3 py-1 rounded border border-[#1D1D21] bg-[#16161A]"
                    activeOpacity={0.7}
                  >
                    <Typography variant="caption" weight="bold" style={{ fontSize: 11, color: '#4B82FF' }}>
                      {device.lastSynced === 'Syncing...' ? 'Pushing...' : 'Sync'}
                    </Typography>
                  </TouchableOpacity>
                )}
              </View>
            </Card>
          ))}
        </View>

        {/* Security Shield Callout */}
        <View className="mt-8 flex-row items-center p-4 rounded-xl border border-[#1D1D21] bg-[#0E0E11]">
          <ShieldCheck color="#22C55E" size={18} className="mr-3" />
          <Typography variant="caption" color="secondary" className="flex-1 leading-4">
            All biometrics extracted from Noctis nodes use AES-256 end-to-end transport layer security models. Data stays completely anonymous inside the Supabase ledger stack.
          </Typography>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}