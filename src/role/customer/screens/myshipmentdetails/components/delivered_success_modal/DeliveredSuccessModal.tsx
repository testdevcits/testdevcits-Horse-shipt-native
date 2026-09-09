import React from 'react';
import { Modal, View, Image } from 'react-native';

import { AppText, Button as ButtonCompt } from '../../../../../../components';
import imageIndex from '../../../../../../assets/images/imageIndex';
import styles from './styles.deliveredSuccessModal';

interface DeliveredSuccessModalProps {
  visible: boolean;
  onClose: () => void;
  onLeaveReview?: () => void;
}

const DeliveredSuccessModal = ({
  visible,
  onClose,
  onLeaveReview,
}: DeliveredSuccessModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* SUCCESS GIF ANIMATION */}
          <View style={styles.gifContainer}>
            <Image
              source={imageIndex.success}
              style={styles.successGif}
              resizeMode="contain"
            />
          </View>

          {/* TEXT CONTENT */}
          <AppText style={styles.title}>Shipment Delivered!</AppText>

          <AppText style={styles.description}>
            This shipment has been successfully completed and delivered.
          </AppText>

          {/* ACTION BUTTONS */}
          <View style={styles.buttonContainer}>
            {onLeaveReview && (
              <ButtonCompt
                title="Leave a Review"
                onPress={() => {
                  onClose();
                  onLeaveReview();
                }}
                // buttonStyle={styles.primaryBtn}
                // textStyle={styles.primaryBtnText}
              />
            )}

            <ButtonCompt
              title="Close"
              onPress={onClose}
              buttonStyle={
                onLeaveReview ? styles.secondaryBtn : styles.primaryBtn
              }
              textStyle={
                onLeaveReview ? styles.secondaryBtnText : styles.primaryBtnText
              }
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeliveredSuccessModal;
