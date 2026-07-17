import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
   
  TextInput,
} from 'react-native';
import { ChevronDown, Search, X } from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../constants';
import AppText from './AppText';
 
interface AppSelectProps {
  label: string;
  value: string;
  options: string[];
  placeholder: string;
  error?: string;
  onSelect: (item: string) => void;
  searchable?: boolean;
}

const AppSelect = ({ label, value, options, placeholder, error, onSelect, searchable = false }: AppSelectProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOptions = options.filter(item =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (item: string) => {
    onSelect(item);
    setModalVisible(false);
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      <AppText style={styles.label}>{label}</AppText>
      
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setModalVisible(true)}
        style={[styles.selector, error ? styles.errorBorder : null]}
      >
        <AppText style={[styles.valueText, !value && styles.placeholder]}>
          {value || placeholder}
        </AppText>
        <ChevronDown size={20} color={COLORS.textSecondary} />
      </TouchableOpacity>

      {error ? <AppText style={styles.errorText}>{error}</AppText> : null}

      <Modal animationType="slide" visible={modalVisible} transparent={false}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <AppText style={styles.modalTitle}>{label}</AppText>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <X size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          {searchable && (
            <View style={styles.searchContainer}>
              <Search size={20} color={COLORS.textLight} style={styles.searchIcon} />
              <TextInput
                placeholder="Search..."
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCorrect={false}
              />
            </View>
          )}

          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.optionItem, value === item && styles.selectedOption]}
                onPress={() => handleSelect(item)}
              >
                <AppText style={[styles.optionText, value === item && styles.selectedOptionText]}>
                  {item}
                </AppText>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

export default AppSelect;

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.md },
  label: { fontSize: 14, fontFamily: FONTS.medium, color: COLORS.textPrimary, marginBottom: 8 },
  selector: {
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: RADIUS.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.white,
  },
  valueText: { fontSize: 14, color: COLORS.textPrimary, fontFamily: FONTS.regular },
  placeholder: { color: COLORS.textLight },
  errorBorder: { borderColor: COLORS.error },
  errorText: { color: COLORS.error, fontSize: 12, marginTop: 4 },
  modalContainer: { flex: 1, backgroundColor: COLORS.white },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  modalTitle: { fontSize: 18, fontFamily: FONTS.bold },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: SPACING.lg,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.grey50,
    borderRadius: RADIUS.sm,
    height: 45,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, height: '100%', fontFamily: FONTS.regular },
  listContent: { paddingHorizontal: SPACING.lg },
  optionItem: {
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  selectedOption: { backgroundColor: COLORS.goldLightBg },
  optionText: { fontSize: 16, color: COLORS.textPrimary },
  selectedOptionText: { color: COLORS.goldPrimary, fontFamily: FONTS.bold },
});