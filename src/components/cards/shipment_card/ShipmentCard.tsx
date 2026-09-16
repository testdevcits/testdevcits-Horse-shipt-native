import React, { memo } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { COLORS } from '../../../constants';
import AppText from '../../common/AppText';
import { formatDate } from '../../../utils/helpers';
import AppIcon from '../../app_icon/AppIcon';
import styles from './styles.ShipmentCard';

const ShipmentCard = ({ item, onView }: { item: any; onView: () => void }) => {
  const horsePhoto = item?.horses[0]?.photo?.url;

  // Dynamic Status Colors
  const statusColor = item?.isInProgress ? COLORS.info : COLORS.success;
  const statusBg = item?.isInProgress
    ? COLORS.blueLightBg
    : COLORS.greenBadgeBg;

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onView} style={styles.card}>
      {/* Top Section: ID and Status */}
      <View style={styles.header}>
        <View>
          <AppText style={styles.shipmentCode}>{item?.shipmentCode}</AppText>
          <AppText style={styles.dateLabel}>
            Requested {formatDate(item?.pickupDateRange?.start)}
          </AppText>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
          <View style={[styles.dot, { backgroundColor: statusColor }]} />
          <AppText style={[styles.statusText, { color: statusColor }]}>
            {item?.status.toUpperCase()}
          </AppText>
        </View>
      </View>

      {/* Main Content: Route and Image */}
      <View style={styles.content}>
        <View style={styles.routeContainer}>
          {/* Visual Route Line */}
          <View style={styles.routeLineContainer}>
            <View style={[styles.routeDot, { borderColor: COLORS.primary }]} />
            <View style={styles.line} />
            <AppIcon name={'MapPin'} size={14} color={COLORS.error} />
          </View>

          <View style={styles.locations}>
            <AppText numberOfLines={1} style={styles.locationTitle}>
              {item?.pickupLocation}
            </AppText>
            <View style={styles.spacingLine} /> {/* Spacing for the line */}
            <AppText numberOfLines={1} style={styles.locationTitle}>
              {item?.deliveryLocation}
            </AppText>
          </View>
        </View>

        <Image
          source={{ uri: horsePhoto || 'https://via.placeholder.com/150' }}
          style={styles.horseImg}
        />
      </View>

      {/* Footer: Metadata Tags */}
      <View style={styles.footer}>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <AppIcon name="User" size={14} color={COLORS.textLight} />
            <AppText style={styles.metaValue}>{item?.shipper?.name}</AppText>
          </View>
          <View style={styles.divider} />
          <View style={styles.metaItem}>
            <AppIcon name="Info" size={14} color={COLORS.textLight} />
            <AppText style={styles.metaValue}>
              {item?.numberOfHorses} Horses
            </AppText>
          </View>
        </View>

        <View style={styles.chevronCircle}>
          <AppIcon name="ChevronRight" size={18} color={COLORS.white} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(ShipmentCard);
