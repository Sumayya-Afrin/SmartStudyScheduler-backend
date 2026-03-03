// navigation/linking.ts
import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from './types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [
    // Works for both local dev and production
    'http://localhost:8081',
    'http://localhost:19006',
    'https://yourdomain.com', // ← replace with your actual domain
  ],

  config: {
    screens: {
      Landing: '',           // → yourdomain.com/
      Auth: 'auth',          // → yourdomain.com/auth
      ForgotPassword: 'forgot-password',   // → yourdomain.com/forgot-password
      ResetPassword: 'reset-password',     // → yourdomain.com/reset-password
      MainTabs: {
        screens: {
          DashboardTab: 'dashboard',       // → yourdomain.com/dashboard
          CalendarTab: 'calendar',         // → yourdomain.com/calendar
          AddSubjectTab: 'add-subject',    // → yourdomain.com/add-subject
          ProfileTab: 'profile',           // → yourdomain.com/profile
        },
      },
    },
  },
};

export default linking;