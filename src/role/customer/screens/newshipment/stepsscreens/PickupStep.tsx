import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MapPin, Calendar as CalendarIcon } from 'lucide-react-native';

import { AppText, AppCalendarModal } from '../../../../../components';
import { COLORS, FONTS, RADIUS, SPACING } from '../../../../../constants';
import LocationPicker from '../../../../../components/common/LocationPicker/LocationPicker';
import { NewShipmentForm } from '../interfaces';

interface PickupStepProps {
  form: NewShipmentForm;
  updateForm: (updates: Partial<NewShipmentForm>) => void;
  onNext: () => void;
  onPrevious: () => void;
  errors: any;
}

const PickupStep: React.FC<PickupStepProps> = ({
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

  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const handleOpenStart = useCallback(() => setActiveDateType('start'), []);
  const handleOpenEnd = useCallback(() => setActiveDateType('end'), []);
  const handleCloseCalendar = useCallback(() => setActiveDateType(null), []);

  const handleDateSelect = useCallback(
    (date: Date) => {
      if (activeDateType === 'start') {
        const updates: Partial<NewShipmentForm> = { pickupStartDate: date };

        const currentEndDate = form.pickupEndDate
          ? new Date(form.pickupEndDate)
          : null;
        let effectiveEndDate = currentEndDate;
        if (!currentEndDate || currentEndDate.getTime() < date.getTime()) {
          updates.pickupEndDate = date;
          effectiveEndDate = date;
        }

        if (effectiveEndDate) {
          const currentDelStart = form.deliveryStartDate
            ? new Date(form.deliveryStartDate)
            : null;
          if (
            currentDelStart &&
            currentDelStart.getTime() < effectiveEndDate.getTime()
          ) {
            updates.deliveryStartDate = effectiveEndDate;
            const currentDelEnd = form.deliveryEndDate
              ? new Date(form.deliveryEndDate)
              : null;
            if (
              currentDelEnd &&
              currentDelEnd.getTime() < effectiveEndDate.getTime()
            ) {
              updates.deliveryEndDate = effectiveEndDate;
            }
          }
        }

        updateForm(updates);
      } else {
        const updates: Partial<NewShipmentForm> = { pickupEndDate: date };

        const currentDelStart = form.deliveryStartDate
          ? new Date(form.deliveryStartDate)
          : null;
        if (
          currentDelStart &&
          currentDelStart.getTime() < date.getTime()
        ) {
          updates.deliveryStartDate = date;
          const currentDelEnd = form.deliveryEndDate
            ? new Date(form.deliveryEndDate)
            : null;
          if (
            currentDelEnd &&
            currentDelEnd.getTime() < date.getTime()
          ) {
            updates.deliveryEndDate = date;
          }
        }

        updateForm(updates);
      }
      setActiveDateType(null);
    },
    [
      activeDateType,
      form.pickupEndDate,
      form.deliveryStartDate,
      form.deliveryEndDate,
      updateForm,
    ],
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
            <AppText style={styles.cancelText}>Cancel</AppText>
          </TouchableOpacity>
        </View>

        {/* INSTRUCTION */}
        <View style={styles.instructionCard}>
          <View style={styles.iconBox}>
            <MapPin size={24} color={COLORS.primary} />
          </View>
          <View style={styles.instructionTextContent}>
            <AppText style={styles.instructionTitle}>Pickup Details</AppText>
            <AppText style={styles.instructionSub}>
              Enter pickup address and select your availability window.
            </AppText>
          </View>
        </View>

        {/* PICKUP LOCATION */}
        <AppText style={styles.inputLabel}>Pickup Location</AppText>
        <LocationPicker
          value={form.pickupLocation}
          placeholder="Pickup Address"
          onSelect={location => {
            updateForm({
              pickupLocation: location.address,
              pickupLat: location.latitude,
              pickupLng: location.longitude,
            });
          }}
        />

        {errors.pickupLocation && (
          <AppText style={styles.errorText}>{errors.pickupLocation}</AppText>
        )}

        {/* START DATE */}
        <AppText style={styles.inputLabel}>Pickup Start Date</AppText>
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
              {formatDate(form.pickupStartDate)}
            </AppText>
          </View>
        </TouchableOpacity>

        {errors.pickupStartDate && (
          <AppText style={styles.errorText}>{errors.pickupStartDate}</AppText>
        )}

        {/* END DATE */}
        <AppText style={styles.inputLabel}>Pickup End Date</AppText>
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
              {formatDate(form.pickupEndDate)}
            </AppText>
          </View>
        </TouchableOpacity>

        {errors.pickupEndDate && (
          <AppText style={styles.errorText}>{errors.pickupEndDate}</AppText>
        )}

        {/* FOOTER */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.prevButton} onPress={onPrevious}>
            <AppText style={styles.prevButtonText}>Cancel</AppText>
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
        title={activeDateType === 'start' ? 'Pickup Start' : 'Pickup End'}
        initialDate={
          activeDateType === 'start'
            ? getSafeDateStr(form.pickupStartDate)
            : getSafeDateStr(form.pickupEndDate)
        }
        minDate={
          activeDateType === 'start'
            ? getTomorrowStr()
            : form.pickupStartDate
            ? getSafeDateStr(form.pickupStartDate)
            : getTomorrowStr()
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

export default PickupStep;
