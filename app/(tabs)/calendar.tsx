import CurrentTime from '@/components/CurrentTime';
import { Weekly } from '@/components/Weekly';
import { getTasks, Task } from '@/utils/storage';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Calendar() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const loadedTasks = await getTasks();
        // console.log('Loaded tasks:', loadedTasks);
        setTasks(loadedTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };
    
    loadTasks();
    
    const interval = setInterval(() => {
      loadTasks();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.titleIconContainer}>
        <Text style={styles.titleContainer}>Calendário</Text>
        <Pressable 
          onPress={() => router.push('/')}
          style={({ pressed }) => [
            styles.iconView,
            {
              transform: [{ scale: pressed ? 0.95 : 1 }],
              opacity: pressed ? 0.8 : 1,
            }
          ]}
        >
          {({ pressed }) => (
            <X 
              size={34} 
              color={pressed ? '#A278C6' : '#000000'}
            />
          )}
        </Pressable>
      </View>

      <View>
        <CurrentTime />
      </View>
      
      <Weekly 
        tasks={tasks} 
        selectedDay={selectedDay} 
        onSelectDay={setSelectedDay} 
      />
    </SafeAreaProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F2EF",
  },
  titleContainer: {
    marginVertical: 60,
    marginBottom: 40,
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  titleIconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "94%",
  },
  iconView: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    backgroundColor: "white",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "white",
  },
});