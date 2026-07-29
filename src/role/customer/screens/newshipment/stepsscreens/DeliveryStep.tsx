import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MapPin, Calendar as CalendarIcon } from 'lucide-react-native';

import { AppText, AppCalendarModal } from '../../../../../components';
import { COLORS, FONTS, RADIUS, SPACING } from '../../../../../constants';
import LocationPicker from '../../../../../components/common/LocationPicker/LocationPicker';
import { NewShipmentForm } from '../interfaces';

interface DeliveryStepProps {
  form: NewShipmentForm;
  updateForm: (updates: Partial<NewShipmentForm>) => void;
  onNext: () => void;
  onPrevious: () => void;
  errors: any;
}

const DeliveryStep: React.FC<DeliveryStepProps> = ({
  form,
  updateForm,
  onNext,
  onPrevious,
  errors,
}) => {
  const [activeDateType, setActiveDateType] = useState<'start' | 'end' | null>(
    null,
  );

  const formatDate = (date: any) => {
    if (!date) return 'Select Date';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Select Date';
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${d.getFullYear()}`;
  };

  const getSafeDateStr = (dateVal: any) => {
    try {
      const d = new Date(dateVal);
      if (!isNaN(d.getTime())) {
        return d.toISOString().split('T')[0];
      }
    } catch (e) {}
    return new Date().toISOString().split('T')[0];
  };

  const handleOpenStart = useCallback(() => setActiveDateType('start'), []);
  const handleOpenEnd = useCallback(() => setActiveDateType('end'), []);
  const handleCloseCalendar = useCallback(() => setActiveDateType(null), []);

  const handleDateSelect = useCallback(
    (date: Date) => {
      if (activeDateType === 'start') {
        updateForm({ deliveryStartDate: date });
      } else {
        updateForm({ deliveryEndDate: date });
      }
      setActiveDateType(null);
    },
    [activeDateType, updateForm],
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER */}
        <View style={styles.titleRow}>
          <AppText style={styles.mainTitle}>New Shipment</AppText>
          <TouchableOpacity onPress={onPrevious}>
            <AppText style={styles.cancelText}>Back</AppText>
          </TouchableOpacity>
        </View>

        {/* INSTRUCTION */}
        <View style={styles.instructionCard}>
          <View style={styles.iconBox}>
            <MapPin size={24} color={COLORS.primary} />
          </View>
          <View style={styles.instructionTextContent}>
            <AppText style={styles.instructionTitle}>Delivery Details</AppText>
            <AppText style={styles.instructionSub}>
              Enter delivery address and select the timeframe for drop-off.
            </AppText>
          </View>
        </View>

        {/* DELIVERY LOCATION */}
        <AppText style={styles.inputLabel}>Delivery Location</AppText>
        <LocationPicker
          value={form.deliveryLocation}
          placeholder="Delivery Address"
          onSelect={location => {
            updateForm({
              deliveryLocation: location.address,
              deliveryLat: location.latitude,
              deliveryLng: location.longitude,
            });
          }}
        />
        {errors.deliveryLocation && (
          <AppText style={styles.errorText}>{errors.deliveryLocation}</AppText>
        )}

        {/* DELIVERY START DATE */}
        <AppText style={styles.inputLabel}>Delivery Start Date</AppText>
        <TouchableOpacity
          style={styles.selectorField}
          onPress={handleOpenStart}
          activeOpacity={0.8}
        >
          <View style={styles.fieldInner}>
            <CalendarIcon
              size={18}
              color={COLORS.primary}
              style={styles.iconMargin}
            />
            <AppText style={styles.selectorValue}>
              {formatDate(form.deliveryStartDate)}
            </AppText>
          </View>
        </TouchableOpacity>
        {errors.deliveryStartDate && (
          <AppText style={styles.errorText}>{errors.deliveryStartDate}</AppText>
        )}

        {/* DELIVERY END DATE */}
        <AppText style={styles.inputLabel}>Delivery End Date</AppText>
        <TouchableOpacity
          style={styles.selectorField}
          onPress={handleOpenEnd}
          activeOpacity={0.8}
        >
          <View style={styles.fieldInner}>
            <CalendarIcon
              size={18}
              color={COLORS.primary}
              style={styles.iconMargin}
            />
            <AppText style={styles.selectorValue}>
              {formatDate(form.deliveryEndDate)}
            </AppText>
          </View>
        </TouchableOpacity>
        {errors.deliveryEndDate && (
          <AppText style={styles.errorText}>{errors.deliveryEndDate}</AppText>
        )}

        {/* FOOTER */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.prevButton} onPress={onPrevious}>
            <AppText style={styles.prevButtonText}>Previous</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={onNext}>
            <AppText style={styles.nextButtonText}>Next</AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* CALENDAR MODAL */}
      <AppCalendarModal
        visible={activeDateType !== null}
        onClose={handleCloseCalendar}
        onSelect={handleDateSelect}
        title={activeDateType === 'start' ? 'Delivery Start' : 'Delivery End'}
        initialDate={
          activeDateType === 'start'
            ? getSafeDateStr(form.deliveryStartDate)
            : getSafeDateStr(form.deliveryEndDate)
        }
        minDate={
          activeDateType === 'end' && form.deliveryStartDate
            ? getSafeDateStr(form.deliveryStartDate)
            : form.pickupStartDate
            ? getSafeDateStr(form.pickupStartDate)
            : new Date().toISOString().split('T')[0]
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollView: { flex: 1 },
  scrollContent: { padding: SPACING.lg, paddingBottom: 60 },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  mainTitle: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  cancelText: { color: COLORS.primary, fontFamily: FONTS.medium },
  instructionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  iconBox: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.goldLightBg,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  instructionTextContent: { flex: 1 },
  instructionTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  instructionSub: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  inputLabel: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
    color: COLORS.grey700,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  selectorField: {
    height: 55,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.white,
  },
  fieldInner: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconMargin: { marginRight: 10 },
  selectorValue: {
    fontSize: 15,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
  },
  footer: {
    flexDirection: 'row',
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    gap: SPACING.md,
    marginTop: SPACING.xl,
  },
  prevButton: {
    flex: 1,
    height: 52,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.grey50,
  },
  prevButtonText: { fontFamily: FONTS.bold, color: COLORS.grey600 },
  nextButton: {
    flex: 1,
    height: 52,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: { fontFamily: FONTS.bold, color: COLORS.white },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
});

export default DeliveryStep;
