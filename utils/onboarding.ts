import AsyncStorage from '@react-native-async-storage/async-storage';


export interface UserOnboardingData {
  name: string;
  onboardingCompleted: boolean;
  completedAt?: string;
}

const ONBOARDING_DATA_KEY = '@user_onboarding_data';


export const saveOnboardingData = async (data: UserOnboardingData): Promise<void> => {
  try {
    if (!data.name?.trim()) {
      throw new Error('Name is required');
    }

    const completeData: UserOnboardingData = {
      ...data,
      onboardingCompleted: true,
      completedAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(ONBOARDING_DATA_KEY, JSON.stringify(completeData));
  } catch (error) {
    console.error('Failed to save onboarding data:', error);
    throw error;
  }
};


export const completeOnboarding = async (name: string): Promise<void> => {
  await saveOnboardingData({
    name,
    onboardingCompleted: true,
  });
};


export const getOnboardingData = async (): Promise<UserOnboardingData | null> => {
  try {
    const data = await AsyncStorage.getItem(ONBOARDING_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to get onboarding data:', error);
    return null;
  }
};


export const isOnboardingComplete = async (): Promise<boolean> => {
  const data = await getOnboardingData();
  return !!data?.onboardingCompleted;
};


export const getUserName = async (): Promise<string | null> => {
  const data = await getOnboardingData();
  return data?.name || null;
};

export const resetOnboarding = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(ONBOARDING_DATA_KEY);
  } catch (error) {
    console.error('Failed to reset onboarding data:', error);
    throw error;
  }
};


export const validateOnboardingData = (data: Partial<UserOnboardingData>): {
  valid: boolean;
  errors: Record<string, string>;
} => {
  const errors: Record<string, string> = {};
  
  if (!data.name?.trim()) {
    errors.name = 'Name is required';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

const getDefaultOnboardingData = (): UserOnboardingData => ({
  name: '',
  onboardingCompleted: false,
});

export const getCompleteOnboardingData = async (): Promise<UserOnboardingData> => {
  const data = await getOnboardingData();
  return data || getDefaultOnboardingData();
};