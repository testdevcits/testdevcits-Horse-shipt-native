import React, { memo } from 'react';
import { Modal, View, TouchableOpacity } from 'react-native';
import { LogOut, ArrowRight } from 'lucide-react-native';
import { COLORS, ICON_SIZE } from '../../../constants';
import AppText from '../AppText';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import {
  dismissSessionExpired,
  logoutUser,
} from '../../../redux/slices/authSlice';
import styles from './SessionExpiredModal.styles';

const SessionExpiredModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isSessionExpired = useAppSelector(state => state.auth.isSessionExpired);

  if (!isSessionExpired) {
    return null;
  }

  const handleLoginAgain = () => {
    dispatch(dismissSessionExpired());
    dispatch(logoutUser());
  };

  return (
    <Modal
      transparent
      visible={isSessionExpired}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleLoginAgain}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Icon Badge */}
          <View style={styles.iconBadgeOuter}>
            <LogOut size={32} color={COLORS.primary} strokeWidth={2.2} />
          </View>

          {/* Header Tag */}
          <AppText style={styles.tagText}>SESSION EXPIRED</AppText>

          {/* Title */}
          <AppText style={styles.title}>Session Timed Out</AppText>

          {/* Description */}
          <AppText style={styles.description}>
            Your session has expired for security reasons. Please log in again
            to continue accessing your account.
          </AppText>

          {/* Action Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleLoginAgain}
            activeOpacity={0.88}
          >
            <AppText style={styles.buttonText}>Log In Again</AppText>
            <ArrowRight
              size={ICON_SIZE.sm}
              color={COLORS.white}
              strokeWidth={2.5}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default memo(SessionExpiredModal);
