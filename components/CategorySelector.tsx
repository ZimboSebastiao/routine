import { Category } from '@/types/category';
import { CATEGORIES } from '@/utils/categoryUtils';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { ChevronDown } from 'react-native-feather';

interface CategorySelectorProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleSelectCategory = (category: Category) => {
    onSelectCategory(category);
    setShowModal(false);
  };

  return (
    <View>
      {/* Input que mostra a categoria selecionada */}
      <TouchableOpacity 
        style={styles.inputContainer}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.selectedCategoryText}>
          {selectedCategory?.name || 'Selecione uma categoria'}
        </Text>
        <ChevronDown width={24} height={24} color="gray" />
      </TouchableOpacity>

      {/* Modal com a lista de categorias */}
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
            data={CATEGORIES}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.categoryItem}
                onPress={() => handleSelectCategory(item)}
              >
                <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
                <Text style={styles.categoryText}>
                  {item.name}
                </Text>
                {selectedCategory?.id === item.id && (
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EEE',
    marginVertical: 8,
  },
  selectedCategoryText: {
    fontSize: 16,
    color: '#333',
  },
  categoryItem: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryText: {
    fontSize: 16,
    flex: 1,
  },
  selectedIndicator: {
    color: '#6200EE',
    fontWeight: 'bold',
  },
});

export default CategorySelector;