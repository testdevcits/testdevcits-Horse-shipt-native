import React, { memo } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { AppText } from '../../../../../components';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../constants';
import styles from '../styles.earnings';

const PayoutModal = ({ feedbackModal, setFeedbackModal }: any) => {
  return (
    <Modal
      visible={feedbackModal?.visible}
      transparent
      animationType="fade"
      onRequestClose={() =>
        setFeedbackModal((prev: any) => ({ ...prev, visible: false }))
      }
    >
      <View style={styles.modalOverlay}>
        <View style={styles.feedbackModalContent}>
          {feedbackModal?.type === 'success' ? (
            <View style={styles.feedbackIconBoxSuccess}>
              <AppIcon name={'CheckCircle2'} size={36} color={COLORS.success} />
            </View>
          ) : (
            <View style={styles.feedbackIconBoxError}>
              <AppIcon name={'XCircle'} size={36} color={COLORS.error} />
            </View>
          )}

          <AppText style={styles.feedbackTitle}>{feedbackModal?.title}</AppText>
          <AppText style={styles.feedbackSub}>{feedbackModal?.message}</AppText>

          <TouchableOpacity
            style={styles.feedbackBtn}
            onPress={() =>
              setFeedbackModal((prev: any) => ({ ...prev, visible: false }))
            }
            activeOpacity={0.85}
          >
            <AppText style={styles.feedbackBtnText}>Got it</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
export default memo(PayoutModal);
