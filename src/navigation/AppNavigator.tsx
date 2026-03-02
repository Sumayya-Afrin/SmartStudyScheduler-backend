import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, View } from 'react-native';
import { getToken } from '../utils/storage'; 

// Import Types and Screens
import { RootStackParamList, MainTabParamList } from './types'; 
import AuthScreen from '../screens/AuthScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CalendarScreen from '../screens/CalendarScreen';
import AddSubjectScreen from '../screens/AddSubjectScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import LandingScreen from '../screens/LandingScreen';

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
        const token = await getToken();
        setIsAuthenticated(!!token);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    // If not authenticated, we start at 'Landing' instead of 'Auth'
    <RootStack.Navigator initialRouteName={isAuthenticated ? "MainTabs" : "Landing"}>
      <RootStack.Screen name="MainTabs" component={MainTabsNavigator} options={{ headerShown: false }} />
      <RootStack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="Auth" component={AuthScreen} options={{ title: 'Sign In' }} />
      <RootStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Reset Password' }} />
      <RootStack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ title: 'Update Password' }} />
    </RootStack.Navigator>
  );
};

export default AppNavigator;