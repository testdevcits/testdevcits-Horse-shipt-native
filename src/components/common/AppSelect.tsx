import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  memo,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Modal,
  FlatList,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

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
import AppIcon from '../AppIcon';

export interface AppSelectRef {
  present: () => void;
  dismiss: () => void;
}

export interface AppSelectOption {
  label: string;
  value: any;
  icon?: string;
  subtitle?: string;
}

export interface AppSelectProps {
  label?: string;
  value?: any;
  options: (string | AppSelectOption)[];
  placeholder?: string;
  error?: string;
  onSelect: (item: any) => void;
  searchable?: boolean;
  customSelectorStyle?: ViewStyle;
  hideSelector?: boolean;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: string;
}

const AppSelect = memo(
  forwardRef<AppSelectRef, AppSelectProps>(
    (
      {
        label,
        value,
        options = [],
        placeholder = 'Select option',
        error,
        onSelect,
        searchable = false,
        customSelectorStyle,
        hideSelector = false,
        required = false,
        disabled = false,
        loading = false,
        leftIcon,
      },
      ref,
    ) => {
      const bottomSheetModalRef = useRef<BottomSheetModal>(null);
      const [searchQuery, setSearchQuery] = useState('');
      const [fallbackVisible, setFallbackVisible] = useState(false);

      const snapPoints = useMemo(() => ['55%', '85%'], []);

      // Normalize options to object format
      const normalizedOptions = useMemo<AppSelectOption[]>(() => {
        return (options || []).map(opt => {
          if (typeof opt === 'string' || typeof opt === 'number') {
            return { label: String(opt), value: opt };
          }
          return opt;
        });
      }, [options]);

      // Find current selected label
      const selectedLabel = useMemo(() => {
        if (value === undefined || value === null || value === '') return '';
        const match = normalizedOptions.find(
          opt => opt.value === value || opt.label === value,
        );
        return match ? match.label : String(value);
      }, [value, normalizedOptions]);

      const filteredOptions = useMemo(() => {
        if (!searchQuery.trim()) return normalizedOptions;
        const query = searchQuery.toLowerCase();
        return normalizedOptions.filter(
          opt =>
            opt.label.toLowerCase().includes(query) ||
            opt.subtitle?.toLowerCase().includes(query),
        );
      }, [normalizedOptions, searchQuery]);

      const handlePresentModalPress = useCallback(() => {
        if (disabled || loading) return;
        try {
          bottomSheetModalRef.current?.present();
        } catch {
          setFallbackVisible(true);
        }
      }, [disabled, loading]);

      const handleDismissModal = useCallback(() => {
        try {
          bottomSheetModalRef.current?.dismiss();
        } catch {}
        setFallbackVisible(false);
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
        (option: AppSelectOption) => {
          onSelect(option.value);
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

      const renderOptionItem = (item: AppSelectOption) => {
        const isSelected = item.value === value || item.label === value;
        return (
          <TouchableOpacity
            key={String(item.value)}
            style={[
              styles.optionItem,
              isSelected && styles.selectedOptionItem,
            ]}
            onPress={() => handleSelect(item)}
            activeOpacity={0.7}
          >
            <View style={styles.optionLeft}>
              {item.icon && (
                <View style={styles.optionIconBox}>
                  <AppIcon name={item.icon as any} size={18} color={COLORS.primary} />
                </View>
              )}
              <View style={styles.optionTextWrap}>
                <AppText
                  style={[
                    styles.optionText,
                    isSelected && styles.selectedOptionText,
                  ]}
                >
                  {item.label}
                </AppText>
                {item.subtitle && (
                  <AppText style={styles.optionSubtitle}>
                    {item.subtitle}
                  </AppText>
                )}
              </View>
            </View>

            {isSelected && (
              <View style={styles.checkBadge}>
                <AppIcon
                  name="Check"
                  size={ICON_SIZE.xs || 14}
                  color={COLORS.primary}
                  strokeWidth={3}
                />
              </View>
            )}
          </TouchableOpacity>
        );
      };

      return (
        <View style={hideSelector ? undefined : styles.container}>
          {!hideSelector && label && (
            <View style={styles.labelRow}>
              <AppText style={styles.label}>{label}</AppText>
              {required && <AppText style={styles.requiredStar}> *</AppText>}
            </View>
          )}

          {!hideSelector && (
            <TouchableOpacity
              activeOpacity={0.65}
              onPress={handlePresentModalPress}
              disabled={disabled || loading}
              style={[
                styles.selector,
                disabled && styles.disabledSelector,
                error ? styles.errorBorder : null,
                customSelectorStyle,
              ]}
            >
              {leftIcon && (
                <AppIcon
                  name={leftIcon as any}
                  size={ICON_SIZE.sm}
                  color={disabled ? COLORS.textLight : COLORS.grey600}
                  style={styles.leftIcon}
                />
              )}
              <AppText
                style={[
                  styles.valueText,
                  !selectedLabel && styles.placeholderText,
                  disabled && styles.disabledText,
                ]}
                numberOfLines={1}
              >
                {selectedLabel || placeholder}
              </AppText>
              <AppIcon
                name="ChevronDown"
                size={ICON_SIZE.sm}
                color={disabled ? COLORS.grey300 : COLORS.textSecondary}
              />
            </TouchableOpacity>
          )}

          {!hideSelector && error && (
            <AppText style={styles.errorText}>{error}</AppText>
          )}

          {/* BottomSheet Modal */}
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            enablePanDownToClose
            handleIndicatorStyle={styles.sheetIndicator}
            backgroundStyle={styles.sheetBackground}
          >
            <View style={styles.modalContent}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <AppText style={styles.modalTitle}>
                  {label || 'Select Option'}
                </AppText>
                <TouchableOpacity
                  onPress={handleDismissModal}
                  style={styles.closeBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <AppIcon
                    name="X"
                    size={ICON_SIZE.sm}
                    color={COLORS.textPrimary}
                  />
                </TouchableOpacity>
              </View>

              {/* Search Bar */}
              {searchable && (
                <View style={styles.searchContainer}>
                  <AppIcon
                    name="Search"
                    size={ICON_SIZE.xs}
                    color={COLORS.textLight}
                  />
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
                      <AppIcon
                        name="X"
                        size={ICON_SIZE.xs}
                        color={COLORS.textLight}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Options List */}
              <BottomSheetFlatList
                data={filteredOptions}
                keyExtractor={(item, index) => `${String(item.value)}-${index}`}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={true}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <AppText style={styles.emptyText}>
                      No options available
                    </AppText>
                  </View>
                }
                renderItem={({ item }) => renderOptionItem(item)}
              />
            </View>
          </BottomSheetModal>

          {/* Fallback RN Modal */}
          {fallbackVisible && (
            <Modal
              visible={fallbackVisible}
              transparent
              animationType="slide"
              onRequestClose={handleDismissModal}
            >
              <TouchableWithoutFeedback onPress={handleDismissModal}>
                <View style={styles.fallbackOverlay} />
              </TouchableWithoutFeedback>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.fallbackSheet}
              >
                <View style={styles.modalHeader}>
                  <AppText style={styles.modalTitle}>
                    {label || 'Select Option'}
                  </AppText>
                  <TouchableOpacity
                    onPress={handleDismissModal}
                    style={styles.closeBtn}
                  >
                    <AppIcon
                      name="X"
                      size={ICON_SIZE.sm}
                      color={COLORS.textPrimary}
                    />
                  </TouchableOpacity>
                </View>

                {searchable && (
                  <View style={styles.searchContainer}>
                    <AppIcon
                      name="Search"
                      size={ICON_SIZE.xs}
                      color={COLORS.textLight}
                    />
                    <TextInput
                      placeholder="Search..."
                      placeholderTextColor={COLORS.textLight}
                      style={styles.searchInput}
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      autoCorrect={false}
                    />
                    {searchQuery.length > 0 && (
                      <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <AppIcon
                          name="X"
                          size={ICON_SIZE.xs}
                          color={COLORS.textLight}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                )}

                <FlatList
                  data={filteredOptions}
                  keyExtractor={(item, index) => `${String(item.value)}-${index}`}
                  contentContainerStyle={styles.listContent}
                  showsVerticalScrollIndicator={true}
                  ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                      <AppText style={styles.emptyText}>
                        No options available
                      </AppText>
                    </View>
                  }
                  renderItem={({ item }) => renderOptionItem(item)}
                />
              </KeyboardAvoidingView>
            </Modal>
          )}
        </View>
      );
    },
  ),
);

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.sm,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    marginLeft: 2,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.grey700,
  },
  requiredStar: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
  },
  selector: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.inputBorder || COLORS.border,
    borderRadius: RADIUS.md,
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
  disabledSelector: {
    backgroundColor: COLORS.grey50,
    borderColor: COLORS.grey200,
  },
  leftIcon: {
    marginRight: SPACING.xs,
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
  disabledText: {
    color: COLORS.grey400,
  },
  errorBorder: {
    borderColor: COLORS.error,
    borderWidth: 1.5,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.xs,
    marginTop: 4,
    fontFamily: FONTS.medium,
    marginLeft: 4,
  },

  /* Bottom Sheet Styles */
  sheetBackground: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
  },
  sheetIndicator: {
    backgroundColor: COLORS.grey300,
    width: 40,
    height: 4,
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
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
    padding: 6,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.grey50,
    borderRadius: RADIUS.md,
    height: 44,
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
    paddingHorizontal: SPACING.lg,
    paddingBottom: 80,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  selectedOptionItem: {
    backgroundColor: COLORS.goldLightBg || '#FEFCE8',
    borderBottomColor: 'transparent',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIconBox: {
    marginRight: SPACING.sm,
  },
  optionTextWrap: {
    flex: 1,
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
  optionSubtitle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    marginTop: 2,
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.goldTintBox || '#FEF9C3',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.xs,
  },
  emptyContainer: {
    paddingVertical: SPACING.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    fontFamily: FONTS.medium,
  },

  /* Fallback Modal Styles */
  fallbackOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  fallbackSheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: '80%',
    paddingBottom: SPACING.xl,
  },
});

export default AppSelect;
