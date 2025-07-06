import { getUserName } from '@/utils/onboarding';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface UserContextType {
  avatarUri: string | null;
  setAvatarUri: (uri: string | null) => Promise<void>;
  userName: string | null;
}

const UserContext = createContext<UserContextType>({
  avatarUri: null,
  setAvatarUri: async () => {},
  userName: null,
});

export const UserProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [avatarUri, setAvatarUriState] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
    useEffect(() => {
    const loadUserName = async () => {
      try {
        const name = await getUserName();
        setUserName(name);
      } catch (error) {
        console.error('Error loading user name:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserName();
  }, []);

  // Carrega a imagem salva ao iniciar
  useEffect(() => {
    const loadAvatar = async () => {
      try {
        const savedUri = await AsyncStorage.getItem('userAvatar');
        if (savedUri) {
          setAvatarUriState(savedUri);
        }
      } catch (error) {
        console.error('Erro ao carregar avatar:', error);
      }
    };

    loadAvatar();
  }, []);


  const setAvatarUri = async (uri: string | null) => {
    try {
      setAvatarUriState(uri);
      if (uri) {
        await AsyncStorage.setItem('userAvatar', uri);
      } else {
        await AsyncStorage.removeItem('userAvatar');
      }
    } catch (error) {
      console.error('Erro ao salvar avatar:', error);
    }
  };

  return (
    <UserContext.Provider value={{ avatarUri, setAvatarUri, userName }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);