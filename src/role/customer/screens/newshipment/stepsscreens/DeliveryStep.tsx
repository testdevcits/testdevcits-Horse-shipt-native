import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {
  MapPin,
  Calendar as CalendarIcon,
  Target,
} from 'lucide-react-native';

import { AppText, AppCalendarModal } from '../../../../../components';
import { COLORS, FONTS, RADIUS, SPACING } from '../../../../../constants';
import { GOOGLE_MAPS_APIKEY } from '../../../../../config/constants';

interface DeliveryStepProps {
  form: any;
  updateForm: (updates: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const DeliveryStep: React.FC<DeliveryStepProps> = ({ form, updateForm, onNext, onPrevious }) => {
  const [activeDateType, setActiveDateType] = useState<'start' | 'end' | null>(null);

  const formatDate = (date: any) => {
    if (!date) return 'Select Date';
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  // --- HANDLERS ---
  const handleOpenStart = useCallback(() => setActiveDateType('start'), []);
  const handleOpenEnd = useCallback(() => setActiveDateType('end'), []);
  const handleCloseCalendar = useCallback(() => setActiveDateType(null), []);

  const handleDateSelect = useCallback((date: Date) => {
    if (activeDateType === 'start') {
      updateForm({ deliveryStartDate: date });
    } else {
      updateForm({ deliveryEndDate: date });
    }
    setActiveDateType(null);
  }, [activeDateType, updateForm]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* 1. PROGRESS - Second dash active */}
        <View style={styles.progressContainer}>
          <View style={styles.progressDash} />
          <View style={[styles.progressDash, styles.activeDash]} />
          <View style={styles.progressDash} />
          <View style={styles.progressDash} />
          <View style={styles.progressDash} />
        </View>

        {/* 2. HEADER */}
        <View style={styles.titleRow}>
          <AppText style={styles.mainTitle}>New Shipment</AppText>
          <TouchableOpacity onPress={onPrevious}>
            <AppText style={styles.cancelText}>Cancel</AppText>
          </TouchableOpacity>
        </View>

        {/* 3. INSTRUCTION (Updated for Delivery) */}
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

        {/* 4. DELIVERY LOCATION (Updated Keys) */}
        <AppText style={styles.inputLabel}>Delivery Location</AppText>
        <View style={styles.autocompleteWrapper}>
          <GooglePlacesAutocomplete
            placeholder="Enter delivery address"
            fetchDetails={true}
            onPress={(data, details = null) => {
              updateForm({
                deliveryLocation: data.description,
                deliveryLat: details?.geometry.location.lat,
                deliveryLng: details?.geometry.location.lng,
              });
            }}
            query={{
              key: GOOGLE_MAPS_APIKEY,
              language: 'en',
            }}
            renderLeftButton={() => (
              <View style={styles.inputIconLeft}>
                <MapPin size={18} color={COLORS.primary} />
              </View>
            )}
            renderRightButton={() => (
              <TouchableOpacity style={styles.inputIconRight}>
                <Target size={18} color={COLORS.primary} />
              </TouchableOpacity>
            )}
            styles={autocompleteStyles}
            enablePoweredByContainer={false}
          />
        </View>

        {/* 5. DELIVERY START DATE */}
        <AppText style={styles.inputLabel}>Delivery Start Date</AppText>
        <TouchableOpacity
          style={styles.selectorField}
          onPress={handleOpenStart}
          activeOpacity={0.8}
        >
          <View style={styles.fieldInner}>
            <CalendarIcon size={18} color={COLORS.primary} style={styles.iconMargin} />
            <AppText style={styles.selectorValue}>{formatDate(form.deliveryStartDate)}</AppText>
          </View>
        </TouchableOpacity>

        {/* 6. DELIVERY END DATE */}
        <AppText style={styles.inputLabel}>Delivery End Date</AppText>
        <TouchableOpacity
          style={styles.selectorField}
          onPress={handleOpenEnd}
          activeOpacity={0.8}
        >
          <View style={styles.fieldInner}>
            <CalendarIcon size={18} color={COLORS.primary} style={styles.iconMargin} />
            <AppText style={styles.selectorValue}>{formatDate(form.deliveryEndDate)}</AppText>
          </View>
        </TouchableOpacity>

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

      {/* MODAL (Updated logic for delivery) */}
      <AppCalendarModal
        visible={activeDateType !== null}
        onClose={handleCloseCalendar}
        onSelect={handleDateSelect}
        title={activeDateType === 'start' ? "Delivery Start" : "Delivery End"}
        initialDate={
            activeDateType === 'start' 
            ? new Date(form.deliveryStartDate || new Date()).toISOString().split('T')[0] 
            : new Date(form.deliveryEndDate || new Date()).toISOString().split('T')[0]
        }
        minDate={
            activeDateType === 'end' && form.deliveryStartDate 
            ? new Date(form.deliveryStartDate).toISOString().split('T')[0] 
            : (form.pickupStartDate ? new Date(form.pickupStartDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0])
        }
      />
    </View>
  );
};

// Styles remain identical to PickupStep for consistent UI
const autocompleteStyles = {
  container: { flex: 0 },
  textInput: {
    height: 55,
    backgroundColor: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: 15,
    paddingLeft: 45,
    paddingRight: 45,
    color: COLORS.textPrimary,
  },
  listView: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.md,
    marginTop: 2,
    elevation: 5,
    zIndex: 1000,
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollView: { flex: 1 },
  scrollContent: { padding: SPACING.lg, paddingBottom: 100 },
  progressContainer: { flexDirection: 'row', gap: 8, marginBottom: SPACING.xl, marginTop: 10 },
  progressDash: { flex: 1, height: 3, backgroundColor: COLORS.grey300, borderRadius: 2 },
  activeDash: { backgroundColor: COLORS.primary },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xl },
  mainTitle: { fontSize: 22, fontFamily: FONTS.bold, color: COLORS.textPrimary },
  cancelText: { color: COLORS.primary, fontFamily: FONTS.medium },
  instructionCard: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xl },
  iconBox: { width: 50, height: 50, backgroundColor: COLORS.goldLightBg, borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  instructionTextContent: { flex: 1 },
  instructionTitle: { fontSize: 18, fontFamily: FONTS.bold, color: COLORS.textPrimary },
  instructionSub: { fontSize: 13, fontFamily: FONTS.regular, color: COLORS.textSecondary, marginTop: 2 },
  inputLabel: { fontSize: 15, fontFamily: FONTS.semiBold, color: COLORS.grey700, marginBottom: SPACING.sm, marginTop: SPACING.md },
  autocompleteWrapper: { zIndex: 10, borderWidth: 1, borderColor: COLORS.divider, borderRadius: RADIUS.md },
  inputIconLeft: { position: 'absolute', left: 15, top: 18, zIndex: 11 },
  inputIconRight: { position: 'absolute', right: 15, top: 18, zIndex: 11 },
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
    zIndex: 1,
  },
  fieldInner: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconMargin: { marginRight: 10 },
  selectorValue: { fontSize: 15, fontFamily: FONTS.medium, color: COLORS.textPrimary },
  footer: { 
    flexDirection: 'row', 
    paddingVertical: SPACING.lg, 
    backgroundColor: COLORS.white, 
    borderTopWidth: 1, 
    borderTopColor: COLORS.divider, 
    gap: SPACING.md,
    marginTop: SPACING.xl 
  },
  prevButton: { flex: 1, height: 52, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.divider, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.grey50 },
  prevButtonText: { fontFamily: FONTS.bold, color: COLORS.grey600 },
  nextButton: { flex: 1, height: 52, borderRadius: RADIUS.md, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  nextButtonText: { fontFamily: FONTS.bold, color: COLORS.white },
});

export default DeliveryStep;