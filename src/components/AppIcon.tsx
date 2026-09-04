import React, { memo } from 'react';
import {
  Pencil,
  Trash2,
  ShieldCheck,
  FileText,
  CreditCard,
  ChevronRight,
  ArrowRight,
  Star,
  MapPin,
  Package,
  User,
  Info,
} from 'lucide-react-native';
import { COLORS, ICON_SIZE } from '../constants';
import { ViewStyle } from 'react-native';

const ICONS = {
  Pencil,
  Trash2,
  ShieldCheck,
  FileText,
  CreditCard,
  ChevronRight,
  ArrowRight,
  Star,
  MapPin,
  Package,
  User,
  Info,
} as const;

export type IconName = keyof typeof ICONS;

interface AppIconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: ViewStyle;
  fill?: string;
}

const AppIcon = ({
  name,
  size = ICON_SIZE.s20,
  color = COLORS.textPrimary,
  strokeWidth = 2,
  style,
  fill,
}: AppIconProps) => {
  const Icon = ICONS[name];

  return (
    <Icon
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      style={style}
      fill={fill}
    />
  );
};

export default memo(AppIcon);
