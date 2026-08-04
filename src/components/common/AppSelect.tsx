import React, { useState, useRef, useCallback, useMemo, memo, forwardRef, useImperativeHandle } from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { ChevronDown, Search, X, Check } from 'lucide-react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import {
  COLORS,
  FONTS,
  RADIUS,
  SPACING,
  FONT_SIZE,
  ICON_SIZE,
} from '../../constants';
import AppText from './AppText';

export interface AppSelectRef {
  present: () => void;
  dismiss: () => void;
}

interface AppSelectProps {
  label?: string;
  value: string;
  options: string[];
  placeholder: string;
  error?: string;
  onSelect: (item: string) => void;
  searchable?: boolean;
  customSelectorStyle?: ViewStyle;
  hideSelector?: boolean;
}

const AppSelect = memo(
  forwardRef<AppSelectRef, AppSelectProps>(
    (
      {
        label,
        value,
        options,
        placeholder,
        error,
        onSelect,
        searchable = false,
        customSelectorStyle,
        hideSelector = false,
      },
      ref,
    ) => {
      const bottomSheetModalRef = useRef<BottomSheetModal>(null);
      const [searchQuery, setSearchQuery] = useState('');

      const snapPoints = useMemo(() => ['50%', '85%'], []);

      const filteredOptions = useMemo(
        () =>
          options.filter(item =>
            item?.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        [options, searchQuery],
      );

      const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
      }, []);

      const handleDismissModal = useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
        setSearchQuery('');
      }, []);

      useImperativeHandle(
        ref,
        () => ({
          present: handlePresentModalPress,
          dismiss: handleDismissModal,
        }),
        [handlePresentModalPress, handleDismissModal],
      );

      const handleSelect = useCallback(
        (item: string) => {
          onSelect(item);
          handleDismissModal();
        },
        [onSelect, handleDismissModal],
      );

      const renderBackdrop = useCallback(
        (props: any) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.5}
          />
        ),
        [],
      );

      return (
        <View style={hideSelector ? undefined : styles.container}>
          {!hideSelector && label && <AppText style={styles.label}>{label}</AppText>}

          {!hideSelector && (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={handlePresentModalPress}
              style={[
                styles.selector,
                customSelectorStyle,
                error ? styles.errorBorder : null,
              ]}
            >
              <AppText
                style={[styles.valueText, !value && styles.placeholderText]}
                numberOfLines={1}
              >
                {value || placeholder}
              </AppText>
              <ChevronDown size={ICON_SIZE.sm} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}

          {!hideSelector && error && <AppText style={styles.errorText}>{error}</AppText>}

          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            enablePanDownToClose
            handleIndicatorStyle={styles.sheetIndicator}
            backgroundStyle={styles.sheetBackground}
          >
            <BottomSheetView style={styles.modalContent}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <AppText style={styles.modalTitle}>
                  {label || 'Select Option'}
                </AppText>
                <TouchableOpacity
                  onPress={handleDismissModal}
                  style={styles.closeBtn}
                >
                  <X size={ICON_SIZE.sm} color={COLORS.textPrimary} />
                </TouchableOpacity>
              </View>

              {/* Search Bar */}
              {searchable && (
                <View style={styles.searchContainer}>
                  <Search size={ICON_SIZE.xs} color={COLORS.textLight} />
                  <BottomSheetTextInput
                    placeholder="Search..."
                    placeholderTextColor={COLORS.textLight}
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCorrect={false}
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                      <X size={ICON_SIZE.xs} color={COLORS.textLight} />
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* List */}
              <BottomSheetFlatList
                data={filteredOptions}
                keyExtractor={item => item}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => {
                  const isSelected = value === item;
                  return (
                    <TouchableOpacity
                      style={[
                        styles.optionItem,
                        isSelected && styles.selectedOption,
                      ]}
                      onPress={() => handleSelect(item)}
                    >
                      <AppText
                        style={[
                          styles.optionText,
                          isSelected && styles.selectedOptionText,
                        ]}
                      >
                        {item}
                      </AppText>
                      {isSelected && (
                        <Check
                          size={ICON_SIZE.xs}
                          color={COLORS.primary}
                          strokeWidth={3}
                        />
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            </BottomSheetView>
          </BottomSheetModal>
        </View>
      );
    },
  ),
);

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.grey700,
    marginBottom: 4,
    marginLeft: 2,
  },
  selector: {
    height: 46,
    borderWidth: 1,
    borderColor: COLORS.inputBorder || COLORS.border,
    borderRadius: RADIUS.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.white,
    elevation: 1,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  valueText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
    fontFamily: FONTS.medium,
    flex: 1,
  },
  placeholderText: {
    color: COLORS.textLight,
    fontFamily: FONTS.regular,
  },
  errorBorder: {
    borderColor: COLORS.error,
    borderWidth: 1.5,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
    fontFamily: FONTS.medium,
    marginLeft: 4,
  },

  /* Bottom Sheet Styles */
  sheetBackground: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
  },
  sheetIndicator: {
    backgroundColor: COLORS.grey300,
    width: 36,
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  modalTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: SPACING.md,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.grey50,
    borderRadius: RADIUS.sm,
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.grey200,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
    marginLeft: SPACING.xs,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xxxl,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  selectedOption: {
    backgroundColor: 'transparent',
  },
  optionText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
    fontFamily: FONTS.medium,
  },
  selectedOptionText: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
  },
});

export default AppSelect;
