import React from 'react';
import { View, FlatList, RefreshControl, SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CreditCard, WalletCards } from 'lucide-react-native';
import { COLORS, SPACING, FONTS } from '../../../../constants';
import { AppLoader, AppText, EmptyState, ErrorView, PaymentCard } from '../../../../components';
import { usePayments } from './usePayments';
 
 
const Payments = () => {
  const { payments, loading, refreshing, error, fetchPayments } = usePayments();
  const navigation = useNavigation<any>();

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
        keyExtractor={(item) => item.transactionId}
        renderItem={({ item }) => (
          <PaymentCard
            item={item} 
            onPress={(p) => navigation.navigate('PaymentDetails', { payment: p })} 
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => fetchPayments(true)} tintColor={COLORS.goldPrimary} />
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
  header: { padding: SPACING.lg, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  title: { fontSize: 24, fontFamily: FONTS.bold, color: COLORS.textPrimary },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  list: { padding: SPACING.lg, paddingBottom: 100 },
});

export default Payments;