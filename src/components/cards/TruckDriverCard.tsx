import React, { memo } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import {
  User,
  Power,
  Edit,
  Trash2,
  FileText,
  Mail,
  Phone,
  Award,
} from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SPACING, FONT_SIZE } from '../../constants';
import AppText from '../common/AppText';

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
  };
  onToggleStatus: (id: string, currentActiveStatus: boolean) => void;
  onEdit: (driver: any) => void;
  onDelete: (id: string, name: string) => void;
}

const TruckDriverCard: React.FC<TruckDriverCardProps> = memo(
  ({ driver, onToggleStatus, onEdit, onDelete }) => {
    const isActive = driver.isActive ?? true;
    const profileUrl = driver.profileImage?.url || null;
    const driverId = driver._id || '';
    const driverName = driver.name || 'Unnamed Driver';

    return (
      <View style={styles.driverCard}>
        {/* Driver Top Profile Bar */}
        <View style={styles.driverHeaderRow}>
          <View style={styles.avatarContainer}>
            {profileUrl ? (
              <Image source={{ uri: profileUrl }} style={styles.avatarImg} />
            ) : (
              <User size={24} color={COLORS.primary} />
            )}
          </View>

          <View style={styles.driverNameCol}>
            <AppText style={styles.driverName}>{driverName}</AppText>
            <View
              style={[
                styles.activeBadge,
                isActive ? styles.badgeActiveBg : styles.badgeInactiveBg,
              ]}
            >
              <AppText
                style={[
                  styles.activeBadgeText,
                  isActive ? styles.badgeActiveText : styles.badgeInactiveText,
                ]}
              >
                {isActive ? 'Active' : 'Inactive'}
              </AppText>
            </View>
          </View>
        </View>

        {/* Top Action Pills (Activate/Deactivate, Edit, Delete) */}
        <View style={styles.actionPillsRow}>
          <TouchableOpacity
            style={styles.actionBtnPill}
            onPress={() => onToggleStatus(driverId, isActive)}
            activeOpacity={0.7}
          >
            <Power size={15} color={isActive ? '#D97706' : '#10B981'} />
            <AppText style={styles.actionBtnPillText}>
              {isActive ? 'Deactivate' : 'Activate'}
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtnPill}
            onPress={() => onEdit(driver)}
            activeOpacity={0.7}
          >
            <Edit size={15} color={COLORS.textPrimary} />
            <AppText style={styles.actionBtnPillText}>Edit</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtnPill}
            onPress={() => onDelete(driverId, driverName)}
            activeOpacity={0.7}
          >
            <Trash2 size={15} color="#EF4444" />
            <AppText style={[styles.actionBtnPillText, { color: '#EF4444' }]}>
              Delete
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Detail Specification Cards */}
        <View style={styles.specCardsContainer}>
          {/* Name Card */}
          <View style={styles.specDetailCard}>
            <View style={styles.specIconBox}>
              <User size={18} color={COLORS.primary} />
            </View>
            <View style={styles.specTextCol}>
              <AppText style={styles.specLabelTitle}>Name</AppText>
              <AppText style={styles.specLabelVal}>
                {driver.name || 'N/A'}
              </AppText>
            </View>
          </View>

          {/* License Card */}
          <View style={styles.specDetailCard}>
            <View style={styles.specIconBox}>
              <Award size={18} color={COLORS.primary} />
            </View>
            <View style={styles.specTextCol}>
              <AppText style={styles.specLabelTitle}>License</AppText>
              <AppText style={styles.specLabelVal}>
                {driver.licenseNumber || 'N/A'}
              </AppText>
            </View>
          </View>

          {/* Email Card */}
          <View style={styles.specDetailCard}>
            <View style={styles.specIconBox}>
              <Mail size={18} color={COLORS.primary} />
            </View>
            <View style={styles.specTextCol}>
              <AppText style={styles.specLabelTitle}>Email</AppText>
              <AppText style={styles.specLabelVal}>
                {driver.email || 'N/A'}
              </AppText>
            </View>
          </View>

          {/* Phone Card */}
          <View style={styles.specDetailCard}>
            <View style={styles.specIconBox}>
              <Phone size={18} color={COLORS.primary} />
            </View>
            <View style={styles.specTextCol}>
              <AppText style={styles.specLabelTitle}>Phone</AppText>
              <AppText style={styles.specLabelVal}>
                {driver.phone || 'N/A'}
              </AppText>
            </View>
          </View>

          {/* Notes Card */}
          {driver.notes ? (
            <View style={styles.specDetailCard}>
              <View style={styles.specIconBox}>
                <FileText size={18} color={COLORS.primary} />
              </View>
              <View style={styles.specTextCol}>
                <AppText style={styles.specLabelTitle}>Notes</AppText>
                <AppText style={styles.specLabelVal}>{driver.notes}</AppText>
              </View>
            </View>
          ) : null}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  driverCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    padding: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  driverHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.goldLightBg,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  driverNameCol: {
    flex: 1,
  },
  driverName: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  activeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: RADIUS.round,
    marginTop: 4,
    borderWidth: 1,
  },
  badgeActiveBg: {
    backgroundColor: COLORS.greenLightBg,
    borderColor: COLORS.greenBorder,
  },
  badgeActiveText: {
    color: COLORS.greenSuccess,
  },
  badgeInactiveBg: {
    backgroundColor: COLORS.grey100,
    borderColor: COLORS.grey200,
  },
  badgeInactiveText: {
    color: COLORS.grey600,
  },
  activeBadgeText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
  },
  actionPillsRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  actionBtnPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.divider,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.xs,
    gap: 5,
  },
  actionBtnPillText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
  },
  specCardsContainer: {
    gap: SPACING.xs,
  },
  specDetailCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    gap: SPACING.sm,
  },
  specIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.goldLightBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  specTextCol: {
    flex: 1,
  },
  specLabelTitle: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
  specLabelVal: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginTop: 1,
  },
});

export default TruckDriverCard;
