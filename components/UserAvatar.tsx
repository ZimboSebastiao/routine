import { useUser } from '@/contexts/UserContext';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, useTheme } from 'react-native-paper';

interface UserAvatarProps {
  size?: number;
  defaultColor?: string;
  editable?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  size = 100,
  defaultColor = '#4CAF50',
  editable = true,
}) => {
  const theme = useTheme();
  const { avatarUri, setAvatarUri, userName } = useUser();

  const getInitials = () => {
    const names = userName.split(' ');
    return names
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const pickImage = async () => {
    if (!editable) return;

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos acessar sua galeria para escolher uma foto.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0].uri) {
        setAvatarUri(result.assets[0].uri); // Atualiza o contexto global
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }
  };

  return (
    <TouchableOpacity 
      onPress={pickImage} 
      activeOpacity={0.8}
      disabled={!editable}
    >
      <View style={[styles.container, { width: size + 10, height: size + 10 }]}>
        {avatarUri ? (
          <Avatar.Image 
            size={size} 
            source={{ uri: avatarUri }} 
            style={styles.avatar}
          />
        ) : (
          <Avatar.Text 
            size={size}
            label={getInitials()}
            style={{ backgroundColor: defaultColor }}
            color="#FFFFFF"
          />
        )}
        
        {editable && (
          <View style={styles.editIcon}>
            <MaterialIcons 
              name="edit" 
              size={size * 0.2} 
              color={theme.colors.onPrimary} 
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    backgroundColor: 'transparent',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6200EE',
    borderRadius: 50,
    padding: 6,
  },
});

export default UserAvatar;