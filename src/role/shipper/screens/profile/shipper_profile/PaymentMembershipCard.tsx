import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { AppText } from '../../../../../components';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../constants';
import styles from './styles.shipperprofile';

interface PaymentMembershipCardProps {
  navigation: any;
  isStripeConnected: boolean;
}

const PaymentMembershipCard: React.FC<PaymentMembershipCardProps> = ({
  navigation,
  isStripeConnected,
}) => {
  return (
    <View style={styles.menuSection}>
      <AppText style={styles.sectionTitle}>Payments & Membership</AppText>
      <View style={styles.menuCard}>
        {/* Payout Account (Stripe) */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('ShipperPayments')}
          activeOpacity={0.7}
        >
          <View style={styles.menuIconBox}>
            <AppIcon name="CreditCard" size={18} color={COLORS.saddleBrown} />
          </View>
          <View style={styles.menuContent}>
            <AppText style={styles.menuItemTitle}>
              Payment Settings & Payouts
            </AppText>
            <AppText style={styles.menuItemSub}>
              Stripe payout account & bank setup
            </AppText>
          </View>
          <View style={styles.menuRightRow}>
            <View
              style={[
                styles.badgePill,
                isStripeConnected && styles.badgePillConnected,
              ]}
            >
              <AppText
                style={[
                  styles.badgeText,
                  isStripeConnected && styles.badgeTextConnected,
                ]}
              >
                {isStripeConnected ? 'Connected' : 'Action Needed'}
              </AppText>
            </View>
            <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
          </View>
        </TouchableOpacity>

        {/* Subscription & Billing */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('ShipperSubscription')}
          activeOpacity={0.7}
        >
          <View style={styles.menuIconBox}>
            <AppIcon name="Sparkles" size={18} color={COLORS.saddleBrown} />
          </View>
          <View style={styles.menuContent}>
            <AppText style={styles.menuItemTitle}>
              Subscription & Billing
            </AppText>
            <AppText style={styles.menuItemSub}>
              Active plan, invoices & upgrade options
            </AppText>
          </View>
          <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
        </TouchableOpacity>

        {/* Earnings History */}
        <TouchableOpacity
          style={[styles.menuItem, styles.menuItemLast]}
          onPress={() => navigation.navigate('Earnings')}
          activeOpacity={0.7}
        >
          <View style={styles.menuIconBox}>
            <AppIcon name="Wallet" size={18} color={COLORS.saddleBrown} />
          </View>
          <View style={styles.menuContent}>
            <AppText style={styles.menuItemTitle}>
              Earnings & Payout Logs
            </AppText>
            <AppText style={styles.menuItemSub}>
              Track total earnings & payout history
            </AppText>
          </View>
          <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(PaymentMembershipCard);
