import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { 
  User, 
  Bell, 
  Lock, 
  Sliders, 
  HelpCircle, 
  ShieldCheck, 
  ChevronRight, 
  LogOut 
} from 'lucide-react-native';
import { useAuth } from '../../../providers/AuthProvider';

export function ProfileScreen() {
  const { user, signOut } = useAuth();

  // Safely fallback user details
  const userFullName = user?.user_metadata?.full_name || 'Nairon Malone Cossa';
  const userEmail = user?.email || 'developer@noctis.tech';

  // Helper component for uniform premium menu rows
  const MenuRow = ({ 
    icon: Icon, 
    title, 
    value, 
    onPress 
  }: { 
    icon: any; 
    title: string; 
    value?: string; 
    onPress?: () => void 
  }) => (
    <TouchableOpacity 
      activeOpacity={0.7} 
      onPress={onPress} 
      style={styles.menuRow}
    >
      <View style={styles.rowLead}>
        <View style={styles.iconWrapper}>
          <Icon color="#A1A1AA" size={16} />
        </View>
        <Text style={styles.rowTitle}>{title}</Text>
      </View>
      <View style={styles.rowTail}>
        {value && <Text style={styles.rowValue}>{value}</Text>}
        <ChevronRight color="#3F3F46" size={16} style={{ marginLeft: 4 }} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Luxury Portrait Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{userFullName.charAt(0)}</Text>
            <View style={styles.tierBadge}>
              <Text style={styles.tierText}>PRO</Text>
            </View>
          </View>
          <Text style={styles.profileName}>{userFullName}</Text>
          <Text style={styles.profileEmail}>{userEmail}</Text>
        </View>

        {/* Account Management Group */}
        <Text style={styles.sectionLabel}>Account Security & Settings</Text>
        <View style={styles.menuGroup}>
          <MenuRow 
            icon={User} 
            title="Personal Identification" 
            value="Identity Verified" 
            onPress={() => console.log('Navigate to identity')}
          />
          <MenuRow 
            icon={Lock} 
            title="Security & Credentials" 
            value="Passkey Active" 
            onPress={() => console.log('Navigate to security')}
          />
          <MenuRow 
            icon={Bell} 
            title="Telemetry Alerts" 
            value="Smart Push" 
            onPress={() => console.log('Navigate to notifications')}
          />
        </View>

        {/* System & Configuration Preferences */}
        <Text style={styles.sectionLabel}>System Preferences</Text>
        <View style={styles.menuGroup}>
          <MenuRow 
            icon={Sliders} 
            title="Biometric Data Targets" 
            value="Metric / Sleep" 
            onPress={() => console.log('Navigate to data targets')}
          />
          <MenuRow 
            icon={ShieldCheck} 
            title="Supabase Sync Ledger" 
            value="Cloud Confirmed" 
            onPress={() => console.log('Navigate to sync records')}
          />
        </View>

        {/* Info & Support Panel */}
        <Text style={styles.sectionLabel}>Resources</Text>
        <View style={styles.menuGroup}>
          <MenuRow 
            icon={HelpCircle} 
            title="Noctis Core Support" 
            onPress={() => console.log('Navigate to support')}
          />
        </View>

        {/* Clean, Premium Sign Out Trigger */}
        <TouchableOpacity 
          activeOpacity={0.7} 
          onPress={() => signOut()} 
          style={styles.signOutButton}
        >
          <LogOut color="#EF4444" size={16} style={{ marginRight: 8 }} />
          <Text style={styles.signOutText}>Terminate Session</Text>
        </TouchableOpacity>

        {/* Monospaced Branding Footer */}
        <Text style={styles.brandingFooter}>Luxury. Silence. Technology. Better tomorrow.</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0D',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 120,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#111115',
    borderWidth: 1,
    borderColor: '#1D1D21',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  avatarText: {
    color: '#4B82FF',
    fontSize: 28,
    fontWeight: '700',
  },
  tierBadge: {
    position: 'absolute',
    bottom: -4,
    backgroundColor: '#4B82FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#0B0B0D',
  },
  tierText: {
    color: '#0B0B0D',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  profileEmail: {
    fontSize: 13,
    color: '#52525A',
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#3F3F46',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 10,
    marginLeft: 4,
  },
  menuGroup: {
    backgroundColor: '#111115',
    borderWidth: 1,
    borderColor: '#1D1D21',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 28,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 54,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1F',
  },
  rowLead: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 28,
    alignItems: 'flex-start',
  },
  rowTitle: {
    fontSize: 14,
    color: '#E4E4E7',
    fontWeight: '500',
  },
  rowTail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowValue: {
    fontSize: 13,
    color: '#52525A',
    fontWeight: '500',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.15)',
    backgroundColor: 'rgba(239, 68, 68, 0.01)',
    marginTop: 12,
  },
  signOutText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  brandingFooter: {
    textAlign: 'center',
    color: '#27272A',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginTop: 48,
    textTransform: 'uppercase',
  }
});