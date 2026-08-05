import { useState, useEffect, useCallback } from 'react';
import shipperService from '../api/services/shipperService';

export interface ShipperStatus {
  success: boolean;
  hasCard: boolean;
  cardLast4?: string | null;
  cardBrand?: string | null;
}

export interface SubscriptionStatus {
  success: boolean;
  hasSubscription: boolean;
  status: string;
  planType?: string | null;
  hasAccess: boolean;
  needsSubscription: boolean;
  trialActive?: boolean;
  remainingTrialDays?: number;
}

export interface PlanItem {
  priceId: string;
  amount: number;
  currency: string;
  interval: string;
  intervalCount: number;
  productName: string;
  label: string;
  planType: string;
  created?: number;
}

export interface SubscriptionPlansData {
  monthly?: PlanItem;
  daily?: PlanItem;
  yearly?: PlanItem;
  plans?: PlanItem[];
  trialDays?: number;
  hasUsedTrial?: boolean;
  trialEligible?: boolean;
  trialActive?: boolean;
  remainingTrialDays?: number;
  currency?: string;
}

export const useShipperSubscription = () => {
  const [shipperStatus, setShipperStatus] = useState<ShipperStatus>({
    success: true,
    hasCard: false,
    cardLast4: null,
    cardBrand: null,
  });

  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    success: true,
    hasSubscription: false,
    status: 'none',
    planType: null,
    hasAccess: false,
    needsSubscription: true,
  });

  const [plansData, setPlansData] = useState<SubscriptionPlansData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const fetchSubscriptionData = useCallback(async () => {
    setLoading(true);
    try {
      const [statusRes, subStatusRes, plansRes] = await Promise.all([
        shipperService.getShipperStatus().catch(() => null),
        shipperService.getSubscriptionStatus().catch(() => null),
        shipperService.getSubscriptionPlan().catch(() => null),
      ]);

      if (statusRes?.success !== undefined) {
        setShipperStatus({
          success: statusRes.success,
          hasCard: !!statusRes.hasCard,
          cardLast4: statusRes.cardLast4 || null,
          cardBrand: statusRes.cardBrand || null,
        });
      }

      if (subStatusRes?.success !== undefined) {
        setSubscriptionStatus({
          success: subStatusRes.success,
          hasSubscription: !!subStatusRes.hasSubscription,
          status: subStatusRes.status || 'none',
          planType: subStatusRes.planType || null,
          hasAccess: subStatusRes.hasAccess !== false && !subStatusRes.needsSubscription,
          needsSubscription: !!subStatusRes.needsSubscription,
          trialActive: !!subStatusRes.trialActive,
          remainingTrialDays: subStatusRes.remainingTrialDays || 0,
        });
      }

      if (plansRes?.data) {
        setPlansData(plansRes.data);
      }
    } catch (err) {
      console.error('Error fetching shipper subscription details:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptionData();
  }, [fetchSubscriptionData]);

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  /**
   * Guards an action: if the shipper has active access, runs callback.
   * If not, opens the Subscription Required Modal.
   */
  const checkAccessAndRun = (action: () => void) => {
    if (subscriptionStatus.hasAccess && !subscriptionStatus.needsSubscription) {
      action();
    } else {
      setIsModalVisible(true);
    }
  };

  return {
    shipperStatus,
    subscriptionStatus,
    plansData,
    loading,
    isModalVisible,
    openModal,
    closeModal,
    checkAccessAndRun,
    refreshStatus: fetchSubscriptionData,
  };
};

export default useShipperSubscription;
