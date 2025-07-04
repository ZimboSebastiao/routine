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
  const [isTaskCompleted, setIsTaskCompleted] = useState(false);
  const router = useRouter();

	useEffect(() => {
	const loadInitialState = async () => {
		try {
		const tasks = await getTasks();
		const task = tasks.find(t => t.id === taskId);
		
		if (task?.completed) {
			setIsFinishing(true);
			setIsTaskCompleted(true);
			setSeconds(task.timeSpent || 0);
		} else {
			setSeconds(task?.timeSpent || 0);
		}
		} catch (error) {
		console.error('Error loading task:', error);
		}
	};

	loadInitialState();
	return () => {
		setIsActive(false);
		setIsFinishing(false);
		setIsTaskCompleted(false);
	};
	}, [taskId]);

	useEffect(() => {
	let interval: ReturnType<typeof setInterval> | null = null;
	
	if (isActive && !isFinishing && !isTaskCompleted) {
		interval = setInterval(() => {
		setSeconds(prev => {
			if (prev >= 86399) return 86400; 
			return prev + 1;
		});
		}, 1000);
	}

	return () => {
		if (interval) clearInterval(interval);
	};
	}, [isActive, isFinishing, isTaskCompleted]);

  const handleToggle = async () => {
    if (!isFinishing) {
      if (!isActive) {
        const tasks = await getTasks();
        const currentTask = tasks.find(t => t.id === taskId);
        
        if (!currentTask?.startTime) {
          await updateTask(taskId as string, {
            startTime: new Date().toISOString()
          });
        }
      }
      setIsActive(!isActive);
    }
  };

	const handleFinish = async () => {
	try {
		setIsFinishing(true);
		setIsActive(false);
		setIsTaskCompleted(true); 

		const finalSeconds = seconds > 0 ? seconds : 1;
		setSeconds(finalSeconds);

		const tasks = await getTasks();
		const currentTask = tasks.find(t => t.id === taskId);
		
		const now = new Date();
		const startTime = currentTask?.startTime || new Date(now.getTime() - finalSeconds * 1000).toISOString();

		console.log('Finishing task:', {
		taskId,
		finalSeconds,
		startTime,
		endTime: now.toISOString()
		});

		await updateTask(taskId as string, {
		timeSpent: finalSeconds,
		completed: true,
		startTime: startTime,
		endTime: now.toISOString()
		});

		setTimeout(() => {
		router.replace({
			pathname: '/(tabs)/tasks',
			params: { habitId: taskId, refreshed: Date.now() }
		});
		}, 300);
	} catch (error) {
		console.error('Error finishing timer:', error);
		setIsFinishing(false);
		setIsTaskCompleted(false);
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
            (isFinishing || seconds === 0) && styles.disabledButton
          ]}
          onPress={handleFinish}
          disabled={isFinishing || seconds === 0}
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