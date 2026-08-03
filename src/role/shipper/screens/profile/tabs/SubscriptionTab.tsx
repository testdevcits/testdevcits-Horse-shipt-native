import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Crown, CheckCircle, Calendar } from 'lucide-react-native';
import moment from 'moment';
import { AppText } from '../../../../../components';
import { SPACING } from '../../../../../constants';
import styles from './styles.subscriptiontab';

interface Props {
  subscriptionData: any;
  billingHistoryData: any;
  billingFilter: 'All' | 'Invoices' | 'Payments' | 'Payouts';
  setBillingFilter: (filter: 'All' | 'Invoices' | 'Payments' | 'Payouts') => void;
}

const SubscriptionTab: React.FC<Props> = ({
  subscriptionData,
  billingHistoryData,
  billingFilter,
  setBillingFilter,
}) => {
  return (
    <View style={styles.tabSection}>
      <AppText style={styles.sectionHeaderTitle}>Billing & History</AppText>
      <AppText style={styles.sectionHeaderSub}>
        View your subscription, invoices, and transactions
      </AppText>

      {/* Subscription Status Card */}
      <View style={styles.subCardContainer}>
        <View style={styles.subCardHeader}>
          <View style={styles.goldSquareIconBox}>
            <Crown size={22} color="#A06333" />
          </View>

          <View style={styles.subHeaderTextCol}>
            <AppText style={styles.subHeaderTitle}>Subscription Status</AppText>
            <AppText style={styles.subHeaderSub}>
              Your current plan and billing details
            </AppText>
          </View>

          <View style={styles.redCrossCircle}>
            <AppText style={styles.redCrossText}>✕</AppText>
          </View>
        </View>

        <View style={styles.cardDivider} />

        {/* Status Pills */}
        <View style={styles.statusPillsRow}>
          <View style={styles.greenOutlinePill}>
            <AppText style={styles.greenOutlinePillText}>Active</AppText>
          </View>

          <View style={styles.blueOutlinePill}>
            <AppText style={styles.blueOutlinePillText}>
              {subscriptionData?.monthly?.label || 'Monthly Plan'}
            </AppText>
          </View>
        </View>

        {/* Plan Card */}
        <View style={styles.planDetailsBox}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Crown size={16} color="#A06333" />
            <AppText style={styles.planLabel}>Plan</AppText>
          </View>
          <AppText style={styles.planName}>Monthly</AppText>
          <AppText style={styles.planPrice}>
            ${subscriptionData?.monthly?.amount || '19.99'}/month USD
          </AppText>
        </View>

        {/* Subscription Active Banner */}
        <View style={styles.subActiveBanner}>
          <CheckCircle size={18} color="#059669" />
          <AppText style={styles.subActiveBannerText}>Subscription Active</AppText>
        </View>

        {/* Billing History Section */}
        <View style={{ marginTop: SPACING.lg }}>
          <View style={styles.subCardHeader}>
            <View style={styles.goldSquareIconBox}>
              <Calendar size={22} color="#A06333" />
            </View>

            <View style={styles.subHeaderTextCol}>
              <AppText style={styles.subHeaderTitle}>Billing History</AppText>
              <AppText style={styles.subHeaderSub}>
                Invoices, payments, and transactions (USA (ET))
              </AppText>
            </View>
          </View>

          <View style={styles.cardDivider} />

          {/* Filter Pills */}
          <View style={styles.billingFilterRow}>
            {(['All', 'Invoices', 'Payments', 'Payouts'] as const).map(f => (
              <TouchableOpacity
                key={f}
                style={[
                  styles.billingFilterPill,
                  billingFilter === f && styles.billingFilterPillActive,
                ]}
                onPress={() => setBillingFilter(f)}
              >
                <AppText
                  style={[
                    styles.billingFilterText,
                    billingFilter === f && styles.billingFilterTextActive,
                  ]}
                >
                  {f}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>

          {/* Transactions Table */}
          <View style={styles.transactionsTableContainer}>
            <View style={styles.tableHeaderRow}>
              <AppText style={[styles.tableColHeader, { flex: 1.5 }]}>Description</AppText>
              <AppText style={[styles.tableColHeader, { flex: 1.2 }]}>Date & Time</AppText>
              <AppText style={[styles.tableColHeader, { flex: 1.2 }]}>Amount</AppText>
              <AppText style={[styles.tableColHeader, { flex: 1 }]}>Status</AppText>
            </View>

            {(() => {
              const subs = billingHistoryData?.subscriptions || [];
              const pymts = billingHistoryData?.payments || [];
              const pyts = billingHistoryData?.payouts || [];

              let list: any[] = [];
              if (billingFilter === 'Invoices') list = subs;
              else if (billingFilter === 'Payments') list = pymts;
              else if (billingFilter === 'Payouts') list = pyts;
              else list = [...subs, ...pymts, ...pyts];

              if (list.length === 0) {
                list = [
                  {
                    _id: '1',
                    title: 'Card payment receipt',
                    createdAt: '2026-07-18T00:00:00.000Z',
                    amount: 19.99,
                    currency: 'USD',
                    status: 'succeeded',
                  },
                ];
              }

              return list.map((item, idx) => {
                const titleText =
                  item?.title || item?.description || 'Card payment receipt';
                const dateText = moment(
                  item?.createdAt || item?.paidAt || new Date(),
                ).format('MMM DD, YYYY');
                const amountText = `$${item?.amount || '0'} ${(
                  item?.currency || 'USD'
                ).toUpperCase()}`;
                const statusText = item?.status || 'paid';

                return (
                  <View
                    key={item?._id || item?.id || idx}
                    style={[
                      styles.tableBodyRow,
                      idx === list.length - 1 && { borderBottomWidth: 0 },
                    ]}
                  >
                    <AppText style={[styles.tableCellText, { flex: 1.5 }]}>
                      {titleText}
                    </AppText>
                    <AppText style={[styles.tableCellText, { flex: 1.2 }]}>
                      {dateText}
                    </AppText>
                    <AppText style={[styles.tableCellText, { flex: 1.2 }]}>
                      {amountText}
                    </AppText>
                    <View style={{ flex: 1 }}>
                      <View style={styles.succeededPill}>
                        <AppText style={styles.succeededText}>
                          {statusText.charAt(0).toUpperCase() +
                            statusText.slice(1)}
                        </AppText>
                      </View>
                    </View>
                  </View>
                );
              });
            })()}
          </View>
        </View>
      </View>
    </View>
  );
};

export default SubscriptionTab;
