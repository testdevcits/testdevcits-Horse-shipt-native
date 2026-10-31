import { Image, TouchableOpacity, View } from 'react-native';
import React, { memo, useState } from 'react';
import { AppText } from '../../../../../components';

import { COLORS } from '../../../../../constants';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import styles from './VahicleInfoCard.Style';

const VahicleInfoCard = ({
  vehicle,
  isVehicleCollapsed,
  setIsVehicleCollapsed,
}: {
  vehicle?: any;
  isVehicleCollapsed?: any;
  setIsVehicleCollapsed?: any;
}) => {
  const [imageError, setImageError] = useState(false);

  const vehicleImageUrl = vehicle?.images?.[0]?.url;

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.accordionHeader}
        activeOpacity={0.8}
        onPress={() => setIsVehicleCollapsed(!isVehicleCollapsed)}
      >
        <View style={styles.headerLeftRow}>
          <AppIcon name={'Truck'} size={20} color={COLORS.primary} />
          <AppText style={styles.cardHeaderTitle}>Assigned Vehicle</AppText>
        </View>
        {isVehicleCollapsed ? (
          <AppIcon name={'ChevronDown'} size={20} color={COLORS.goldDarkText} />
        ) : (
          <AppIcon name={'ChevronUp'} size={20} color={COLORS.goldDarkText} />
        )}
      </TouchableOpacity>

      {!isVehicleCollapsed && (
        <View style={styles.cardBody}>
          {/* Truck Cover Image with tag */}
          <View style={styles.vehicleImageContainer}>
            {vehicleImageUrl && !imageError ? (
              <Image
                source={{ uri: vehicleImageUrl }}
                style={styles.vehicleImage}
                resizeMode="cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <View style={styles.vehicleImageFallback}>
                <AppIcon name={'Truck'} size={44} color={COLORS.primary} />
              </View>
            )}
            <View style={styles.tagBadge}>
              <AppText style={styles.tagBadgeText}>
                {vehicle?.vehicleType?.toUpperCase() || 'TRUCK'}
              </AppText>
            </View>
          </View>

          {/* Vehicle Number & Status */}
          <View style={styles.vehicleMetaRow}>
            <View style={styles.flexOne}>
              <AppText style={styles.vehicleNum}>
                {vehicle?.vehicleNumber || 'No Number'}
              </AppText>
              <AppText style={styles.vehicleSubDetails}>
                {vehicle?.transportType || 'Trucking'} •{' '}
                {vehicle?.trailerType || 'Trailer'}
              </AppText>
            </View>
            <View style={styles.readyBadge}>
              <AppIcon name={'CheckCircle2'} size={13} color={COLORS.primary} />
              <AppText style={styles.readyBadgeText}>READY</AppText>
            </View>
          </View>

          {/* Grid layout parameters */}
          <View style={styles.vehicleGrid}>
            <View style={styles.vehicleGridCell}>
              <AppText style={styles.vLabel}>TRAILER TYPE</AppText>
              <AppText style={styles.vValue} numberOfLines={1}>
                {vehicle?.trailerType || 'N/A'}
              </AppText>
            </View>
            <View style={styles.vehicleGridCell}>
              <AppText style={styles.vLabel}>STALLS</AppText>
              <AppText style={styles.vValue}>
                {vehicle?.numberOfStalls !== undefined
                  ? String(vehicle.numberOfStalls).padStart(2, '0')
                  : '01'}
              </AppText>
            </View>
            <View style={styles.vehicleGridCell}>
              <AppText style={styles.vLabel}>STALL SIZE</AppText>
              <AppText style={styles.vValue} numberOfLines={1}>
                {vehicle?.stallSize || 'Standard'}
              </AppText>
            </View>
            <View style={styles.vehicleGridCell}>
              <AppText style={styles.vLabel}>TRANSPORT</AppText>
              <AppText style={styles.vValue} numberOfLines={1}>
                {vehicle?.transportType || 'Trucking'}
              </AppText>
            </View>
          </View>

          {/* Vehicle Notes Box */}
          {vehicle?.notes ? (
            <View style={styles.notesBox}>
              <View style={styles.notesHeaderRow}>
                <AppIcon name={'FileText'} size={16} color={COLORS.primary} />
                <AppText style={styles.notesBoxLabel}>VEHICLE NOTES</AppText>
              </View>
              <AppText style={styles.notesBoxText}>
                {vehicle.notes.trim()}
              </AppText>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
};

export default memo(VahicleInfoCard);
