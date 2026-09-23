import React, { useState, useEffect, useMemo } from 'react';
import { Modal, View, TouchableOpacity, Pressable } from 'react-native';
import { User, Building2, Truck } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../../../constants';
import AppText from '../../../../components/common/AppText';
import AppButton from '../../../../components/common/Button/AppButton';
import styles from './styles.RoleSelection';
import AppIcon from '../../../../components/app_icon/AppIcon';

export type UserRole = 'customer' | 'shipper' | 'driver';

interface RoleSelectionModalProps {
  visible: boolean;
  currentRole: string;
  onClose: () => void;
  onSelectRole: (role: UserRole) => void;
  allowedRoles?: UserRole[];
  isSignup?: boolean;
}

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

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({
  visible,
  currentRole,
  onClose,
  onSelectRole,
  allowedRoles,
  isSignup: _isSignup,
}) => {
  const [selected, setSelected] = useState<UserRole>('customer');

  // Filter roles: if allowedRoles specified, show allowed roles, otherwise all roles (customer, shipper, driver)
  const availableRoles = useMemo(() => {
    return allowedRoles
      ? ROLES.filter(r => allowedRoles.includes(r.id))
      : ROLES;
  }, [allowedRoles]);

  useEffect(() => {
    if (visible) {
      if (
        currentRole &&
        availableRoles.some(roleItem => roleItem?.id === currentRole)
      ) {
        setSelected(currentRole as UserRole);
      } else if (availableRoles.length > 0) {
        setSelected(availableRoles[0].id);
      }
    }
  }, [visible, currentRole, availableRoles]);

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
        <Pressable
          style={styles.modalContent}
          onPress={e => e.stopPropagation()}
        >
          {/* Top Sheet Handle */}
          <View style={styles.sheetHandle} />

          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerTextGroup}>
              <View style={styles.titleWithBadge}>
                <AppIcon
                  name={'ShieldCheck'}
                  size={20}
                  color={COLORS.primary}
                />
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
              <AppIcon name={'X'} size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Role Cards List */}
          <View style={styles.rolesList}>
            {availableRoles.map(roleItem => {
              const isSelected = selected === roleItem?.id;
              const RoleIcon = roleItem?.Icon;

              return (
                <TouchableOpacity
                  key={roleItem?.id}
                  activeOpacity={0.85}
                  onPress={() => setSelected(roleItem?.id)}
                  style={[styles.roleCard, isSelected && styles.roleCardActive]}
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
                        {roleItem?.title}
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
                          {roleItem?.tag}
                        </AppText>
                      </View>
                    </View>
                    <AppText
                      style={[
                        styles.cardSubtitle,
                        isSelected && styles.cardSubtitleActive,
                      ]}
                    >
                      {roleItem?.subtitle}
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
                      <AppIcon
                        name={'Check'}
                        size={14}
                        color={COLORS.white}
                        strokeWidth={3}
                      />
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

export default RoleSelectionModal;
