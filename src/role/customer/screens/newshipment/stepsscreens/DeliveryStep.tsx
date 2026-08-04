import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import {
  MapPin,
  Calendar as CalendarIcon,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ChevronRight,
  Info,
} from 'lucide-react-native';

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

  const formatDateDisplay = (dateVal: any) => {
    if (!dateVal) return null;
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return null;
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const day = d.getDate().toString().padStart(2, '0');
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    const year = d.getFullYear();
    return `${dayName}, ${day} ${month} ${year}`;
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

  const getMinDeliveryStartStr = () => {
    const refDate = form.pickupEndDate || form.pickupStartDate;
    if (refDate) {
      const minDate = new Date(refDate);
      minDate.setDate(minDate.getDate() + 1);
      return getSafeDateStr(minDate);
    }
    const minDefault = new Date();
    minDefault.setDate(minDefault.getDate() + 2);
    return minDefault.toISOString().split('T')[0];
  };

  const handleOpenStart = useCallback(() => setActiveDateType('start'), []);
  const handleOpenEnd = useCallback(() => setActiveDateType('end'), []);
  const handleCloseCalendar = useCallback(() => setActiveDateType(null), []);

  const handleDateSelect = useCallback(
    (date: Date) => {
      if (activeDateType === 'start') {
        const updates: Partial<NewShipmentForm> = { deliveryStartDate: date };

        const currentDelEnd = form.deliveryEndDate
          ? new Date(form.deliveryEndDate)
          : null;
        if (!currentDelEnd || currentDelEnd.getTime() < date.getTime()) {
          updates.deliveryEndDate = date;
        }

        updateForm(updates);
      } else {
        updateForm({ deliveryEndDate: date });
      }
      setActiveDateType(null);
    },
    [activeDateType, form.deliveryEndDate, updateForm],
  );

  const isLocationSelected = Boolean(
    form.deliveryLocation && form.deliveryLocation.trim() !== '',
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* STEP HEADER CARD */}
        <View style={styles.headerCard}>
          <View style={styles.headerBadgeRow}>
            <View style={styles.stepChip}>
              <AppText style={styles.stepChipText}>STEP 2 OF 5</AppText>
            </View>
            {isLocationSelected && (
              <View style={styles.statusBadge}>
                <CheckCircle2 size={13} color={COLORS.greenSuccess} />
                <AppText style={styles.statusBadgeText}>Address Set</AppText>
              </View>
            )}
          </View>
          <View style={styles.headerTitleRow}>
            <View style={styles.headerIconBox}>
              <MapPin size={22} color={COLORS.primary} />
            </View>
            <View style={styles.headerTextGroup}>
              <AppText style={styles.headerTitle}>Delivery Destination & Window</AppText>
              <AppText style={styles.headerSubtitle}>
                Where should the horse be delivered, and what is your target drop-off window?
              </AppText>
            </View>
          </View>
        </View>

        {/* SECTION 1: DELIVERY LOCATION CARD */}
        <View style={[styles.card, errors.deliveryLocation && styles.cardError]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={styles.iconCircle}>
                <MapPin size={16} color={COLORS.primary} />
              </View>
              <AppText style={styles.cardTitle}>DELIVERY DESTINATION</AppText>
            </View>
            <AppText style={styles.requiredStar}>*Required</AppText>
          </View>

          <LocationPicker
            value={form.deliveryLocation}
            placeholder="Search destination farm, facility, or address..."
            onSelect={location => {
              updateForm({
                deliveryLocation: location.address,
                deliveryLat: location.latitude,
                deliveryLng: location.longitude,
              });
            }}
          />

          {errors.deliveryLocation ? (
            <View style={styles.errorContainer}>
              <Info size={14} color={COLORS.error} />
              <AppText style={styles.errorText}>{errors.deliveryLocation}</AppText>
            </View>
          ) : (
            <AppText style={styles.helperText}>
              Select exact delivery address or destination facility name.
            </AppText>
          )}
        </View>

        {/* SECTION 2: DELIVERY TIMEFRAME CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={styles.iconCircle}>
                <CalendarIcon size={16} color={COLORS.primary} />
              </View>
              <AppText style={styles.cardTitle}>DELIVERY TIMEFRAME</AppText>
            </View>
            <View style={styles.infoTag}>
              <Clock size={12} color={COLORS.primary} />
              <AppText style={styles.infoTagText}>Drop-off Window</AppText>
            </View>
          </View>

          <AppText style={styles.sectionSubtitle}>
            Select the estimated drop-off timeframe for the carrier.
          </AppText>

          {/* DUAL DATE CARDS WITH CONNECTING RANGE */}
          <View style={styles.datesContainer}>
            {/* START DATE CARD */}
            <View style={styles.dateColumn}>
              <AppText style={styles.fieldLabel}>Earliest Drop-off</AppText>
              <TouchableOpacity
                style={[
                  styles.dateCard,
                  activeDateType === 'start' && styles.dateCardActive,
                  errors.deliveryStartDate && styles.dateCardError,
                ]}
                onPress={handleOpenStart}
                activeOpacity={0.85}
              >
                <View style={styles.dateCardTop}>
                  <CalendarIcon
                    size={16}
                    color={form.deliveryStartDate ? COLORS.primary : COLORS.grey400}
                  />
                  <AppText style={styles.dateLabelBadge}>FROM</AppText>
                </View>
                <AppText
                  style={[
                    styles.dateValueText,
                    !form.deliveryStartDate && styles.dateValuePlaceholder,
                  ]}
                  numberOfLines={1}
                >
                  {formatDateDisplay(form.deliveryStartDate) || 'Select Date'}
                </AppText>
              </TouchableOpacity>
              {errors.deliveryStartDate && (
                <AppText style={styles.errorText}>{errors.deliveryStartDate}</AppText>
              )}
            </View>

            {/* CONNECTOR DIVIDER */}
            <View style={styles.dateConnector}>
              <View style={styles.connectorLine} />
              <View style={styles.connectorIconBox}>
                <ChevronRight size={14} color={COLORS.grey400} />
              </View>
              <View style={styles.connectorLine} />
            </View>

            {/* END DATE CARD */}
            <View style={styles.dateColumn}>
              <AppText style={styles.fieldLabel}>Latest Drop-off</AppText>
              <TouchableOpacity
                style={[
                  styles.dateCard,
                  activeDateType === 'end' && styles.dateCardActive,
                  errors.deliveryEndDate && styles.dateCardError,
                ]}
                onPress={handleOpenEnd}
                activeOpacity={0.85}
              >
                <View style={styles.dateCardTop}>
                  <CalendarIcon
                    size={16}
                    color={form.deliveryEndDate ? COLORS.primary : COLORS.grey400}
                  />
                  <AppText style={styles.dateLabelBadge}>TO</AppText>
                </View>
                <AppText
                  style={[
                    styles.dateValueText,
                    !form.deliveryEndDate && styles.dateValuePlaceholder,
                  ]}
                  numberOfLines={1}
                >
                  {formatDateDisplay(form.deliveryEndDate) || 'Select Date'}
                </AppText>
              </TouchableOpacity>
              {errors.deliveryEndDate && (
                <AppText style={styles.errorText}>{errors.deliveryEndDate}</AppText>
              )}
            </View>
          </View>
        </View>

        {/* INFO BANNER CARD */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconBox}>
            <Info size={18} color={COLORS.primary} />
          </View>
          <View style={styles.infoTextContent}>
            <AppText style={styles.infoTitle}>Delivery Timing Note</AppText>
            <AppText style={styles.infoSub}>
              Delivery dates automatically start after your pickup timeframe so haulers have sufficient transit time.
            </AppText>
          </View>
        </View>

        {/* FOOTER ACTION BUTTONS */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.secondaryBtn} onPress={onPrevious}>
            <ArrowLeft size={18} color={COLORS.grey700} style={{ marginRight: 6 }} />
            <AppText style={styles.secondaryBtnText}>Previous</AppText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryBtn} onPress={onNext} activeOpacity={0.85}>
            <AppText style={styles.primaryBtnText}>Continue to Horse Details</AppText>
            <ArrowRight size={18} color={COLORS.white} style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* CALENDAR MODAL */}
      <AppCalendarModal
        visible={activeDateType !== null}
        onClose={handleCloseCalendar}
        onSelect={handleDateSelect}
        title={activeDateType === 'start' ? 'Delivery Start Date' : 'Delivery End Date'}
        initialDate={
          activeDateType === 'start'
            ? getSafeDateStr(form.deliveryStartDate)
            : getSafeDateStr(form.deliveryEndDate)
        }
        minDate={
          activeDateType === 'start'
            ? getMinDeliveryStartStr()
            : form.deliveryStartDate
            ? getSafeDateStr(form.deliveryStartDate)
            : getMinDeliveryStartStr()
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollView: { flex: 1 },
  scrollContent: { padding: SPACING.lg, paddingBottom: 40 },

  /* STEP HEADER CARD */
  headerCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.divider,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  headerBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  stepChip: {
    backgroundColor: COLORS.goldLightBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
  },
  stepChipText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: COLORS.goldDarkText,
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.greenLightBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    gap: 4,
  },
  statusBadgeText: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
    color: COLORS.greenSuccess,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headerIconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.goldLightBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  headerTextGroup: { flex: 1 },
  headerTitle: {
    fontSize: 19,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },

  /* SECTION CARDS */
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.divider,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  cardError: {
    borderColor: COLORS.error,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.goldLightBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    letterSpacing: 0.6,
  },
  requiredStar: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: COLORS.error,
  },
  infoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.goldLightBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  infoTagText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  helperText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: SPACING.xs,
  },
  errorText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.error,
  },

  /* DUAL DATES CONTAINER */
  datesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  dateColumn: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    color: COLORS.grey700,
    marginBottom: 6,
  },
  dateCard: {
    backgroundColor: COLORS.grey50,
    borderWidth: 1,
    borderColor: COLORS.grey200,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    minHeight: 74,
    justifyContent: 'space-between',
  },
  dateCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.goldLightBg,
  },
  dateCardError: {
    borderColor: COLORS.error,
  },
  dateCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  dateLabelBadge: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: COLORS.grey500,
    letterSpacing: 0.5,
  },
  dateValueText: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    color: COLORS.textPrimary,
  },
  dateValuePlaceholder: {
    color: COLORS.grey400,
    fontFamily: FONTS.regular,
  },
  dateConnector: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 18,
    width: 20,
  },
  connectorLine: {
    height: 1,
    backgroundColor: COLORS.grey200,
    width: '100%',
  },
  connectorIconBox: {
    paddingVertical: 2,
  },

  /* INFO BANNER CARD */
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.grey50,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.grey200,
    marginBottom: SPACING.xl,
  },
  infoIconBox: {
    marginRight: SPACING.md,
    marginTop: 2,
  },
  infoTextContent: { flex: 1 },
  infoTitle: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  infoSub: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },

  /* FOOTER */
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  secondaryBtn: {
    flex: 1,
    height: 52,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.grey300,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
    color: COLORS.grey700,
  },
  primaryBtn: {
    flex: 1.5,
    height: 52,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  primaryBtnText: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
});

export default DeliveryStep;

