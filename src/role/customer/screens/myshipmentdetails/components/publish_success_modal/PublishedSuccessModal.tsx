import React from 'react';
import { Modal, View, TouchableOpacity, Image } from 'react-native';
 
import { AppText } from '../../../../../../components';
import imageIndex from '../../../../../../assets/images/imageIndex';
import styles from './styles.PublicSuccessModal';

interface PublishedSuccessModalProps {
  visible: boolean;
  onClose: () => void;
  onViewShipment: () => void;
}

const PublishedSuccessModal = ({
  visible,
  onClose,
  onViewShipment,
}: PublishedSuccessModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* LOGO SECTION */}
          <View style={styles.logoContainer}>
            <Image
              source={imageIndex.LogoIcon} // Replace with your actual path
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* TEXT CONTENT */}
          <AppText style={styles.title}>
            Your shipment request has been published
          </AppText>

          <AppText style={styles.description}>
            To view detailed information about the shipment and quotes received,
            please visit “My Shipments” page.
          </AppText>

          {/* ACTION BUTTONS */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={onViewShipment}
              activeOpacity={0.8}
            >
              <AppText style={styles.primaryBtnText}>
                View shipment published
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <AppText style={styles.secondaryBtnText}>Close</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

 

export default PublishedSuccessModal;
