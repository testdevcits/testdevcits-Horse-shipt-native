import React, { memo } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import {
  COLORS,
  FONTS,
  RADIUS,
  SPACING,
  FONT_SIZE,
} from '../../constants';
import AppText from '../common/AppText';
import Toast from 'react-native-toast-message';
import AppIcon from '../AppIcon';

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
                <AppIcon name="User" size={24} color="#A06333" />
              </View>
            )}
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isActive ? '#10B981' : '#94A3B8' },
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
                <AppIcon name="Award" size={12} color="#A06333" />
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
                <AppIcon name="Phone" size={14} color="#A06333" />
              </View>
              <AppText style={styles.infoText} numberOfLines={1}>
                {driver?.phone}
              </AppText>
            </View>
          ) : null}

          {driver?.email ? (
            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <AppIcon name="Mail" size={14} color="#A06333" />
              </View>
              <AppText style={styles.infoText} numberOfLines={1}>
                {driver?.email}
              </AppText>
            </View>
          ) : null}

          {driver?.notes ? (
            <View style={styles.notesBox}>
              <AppIcon name="FileText" size={13} color="#64748B" />
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
              color={isActive ? '#D97706' : '#10B981'}
            />
            <AppText
              style={[
                styles.actionBtnText,
                { color: isActive ? '#D97706' : '#10B981' },
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
            <AppIcon name="Edit" size={14} color="#334155" />
            <AppText style={[styles.actionBtnText, { color: '#334155' }]}>
              Edit Profile
            </AppText>
          </TouchableOpacity>

          {isDriverDeletable && (
            <TouchableOpacity
              style={[styles.actionButton, styles.btnDelete]}
              onPress={() => onDelete(driverId, driverName)}
              activeOpacity={0.7}
            >
              <AppIcon name="Trash2" size={14} color="#EF4444" />
              <AppText style={[styles.actionBtnText, { color: '#EF4444' }]}>
                Delete
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: SPACING.md,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: SPACING.sm,
  },
  avatarImg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#F0E4D4',
  },
  avatarPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFBF5',
    borderWidth: 1.5,
    borderColor: '#F0E4D4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  headerInfoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  driverName: {
    fontSize: FONT_SIZE.md + 1,
    fontFamily: FONTS.bold,
    color: '#0F172A',
    flex: 1,
    marginRight: SPACING.xs,
  },
  statusBadge: {
    paddingHorizontal: SPACING.xs + 2,
    paddingVertical: 3,
    borderRadius: RADIUS.round,
  },
  badgeActive: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  badgeInactive: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusBadgeText: {
    fontSize: FONT_SIZE.xs - 1,
    fontFamily: FONTS.bold,
  },
  textActive: {
    color: '#059669',
  },
  textInactive: {
    color: '#64748B',
  },
  licensePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBF5',
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.xs + 2,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#F0E4D4',
  },
  licenseText: {
    fontSize: FONT_SIZE.xs - 1,
    fontFamily: FONTS.medium,
    color: '#A06333',
    marginLeft: 4,
  },
  noLicenseText: {
    fontSize: FONT_SIZE.xs - 1,
    fontFamily: FONTS.regular,
    color: '#94A3B8',
    marginTop: 2,
  },
  infoGrid: {
    paddingVertical: SPACING.sm,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFBF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.xs,
    borderWidth: 1,
    borderColor: '#F0E4D4',
  },
  infoText: {
    fontSize: FONT_SIZE.xs + 1,
    fontFamily: FONTS.regular,
    color: '#334155',
    flex: 1,
  },
  notesBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    padding: SPACING.xs + 2,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginTop: 2,
    gap: 6,
  },
  notesText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: '#64748B',
    flex: 1,
  },
  actionFooter: {
    flexDirection: 'row',
    gap: SPACING.xs,
    paddingTop: SPACING.xs,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    gap: 6,
  },
  btnActivate: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  btnDeactivate: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  btnEdit: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  btnDelete: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  actionBtnText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.semiBold,
  },
});

export default TruckDriverCard;
