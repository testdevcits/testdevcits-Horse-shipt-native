import React from 'react';
import { View, TouchableOpacity, Linking } from 'react-native';
import { AppText } from '../../../../../../../components';
import AppIcon from '../../../../../../../components/app_icon/AppIcon';
import { COLORS, SPACING } from '../../../../../../../constants';
import { formatDate } from '../../../../../../../utils/helpers';
import styles from '../styles.subscriptiontab';

interface BillingHistorySectionProps {
  billingFilter: 'All' | 'Invoices' | 'Payments' | 'Payouts';
  setBillingFilter: (filter: 'All' | 'Invoices' | 'Payments' | 'Payouts') => void;
  subscriptionsList: any[];
  paymentsList: any[];
  payoutsList: any[];
  filteredList: any[];
}

export const BillingHistorySection: React.FC<BillingHistorySectionProps> = ({
  billingFilter,
  setBillingFilter,
  subscriptionsList,
  paymentsList,
  payoutsList,
  filteredList,
}) => {
  const handleOpenUrl = (url?: string) => {
    if (url) {
      Linking.openURL(url).catch(err =>
        console.error('Failed to open URL:', err),
      );
    }
  };

  const filterTabs = [
    {
      label: 'All',
      count:
        subscriptionsList.length + paymentsList.length + payoutsList.length,
    },
    { label: 'Invoices', count: subscriptionsList.length },
    { label: 'Payments', count: paymentsList.length },
    { label: 'Payouts', count: payoutsList.length },
  ] as const;

  return (
    <View style={{ marginTop: SPACING.lg }}>
      <View style={styles.subCardHeader}>
        <View style={styles.goldSquareIconBox}>
          <AppIcon name="Calendar" size={22} color={COLORS.brandBrown} />
        </View>

        <View style={styles.subHeaderTextCol}>
          <AppText style={styles.subHeaderTitle}>Billing History</AppText>
          <AppText style={styles.subHeaderSub}>
            Invoices, receipts, and payment transactions
          </AppText>
        </View>
      </View>

      <View style={styles.cardDivider} />

      {/* Filter Pills */}
      <View style={styles.billingFilterRow}>
        {filterTabs.map(f => (
          <TouchableOpacity
            key={f.label}
            style={[
              styles.billingFilterPill,
              billingFilter === f.label && styles.billingFilterPillActive,
            ]}
            onPress={() => setBillingFilter(f.label)}
          >
            <AppText
              style={[
                styles.billingFilterText,
                billingFilter === f.label && styles.billingFilterTextActive,
              ]}
            >
              {f.label} ({f.count})
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Transactions List */}
      <View style={styles.historyListContainer}>
        {filteredList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <AppIcon name="FileText" size={32} color={COLORS.textLight} />
            <AppText style={styles.emptyTitle}>No records found</AppText>
            <AppText style={styles.emptySub}>
              No {billingFilter.toLowerCase()} available for this account.
            </AppText>
          </View>
        ) : (
          filteredList.map((item, idx) => {
            const isInvoice =
              !!item.invoicePdf ||
              !!item.hostedInvoiceUrl ||
              item.displayType === 'invoice' ||
              item.displayType === 'trial';
            const isPayment =
              !!item.receiptUrl || item.paymentMethod === 'card';

            const targetUrl =
              item.invoicePdf || item.hostedInvoiceUrl || item.receiptUrl;

            const dateStr = formatDate(
              item.createdAt || item.paidAt || item.periodStart || new Date(),
              'MMM DD, YYYY • hh:mm A',
            );

            const titleText =
              item.title ||
              item.description ||
              (isInvoice
                ? 'Subscription Invoice'
                : isPayment
                ? 'Card Payment Receipt'
                : 'Payout Transfer');

            const statusStr = (item.status || 'paid').toLowerCase();
            const isSuccessStatus =
              statusStr === 'paid' || statusStr === 'succeeded';

            return (
              <View
                key={item.id || item._id || idx}
                style={[
                  styles.historyCardItem,
                  idx === filteredList.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                {/* Left Type Icon */}
                <View style={styles.itemIconBox}>
                  {isInvoice ? (
                    <AppIcon
                      name="FileText"
                      size={18}
                      color={COLORS.brandBrown}
                    />
                  ) : isPayment ? (
                    <AppIcon
                      name="CreditCard"
                      size={18}
                      color={COLORS.bluePrimary}
                    />
                  ) : (
                    <AppIcon
                      name="ArrowUpRight"
                      size={18}
                      color={COLORS.emeraldPrimary}
                    />
                  )}
                </View>

                {/* Content Details */}
                <View style={styles.itemContentCol}>
                  <View style={styles.itemTopRow}>
                    <AppText style={styles.itemTitleText} numberOfLines={1}>
                      {titleText}
                    </AppText>
                    <AppText style={styles.itemAmountText}>
                      {item.isNoChargeInvoice || item.amount === 0
                        ? 'Free'
                        : `$${Number(item.amount).toFixed(2)} ${(
                            item.currency || 'USD'
                          ).toUpperCase()}`}
                    </AppText>
                  </View>

                  <View style={styles.itemBottomRow}>
                    <AppText style={styles.itemDateText}>{dateStr}</AppText>

                    {item.cardBrand && item.last4 ? (
                      <AppText style={styles.itemCardText}>
                        • {item.cardBrand.toUpperCase()} •••• {item.last4}
                      </AppText>
                    ) : null}
                  </View>

                  {/* Status & PDF Link Row */}
                  <View style={styles.itemBadgeRow}>
                    <View
                      style={[
                        styles.statusBadgePill,
                        isSuccessStatus
                          ? styles.statusBadgeSuccess
                          : styles.statusBadgeTrial,
                      ]}
                    >
                      <AppText
                        style={[
                          styles.statusBadgeText,
                          isSuccessStatus
                            ? styles.statusBadgeTextSuccess
                            : styles.statusBadgeTextTrial,
                        ]}
                      >
                        {item.isTrialInvoice
                          ? 'Trial Invoice'
                          : (item.status || 'paid').toUpperCase()}
                      </AppText>
                    </View>

                    {targetUrl ? (
                      <TouchableOpacity
                        style={styles.viewPdfBtn}
                        onPress={() => handleOpenUrl(targetUrl)}
                        activeOpacity={0.7}
                      >
                        <AppIcon
                          name="ExternalLink"
                          size={12}
                          color={COLORS.saddleBrown}
                        />
                        <AppText style={styles.viewPdfBtnText}>
                          {isInvoice ? 'View PDF' : 'Receipt'}
                        </AppText>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
};
