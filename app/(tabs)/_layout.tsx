import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { CalendarDays, FileChartPie, House, UserRound } from 'lucide-react-native';

import { HapticTab } from '@/components/HapticTab';
import OnboardingGuard from '@/components/OnboardingGuard';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
	<OnboardingGuard>
		
		<Tabs
		screenOptions={{
			tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint ,
			headerShown: false,
			tabBarButton: HapticTab,
			tabBarBackground: TabBarBackground,
			tabBarStyle: Platform.select({
			ios: {
				position: 'absolute',
			},
			default: {},
			}),
		}}>
		<Tabs.Screen
			name="index"
			options={{
			title: 'Inicial',
			tabBarIcon: ({ color }) => <House  size={28} color={color} />,
			}}
		/>
		<Tabs.Screen
			name="calendar"
			options={{
			title: 'Calendário',
			tabBarIcon: ({ color }) => <CalendarDays size={28}  color={color} />,
			}}
		/>
			<Tabs.Screen
			name="painel"
			options={{
			title: 'Painel',
			tabBarIcon: ({ color }) => <FileChartPie size={28}  color={color} />,
			href: null
			}}
		/>
		<Tabs.Screen
			name="profile"
			options={{
			title: 'Perfil',
			tabBarIcon: ({ color }) => <UserRound size={28}  color={color} />,
			}}
		/>
			<Tabs.Screen
			name="habitslist"
			options={{
			title: 'Hábitos',
			tabBarIcon: ({ color }) => <UserRound size={28}  color={color} />,
			href: null,
			}}
		/>
		<Tabs.Screen
			name="edithabit"
			options={{
			title: 'Editar',
			tabBarIcon: ({ color }) => <UserRound size={28}  color={color} />,
			href: null,
			}}
		/>
		<Tabs.Screen
			name="newhabit"
			options={{
			title: 'Hábito',
			tabBarIcon: ({ color }) => <UserRound size={28}  color={color} />,
			href: null,
			}}
		/>
			<Tabs.Screen
			name="insights"
			options={{
			title: 'Insights',
			tabBarIcon: ({ color }) => <UserRound size={28}  color={color} />,
			href: null
			}}
		/>
		<Tabs.Screen
			name="tasks"
			options={{
			title: 'Tarefas',
			tabBarIcon: ({ color }) => <UserRound size={28}  color={color} />,
			href: null
			}}
		/>
		<Tabs.Screen
			name="timer"
			options={{
			title: 'Temporizador',
			tabBarIcon: ({ color }) => <UserRound size={28}  color={color} />,
			href: null
			}}
		/>
		</Tabs>
	</OnboardingGuard>
  );
}

