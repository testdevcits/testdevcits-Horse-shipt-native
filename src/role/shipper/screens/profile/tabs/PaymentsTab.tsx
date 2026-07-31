import React from 'react';
import { View } from 'react-native';
import { Building2, Check } from 'lucide-react-native';
import { AppText } from '../../../../../components';
import styles from './styles.paymentstab';

interface Props {
  stripeStatus: any;
}

const PaymentsTab: React.FC<Props> = ({ stripeStatus }) => {
  return (
    <View style={styles.tabSection}>
      <AppText style={styles.sectionHeaderTitle}>Payment Settings</AppText>
      <AppText style={styles.sectionHeaderSub}>
        Set up your payout account to securely receive payments for completed horse shipments.
      </AppText>

      {/* Shipper Payout Card */}
      <View style={styles.payoutAccountCard}>
        <View style={styles.goldHorseIconBox}>
          <Building2 size={24} color="#A06333" />
        </View>
        <View style={styles.payoutTextCol}>
          <AppText style={styles.payoutTitle}>Horse Shipper Payout Account</AppText>
          <AppText style={styles.payoutSub}>
            Receive payments for completed shipments
          </AppText>
        </View>
      </View>

      <View style={styles.cardDivider} />

      {/* Payout Verified Container */}
      <View style={styles.verifiedCard}>
        <View style={styles.checkSquare}>
          <Check size={16} color="#A06333" />
        </View>
        <View style={styles.verifiedTextCol}>
          <AppText style={styles.verifiedTitle}>
            {stripeStatus?.verified || stripeStatus?.chargesEnabled
              ? 'Payout account Verified'
              : 'Payout account Verification Pending'}
          </AppText>
          <AppText style={styles.verifiedSub}>
            {stripeStatus?.verified || stripeStatus?.payoutsEnabled
              ? 'Your payout accounts connected already to receive payments for your shipments.'
              : 'Complete onboarding requirements to enable payouts and receiving funds.'}
          </AppText>
        </View>
      </View>

      {/* Bottom Encryption Callout */}
      <View style={styles.calloutBanner}>
        <AppText style={styles.calloutText}>
          All transactions are encrypted and securely processed through your payout account.
        </AppText>
      </View>
    </View>
  );
};

export default PaymentsTab;
