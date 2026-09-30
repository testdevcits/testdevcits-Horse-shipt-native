import React from 'react';
import { Modal, View, TouchableOpacity } from 'react-native';
import { AppText } from '../../../../../../components';
import AppIcon from '../../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../../constants';
import styles from '../styles.addvehicle';

export const VEHICLE_TYPES = ['Truck', 'Trailer', 'Other'];
export const STALL_TYPES = [
  'Stock Trailer',
  'Slant Load',
  'Head to Head',
  'Semi',
  'Other',
];
export const STALL_SIZES = [
  'Single Stall',
  'Stall and a Half',
  'Box Stall',
  'Other',
];

interface VehiclePickerModalProps {
  activePicker: 'vehicleType' | 'stallType' | 'stallSize' | null;
  onClose: () => void;
  vehicleType: string;
  stallType: string;
  stallSize: string;
  onSelectVehicleType: (val: string) => void;
  onSelectStallType: (val: string) => void;
  onSelectStallSize: (val: string) => void;
}

export const VehiclePickerModal: React.FC<VehiclePickerModalProps> = ({
  activePicker,
  onClose,
  vehicleType,
  stallType,
  stallSize,
  onSelectVehicleType,
  onSelectStallType,
  onSelectStallSize,
}) => {
  return (
    <Modal
      visible={activePicker !== null}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.pickerOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.pickerContent}>
          <AppText style={styles.pickerTitle}>
            {activePicker === 'vehicleType'
              ? 'Select Vehicle Type'
              : activePicker === 'stallType'
              ? 'Select Stall Type'
              : 'Select Stall Size'}
          </AppText>

          {activePicker === 'vehicleType' &&
            VEHICLE_TYPES.map(item => (
              <TouchableOpacity
                key={item}
                style={styles.pickerItem}
                onPress={() => onSelectVehicleType(item)}
              >
                <AppText
                  style={[
                    styles.pickerItemText,
                    vehicleType === item && styles.pickerItemTextActive,
                  ]}
                >
                  {item}
                </AppText>
                {vehicleType === item && (
                  <AppIcon name="Check" size={18} color={COLORS.saddleBrown} />
                )}
              </TouchableOpacity>
            ))}

          {activePicker === 'stallType' &&
            STALL_TYPES.map(item => (
              <TouchableOpacity
                key={item}
                style={styles.pickerItem}
                onPress={() => onSelectStallType(item)}
              >
                <AppText
                  style={[
                    styles.pickerItemText,
                    stallType === item && styles.pickerItemTextActive,
                  ]}
                >
                  {item}
                </AppText>
                {stallType === item && (
                  <AppIcon name="Check" size={18} color={COLORS.saddleBrown} />
                )}
              </TouchableOpacity>
            ))}

          {activePicker === 'stallSize' &&
            STALL_SIZES.map(item => (
              <TouchableOpacity
                key={item}
                style={styles.pickerItem}
                onPress={() => onSelectStallSize(item)}
              >
                <AppText
                  style={[
                    styles.pickerItemText,
                    stallSize === item && styles.pickerItemTextActive,
                  ]}
                >
                  {item}
                </AppText>
                {stallSize === item && (
                  <AppIcon name="Check" size={18} color={COLORS.saddleBrown} />
                )}
              </TouchableOpacity>
            ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
