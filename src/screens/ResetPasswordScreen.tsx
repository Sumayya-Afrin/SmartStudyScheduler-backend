// screens/ResetPasswordScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import api from '../services/api';

const ResetPasswordScreen = () => {
  const [password, setPassword] = useState('');

  const handleUpdate = async () => {
    try {
      await api.post('/auth/update-password', { password });
      Alert.alert("Success", "Password updated!");
    } catch (error) {
      Alert.alert("Error", "Failed to update password.");
    }
  };

  return (
    <View>
      <TextInput placeholder="New Password" secureTextEntry onChangeText={setPassword} />
      <Button title="Update Password" onPress={handleUpdate} />
    </View>
  );
};

export default ResetPasswordScreen;