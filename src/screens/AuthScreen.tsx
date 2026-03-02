import React, { useState } from 'react';
import { 
  View, TextInput, TouchableOpacity, Text, StyleSheet, 
  Alert, ActivityIndicator, KeyboardAvoidingView, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { saveToken } from '../utils/storage';
import api from '../services/api';

const AuthScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
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
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.formCard}>
        {/* Academic branding - simple header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Enter your credentials to continue</Text>
        </View>

        <TextInput 
          style={styles.input}
          placeholder="Email Address" 
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#94A3B8"
        />
        
        <View style={styles.passwordContainer}>
          <TextInput 
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Password" 
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#94A3B8"
          />
          <TouchableOpacity 
            style={styles.eyeIcon} 
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#64748B" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => Alert.alert("Support", "Contact us to reset your password.")}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', padding: 20 },
  formCard: { width: '100%', maxWidth: 400, backgroundColor: '#fff', padding: 40, borderRadius: 24, elevation: 5 },
  header: { marginBottom: 32 },
  title: { fontSize: 32, fontWeight: '800', color: '#1E293B', textAlign: 'center', letterSpacing: -1 },
  subtitle: { fontSize: 16, color: '#64748B', textAlign: 'center', marginTop: 8 },
  input: { backgroundColor: '#F8FAFC', padding: 18, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 16 },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  eyeIcon: { position: 'absolute', right: 16 },
  button: { backgroundColor: '#4F46E5', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  forgotText: { color: '#4F46E5', textAlign: 'center', marginTop: 24, fontSize: 14, fontWeight: '500' }
});

export default AuthScreen;