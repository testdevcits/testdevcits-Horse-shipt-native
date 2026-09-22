import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { COLORS } from '../../../constants';
import AppText from '../AppText';
import AppIcon from '../../app_icon/AppIcon';
import styles from './styles.CountryCodePIcker';

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
  const [currentCountry, setCurrentCountry] =
    useState<Country>(selectedCountry);

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
        style={[styles.triggerBtn, showBorder && styles.triggerBorder]}
      >
        <AppText style={styles.flagText}>{currentCountry?.flag}</AppText>
        <AppText style={styles.codeText}>{currentCountry?.code}</AppText>
        <AppIcon
          name={'ChevronDown'}
          size={14}
          color={COLORS.textSecondary}
          style={{ marginLeft: 2 }}
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setModalVisible(false)}
        >
          <Pressable
            style={styles.modalContent}
            onPress={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <AppText style={styles.modalTitle}>Select Country Code</AppText>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <AppIcon name={'X'} size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Country List */}
            <FlatList
              data={COUNTRIES}
              keyExtractor={item => item?.iso}
              contentContainerStyle={styles.listContainer}
              renderItem={({ item }) => {
                const isSelected =
                  item?.code === currentCountry?.code &&
                  item?.iso === currentCountry?.iso;
                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[
                      styles.countryRow,
                      isSelected && styles.selectedRow,
                    ]}
                    onPress={() => handleSelect(item)}
                  >
                    <View style={styles.countryLeft}>
                      <AppText style={styles.modalFlag}>{item?.flag}</AppText>
                      <AppText style={styles.countryName}>{item?.name}</AppText>
                    </View>

                    <View style={styles.countryRight}>
                      <AppText style={styles.countryCode}>{item?.code}</AppText>
                      {isSelected ? (
                        <View style={styles.checkBadge}>
                          <AppIcon
                            name={'Check'}
                            size={14}
                            color={COLORS.white}
                          />
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

export default CountryCodePicker;
