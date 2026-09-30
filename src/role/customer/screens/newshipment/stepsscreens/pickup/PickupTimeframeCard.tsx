import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { AppText } from '../../../../../../components';
import AppIcon from '../../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../../constants';
import { NewShipmentForm } from '../../interfaces';
import styles from './pickupstepstyles';

interface PickupTimeframeCardProps {
  form: NewShipmentForm;
  errors: any;
  activeDateType: 'start' | 'end' | null;
  formatDateDisplay: (dateVal: any) => string | null;
  onOpenStart: () => void;
  onOpenEnd: () => void;
}

const PickupTimeframeCard: React.FC<PickupTimeframeCardProps> = ({
  form,
  errors,
  activeDateType,
  formatDateDisplay,
  onOpenStart,
  onOpenEnd,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={styles.iconCircle}>
            <AppIcon name={'Calendar'} size={16} color={COLORS.primary} />
          </View>
          <AppText style={styles.cardTitle}>PICKUP TIMEFRAME</AppText>
        </View>
        <View style={styles.infoTag}>
          <AppIcon name={'Clock'} size={12} color={COLORS.primary} />
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
            onPress={onOpenStart}
            activeOpacity={0.85}
          >
            <View style={styles.dateCardTop}>
              <AppIcon
                name={'Calendar'}
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
            <AppIcon name={'ChevronRight'} size={14} color={COLORS.grey400} />
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
            onPress={onOpenEnd}
            activeOpacity={0.85}
          >
            <View style={styles.dateCardTop}>
              <AppIcon
                name={'Calendar'}
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
  );
};

export default memo(PickupTimeframeCard);
