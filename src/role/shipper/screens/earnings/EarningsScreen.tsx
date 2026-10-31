import React, { useState, useEffect, lazy, Suspense } from 'react';
import { View, RefreshControl, FlatList, Platform } from 'react-native';

import { useStripe } from '@stripe/stripe-react-native';
import {
  AppHeader,
  EmptyState,
  PaymentsSkeleton,
} from '../../../../components';
import { COLORS, ICON_SIZE } from '../../../../constants';
import shipperService from '../../../../api/services/shipperService';
import styles from './styles.earnings';
import AppIcon from '../../../../components/app_icon/AppIcon';
import PayoutModal from './components/PayoutModal';
import EarningsSummaryHeader from './components/EarningsSummaryHeader';
import { TransactionRowItem } from './components/TransactionRowItem';

const TransactionDetailsModal = lazy(
  () => import('./components/TransactionDetailsModal'),
);
const StripePaymentMethodCardModal = lazy(
  () => import('./components/StripePaymentMethodCardModal'),
);

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

  const showFeedback = (
    type: 'success' | 'error',
    title: string,
    message: string,
  ) => {
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
        setTotalTransactionsCount(res?.totalTransactions || txs.length);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        showFeedback(
          'error',
          'Initialization Failed',
          custRes?.message || 'Failed to initialize customer account.',
        );
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
      showFeedback(
        'error',
        'Setup Error',
        error?.response?.data?.message ||
          error?.message ||
          'Unable to prepare card update.',
      );
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
        const { setupIntent, error: stripeError } = await confirmSetupIntent(
          clientSecret,
          {
            paymentMethodType: 'Card',
            paymentMethodData: {
              billingDetails: {
                name: cardholderName.trim() || undefined,
              },
            },
          },
        );

        if (stripeError) {
          setSubmittingCard(false);
          showFeedback(
            'error',
            'Stripe Error',
            stripeError.message || 'Failed to confirm setup intent.',
          );
          return;
        }

        paymentMethodId =
          typeof setupIntent?.paymentMethod === 'string'
            ? setupIntent.paymentMethod
            : (setupIntent?.paymentMethod as any)?.id || setupIntent?.id || '';
      }

      // Fallback: Create Payment Method via Stripe SDK if setup intent wasn't returned
      if (!paymentMethodId) {
        const { paymentMethod, error: stripeError } = await createPaymentMethod(
          {
            paymentMethodType: 'Card',
            paymentMethodData: {
              billingDetails: {
                name: cardholderName.trim() || undefined,
              },
            },
          },
        );

        if (stripeError) {
          setSubmittingCard(false);
          showFeedback(
            'error',
            'Stripe Error',
            stripeError.message || 'Failed to process card details.',
          );
          return;
        }

        paymentMethodId = paymentMethod?.id || '';
      }

      if (!paymentMethodId) {
        setSubmittingCard(false);
        showFeedback(
          'error',
          'Token Error',
          'Unable to retrieve Stripe payment method token.',
        );
        return;
      }

      // Save Payment Method on backend (/api/shipper/save-payment-method)
      const saveRes = await shipperService.savePaymentMethod({
        paymentMethodId,
      });

      if (saveRes?.success) {
        setCardStatus({
          hasCard: true,
          cardBrand: saveRes.cardBrand || cardDetails?.brand || 'Not Available',
          cardLast4: saveRes.cardLast4 || cardDetails?.last4 || 'Not Available',
          cardExpMonth:
            saveRes.cardExpMonth || cardDetails?.expiryMonth || 'Not Available',
          cardExpYear:
            saveRes.cardExpYear || cardDetails?.expiryYear || 'Not Available',
        });
        setIsCardModalVisible(false);
        showFeedback(
          'success',
          'Card Saved Successfully',
          saveRes.message ||
            'Card saved successfully. Account activated if previously restricted.',
        );
      } else {
        showFeedback(
          'error',
          'Save Error',
          saveRes?.message || 'Failed to save payment method.',
        );
      }
    } catch (error: any) {
      console.error('Save Payment Method Error:', error);
      showFeedback(
        'error',
        'Process Error',
        error?.response?.data?.message ||
          error?.message ||
          'Failed to save payment method.',
      );
    } finally {
      setSubmittingCard(false);
    }
  };

  const renderHeader = () => (
    <EarningsSummaryHeader
      statusLoading={statusLoading}
      cardStatus={cardStatus}
      handleOpenCardModal={handleOpenCardModal}
      initializingCard={initializingCard}
      totalTransactionsCount={totalTransactionsCount}
    />
  );

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View
        style={[
          styles.tableCard,
          { marginTop: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 },
        ]}
      >
        <EmptyState
          icon={
            <AppIcon
              name={'FileText'}
              size={ICON_SIZE.xl}
              color={COLORS.lightGrey}
              strokeWidth={1.5}
            />
          }
          title="No Transactions"
          message="Your payout transactions will appear here."
        />
      </View>
    );
  };

  const renderTxItem = ({ item: tx, index }: { item: any; index: number }) => (
    <TransactionRowItem
      tx={tx}
      isLast={index === transactions.length - 1}
      onSelectTx={setSelectedTx}
    />
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <AppHeader title="Earnings & Payouts" showProfileImage={false} />
        <PaymentsSkeleton />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Earnings & Payouts" showProfileImage={false} />

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
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
      />

      {/* Stripe Payment Method Card Modal */}
      <Suspense fallback={null}>
        <StripePaymentMethodCardModal
          isCardModalVisible={isCardModalVisible}
          setIsCardModalVisible={setIsCardModalVisible}
          cardStatus={cardStatus}
          submittingCard={submittingCard}
          formError={formError}
          cardholderName={cardholderName}
          setCardholderName={setCardholderName}
          cardDetails={cardDetails}
          setCardDetails={setCardDetails}
          handleSavePaymentMethod={handleSavePaymentMethod}
        />
      </Suspense>

      {/* Transaction Details Modal */}
      <Suspense fallback={null}>
        <TransactionDetailsModal
          selectedTx={selectedTx}
          setSelectedTx={setSelectedTx}
        />
      </Suspense>

      {/* Professional Feedback Modal (Replaces Native Alert) */}

      <PayoutModal
        feedbackModal={feedbackModal}
        setFeedbackModal={setFeedbackModal}
      />
    </View>
  );
};

export default EarningsScreen;
