import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckCircle, Sparkles, ChevronRight } from 'lucide-react-native';
import { AppText } from '../../../../../components';
import { COLORS, SPACING, RADIUS, FONT_SIZE, FONTS } from '../../../../../constants';

interface Plan {
  priceId: string;
  amount: number;
  currency: string;
  interval: string;
  intervalCount: number;
  productName: string;
  label: string;
  planType: string;
}

interface Props {
  plans: Plan[];
  currentPriceId?: string;
  onSelectPlan: (plan: Plan) => void;
  isSubscribed: boolean;
  isLoading?: boolean;
}

const SubscriptionPlansList: React.FC<Props> = ({
  plans,
  currentPriceId,
  onSelectPlan,
  isSubscribed,
  isLoading,
}) => {
  if (!plans || plans.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Sparkles size={18} color={COLORS.primary} />
        <AppText style={styles.title}>Available Plans</AppText>
      </View>

      {plans.map((plan) => {
        const isCurrentPlan = plan.priceId === currentPriceId;

        return (
          <TouchableOpacity
            key={plan.priceId}
            style={[
              styles.planCard,
              isCurrentPlan && styles.activePlanCard
            ]}
            onPress={() => !isCurrentPlan && onSelectPlan(plan)}
            disabled={isCurrentPlan || isLoading}
            activeOpacity={0.7}
          >
            <View style={styles.planInfo}>
              <View style={styles.labelRow}>
                <AppText style={styles.planLabel}>{plan.label}</AppText>
                {isCurrentPlan && (
                  <View style={styles.currentBadge}>
                    <CheckCircle size={10} color={COLORS.white} />
                    <AppText style={styles.currentBadgeText}>Current</AppText>
                  </View>
                )}
              </View>

              <AppText style={styles.planPrice}>
                ${plan.amount.toFixed(2)}{' '}
                <AppText style={styles.planInterval}>
                  {plan.currency.toUpperCase()} / {plan.interval}
                </AppText>
              </AppText>
            </View>

            {!isCurrentPlan && (
              <View style={styles.actionSection}>
                <AppText style={styles.selectText}>
                  {isSubscribed ? 'Switch' : 'Select'}
                </AppText>
                <ChevronRight size={16} color={COLORS.brandBrown} />
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.sm,
    gap: SPACING.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    justifyContent: 'space-between',
  },
  activePlanCard: {
    borderColor: COLORS.goldBorder,
    backgroundColor: COLORS.goldLightBg,
  },
  planInfo: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  planLabel: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  currentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.emeraldPrimary,
    paddingHorizontal: SPACING.xs2,
    paddingVertical: SPACING.xxs,
    borderRadius: RADIUS.xs,
    gap: SPACING.xxs,
  },
  currentBadgeText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
  },
  planPrice: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  planInterval: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  actionSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  selectText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.brandBrown,
  },
});

export default SubscriptionPlansList;