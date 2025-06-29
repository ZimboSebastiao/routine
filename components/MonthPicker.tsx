import { mesesCompletos } from '@/utils/months';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { ChevronDown } from 'react-native-feather'; // ou outro ícone

const MonthPicker = () => {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleSelectMonth = (index: number) => {
    setSelectedMonth(index);
    setShowModal(false);
  };

  return (
    <View >
      {/* Input que mostra o mês selecionado */}
	  <View style={styles.goalContainer}>

		<View style={styles.inputContainer}>
			<TextInput
			style={styles.formGoal}
			placeholder="Mês"
			value={selectedMonth !== null ? mesesCompletos[selectedMonth] : ''}
			editable={false}
			/>
			<TouchableOpacity 
			onPress={() => setShowModal(true)}
			style={styles.iconCalendar}
			>
			<ChevronDown width={24} height={24} color="gray" />
			</TouchableOpacity>
		</View>
	  </View>

      {/* Modal com a lista de meses */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContent}>
          <FlatList
            data={mesesCompletos}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={styles.monthItem}
                onPress={() => handleSelectMonth(index)}
              >
                <Text style={styles.monthText}>{item}</Text>
                {selectedMonth === index && (
                  <Text style={styles.selectedIndicator}>✓</Text>
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    maxHeight: '50%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  monthItem: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  monthText: {
    fontSize: 16,
  },
  selectedIndicator: {
    color: '#6200EE',
    fontWeight: 'bold',
  },
  inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		width: "71%",
		borderRadius: 10,
		backgroundColor: '#FFF',
	},
	iconCalendar: {
			width: 0,
			marginLeft: -30,
	},
	formGoal: {
		width: "100%",
		height: 60,
		backgroundColor: 'white',
		fontSize: 18,
		color: '#333',
		marginVertical: 12,
		borderRadius: 10,
	},
	goalContainer: {
		height: 30,
		flexDirection: "row",
		gap: 20,
	}

});

export default MonthPicker;