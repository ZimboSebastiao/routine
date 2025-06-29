import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const diasSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const diasCompletos = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

interface WeeklyFrequencyProps {
  onChange: (diasSelecionados: number[]) => void;
}

const WeeklyFrequency: React.FC<WeeklyFrequencyProps> = ({ onChange }) => {
  const [diasSelecionados, setDiasSelecionados] = useState<number[]>([]);

  useEffect(() => {
    if (diasSelecionados.length === 0) {
      const hoje = new Date().getDay(); 
      toggleDia(hoje);
    }
  }, []);

  useEffect(() => {
    if (diasSelecionados.length > 0) {
      onChange(diasSelecionados);
    }
  }, [diasSelecionados]);

  const toggleDia = (diaIndex: number) => {
    setDiasSelecionados(prev => {
      const novosDias = [...prev];
      const index = novosDias.indexOf(diaIndex);
      
      if (index > -1) {
        if (novosDias.length === 1) {
          Alert.alert('Atenção', 'Selecione pelo menos um dia da semana');
          return novosDias;
        }
        novosDias.splice(index, 1);
      } else {
        novosDias.push(diaIndex);
      }
      
      return novosDias.sort((a, b) => a - b);
    });
  };

  return (
    
      <View style={styles.diasContainer}>
        {diasSemana.map((dia, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.diaButton,
              diasSelecionados.includes(index) && styles.diaSelecionado
            ]}
            onPress={() => toggleDia(index)}
            accessibilityLabel={diasCompletos[index]}
          >
            <Text style={[
              styles.diaText,
              diasSelecionados.includes(index) && styles.diaTextSelecionado
            ]}>
              {dia}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

  );
};

const styles = StyleSheet.create({
  diasContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
	width: "94%"
  },
  diaButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  diaSelecionado: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  diaText: {
    fontSize: 16,
    color: '#333',
  },
  diaTextSelecionado: {
    color: '#FFF',
  },
});

export default WeeklyFrequency;