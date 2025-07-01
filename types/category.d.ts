import { ImageSourcePropType } from 'expo-image';

declare type Category = {
  id: string;
  name: string;
  icon?: ImageSourcePropType;
  color: string;
};