import { getTasks, updateTask } from '@/utils/storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Pressable,
	StyleSheet,
	Text,
	View
} from 'react-native';

export default function TimerScreen() {
  const { taskId } = useLocalSearchParams();
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsActive(false);
    setIsFinishing(false);
    setSeconds(0);
    
    const loadTaskTime = async () => {
      try {
        const tasks = await getTasks();
        const task = tasks.find(t => t.id === taskId);
        
        if (task?.timeSpent) {
          setSeconds(task.timeSpent);
        }
        
        if (task?.completed) {
          setIsFinishing(true);
        }
      } catch (error) {
        console.error('Error loading task:', error);
      }
    };
    
    loadTaskTime();
  }, [taskId]); 
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (isActive && !isFinishing) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isFinishing]);

  const handleToggle = () => {
    if (!isFinishing) {
      setIsActive(!isActive);
    }
  };

  const handleFinish = async () => {
    try {
      setIsFinishing(true);
      setIsActive(false);
      
      await updateTask(taskId as string, { 
        timeSpent: seconds,
        completed: true
      });
      
      router.replace({
        pathname: '/(tabs)/tasks',
        params: { habitId: taskId, refreshed: Date.now() }
      });
    } catch (error) {
      console.error('Error finishing timer:', error);
      setIsFinishing(false);
    }
  };

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>
        {formatTime(seconds)}
      </Text>
      
      <View style={styles.buttonsContainer}>
        <Pressable
          style={[
            styles.button, 
            isActive ? styles.pauseButton : styles.startButton,
            isFinishing && styles.disabledButton
          ]}
          onPress={handleToggle}
          disabled={isFinishing}
        >
          <Text style={styles.buttonText}>
            {isActive ? 'Pausar' : 'Iniciar'}
          </Text>
        </Pressable>
        
        <Pressable
          style={[
            styles.button, 
            styles.finishButton,
            isFinishing && styles.disabledButton
          ]}
          onPress={handleFinish}
          disabled={isFinishing}
        >
          {isFinishing ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Finalizar</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 8,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  pauseButton: {
    backgroundColor: '#FFC107',
  },
  finishButton: {
    backgroundColor: '#F44336',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});