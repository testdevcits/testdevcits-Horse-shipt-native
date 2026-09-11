import React, { useCallback } from 'react';
import { View, FlatList, RefreshControl, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, ICON_SIZE } from '../../../../constants';
import {
  AppText,
  EmptyState,
  ErrorView,
  PaymentCard,
  PaymentsSkeleton,
} from '../../../../components';
import { usePayments } from './usePayments';
import AppIcon from '../../../../components/AppIcon';
import styles from './styles.payments';

const Payments = () => {
  const { payments, loading, refreshing, error, fetchPayments } = usePayments();
  const navigation = useNavigation<any>();

  const handlePaymentPress = useCallback(
    (p: any) => {
      navigation.navigate('PaymentDetails', { payment: p });
    },
    [navigation],
  );

  const keyExtractor = useCallback(
    (item: any) => item?.transactionId || String(Math.random()),
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <PaymentCard item={item} onPress={handlePaymentPress} />
    ),
    [handlePaymentPress],
  );

  if (loading && !refreshing)
    return (
      <View style={styles.container}>
        <PaymentsSkeleton />
      </View>
    );
  if (error)
    return <ErrorView message={error} onRetry={() => fetchPayments()} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText style={styles.title}>Transaction History</AppText>
        <AppText style={styles.subtitle}>
          Track your secure shipment payments
        </AppText>
      </View>

      <FlatList
        data={payments}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchPayments(true)}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            // icon={WalletCards}
            icon={
              <AppIcon
                name={'WalletCards'}
                size={ICON_SIZE.xl}
                color={COLORS.lightGrey}
                strokeWidth={1.5}
              />
            }
            title="No Payments Found"
            message="Your payment history will appear here once you book a shipment."
          />
        }
      />
    </View>
  );
};

export default Payments;
