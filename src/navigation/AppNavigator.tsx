import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { ActivityIndicator, View } from 'react-native'; // Import these
import { getToken } from '../utils/storage'; // Import your utility

// Import Types and Screens
import { RootStackParamList, MainTabParamList } from './types'; 
import AuthScreen from '../screens/AuthScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CalendarScreen from '../screens/CalendarScreen';
import AddSubjectScreen from '../screens/AddSubjectScreen';
import ProfileScreen from '../screens/ProfileScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const MainTabs = createBottomTabNavigator<MainTabParamList>();

const MainTabsNavigator = () => {
  return (
    <MainTabs.Navigator
      initialRouteName="DashboardTab"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
      }}
    >
      <MainTabs.Screen name="DashboardTab" component={DashboardScreen} options={{ title: 'Dashboard', tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} /> }} />
      <MainTabs.Screen name="CalendarTab" component={CalendarScreen} options={{ title: 'Calendar', tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" color={color} size={size} /> }} />
      <MainTabs.Screen name="AddSubjectTab" component={AddSubjectScreen} options={{ title: 'Add Subject', tabBarIcon: ({ color, size }) => <Ionicons name="add-circle-outline" color={color} size={size} /> }} />
      <MainTabs.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} /> }} />
    </MainTabs.Navigator>
  );
};



const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken(); // Now works on Web AND Mobile
        setIsAuthenticated(!!token);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);
  
  // ... rest of your navigator

  // While we are checking storage, return nothing (or a splash screen)
// ... inside AppNavigator component
  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <RootStack.Navigator initialRouteName={isAuthenticated ? "MainTabs" : "Auth"}>
      <RootStack.Screen name="MainTabs" component={MainTabsNavigator} options={{ headerShown: false }} />
      <RootStack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
    </RootStack.Navigator>
  );
};

export default AppNavigator;