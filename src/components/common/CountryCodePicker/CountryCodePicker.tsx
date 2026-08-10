import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Pressable,
} from 'react-native';
import { ChevronDown, Check, X } from 'lucide-react-native';
import { COLORS, FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../constants';
import AppText from '../AppText';

export interface Country {
  code: string;
  name: string;
  flag: string;
  iso: string;
}

export const COUNTRIES: Country[] = [
  { code: '+91', name: 'India', flag: '🇮🇳', iso: 'IN' },
  { code: '+1', name: 'USA', flag: '🇺🇸', iso: 'US' },
  { code: '+44', name: 'UK', flag: '🇬🇧', iso: 'GB' },
  { code: '+61', name: 'Australia', flag: '🇦🇺', iso: 'AU' },
];

interface CountryCodePickerProps {
  selectedCountry?: Country;
  onSelectCountry?: (country: Country) => void;
  showBorder?: boolean;
}

export const CountryCodePicker = ({
  selectedCountry = COUNTRIES[0],
  onSelectCountry,
  showBorder = false,
}: CountryCodePickerProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentCountry, setCurrentCountry] = useState<Country>(selectedCountry);

  const handleSelect = (country: Country) => {
    setCurrentCountry(country);
    onSelectCountry?.(country);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setModalVisible(true)}
        style={[
          styles.triggerBtn,
          showBorder && styles.triggerBorder,
        ]}
      >
        <AppText style={styles.flagText}>{currentCountry.flag}</AppText>
        <AppText style={styles.codeText}>{currentCountry.code}</AppText>
        <ChevronDown size={14} color={COLORS.textSecondary} style={{ marginLeft: 2 }} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <AppText style={styles.modalTitle}>Select Country Code</AppText>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Country List */}
            <FlatList
              data={COUNTRIES}
              keyExtractor={item => item.iso}
              contentContainerStyle={styles.listContainer}
              renderItem={({ item }) => {
                const isSelected = item.code === currentCountry.code && item.iso === currentCountry.iso;
                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[styles.countryRow, isSelected && styles.selectedRow]}
                    onPress={() => handleSelect(item)}
                  >
                    <View style={styles.countryLeft}>
                      <AppText style={styles.modalFlag}>{item.flag}</AppText>
                      <AppText style={styles.countryName}>{item.name}</AppText>
                    </View>

                    <View style={styles.countryRight}>
                      <AppText style={styles.countryCode}>{item.code}</AppText>
                      {isSelected ? (
                        <View style={styles.checkBadge}>
                          <Check size={14} color={COLORS.white} />
                        </View>
                      ) : null}
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  triggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: SPACING.xs,
    height: '100%',
  },
  triggerBorder: {
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    paddingRight: SPACING.sm,
    marginRight: SPACING.xs,
  },
  flagText: {
    fontSize: FONT_SIZE.xl,
    marginRight: SPACING.xs,
  },
  codeText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  modalTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
  },
  listContainer: {
    paddingVertical: SPACING.sm,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.md,
    marginVertical: SPACING.xxs,
  },
  selectedRow: {
    backgroundColor: COLORS.primaryLight,
  },
  countryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalFlag: {
    fontSize: FONT_SIZE.title,
    marginRight: SPACING.sm,
  },
  countryName: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
  },
  countryRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCode: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
    marginRight: SPACING.xs,
  },
  checkBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
});

export default CountryCodePicker;
