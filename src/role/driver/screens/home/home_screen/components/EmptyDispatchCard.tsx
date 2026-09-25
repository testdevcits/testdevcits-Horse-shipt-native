import React from 'react';
import { View } from 'react-native';
import { AppText } from '../../../../../../components';
import AppButton from '../../../../../../components/common/Button/AppButton';
import AppIcon from '../../../../../../components/app_icon/AppIcon';
import styles from '../styles.home';
import { COLORS } from '../../../../../../constants';

interface Props {
  onRefresh: () => void;
}

const EmptyDispatchCard: React.FC<Props> = ({ onRefresh }) => {
  return (
    <View style={styles.emptyCard}>
      <View style={styles.emptyIconBox}>
        <AppIcon name={'Radio'} size={24} color={COLORS.primary} />
      </View>
      <AppText style={styles.emptyTitle}>
        No active manifests assigned
      </AppText>
      <AppText style={styles.emptyText}>
        You are currently on standby for dispatch assignments. Tap below to check
        for new trip manifests.
      </AppText>

      <AppButton
        leftIcon={
          <AppIcon name={'RotateCw'} size={16} color={COLORS.white} />
        }
        title="Check for Dispatch"
        onPress={onRefresh}
        buttonStyle={styles.refreshBtn}
      />
    </View>
  );
};

export default EmptyDispatchCard;
