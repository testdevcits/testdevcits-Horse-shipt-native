import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import AppText from '../../../../../../components/common/AppText';
import styles from '../styles.shippershipmentdetails';

interface Props {
  shipmentCode?: string;
  pendingQuestion: any;
  onAskQuestionPress: () => void;
  onSubmitOfferPress: () => void;
}

export const ShipperCtaActionCard: React.FC<Props> = React.memo(
  ({
    shipmentCode,
    pendingQuestion,
    onAskQuestionPress,
    onSubmitOfferPress,
  }) => {
    return (
      <View style={styles.ctaCard}>
        <AppText style={styles.ctaTitle}>Ready to Respond</AppText>
        <AppText style={styles.ctaSub}>
          Do you have questions about this shipment, or are you ready to submit
          a binding proposal, providing your professional offer?
        </AppText>

        <View style={styles.summaryCodeBox}>
          <AppText style={styles.summaryCodeLabel}>QUESTION SUMMARY</AppText>
          <AppText style={styles.summaryCodeValue}>{shipmentCode}</AppText>
        </View>

        <TouchableOpacity
          style={styles.askQuestionBtn}
          onPress={onAskQuestionPress}
          activeOpacity={0.8}
        >
          <AppText style={styles.askQuestionBtnText}>
            {pendingQuestion ? 'View Pending Question' : 'Ask Question'}
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitOfferBtn}
          onPress={onSubmitOfferPress}
          activeOpacity={0.85}
        >
          <AppText style={styles.submitOfferBtnText}>Submit Proposal</AppText>
        </TouchableOpacity>
      </View>
    );
  },
);
