// screens/ResetPasswordScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { supabase } from '../backend/src/lib/supbase.js';

const ResetPasswordScreen = () => {
  const [password, setPassword] = useState('');

  const handleUpdatePassword = async () => {
    const { error } = await supabase.auth.updateUser({ password: password });
    
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "Password updated successfully!");
    }
  };

  return (
    <View>
      <TextInput 
        placeholder="Enter new password" 
        secureTextEntry 
        onChangeText={setPassword} 
      />
      <Button title="Update Password" onPress={handleUpdatePassword} />
    </View>
  );
};

export default ResetPasswordScreen;