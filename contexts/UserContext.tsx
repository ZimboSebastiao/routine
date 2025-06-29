import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface UserContextType {
  avatarUri: string | null;
  setAvatarUri: (uri: string | null) => Promise<void>;
  userName: string;
}

const UserContext = createContext<UserContextType>({
  avatarUri: null,
  setAvatarUri: async () => {},
  userName: 'Zimbo Sebastiao',
});

export const UserProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [avatarUri, setAvatarUriState] = useState<string | null>(null);
  const userName = 'Zimbo Sebastiao';

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

  // Função para atualizar tanto o estado quanto o AsyncStorage
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