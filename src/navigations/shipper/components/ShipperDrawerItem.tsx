import React, { memo } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { ChevronRight, ChevronDown } from 'lucide-react-native';
import { COLORS } from '../../../constants/colors';
import { AppText } from '../../../components';
import styles from './styles.shipperdrawer';

export interface DrawerItemProps {
  label: string;
  IconComponent?: React.ElementType;
  imageSource?: any;
  onPress: () => void;
  isActive?: boolean;
  hasChevron?: boolean;
  isExpanded?: boolean;
  isLast?: boolean;
}

export const ShipperDrawerMenuItem: React.FC<DrawerItemProps> = memo(
  ({
    label,
    IconComponent,
    imageSource,
    onPress,
    isActive,
    hasChevron,
    isExpanded,
    isLast,
  }) => (
    <TouchableOpacity
      style={[
        styles.menuItem,
        isActive && styles.menuItemActive,
        isLast && { marginBottom: 0 },
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {isActive && <View style={styles.activeLeftBar} />}

      <View
        style={[styles.iconContainer, isActive && styles.iconContainerActive]}
      >
        {imageSource ? (
          <Image
            source={imageSource}
            style={[
              styles.menuImage,
              isActive && { tintColor: COLORS.brandBrown },
            ]}
            resizeMode="contain"
          />
        ) : IconComponent ? (
          <IconComponent
            size={19}
            color={isActive ? COLORS.brandBrown : COLORS.grey600}
            strokeWidth={isActive ? 2.2 : 1.8}
          />
        ) : null}
      </View>

      <AppText style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
        {label}
      </AppText>

      {hasChevron ? (
        isExpanded ? (
          <ChevronDown
            size={16}
            color={isActive ? COLORS.brandBrown : COLORS.textLight}
            style={styles.chevron}
          />
        ) : (
          <ChevronRight
            size={16}
            color={isActive ? COLORS.brandBrown : COLORS.textLight}
            style={styles.chevron}
          />
        )
      ) : (
        <ChevronRight
          size={16}
          color={isActive ? COLORS.brandBrown : COLORS.grey400}
          style={styles.chevron}
        />
      )}
    </TouchableOpacity>
  ),
);

export interface SubMenuItemProps {
  label: string;
  onPress: () => void;
  isActive?: boolean;
}

export const ShipperDrawerSubMenuItem: React.FC<SubMenuItemProps> = memo(
  ({ label, onPress, isActive }) => (
    <TouchableOpacity
      style={[styles.subMenuItem, isActive && styles.subMenuItemActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.bulletDot, isActive && styles.bulletDotActive]} />
      <AppText
        style={[styles.subMenuLabel, isActive && styles.subMenuLabelActive]}
      >
        {label}
      </AppText>
    </TouchableOpacity>
  ),
);
