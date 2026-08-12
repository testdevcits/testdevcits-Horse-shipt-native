import React, { useState, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  Pressable,
  Platform,
} from 'react-native';
import { User, Building2, Truck, Check, X, ShieldCheck } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  COLORS,
  FONTS,
  FONT_SIZE,
  RADIUS,
  SPACING,
  SIZES,
} from '../../../constants';
import AppText from '../../../components/common/AppText';
import AppButton from '../../../components/common/Button/AppButton';

export type UserRole = 'customer' | 'shipper' | 'driver';

interface RoleSelectionModalProps {
  visible: boolean;
  currentRole: string;
  onClose: () => void;
  onSelectRole: (role: UserRole) => void;
  allowedRoles?: UserRole[];
  isSignup?: boolean;
}

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({
  visible,
  currentRole,
  onClose,
  onSelectRole,
  allowedRoles,
  isSignup,
}) => {
  const [selected, setSelected] = useState<UserRole>('customer');

  const ROLES: {
    id: UserRole;
    title: string;
    subtitle: string;
    Icon: any;
    tag: string;
  }[] = [
    {
      id: 'customer',
      title: 'Customer / Horse Owner',
      subtitle: 'Book transportation, track shipments live & post load requests.',
      Icon: User,
      tag: 'BOOK & TRACK',
    },
    {
      id: 'shipper',
      title: 'Shipper / Transport Company',
      subtitle: 'Manage dispatch operations, list vehicles & issue quotes.',
      Icon: Building2,
      tag: 'MANAGE FLEET',
    },
    {
      id: 'driver',
      title: 'Driver / Transporter',
      subtitle: 'Accept assigned trips, navigate routes & verify deliveries.',
      Icon: Truck,
      tag: 'HAUL & DELIVER',
    },
  ];

  // Filter roles: if called from signup or allowedRoles specified, show Customer & Shipper only
  const availableRoles = isSignup
    ? ROLES.filter(r => r.id === 'customer' || r.id === 'shipper')
    : allowedRoles
    ? ROLES.filter(r => allowedRoles.includes(r.id))
    : ROLES;

  useEffect(() => {
    if (
      currentRole &&
      availableRoles.some(roleItem => roleItem.id === currentRole)
    ) {
      setSelected(currentRole as UserRole);
    } else if (availableRoles.length > 0) {
      setSelected(availableRoles[0].id);
    }
  }, [currentRole, visible, isSignup, allowedRoles]);

  const handleConfirm = async () => {
    try {
      await AsyncStorage.setItem('@user_role', selected);
    } catch (e) {
      console.error('Error saving role preference:', e);
    }
    onSelectRole(selected);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
          {/* Top Sheet Handle */}
          <View style={styles.sheetHandle} />

          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerTextGroup}>
              <View style={styles.titleWithBadge}>
                <ShieldCheck size={20} color={COLORS.primary} />
                <AppText style={styles.modalTitle}>Select Account Role</AppText>
              </View>
              <AppText style={styles.modalSubtitle}>
                Choose your profile type to customize your portal experience.
              </AppText>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              activeOpacity={0.7}
            >
              <X size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Role Cards List */}
          <View style={styles.rolesList}>
            {availableRoles.map(roleItem => {
              const isSelected = selected === roleItem.id;
              const RoleIcon = roleItem.Icon;

              return (
                <TouchableOpacity
                  key={roleItem.id}
                  activeOpacity={0.85}
                  onPress={() => setSelected(roleItem.id)}
                  style={[
                    styles.roleCard,
                    isSelected && styles.roleCardActive,
                  ]}
                >
                  {/* Left Icon Badge */}
                  <View
                    style={[
                      styles.iconBadge,
                      isSelected && styles.iconBadgeActive,
                    ]}
                  >
                    <RoleIcon
                      size={22}
                      color={isSelected ? COLORS.white : COLORS.primary}
                    />
                  </View>

                  {/* Text Container */}
                  <View style={styles.cardTextContainer}>
                    <View style={styles.cardTitleRow}>
                      <AppText
                        style={[
                          styles.cardTitle,
                          isSelected && styles.cardTitleActive,
                        ]}
                      >
                        {roleItem.title}
                      </AppText>
                      <View
                        style={[
                          styles.tagPill,
                          isSelected && styles.tagPillActive,
                        ]}
                      >
                        <AppText
                          style={[
                            styles.tagText,
                            isSelected && styles.tagTextActive,
                          ]}
                        >
                          {roleItem.tag}
                        </AppText>
                      </View>
                    </View>
                    <AppText
                      style={[
                        styles.cardSubtitle,
                        isSelected && styles.cardSubtitleActive,
                      ]}
                    >
                      {roleItem.subtitle}
                    </AppText>
                  </View>

                  {/* Selection Radio / Check circle */}
                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleActive,
                    ]}
                  >
                    {isSelected && (
                      <Check size={14} color={COLORS.white} strokeWidth={3} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Bottom Confirm Button */}
          <View style={styles.footerContainer}>
            <AppButton
              title={`Continue as ${
                selected === 'customer'
                  ? 'Customer'
                  : selected === 'shipper'
                  ? 'Shipper'
                  : 'Driver'
              }`}
              onPress={handleConfirm}
              buttonStyle={styles.confirmBtn}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl * 1.25,
    borderTopRightRadius: RADIUS.xl * 1.25,
    paddingHorizontal: SPACING.lg2,
    paddingTop: SPACING.md,
    paddingBottom: Platform.OS === 'ios' ? SPACING.xxxl : SPACING.xl,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: RADIUS.xxs,
    backgroundColor: COLORS.grey300,
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  headerTextGroup: {
    flex: 1,
    paddingRight: SPACING.md,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs2,
    marginBottom: SPACING.xxs,
  },
  modalTitle: {
    fontSize: FONT_SIZE.title,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  modalSubtitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  closeBtn: {
    width: SIZES.avatarSm,
    height: SIZES.avatarSm,
    borderRadius: RADIUS.circle,
    backgroundColor: COLORS.grey100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rolesList: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md2,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.grey50,
    borderWidth: SIZES.borderWidthThick,
    borderColor: COLORS.grey200,
  },
  roleCardActive: {
    backgroundColor: COLORS.goldLightBg,
    borderColor: COLORS.primary,
  },
  iconBadge: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.grey200,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  iconBadgeActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  cardTextContainer: {
    flex: 1,
    marginRight: SPACING.xs2,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.xxs,
  },
  cardTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  cardTitleActive: {
    color: COLORS.primary,
  },
  tagPill: {
    paddingHorizontal: SPACING.xs2,
    paddingVertical: 1,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.grey200,
  },
  tagPillActive: {
    backgroundColor: COLORS.goldBorder,
  },
  tagText: {
    fontSize: FONT_SIZE.xxs,
    fontFamily: FONTS.bold,
    color: COLORS.grey600,
  },
  tagTextActive: {
    color: COLORS.primary,
  },
  cardSubtitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  cardSubtitleActive: {
    color: COLORS.textPrimary,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.circle,
    borderWidth: 2,
    borderColor: COLORS.grey300,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  footerContainer: {
    marginTop: SPACING.xs,
  },
  confirmBtn: {
    height: SIZES.buttonHeight,
    borderRadius: RADIUS.md,
  },
});

export default RoleSelectionModal;
