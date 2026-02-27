import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api'; // Importing our centralized service
import { saveToken } from '../utils/storage';

interface AuthScreenProps {
  navigation: any; 
}

const AuthScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 // Your new utility
// ... other imports

const handleLogin = async () => {
  try {
    const response = await api.post<{ token: string }>('/auth/login', { email, password });
    
    // Use the abstraction instead of SecureStore directly
    await saveToken(response.data.token);
    
    navigation.navigate('MainTabs');
  } catch (error) {
    Alert.alert("Login Failed", "Invalid credentials");
  }
};

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input}
        placeholder="Email" 
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput 
        style={styles.input}
        placeholder="Password" 
        secureTextEntry 
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({ 
  container: { padding: 20, justifyContent: 'center', flex: 1 },
  input: { borderBottomWidth: 1, marginBottom: 20, padding: 8 }
});

export default AuthScreen;