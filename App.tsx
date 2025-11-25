// App.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator'; // Import the file you create in step A

export default function App() {
  // For now, we'll just render the main navigator inside the NavigationContainer
  // This will manage the app's overall navigation state.
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}