import { Tabs } from 'expo-router';
import React from 'react';


import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import Octicons from '@expo/vector-icons/Octicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarShowLabel: false,
        tabBarActiveTintColor: '#1c1c1c',
        tabBarInactiveTintColor: '#a3a2a2',

        
        tabBarStyle: {
          backgroundColor: '#F9F9F9',
          borderTopColor: '#F9F9F9',
          borderTopWidth: 1,

          
          height: 60 + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="plus-circle" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color }) => (
            <Octicons name="gear" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}