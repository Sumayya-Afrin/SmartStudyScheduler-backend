// src/navigation/types.ts

import { NavigatorScreenParams } from '@react-navigation/native';

// --- Main Tab Navigator Types ---
export type MainTabParamList = {
  DashboardTab: undefined;
  CalendarTab: undefined;
  AddSubjectTab: undefined;
  ProfileTab: undefined;
};

// --- Root Stack Navigator Types ---
export type RootStackParamList = {
  // Navigation for the main part of the app (the tabs)
  MainTabs: NavigatorScreenParams<MainTabParamList>; 
  
  // Navigation for the Auth flow (login/register)
  Auth: undefined; 
};