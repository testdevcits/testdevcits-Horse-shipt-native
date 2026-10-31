import React from 'react';
import { Modal, View, Image } from 'react-native';
import { AppText } from '../../../../../../components';
import imageIndex from '../../../../../../assets/images/imageIndex';
import styles from '../styles.addvehicle';

interface VehicleLoadingModalProps {
  loading: boolean;
}

export const VehicleLoadingModal: React.FC<VehicleLoadingModalProps> = ({
  loading,
}) => {
  return (
    <Modal visible={loading} transparent animationType="fade">
      <View style={styles.loadingOverlay}>
        <View style={styles.loadingCard}>
          <View style={styles.truckIconContainer}>
            <Image
              source={imageIndex?.runningtruck}
              style={{
                width: 200,
                height: 200,
              }}
              resizeMode="contain"
            />
          </View>

          <AppText style={styles.loadingTitle}>Saving Vehicle</AppText>
          <AppText style={styles.loadingSubtitle}>
            Registering your vehicle... Please wait while we save the
            information.
          </AppText>
        </View>
      </View>
    </Modal>
  );
};
