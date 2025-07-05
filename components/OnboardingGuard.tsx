import { isOnboardingComplete } from '@/utils/onboarding';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const completed = await isOnboardingComplete();
        if (!completed) {
          setNeedsOnboarding(true);
          router.replace('/onboarding');
        }
      } catch (error) {
        console.error('Error checking onboarding:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboarding();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (needsOnboarding) {
    return null; 
  }

  return <>{children}</>;
}