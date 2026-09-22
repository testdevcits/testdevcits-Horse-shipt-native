import { View, TouchableOpacity, Image } from 'react-native';
import React, { memo, useState } from 'react';
import { COLORS, FONTS } from '../../../constants';
import AppText from '../../common/AppText';
import AppIcon from '../../app_icon/AppIcon';
import styles from './VehicleItemCard.styles';

interface VehicleItemCardProps {
  vehicle: any;
  index: number;
  onAssignDriver: (v: any) => void;
  onEdit: (v: any) => void;
  onDelete: (id: string, num: string) => void;
}

const VehicleItemCard = React.memo(
  ({
    vehicle,
    index,
    onAssignDriver,
    onEdit,
    onDelete,
  }: VehicleItemCardProps) => {
    const [imageError, setImageError] = useState(false);
    const vehicleImg =
      vehicle?.images && vehicle?.images[0]?.url
        ? vehicle?.images[0].url
        : null;
    const status = vehicle?.verificationStatus || 'Not Available';
    const assignedDriverName = vehicle?.driver?.name;

    return (
      <View key={vehicle?._id || index} style={styles.vehicleCard}>
        {/* Vehicle Banner Image */}
        <View style={styles.imageContainer}>
          {vehicleImg && !imageError ? (
            <Image
              source={{ uri: vehicleImg }}
              style={styles.vehicleImage}
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={styles.fallbackImage}>
              <AppIcon name={'Truck'} size={44} color={COLORS.primary} />
            </View>
          )}
          {/* Status Badge */}
          <View
            style={[
              styles.statusBadge,
              status === 'APPROVED'
                ? styles.statusApproved
                : status === 'REJECTED'
                ? styles.statusRejected
                : styles.statusPending,
            ]}
          >
            <AppText
              style={[
                styles.statusBadgeText,
                status === 'APPROVED'
                  ? styles.statusApprovedText
                  : status === 'REJECTED'
                  ? styles.statusRejectedText
                  : styles.statusPendingText,
              ]}
            >
              {status}
            </AppText>
          </View>
        </View>

        {/* Card Main Info */}
        <View style={styles.cardContent}>
          <AppText style={styles.vehicleNum}>
            {vehicle?.vehicleNumber || 'No Plate Number'}
          </AppText>
          <AppText style={styles.vehicleType}>
            {vehicle?.vehicleType || 'Not Available'} -{' '}
            {vehicle?.transportType || 'Not Available'}
          </AppText>

          {/* 2x2 Specs Grid */}
          <View style={styles.specsGrid}>
            <View style={styles.specBox}>
              <AppIcon name={'Truck'} size={18} color={COLORS.primary} />
              <View style={styles.specBoxTextCol}>
                <AppText style={styles.specLabel}>VIN</AppText>
                <AppText style={styles.specValue} numberOfLines={1}>
                  {vehicle?.vinNumber || 'Not Available'}
                </AppText>
              </View>
            </View>

            <View style={styles.specBox}>
              <AppIcon name={'Box'} size={18} color={COLORS.primary} />
              <View style={styles.specBoxTextCol}>
                <AppText style={styles.specLabel}>Size</AppText>
                <AppText style={styles.specValue} numberOfLines={1}>
                  {vehicle?.stallSize || 'Not Available'}
                </AppText>
              </View>
            </View>

            <View style={styles.specBox}>
              <AppIcon name={'Layers'} size={18} color={COLORS.primary} />
              <View style={styles.specBoxTextCol}>
                <AppText style={styles.specLabel}>Stalls</AppText>
                <AppText style={styles.specValue}>
                  {vehicle?.numberOfStalls
                    ? String(vehicle?.numberOfStalls).padStart(2, '0')
                    : '01'}
                </AppText>
              </View>
            </View>

            <View style={styles.specBox}>
              <AppIcon name={'Truck'} size={18} color={COLORS.primary} />
              <View style={styles.specBoxTextCol}>
                <AppText style={styles.specLabel}>Stall Type</AppText>
                <AppText style={styles.specValue} numberOfLines={1}>
                  {vehicle?.trailerType || 'N/A'}
                </AppText>
              </View>
            </View>
          </View>

          {/* Notes / Spec Description */}
          {vehicle?.notes ? (
            <View style={styles.notesBox}>
              <AppIcon name={'FileText'} size={18} color={COLORS.primary} />
              <View style={styles.notesTextCol}>
                <AppText style={styles.notesTitle}>Notes</AppText>
                <AppText style={styles.notesText}>{vehicle?.notes}</AppText>
              </View>
            </View>
          ) : null}

          {/* Action Buttons Row */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionPill}
              onPress={() => onAssignDriver(vehicle)}
            >
              {assignedDriverName ? (
                <AppIcon name={'UserCheck'} size={15} color={COLORS.primary} />
              ) : (
                <AppIcon
                  name={'UserPlus'}
                  size={15}
                  color={COLORS.textPrimary}
                />
              )}
              <AppText
                style={[
                  styles.actionPillText,
                  assignedDriverName && {
                    color: COLORS.primary,
                    fontFamily: FONTS.bold,
                  },
                ]}
                numberOfLines={1}
              >
                {assignedDriverName ? `${assignedDriverName}` : 'Assign Driver'}
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionPill}
              onPress={() => onEdit(vehicle)}
            >
              <AppIcon name={'Edit'} size={15} color={COLORS.textPrimary} />
              <AppText style={styles.actionPillText}>Edit</AppText>
            </TouchableOpacity>
            {vehicle?.currentShipment === null ? (
              <TouchableOpacity
                style={styles.actionPill}
                onPress={() => onDelete(vehicle?._id, vehicle?.vehicleNumber)}
              >
                <AppIcon name={'Trash2'} size={15} color={COLORS.error} />
                <AppText
                  style={[styles.actionPillText, { color: COLORS.error }]}
                >
                  Delete
                </AppText>
              </TouchableOpacity>
            ) : (
              <View style={[styles.actionPill, styles.actionPillExtraStyles]}>
                <AppText
                  style={[styles.actionPillText, { color: COLORS.error }]}
                >
                  In-Use
                </AppText>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  },
);

export default memo(VehicleItemCard);
