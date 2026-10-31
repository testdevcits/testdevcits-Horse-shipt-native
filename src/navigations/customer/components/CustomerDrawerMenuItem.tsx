import React, { memo } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { COLORS } from '../../../constants/colors';
import { AppText } from '../../../components';
import styles from './styles.customerdrawer';

interface DrawerMenuItemProps {
  label: string;
  iconSource?: ImageSourcePropType;
  IconComponent?: React.ComponentType<any>;
  iconColor?: string;
  onPress: () => void;
  isActive?: boolean;
  isLast?: boolean;
  hasChevron?: boolean;
  badgeCount?: number;
}

export const DrawerMenuItem: React.FC<DrawerMenuItemProps> = memo(
  ({
    label,
    iconSource,
    IconComponent,
    iconColor,
    onPress,
    isActive,
    isLast,
    hasChevron = true,
    badgeCount,
  }) => (
    <TouchableOpacity
      style={[
        styles.menuItem,
        isActive && styles.menuItemActive,
        isLast && { marginBottom: 0 },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {isActive && <View style={styles.activeLeftBar} />}

      <View
        style={[styles.iconContainer, isActive && styles.iconContainerActive]}
      >
        {IconComponent ? (
          <IconComponent
            size={19}
            color={iconColor || (isActive ? COLORS.primary : COLORS.grey600)}
            strokeWidth={isActive ? 2.2 : 1.8}
          />
        ) : iconSource ? (
          <Image
            source={iconSource}
            style={[styles.menuIcon, isActive && { tintColor: COLORS.primary }]}
            resizeMode="contain"
          />
        ) : null}
      </View>

      <AppText
        style={[
          styles.menuLabel,
          isActive && styles.menuLabelActive,
          iconColor ? { color: iconColor } : null,
        ]}
        numberOfLines={1}
      >
        {label}
      </AppText>

      {badgeCount !== undefined && badgeCount > 0 && (
        <View style={styles.badgeContainer}>
          <AppText style={styles.badgeText}>{badgeCount}</AppText>
        </View>
      )}

      {(isActive || hasChevron) && (
        <ChevronRight
          size={16}
          color={iconColor || (isActive ? COLORS.primary : COLORS.grey400)}
          style={styles.chevron}
        />
      )}
    </TouchableOpacity>
  ),
);
