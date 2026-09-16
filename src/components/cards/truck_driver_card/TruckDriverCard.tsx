import React, { memo } from 'react';
import { View, Image, TouchableOpacity,   } from 'react-native';
import { COLORS,   } from '../../../constants';
import AppText from '../../common/AppText';
import Toast from 'react-native-toast-message';
import AppIcon from '../../app_icon/AppIcon';
import styles from './styles.truckdrivercard';

export interface TruckDriverCardProps {
  driver: {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
    licenseNumber?: string;
    notes?: string;
    isActive?: boolean;
    profileImage?: {
      url?: string;
    };
    assignedVehicles?: {
      currentShipment?: string;
    }[];
  };
  onToggleStatus: (id: string, currentActiveStatus: boolean) => void;
  onEdit: (driver: any) => void;
  onDelete: (id: string, name: string) => void;
}

const TruckDriverCard: React.FC<TruckDriverCardProps> = memo(
  ({ driver, onToggleStatus, onEdit, onDelete }) => {
    const isActive = driver?.isActive ?? true;
    const profileUrl = driver?.profileImage?.url || null;
    const driverId = driver?._id || '';
    const driverName = driver?.name || 'Driver';

    const isDriverDeletable =
      !driver?.assignedVehicles ||
      driver?.assignedVehicles.length === 0 ||
      driver?.assignedVehicles.every(
        (vehicle: any) => vehicle.currentShipment === null,
      );
    const canToggleStatus =
      !driver?.assignedVehicles ||
      driver?.assignedVehicles.length === 0 ||
      driver?.assignedVehicles.every(
        (vehicle: any) => vehicle.currentShipment === null,
      );

    return (
      <View style={styles.cardContainer}>
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.avatarWrapper}>
            {profileUrl ? (
              <Image source={{ uri: profileUrl }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <AppIcon name="User" size={24} color={COLORS.saddleBrown} />
              </View>
            )}
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: isActive ? COLORS.success : COLORS.textLight,
                },
              ]}
            />
          </View>

          <View style={styles.headerInfoCol}>
            <View style={styles.nameRow}>
              <AppText style={styles.driverName} numberOfLines={1}>
                {driverName}
              </AppText>
              <View
                style={[
                  styles.statusBadge,
                  isActive ? styles.badgeActive : styles.badgeInactive,
                ]}
              >
                <AppText
                  style={[
                    styles.statusBadgeText,
                    isActive ? styles.textActive : styles.textInactive,
                  ]}
                >
                  {isActive ? 'Active' : 'Inactive'}
                </AppText>
              </View>
            </View>

            {driver?.licenseNumber ? (
              <View style={styles.licensePill}>
                <AppIcon name="Award" size={12} color={COLORS.saddleBrown} />
                <AppText style={styles.licenseText} numberOfLines={1}>
                  Lic: {driver?.licenseNumber}
                </AppText>
              </View>
            ) : (
              <AppText style={styles.noLicenseText}>No License Info</AppText>
            )}
          </View>
        </View>

        {/* Contact Information Details */}
        <View style={styles.infoGrid}>
          {driver?.phone ? (
            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <AppIcon name="Phone" size={14} color={COLORS.saddleBrown} />
              </View>
              <AppText style={styles.infoText} numberOfLines={1}>
                {driver?.phone}
              </AppText>
            </View>
          ) : null}

          {driver?.email ? (
            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <AppIcon name="Mail" size={14} color={COLORS.saddleBrown} />
              </View>
              <AppText style={styles.infoText} numberOfLines={1}>
                {driver?.email}
              </AppText>
            </View>
          ) : null}

          {driver?.notes ? (
            <View style={styles.notesBox}>
              <AppIcon name="FileText" size={13} color={COLORS.textSecondary} />
              <AppText style={styles.notesText} numberOfLines={2}>
                {driver?.notes}
              </AppText>
            </View>
          ) : null}
        </View>

        {/* Action Buttons Footer */}
        <View style={styles.actionFooter}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              isActive ? styles.btnDeactivate : styles.btnActivate,
            ]}
            onPress={() => {
              if (canToggleStatus) {
                onToggleStatus(driverId, isActive);
              } else {
                Toast.show({
                  type: 'info',
                  text1: 'Driver Busy',
                  text2: `Driver ${driverName} is currently assigned to an active trip.`,
                });
              }
            }}
            activeOpacity={0.7}
          >
            <AppIcon
              name="Power"
              size={14}
              color={isActive ? COLORS.amberPrimary : COLORS.success}
            />
            <AppText
              style={[
                styles.actionBtnText,
                { color: isActive ? COLORS.amberPrimary : COLORS.success },
              ]}
            >
              {isActive ? 'Deactivate' : 'Activate'}
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.btnEdit]}
            onPress={() => onEdit(driver)}
            activeOpacity={0.7}
          >
            <AppIcon name="Edit" size={14} color={COLORS.grey700} />
            <AppText style={[styles.actionBtnText, { color: COLORS.grey700 }]}>
              Edit Profile
            </AppText>
          </TouchableOpacity>

          {isDriverDeletable && (
            <TouchableOpacity
              style={[styles.actionButton, styles.btnDelete]}
              onPress={() => onDelete(driverId, driverName)}
              activeOpacity={0.7}
            >
              <AppIcon name="Trash2" size={14} color={COLORS.error} />
              <AppText style={[styles.actionBtnText, { color: COLORS.error }]}>
                Delete
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  },
);

 

export default TruckDriverCard;
