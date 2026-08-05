import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  MapPin,
  Calendar as CalendarIcon,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Clock,
  ChevronRight,
  Info,
} from 'lucide-react-native';

import { AppText, AppCalendarModal } from '../../../../../components';
import { COLORS, FONTS, RADIUS, SPACING } from '../../../../../constants';
import LocationPicker from '../../../../../components/common/LocationPicker/LocationPicker';
import { NewShipmentForm } from '../interfaces';
import styles from './pickupstepstyles';

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
    } catch (e) { }
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
          const minDeliveryDate = new Date(effectiveEndDate);
          minDeliveryDate.setDate(minDeliveryDate.getDate() + 1);

          const currentDelStart = form.deliveryStartDate
            ? new Date(form.deliveryStartDate)
            : null;
          if (
            !currentDelStart ||
            currentDelStart.getTime() < minDeliveryDate.getTime()
          ) {
            updates.deliveryStartDate = minDeliveryDate;
            const currentDelEnd = form.deliveryEndDate
              ? new Date(form.deliveryEndDate)
              : null;
            if (
              !currentDelEnd ||
              currentDelEnd.getTime() < minDeliveryDate.getTime()
            ) {
              updates.deliveryEndDate = minDeliveryDate;
            }
          }
        }

        updateForm(updates);
      } else {
        const updates: Partial<NewShipmentForm> = { pickupEndDate: date };
        const minDeliveryDate = new Date(date);
        minDeliveryDate.setDate(minDeliveryDate.getDate() + 1);

        const currentDelStart = form.deliveryStartDate
          ? new Date(form.deliveryStartDate)
          : null;
        if (
          !currentDelStart ||
          currentDelStart.getTime() < minDeliveryDate.getTime()
        ) {
          updates.deliveryStartDate = minDeliveryDate;
          const currentDelEnd = form.deliveryEndDate
            ? new Date(form.deliveryEndDate)
            : null;
          if (
            !currentDelEnd ||
            currentDelEnd.getTime() < minDeliveryDate.getTime()
          ) {
            updates.deliveryEndDate = minDeliveryDate;
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

  const isLocationSelected = Boolean(form.pickupLocation && form.pickupLocation.trim() !== '');

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
              <AppText style={styles.stepChipText}>STEP 1 OF 5</AppText>
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
              <AppText style={styles.headerTitle}>Pickup Location & Window</AppText>
              <AppText style={styles.headerSubtitle}>
                Where will the horse be picked up, and when are you available?
              </AppText>
            </View>
          </View>
        </View>

        {/* SECTION 1: PICKUP LOCATION CARD */}
        <View style={[styles.card, errors.pickupLocation && styles.cardError]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={styles.iconCircle}>
                <MapPin size={16} color={COLORS.primary} />
              </View>
              <AppText style={styles.cardTitle}>PICKUP LOCATION</AppText>
            </View>
            <AppText style={styles.requiredStar}>*Required</AppText>
          </View>

          <LocationPicker
            value={form.pickupLocation}
            placeholder="Search farm, stable, or address..."
            onSelect={location => {
              updateForm({
                pickupLocation: location.address,
                pickupLat: location.latitude,
                pickupLng: location.longitude,
              });
            }}
          />

          {errors.pickupLocation ? (
            <View style={styles.errorContainer}>
              <Info size={14} color={COLORS.error} />
              <AppText style={styles.errorText}>{errors.pickupLocation}</AppText>
            </View>
          ) : (
            <AppText style={styles.helperText}>
              Select exact address or search stable/facility name.
            </AppText>
          )}
        </View>

        {/* SECTION 2: AVAILABILITY WINDOW CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={styles.iconCircle}>
                <CalendarIcon size={16} color={COLORS.primary} />
              </View>
              <AppText style={styles.cardTitle}>PICKUP TIMEFRAME</AppText>
            </View>
            <View style={styles.infoTag}>
              <Clock size={12} color={COLORS.primary} />
              <AppText style={styles.infoTagText}>Flexible Window</AppText>
            </View>
          </View>

          <AppText style={styles.sectionSubtitle}>
            Select the earliest and latest dates you are ready for pickup.
          </AppText>

          {/* DUAL DATE CARDS WITH CONNECTING RANGE */}
          <View style={styles.datesContainer}>
            {/* START DATE CARD */}
            <View style={styles.dateColumn}>
              <AppText style={styles.fieldLabel}>Earliest Pickup</AppText>
              <TouchableOpacity
                style={[
                  styles.dateCard,
                  activeDateType === 'start' && styles.dateCardActive,
                  errors.pickupStartDate && styles.dateCardError,
                ]}
                onPress={handleOpenStart}
                activeOpacity={0.85}
              >
                <View style={styles.dateCardTop}>
                  <CalendarIcon
                    size={16}
                    color={form.pickupStartDate ? COLORS.primary : COLORS.grey400}
                  />
                  <AppText style={styles.dateLabelBadge}>START</AppText>
                </View>
                <AppText
                  style={[
                    styles.dateValueText,
                    !form.pickupStartDate && styles.dateValuePlaceholder,
                  ]}
                  numberOfLines={1}
                >
                  {formatDateDisplay(form.pickupStartDate) || 'Select Date'}
                </AppText>
              </TouchableOpacity>
              {errors.pickupStartDate && (
                <AppText style={styles.errorText}>{errors.pickupStartDate}</AppText>
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
              <AppText style={styles.fieldLabel}>Latest Pickup</AppText>
              <TouchableOpacity
                style={[
                  styles.dateCard,
                  activeDateType === 'end' && styles.dateCardActive,
                  errors.pickupEndDate && styles.dateCardError,
                ]}
                onPress={handleOpenEnd}
                activeOpacity={0.85}
              >
                <View style={styles.dateCardTop}>
                  <CalendarIcon
                    size={16}
                    color={form.pickupEndDate ? COLORS.primary : COLORS.grey400}
                  />
                  <AppText style={styles.dateLabelBadge}>END</AppText>
                </View>
                <AppText
                  style={[
                    styles.dateValueText,
                    !form.pickupEndDate && styles.dateValuePlaceholder,
                  ]}
                  numberOfLines={1}
                >
                  {formatDateDisplay(form.pickupEndDate) || 'Select Date'}
                </AppText>
              </TouchableOpacity>
              {errors.pickupEndDate && (
                <AppText style={styles.errorText}>{errors.pickupEndDate}</AppText>
              )}
            </View>
          </View>
        </View>

        {/* PRO-TIP BANNER CARD */}
        <View style={styles.tipCard}>
          <View style={styles.tipIconBox}>
            <Sparkles size={18} color={COLORS.goldDarkText} />
          </View>
          <View style={styles.tipTextContent}>
            <AppText style={styles.tipTitle}>Pro Tip for Faster Quotes</AppText>
            <AppText style={styles.tipSub}>
              A flexible 3–5 day window gives haulers room to route efficiently, resulting in more competitive bids.
            </AppText>
          </View>
        </View>

        {/* FOOTER ACTION BUTTONS */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.secondaryBtn} onPress={onPrevious}>
            <ArrowLeft size={18} color={COLORS.grey700} style={{ marginRight: 6 }} />
            <AppText style={styles.secondaryBtnText}>Cancel</AppText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryBtn} onPress={onNext} activeOpacity={0.85}>
            <AppText style={styles.primaryBtnText}>Continue to Delivery</AppText>
            <ArrowRight size={18} color={COLORS.white} style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* CALENDAR MODAL */}
      <AppCalendarModal
        visible={activeDateType !== null}
        onClose={handleCloseCalendar}
        onSelect={handleDateSelect}
        title={activeDateType === 'start' ? 'Pickup Start Date' : 'Pickup End Date'}
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



export default PickupStep;

