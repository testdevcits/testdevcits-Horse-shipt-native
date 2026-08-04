import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
  FlatList,
} from 'react-native';
import {
  Wallet,
  CreditCard,
  CheckCircle,
  CheckCircle2,
  Edit,
  ExternalLink,
  Eye,
  FileText,
  Plus,
  X,
  XCircle,
  ShieldCheck,
  AlertCircle,
  User,
  Hash,
  Calendar,
  DollarSign,
} from 'lucide-react-native';
import { formatDate } from '../../../../utils/helpers';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { AppHeader, AppText, AppLoader, EmptyState, Input } from '../../../../components';
import { COLORS, FONTS, SPACING, RADIUS, FONT_SIZE } from '../../../../constants';
import shipperService from '../../../../api/services/shipperService';
import styles from './styles.earnings';

interface CardStatusState {
  hasCard: boolean;
  cardLast4: string;
  cardBrand: string;
  cardExpMonth?: number;
  cardExpYear?: number;
}

const EarningsScreen = () => {
  const { confirmSetupIntent, createPaymentMethod } = useStripe();

  const [cardStatus, setCardStatus] = useState<CardStatusState>({
    hasCard: false,
    cardLast4: '',
    cardBrand: '',
  });
  const [statusLoading, setStatusLoading] = useState(true);

  const [transactions, setTransactions] = useState<any[]>([]);
  const [totalTransactionsCount, setTotalTransactionsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Card Modal & Stripe Field State
  const [isCardModalVisible, setIsCardModalVisible] = useState(false);
  const [initializingCard, setInitializingCard] = useState(false);
  const [submittingCard, setSubmittingCard] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [cardDetails, setCardDetails] = useState<any>(null);
  const [cardholderName, setCardholderName] = useState('');
  const [formError, setFormError] = useState<string>('');

  // Transaction Detail Modal State
  const [selectedTx, setSelectedTx] = useState<any | null>(null);

  // Professional Feedback Modal State (Replaces native Alert)
  const [feedbackModal, setFeedbackModal] = useState<{
    visible: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({
    visible: false,
    type: 'success',
    title: '',
    message: '',
  });

  const showFeedback = (type: 'success' | 'error', title: string, message: string) => {
    setFeedbackModal({
      visible: true,
      type,
      title,
      message,
    });
  };

  const fetchCardStatus = async () => {
    try {
      setStatusLoading(true);
      const res = await shipperService.getShipperStatus();
      if (res?.success) {
        setCardStatus({
          hasCard: !!res.hasCard,
          cardLast4: res.cardLast4 || '',
          cardBrand: res.cardBrand || '',
          cardExpMonth: res.cardExpMonth,
          cardExpYear: res.cardExpYear,
        });
      }
    } catch (error: any) {
      console.error('Fetch Shipper Status Error:', error);
    } finally {
      setStatusLoading(false);
    }
  };

  const fetchPayoutHistory = async () => {
    try {
      setLoading(true);
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

  const loadData = async () => {
    await Promise.all([fetchCardStatus(), fetchPayoutHistory()]);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleOpenCardModal = async () => {
    try {
      setInitializingCard(true);
      setFormError('');

      // Step 1: Call /api/shipper/create-customer on Update/Add button press
      const custRes = await shipperService.createCustomer();
      if (!custRes?.success) {
        setInitializingCard(false);
        showFeedback('error', 'Initialization Failed', custRes?.message || 'Failed to initialize customer account.');
        return;
      }

      // Step 2: If create-customer is true, call /api/shipper/setup-intent
      const setupRes = await shipperService.getSetupIntent();
      if (setupRes?.success && setupRes.clientSecret) {
        setClientSecret(setupRes.clientSecret);
      } else {
        setClientSecret('');
      }

      // Reset state & open modal
      setCardDetails(null);
      setCardholderName('');
      setIsCardModalVisible(true);
    } catch (error: any) {
      console.error('Initialize Card Setup Error:', error);
      showFeedback('error', 'Setup Error', error?.response?.data?.message || error?.message || 'Unable to prepare card update.');
    } finally {
      setInitializingCard(false);
    }
  };

  const handleSavePaymentMethod = async () => {
    if (!cardDetails?.complete) {
      setFormError('Please enter valid and complete card details.');
      return;
    }
    setFormError('');

    try {
      setSubmittingCard(true);

      let paymentMethodId = '';

      // Confirm Setup Intent via Stripe SDK if clientSecret is available
      if (clientSecret && clientSecret.includes('_secret_')) {
        const { setupIntent, error: stripeError } = await confirmSetupIntent(clientSecret, {
          paymentMethodType: 'Card',
          paymentMethodData: {
            billingDetails: {
              name: cardholderName.trim() || undefined,
            },
          },
        });

        if (stripeError) {
          setSubmittingCard(false);
          showFeedback('error', 'Stripe Error', stripeError.message || 'Failed to confirm setup intent.');
          return;
        }

        paymentMethodId =
          typeof setupIntent?.paymentMethod === 'string'
            ? setupIntent.paymentMethod
            : (setupIntent?.paymentMethod as any)?.id || setupIntent?.id || '';
      }

      // Fallback: Create Payment Method via Stripe SDK if setup intent wasn't returned
      if (!paymentMethodId) {
        const { paymentMethod, error: stripeError } = await createPaymentMethod({
          paymentMethodType: 'Card',
          paymentMethodData: {
            billingDetails: {
              name: cardholderName.trim() || undefined,
            },
          },
        });

        if (stripeError) {
          setSubmittingCard(false);
          showFeedback('error', 'Stripe Error', stripeError.message || 'Failed to process card details.');
          return;
        }

        paymentMethodId = paymentMethod?.id || '';
      }

      if (!paymentMethodId) {
        setSubmittingCard(false);
        showFeedback('error', 'Token Error', 'Unable to retrieve Stripe payment method token.');
        return;
      }

      // Save Payment Method on backend (/api/shipper/save-payment-method)
      const saveRes = await shipperService.savePaymentMethod({ paymentMethodId });

      if (saveRes?.success) {
        setCardStatus({
          hasCard: true,
          cardBrand: saveRes.cardBrand || cardDetails?.brand || 'visa',
          cardLast4: saveRes.cardLast4 || cardDetails?.last4 || '4242',
          cardExpMonth: saveRes.cardExpMonth || cardDetails?.expiryMonth,
          cardExpYear: saveRes.cardExpYear || cardDetails?.expiryYear,
        });
        setIsCardModalVisible(false);
        showFeedback(
          'success',
          'Card Saved Successfully',
          saveRes.message || 'Card saved successfully. Account activated if previously restricted.',
        );
      } else {
        showFeedback('error', 'Save Error', saveRes?.message || 'Failed to save payment method.');
      }
    } catch (error: any) {
      console.error('Save Payment Method Error:', error);
      showFeedback(
        'error',
        'Process Error',
        error?.response?.data?.message || error?.message || 'Failed to save payment method.',
      );
    } finally {
      setSubmittingCard(false);
    }
  };

  const formatTxId = (id: string) => {
    if (!id) return 'tr_...';
    if (id.length > 16) {
      return `${id.substring(0, 9)}.....${id.substring(id.length - 4)}`;
    }
    return id;
  };

  const renderHeader = () => (
    <>
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
        {statusLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color={COLORS.primary} />
          </View>
        ) : cardStatus.hasCard ? (
          <>
            <View style={styles.activeCardContainer}>
              <View style={styles.cardIconBox}>
                <CreditCard size={18} color="#A06333" />
              </View>
              <View style={styles.activeCardTextCol}>
                <AppText style={styles.activeCardLabel}>Active Card</AppText>
                <AppText style={styles.activeCardNumber}>
                  {(cardStatus.cardBrand || 'VISA').toUpperCase()}....{cardStatus.cardLast4 || '4242'}
                </AppText>
              </View>
              <CheckCircle size={22} color="#10B981" />
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
                  <Edit size={16} color="#A06333" />
                  <AppText style={styles.updateCardBtnText}>Update Card</AppText>
                </>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.noCardContainer}>
            <AppText style={styles.noCardText}>No payment method currently attached.</AppText>
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
                  <Plus size={16} color={COLORS.white} />
                  <AppText style={styles.addCardPrimaryBtnText}>Add Payment Method</AppText>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
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

      {/* Table Column Headers */}
      <View style={[styles.tableCard, { marginBottom: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
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
      </View>
    </>
  );

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={[styles.tableCard, { marginTop: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 }]}>
        <EmptyState
          icon={FileText}
          title="No Transactions"
          message="Your payout transactions will appear here."
        />
      </View>
    );
  };

  const renderTxItem = ({ item: tx, index }: { item: any; index: number }) => {
    const isLast = index === transactions.length - 1;
    const formattedDate = tx.createdAt
      ? formatDate(tx.createdAt, 'MMM DD, YYYY')
      : 'Jul 13, 2026';

    return (
      <View
        style={[
          styles.tableRow,
          isLast && styles.tableRowLast,
          { backgroundColor: COLORS.white, paddingHorizontal: SPACING.md },
        ]}
      >
        {/* ID */}
        <TouchableOpacity
          style={styles.idCol}
          onPress={() => setSelectedTx(tx)}
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
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Earnings & Payouts" showProfileImage={false} />
      <AppLoader visible={loading && !refreshing} />

      <FlatList
        data={transactions}
        keyExtractor={(item, index) => item?.id || index.toString()}
        renderItem={renderTxItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      />

      {/* Stripe Payment Method Card Modal */}
      <Modal
        visible={isCardModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCardModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeaderRow}>
              <AppText style={styles.modalTitle}>
                {cardStatus.hasCard ? 'Update Payment Method' : 'Add Payment Method'}
              </AppText>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setIsCardModalVisible(false)}
                disabled={submittingCard}
              >
                <X size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <AppText style={styles.modalSub}>
              Enter your credit or debit card details securely below.
            </AppText>

            {/* Error Banner */}
            {!!formError && (
              <View style={styles.errorBanner}>
                <AlertCircle size={16} color="#DC2626" />
                <AppText style={styles.errorBannerText}>{formError}</AppText>
              </View>
            )}

            {/* Cardholder Name */}
            <Input
              label="Cardholder Name (Optional)"
              placeholder="e.g. John Doe"
              value={cardholderName}
              onChangeText={setCardholderName}
              editable={!submittingCard}
              leftIcon={<User size={16} color={COLORS.textSecondary} />}
            />

            {/* Stripe Card Field Component */}
            <View style={styles.inputGroup}>
              <AppText style={styles.inputLabel}>Card Details *</AppText>
              <View style={styles.stripeCardContainer}>
                <CardField
                  postalCodeEnabled={true}
                  style={styles.stripeCardField}
                  cardStyle={{
                    backgroundColor: '#FFFFFF',
                    textColor: COLORS.textPrimary,
                    fontSize: FONT_SIZE.md,
                    placeholderColor: COLORS.textLight,
                  }}
                  onCardChange={(details) => setCardDetails(details)}
                />
              </View>
            </View>

            {/* Security Row */}
            <View style={styles.securityRow}>
              <ShieldCheck size={14} color={COLORS.greenSuccess} />
              <AppText style={styles.securityText}>
                Secured & encrypted via Stripe 256-bit SSL
              </AppText>
            </View>

            {/* Modal Actions */}
            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.cancelModalBtn}
                onPress={() => setIsCardModalVisible(false)}
                disabled={submittingCard}
              >
                <AppText style={styles.cancelModalBtnText}>Cancel</AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.submitModalBtn,
                  (!cardDetails?.complete || submittingCard) && { opacity: 0.7 },
                ]}
                onPress={handleSavePaymentMethod}
                disabled={submittingCard}
                activeOpacity={0.85}
              >
                {submittingCard ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <AppText style={styles.submitModalBtnText}>Save Card</AppText>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Transaction Details Modal */}
      <Modal
        visible={!!selectedTx}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedTx(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <AppText style={styles.modalTitle}>Transaction Details</AppText>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setSelectedTx(null)}
              >
                <X size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {selectedTx && (
              <View style={{ gap: SPACING.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Hash size={16} color={COLORS.primary} />
                  <AppText style={{ fontSize: FONT_SIZE.xs, color: COLORS.textSecondary }}>Payout ID:</AppText>
                  <AppText style={{ fontSize: FONT_SIZE.xs, fontFamily: FONTS.bold, color: COLORS.textPrimary, flex: 1 }} numberOfLines={1}>
                    {selectedTx.id}
                  </AppText>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <DollarSign size={16} color={COLORS.primary} />
                  <AppText style={{ fontSize: FONT_SIZE.xs, color: COLORS.textSecondary }}>Amount:</AppText>
                  <AppText style={{ fontSize: FONT_SIZE.xs, fontFamily: FONTS.bold, color: COLORS.textPrimary }}>
                    ${selectedTx.amount} {selectedTx.currency || 'USD'}
                  </AppText>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <FileText size={16} color={COLORS.primary} />
                  <AppText style={{ fontSize: FONT_SIZE.xs, color: COLORS.textSecondary }}>Shipment Code:</AppText>
                  <AppText style={{ fontSize: FONT_SIZE.xs, fontFamily: FONTS.bold, color: COLORS.textPrimary }}>
                    {selectedTx.shipmentCode || 'N/A'}
                  </AppText>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Calendar size={16} color={COLORS.primary} />
                  <AppText style={{ fontSize: FONT_SIZE.xs, color: COLORS.textSecondary }}>Date:</AppText>
                  <AppText style={{ fontSize: FONT_SIZE.xs, fontFamily: FONTS.bold, color: COLORS.textPrimary }}>
                    {selectedTx.createdAt ? formatDate(selectedTx.createdAt, 'MMMM DD, YYYY') : 'N/A'}
                  </AppText>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <CheckCircle size={16} color={COLORS.greenSuccess} />
                  <AppText style={{ fontSize: FONT_SIZE.xs, color: COLORS.textSecondary }}>Status:</AppText>
                  <AppText style={{ fontSize: FONT_SIZE.xs, fontFamily: FONTS.bold, color: COLORS.greenSuccess }}>
                    {(selectedTx.status || 'Paid').toUpperCase()}
                  </AppText>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={[styles.feedbackBtn, { marginTop: SPACING.lg }]}
              onPress={() => setSelectedTx(null)}
            >
              <AppText style={styles.feedbackBtnText}>Close</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Professional Feedback Modal (Replaces Native Alert) */}
      <Modal
        visible={feedbackModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() => setFeedbackModal(prev => ({ ...prev, visible: false }))}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.feedbackModalContent}>
            {feedbackModal.type === 'success' ? (
              <View style={styles.feedbackIconBoxSuccess}>
                <CheckCircle2 size={36} color="#10B981" />
              </View>
            ) : (
              <View style={styles.feedbackIconBoxError}>
                <XCircle size={36} color="#EF4444" />
              </View>
            )}

            <AppText style={styles.feedbackTitle}>{feedbackModal.title}</AppText>
            <AppText style={styles.feedbackSub}>{feedbackModal.message}</AppText>

            <TouchableOpacity
              style={styles.feedbackBtn}
              onPress={() => setFeedbackModal(prev => ({ ...prev, visible: false }))}
              activeOpacity={0.85}
            >
              <AppText style={styles.feedbackBtnText}>Got it</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EarningsScreen;
