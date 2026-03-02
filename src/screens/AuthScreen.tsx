import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { saveToken } from '../utils/storage';
import api from '../services/api';

const AuthScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await api.post<{ token: string }>('/auth/login', { email, password });
      await saveToken(response.data.token);
      navigation.navigate('MainTabs');
    } catch (error) {
      Alert.alert("Login Failed", "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <View style={styles.formCard}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Enter your credentials to continue</Text>

        <TextInput 
          style={styles.input}
          placeholder="Email Address" 
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#A0A0A0"
        />
        <TextInput 
          style={styles.input}
          placeholder="Password" 
          secureTextEntry 
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#A0A0A0"
        />
        
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  // Added alignItems: 'center' to keep the card centered on Web
  container: { 
    flex: 1, 
    backgroundColor: '#F0F2F5', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  // Added maxWidth to prevent stretching on Desktop
  formCard: { 
    width: '100%',
    maxWidth: 400, 
    backgroundColor: '#fff', 
    padding: 30, 
    borderRadius: 20, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 12, 
    elevation: 8 
  },
  title: { fontSize: 26, fontWeight: '800', color: '#1A1A1A', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 30, textAlign: 'center' },
  input: { 
    backgroundColor: '#F8F9FA', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 16, 
    fontSize: 16, 
    borderWidth: 1.5, 
    borderColor: '#E5E7EB' 
  },
  button: { 
    backgroundColor: '#007AFF', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 10 
  },
  buttonDisabled: { backgroundColor: '#A0CFFF' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});

export default AuthScreen;