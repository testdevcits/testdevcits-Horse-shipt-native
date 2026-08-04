import React, { useCallback } from 'react';
import { View, FlatList, RefreshControl, SafeAreaView, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CreditCard, WalletCards } from 'lucide-react-native';
import { COLORS, SPACING, FONTS, FONT_SIZE } from '../../../../constants';
import { AppLoader, AppText, EmptyState, ErrorView, PaymentCard } from '../../../../components';
import { usePayments } from './usePayments';

const Payments = () => {
  const { payments, loading, refreshing, error, fetchPayments } = usePayments();
  const navigation = useNavigation<any>();

  const handlePaymentPress = useCallback((p: any) => {
    navigation.navigate('PaymentDetails', { payment: p });
  }, [navigation]);

  const keyExtractor = useCallback((item: any) => item?.transactionId || String(Math.random()), []);

  const renderItem = useCallback(({ item }: { item: any }) => (
    <PaymentCard
      item={item}
      onPress={handlePaymentPress}
    />
  ), [handlePaymentPress]);

  if (loading && !refreshing) return <AppLoader visible={true} />;
  if (error) return <ErrorView message={error} onRetry={() => fetchPayments()} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText style={styles.title}>Transaction History</AppText>
        <AppText style={styles.subtitle}>Track your secure shipment payments</AppText>
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
          <RefreshControl refreshing={refreshing} onRefresh={() => fetchPayments(true)} tintColor={COLORS.primary} />
        }
        ListEmptyComponent={
          <EmptyState
            icon={WalletCards}
            title="No Payments Found"
            message="Your payment history will appear here once you book a shipment."
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  title: { fontSize: FONT_SIZE.lg, fontFamily: FONTS.bold, color: COLORS.textPrimary },
  subtitle: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
  list: { padding: SPACING.md, paddingBottom: 100 },
});

export default Payments;