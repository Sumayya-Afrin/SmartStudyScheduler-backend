import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { getTasks } from '../services/api'; 
import * as SecureStore from 'expo-secure-store';

type Task = {
  id: string; // UUIDs are strings
  title: string;
  description?: string;
  startTime: string;
};

const DashboardScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          const response = await getTasks(token);
          setTasks(response.data as Task[]);
        }
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>My Study Tasks</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default DashboardScreen;