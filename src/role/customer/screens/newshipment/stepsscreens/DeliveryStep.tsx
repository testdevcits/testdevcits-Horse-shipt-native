import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
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
import { COLORS } from '../../../../../constants';
import LocationPicker from '../../../../../components/common/LocationPicker/LocationPicker';
import { NewShipmentForm } from '../interfaces';
import styles from './DeliveryStepstyles';

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
    } catch (e) { }
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
            <Info size={18} color={COLORS.goldDarkText} />
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



export default DeliveryStep;

