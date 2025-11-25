// src/navigation/AppNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// 1. Import Types
import { RootStackParamList, MainTabParamList } from './types'; 

// 2. Import Screens (ensure you create these files!)
import AuthScreen from '../screens/AuthScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CalendarScreen from '../screens/CalendarScreen';
import AddSubjectScreen from '../screens/AddSubjectScreen';
import ProfileScreen from '../screens/ProfileScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const MainTabs = createBottomTabNavigator<MainTabParamList>();

// --- 3. Main Tab Navigator Component ---
// This handles the bottom bar navigation for the authenticated part of the app
const MainTabsNavigator = () => {
  return (
    <MainTabs.Navigator
      initialRouteName="DashboardTab"
      screenOptions={{
        headerShown: false, // Hide header on tabs, we'll use a custom one
        tabBarActiveTintColor: '#007AFF', // Blue color (you can customize this)
      }}
    >
      <MainTabs.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <MainTabs.Screen
        name="CalendarTab"
        component={CalendarScreen}
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" color={color} size={size} />
          ),
        }}
      />
      <MainTabs.Screen
        name="AddSubjectTab"
        component={AddSubjectScreen}
        options={{
          title: 'Add Subject',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" color={color} size={size} />
          ),
        }}
      />
      <MainTabs.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </MainTabs.Navigator>
  );
};

// --- 4. Main Root Stack Navigator Component ---
// This handles the switch between Auth screens and the Main App screens
const AppNavigator = () => {
  return (
    <RootStack.Navigator initialRouteName="MainTabs">
      
      {/* For Week 1, we start on the tabs. We'll add logic to check authentication in Week 2. */}
      <RootStack.Screen
        name="MainTabs"
        component={MainTabsNavigator}
        options={{ headerShown: false }}
      />
      
      {/* Auth screens are usually stacked and don't show the tabs */}
      <RootStack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ headerShown: false }}
      />
      
    </RootStack.Navigator>
  );
};

export default AppNavigator;