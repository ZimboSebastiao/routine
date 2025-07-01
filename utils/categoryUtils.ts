// utils/categoryUtils.ts
import { Category } from '@/types/category';
// import { ImageSourcePropType } from 'expo-image';

// Defina os requires das imagens
const imageSources = {
  finance: require('@/assets/images/finance.jpg'),
  wellness: require('@/assets/images/wellness.jpg'),
  mentalHealth: require('@/assets/images/mental-health.jpg'),
  notes: require('@/assets/images/notes.jpg'),
  focus: require('@/assets/images/focus.jpg'),
  goal: require('@/assets/images/goal.jpg'),
  task: require('@/assets/images/task.jpg'),
  project: require('@/assets/images/project.jpg'),
  review: require('@/assets/images/review.jpg'),
  planning: require('@/assets/images/planning.jpg'),
  habits: require('@/assets/images/habits.jpg'),
};

export const CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Tarefas',
    icon: imageSources.task,
    color: '#FF7617',
  },
  {
    id: '2',
    name: 'Projetos',
    icon: imageSources.project,
    color: '#8A2BE2',
  },
  {
    id: '3',
    name: 'Objetivos',
    icon: imageSources.goal,
    color: '#32CD32',
  },
  {
    id: '4',
    name: 'Financeiro',
    icon: imageSources.finance,
    color: '#FFD700',
  },
  {
    id: '5',
    name: 'Medicação',
    icon: imageSources.wellness,
    color: '#00BFFF',
  },
  {
    id: '6',
    name: 'Saúde Mental',
    icon: imageSources.mentalHealth,
    color: '#FF69B4',
  },
  {
    id: '7',
    name: 'Estudos',
    icon: imageSources.planning,
    color: '#4682B4',
  },
  {
    id: '8',
    name: 'Revisão',
    icon: imageSources.review,
    color: '#A0522D',
  },
  {
    id: '9',
    name: 'Notas',
    icon: imageSources.notes,
    color: '#808080',
  },
  {
    id: '10',
    name: 'Foco',
    icon: imageSources.focus,
    color: '#FF4500',
  },
  {
    id: '11',
    name: 'Hábitos',
    icon: imageSources.habits,
    color: '#6A5ACD',
  },
];


export const getCategoryById = (id: string): Category | undefined => {
  return CATEGORIES.find(category => category.id === id);
};

export const searchCategories = (term: string): Category[] => {
  return CATEGORIES.filter(category => 
    category.name.toLowerCase().includes(term.toLowerCase())
  );
};