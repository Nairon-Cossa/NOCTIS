import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Activity, BookOpen, BarChart2, User } from 'lucide-react-native';

import { HomeScreen } from '../features/home/screens/HomeScreen';
import { CalibrationScreen } from '../features/routine/screens/CalibrationScreen';
import { JournalScreen } from '../features/journal/screens/JournalScreen';
import { InsightsScreen } from '../features/insights/screens/InsightsScreen';
import { ProfileScreen } from '../features/profile/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0B0B0D',
          borderTopColor: '#1D1D21',
          height: 85,
          paddingBottom: 30,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#4B82FF',
        tabBarInactiveTintColor: '#52525A',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
        }}
      />
      
      <Tab.Screen 
        name="Recovery" 
        component={CalibrationScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Activity color={color} size={size} />
        }}
      />

      <Tab.Screen 
        name="Journal" 
        component={JournalScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} />
        }}
      />
      
      <Tab.Screen 
        name="Insights" 
        component={InsightsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <BarChart2 color={color} size={size} />
        }}
      />
      
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          tabBarLabel: 'Profile'
        }}
      />
    </Tab.Navigator>
  );
}