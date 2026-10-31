import { View, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { memo } from 'react';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import { AppText } from '../../../../../components';
import { COLORS } from '../../../../../constants';
import styles from '../styles.earnings';

interface EarningsSummaryHeader {
  statusLoading: boolean;
  cardStatus: any;
  handleOpenCardModal: () => void;
  initializingCard: boolean;
  totalTransactionsCount: any;
}

const EarningsSummaryHeader = ({
  statusLoading,
  cardStatus,
  handleOpenCardModal,
  initializingCard,
  totalTransactionsCount,
}: EarningsSummaryHeader) => (
  <>
    {/* Payments & Payouts Card */}
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.walletIconBox}>
          <AppIcon name={'Wallet'} size={22} color={COLORS.saddleBrown} />
        </View>
        <View style={styles.headerTextCol}>
          <AppText style={styles.cardTitle}>Payments & Payouts</AppText>
          <AppText style={styles.cardSub}>
            Manage payment methods and track earnings
          </AppText>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Active Card Container */}
      {statusLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      ) : cardStatus?.hasCard ? (
        <>
          <View style={styles.activeCardContainer}>
            <View style={styles.cardIconBox}>
              <AppIcon
                name={'CreditCard'}
                size={18}
                color={COLORS.saddleBrown}
              />
            </View>
            <View style={styles.activeCardTextCol}>
              <AppText style={styles.activeCardLabel}>Active Card</AppText>
              <AppText style={styles.activeCardNumber}>
                {(cardStatus?.cardBrand || 'Not Available').toUpperCase()}....
                {cardStatus?.cardLast4 || 'Not Available'}
              </AppText>
            </View>
            <AppIcon name={'CheckCircle'} size={22} color={COLORS.success} />
          </View>

          <TouchableOpacity
            style={styles.updateCardBtn}
            onPress={handleOpenCardModal}
            disabled={initializingCard}
            activeOpacity={0.8}
          >
            {initializingCard ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <>
                <AppIcon name={'Edit'} size={16} color={COLORS.saddleBrown} />
                <AppText style={styles.updateCardBtnText}>Update Card</AppText>
              </>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.noCardContainer}>
          <AppText style={styles.noCardText}>
            No payment method currently attached.
          </AppText>
          <TouchableOpacity
            style={styles.addCardPrimaryBtn}
            onPress={handleOpenCardModal}
            disabled={initializingCard}
            activeOpacity={0.8}
          >
            {initializingCard ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <>
                <AppIcon name={'Plus'} size={16} color={COLORS.white} />
                <AppText style={styles.addCardPrimaryBtnText}>
                  Add Payment Method
                </AppText>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>

    {/* Payout History Section */}
    <View style={styles.payoutHistoryHeaderRow}>
      <View style={styles.payoutIconBox}>
        <AppIcon name={'ExternalLink'} size={20} color={COLORS.saddleBrown} />
      </View>
      <View>
        <AppText style={styles.payoutSectionTitle}>Payout History</AppText>
        <AppText style={styles.payoutSectionSub}>
          {totalTransactionsCount}{' '}
          {totalTransactionsCount === 1 ? 'transaction' : 'transactions'}
        </AppText>
      </View>
    </View>

    <View style={styles.divider} />

    {/* Table Column Headers */}
    <View
      style={[
        styles.tableCard,
        {
          marginBottom: 0,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        },
      ]}
    >
      <View style={styles.tableHeaderRow}>
        <AppText style={[styles.columnHeader, { flex: 2.2 }]}>ID</AppText>
        <AppText
          style={[styles.columnHeader, { flex: 1.5, textAlign: 'center' }]}
        >
          Amount
        </AppText>
        <AppText
          style={[styles.columnHeader, { flex: 1.8, textAlign: 'center' }]}
        >
          Date
        </AppText>
        <AppText
          style={[styles.columnHeader, { flex: 1.5, textAlign: 'right' }]}
        >
          Status
        </AppText>
      </View>
    </View>
  </>
);

export default memo(EarningsSummaryHeader);
