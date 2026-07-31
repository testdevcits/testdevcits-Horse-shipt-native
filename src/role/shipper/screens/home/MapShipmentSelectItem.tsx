import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MapPin, ArrowLeftRight, ArrowRight } from 'lucide-react-native';
import { AppText } from '../../../../components';
import { COLORS } from '../../../../constants';
import styles from './styles.shipperhome';

interface MapShipmentSelectItemProps {
  item: any;
  isSelected: boolean;
  isLast: boolean;
  onSelect: (item: any) => void;
  onNavigateDetails: (item: any) => void;
}

const MapShipmentSelectItem: React.FC<MapShipmentSelectItemProps> = ({
  item,
  isSelected,
  isLast,
  onSelect,
  onNavigateDetails,
}) => {
  const pickupTitle = item.pickupLocation
    ? item.pickupLocation.split(',')[0] +
      ', ' +
      (item.pickupLocation.split(',')[1] || '')
    : 'Ghbaleh, Lebanon';

  const deliveryTitle = item.deliveryLocation
    ? item.deliveryLocation.split(',')[0] +
      ', ' +
      (item.deliveryLocation.split(',')[1] || '')
    : 'Myanmar';

  return (
    <TouchableOpacity
      style={[
        styles.mapSelectItemRow,
        isSelected && styles.mapSelectItemRowActive,
        isLast && { borderBottomWidth: 0 },
      ]}
      onPress={() => onSelect(item)}
      activeOpacity={0.7}
    >
      {/* Left Map Pin Icon Circle */}
      <View style={styles.mapPinCircle}>
        <MapPin size={18} color="#A06333" />
      </View>

      {/* Center Info Col */}
      <View style={styles.mapSelectTextCol}>
        <AppText style={styles.mapSelectLocationTitle} numberOfLines={1}>
          {pickupTitle}
        </AppText>
        <AppText style={styles.mapSelectShipmentCode}>
          {item.shipmentCode || 'HS-SHIP-2026-CODE'}
        </AppText>
        <AppText style={styles.mapSelectDeliverySub} numberOfLines={1}>
          ➜ {deliveryTitle}
        </AppText>
      </View>

      {/* Right Action Swap / Arrow Circle Buttons */}
      <View style={styles.mapSelectActionsCol}>
        <TouchableOpacity
          style={styles.swapIconCircle}
          onPress={() => onNavigateDetails(item)}
        >
          <ArrowLeftRight size={14} color={COLORS.white} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.arrowIconCircle}
          onPress={() => onNavigateDetails(item)}
        >
          <ArrowRight size={14} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default memo(MapShipmentSelectItem);
