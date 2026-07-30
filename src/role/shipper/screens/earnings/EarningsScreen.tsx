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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },

  // Main Card
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#EEDCBD',
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  walletIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FBF5EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextCol: {
    flex: 1,
  },
  cardTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  cardSub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: SPACING.md,
  },

  // Active Card Container
  activeCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF8F0',
    borderWidth: 1,
    borderColor: '#EEDCBD',
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  cardIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCardTextCol: {
    flex: 1,
  },
  activeCardLabel: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  activeCardNumber: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginTop: 1,
  },
  updateCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#A06333',
    borderRadius: RADIUS.xs,
    paddingVertical: 10,
    gap: 6,
  },
  updateCardBtnText: {
    color: '#A06333',
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
  },

  // Payout History Header
  payoutHistoryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  payoutIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FBF5EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  payoutSectionTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  payoutSectionSub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  // Table Card
  tableCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#EEDCBD',
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  columnHeader: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textSecondary,
  },

  loaderContainer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.xs,
  },
  emptySub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  // Table Row
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  idCol: {
    flex: 2.2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  idText: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
  },
  amountText: {
    flex: 1.5,
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  dateText: {
    flex: 1.8,
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  statusCol: {
    flex: 1.5,
    alignItems: 'flex-end',
  },
  paidBadge: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: RADIUS.round || 999,
  },
  paidBadgeText: {
    color: '#059669',
    fontSize: 11,
    fontFamily: FONTS.medium,
  },
});

export default EarningsScreen;
