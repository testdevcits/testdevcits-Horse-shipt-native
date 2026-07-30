import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  Wallet,
  CreditCard,
  CheckCircle,
  Edit,
  ExternalLink,
  Eye,
  FileText,
} from 'lucide-react-native';
import moment from 'moment';
import { AppHeader, AppText } from '../../../../components';
import { COLORS, FONTS, SPACING, RADIUS, FONT_SIZE } from '../../../../constants';
import shipperService from '../../../../api/services/shipperService';
import styles from './styles.earnings';

const EarningsScreen = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [totalTransactionsCount, setTotalTransactionsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPayoutHistory = async () => {
    try {
      const res = await shipperService.getPayoutHistory({ limit: 20 });
      if (res?.success || res?.transactions) {
        const txs = res.transactions || [];
        setTransactions(txs);
        setTotalTransactionsCount(res.totalTransactions || txs.length);
      }
    } catch (error: any) {
      console.error('Fetch Payout History Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPayoutHistory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPayoutHistory();
  };

  const handleUpdateCard = () => {
    Alert.alert(
      'Update Payment Method',
      'Card updates are securely managed via Stripe Connect account settings.',
    );
  };

  const handleViewTxDetails = (tx: any) => {
    Alert.alert(
      'Transaction Details',
      `Payout ID: ${tx.id}\nAmount: $${tx.amount} ${tx.currency}\nShipment: ${tx.shipmentCode || 'N/A'}\nDate: ${
        tx.createdAt ? moment(tx.createdAt).format('MMMM DD, YYYY') : 'N/A'
      }\nStatus: ${tx.status}`,
    );
  };

  const formatTxId = (id: string) => {
    if (!id) return 'tr_...';
    if (id.length > 16) {
      return `${id.substring(0, 9)}.....${id.substring(id.length - 4)}`;
    }
    return id;
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Earnings & Payouts" showNotificationBell />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.goldPrimary}
          />
        }
      >
        {/* Payments & Payouts Card */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.walletIconBox}>
              <Wallet size={22} color="#A06333" />
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
          <View style={styles.activeCardContainer}>
            <View style={styles.cardIconBox}>
              <CreditCard size={18} color="#A06333" />
            </View>
            <View style={styles.activeCardTextCol}>
              <AppText style={styles.activeCardLabel}>Active Card</AppText>
              <AppText style={styles.activeCardNumber}>VISA....4242</AppText>
            </View>
            <CheckCircle size={22} color="#10B981" />
          </View>

          {/* Update Card Button */}
          <TouchableOpacity
            style={styles.updateCardBtn}
            onPress={handleUpdateCard}
            activeOpacity={0.8}
          >
            <Edit size={16} color="#A06333" />
            <AppText style={styles.updateCardBtnText}>Update Card</AppText>
          </TouchableOpacity>
        </View>

        {/* Payout History Section */}
        <View style={styles.payoutHistoryHeaderRow}>
          <View style={styles.payoutIconBox}>
            <ExternalLink size={20} color="#A06333" />
          </View>
          <View>
            <AppText style={styles.payoutSectionTitle}>Payout History</AppText>
            <AppText style={styles.payoutSectionSub}>
              {totalTransactionsCount} {totalTransactionsCount === 1 ? 'transaction' : 'transactions'}
            </AppText>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Table View */}
        <View style={styles.tableCard}>
          {/* Table Column Headers */}
          <View style={styles.tableHeaderRow}>
            <AppText style={[styles.columnHeader, { flex: 2.2 }]}>ID</AppText>
            <AppText style={[styles.columnHeader, { flex: 1.5, textAlign: 'center' }]}>
              Amount
            </AppText>
            <AppText style={[styles.columnHeader, { flex: 1.8, textAlign: 'center' }]}>
              Date
            </AppText>
            <AppText style={[styles.columnHeader, { flex: 1.5, textAlign: 'right' }]}>
              Status
            </AppText>
          </View>

          {/* Table Content */}
          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={COLORS.goldPrimary} />
            </View>
          ) : transactions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FileText size={36} color={COLORS.textLight} />
              <AppText style={styles.emptyTitle}>No Transactions</AppText>
              <AppText style={styles.emptySub}>
                Your payout transactions will appear here.
              </AppText>
            </View>
          ) : (
            transactions.map((tx, index) => {
              const isLast = index === transactions.length - 1;
              const formattedDate = tx.createdAt
                ? moment(tx.createdAt).format('MMM DD, YYYY')
                : 'Jul 13, 2026';

              return (
                <View
                  key={tx.id || index}
                  style={[styles.tableRow, isLast && styles.tableRowLast]}
                >
                  {/* ID */}
                  <TouchableOpacity
                    style={styles.idCol}
                    onPress={() => handleViewTxDetails(tx)}
                  >
                    <AppText style={styles.idText} numberOfLines={1}>
                      {formatTxId(tx.id)}
                    </AppText>
                    <Eye size={13} color={COLORS.textSecondary} />
                  </TouchableOpacity>

                  {/* Amount */}
                  <AppText style={styles.amountText}>
                    ${tx.amount ? (tx.amount % 1 === 0 ? tx.amount.toFixed(2) : tx.amount) : '829.92'}
                  </AppText>

                  {/* Date */}
                  <AppText style={styles.dateText}>{formattedDate}</AppText>

                  {/* Status Badge */}
                  <View style={styles.statusCol}>
                    <View style={styles.paidBadge}>
                      <AppText style={styles.paidBadgeText}>
                        {(tx.status || 'Paid').charAt(0).toUpperCase() +
                          (tx.status || 'Paid').slice(1)}
                      </AppText>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default EarningsScreen;
