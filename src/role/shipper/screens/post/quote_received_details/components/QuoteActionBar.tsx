import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';

import { COLORS } from '../../../../../../constants';
import AppIcon from '../../../../../../components/app_icon/AppIcon';
import AppText from '../../../../../../components/common/AppText';
import styles from '../styles.QuoteReceivedDetails';

interface QuoteActionBarProps {
  onAskQuestionPress: () => void;
  onSubmitOfferPress: () => void;
}

export const QuoteActionBar: React.FC<QuoteActionBarProps> = memo(
  ({ onAskQuestionPress, onSubmitOfferPress }) => {
    return (
      <View style={styles.stickyBottomBar}>
        <TouchableOpacity
          style={styles.askQuestionBtn}
          onPress={onAskQuestionPress}
          activeOpacity={0.8}
        >
          <AppIcon name="MessageSquare" size={16} color={COLORS.primary} />
          <AppText style={styles.askQuestionBtnText}>Ask Question</AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitOfferBtn}
          onPress={onSubmitOfferPress}
          activeOpacity={0.85}
        >
          <AppIcon name="Send" size={16} color={COLORS.white} />
          <AppText style={styles.submitOfferBtnText}>Submit Offer</AppText>
        </TouchableOpacity>
      </View>
    );
  },
);
