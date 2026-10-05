import React, { lazy, Suspense } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { COLORS } from '../../../../constants';
import AppText from '../../../../components/common/AppText';
import styles from './styles.deliveryverification';
import AppIcon from '../../../../components/app_icon/AppIcon';
import useDeliveryVerification from './useDeliveryVerification';
import DeliveryShipmentCard from './components/DeliveryShipmentCard';
import DeliveryStepContent from './components/DeliveryStepContent';

interface ProgressStepperProps {
  step: number;
  activeTab: number;
  onTabPress: (tab: 1 | 2 | 3) => void;
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({
  step,
  activeTab,
  onTabPress,
}) => {
  const tabs = [
    { id: 1 as const, title: 'Send OTP' },
    { id: 2 as const, title: 'Verify OTP' },
    { id: 3 as const, title: 'Complete' },
  ];

  return (
    <View style={styles.tabStepperWrapper}>
      <View style={styles.tabStepperContainer}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          const isCompleted = step > tab.id;
          const isUnlocked = tab.id <= step;

          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.8}
              onPress={() => onTabPress(tab.id)}
              style={[
                styles.tabItem,
                isActive && styles.tabItemActive,
                !isActive && isCompleted && styles.tabItemCompleted,
                !isActive &&
                  !isCompleted &&
                  !isUnlocked &&
                  styles.tabItemLocked,
              ]}
            >
              <View
                style={[
                  styles.tabBadge,
                  isActive && styles.tabBadgeActive,
                  !isActive && isCompleted && styles.tabBadgeCompleted,
                ]}
              >
                {isCompleted && !isActive ? (
                  <AppIcon name="Check" size={10} color="#065F46" />
                ) : (
                  <AppText
                    style={[
                      styles.tabBadgeText,
                      isActive && styles.tabBadgeTextActive,
                    ]}
                  >
                    {tab.id}
                  </AppText>
                )}
              </View>
              <AppText
                numberOfLines={1}
                style={[
                  styles.tabTitle,
                  isActive && styles.tabTitleActive,
                  !isActive && isCompleted && styles.tabTitleCompleted,
                ]}
              >
                {tab.title}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const DeliveryVerificationScreen = () => {
  const ConfirmationModal = lazy(
    () =>
      import(
        '../../../../components/common/ConfirmationModal/ConfirmationModal'
      ),
  );
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // Extract shipment details from navigation parameters
  const shipment = route.params?.shipment || {};

  const {
    step,
    activeTab,
    handleTabPress,
    isLoading,
    otpSentSuccess,
    setOtp,
    modalConfig,
    handleVerifyOtp,
    handleSendOtp,
    handleDone,
    otp,
    setModalConfig,
  } = useDeliveryVerification({ shipment, navigation });

  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flexOne}
      >
        {/* Navigation Header */}
        <View style={styles.navBar}>
          {step < 3 && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <AppIcon name="ArrowLeft" size={22} color={COLORS.textPrimary} />
            </TouchableOpacity>
          )}
          <View style={styles.navTitleContainer}>
            <AppText style={styles.navTitle}>Delivery Verification</AppText>
            <AppText style={styles.navSubtitle}>
              Section {activeTab} of 3 •{' '}
              {activeTab === 1
                ? 'Send OTP'
                : activeTab === 2
                ? 'Verify Code'
                : 'Complete Manifest'}
            </AppText>
          </View>
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Segmented Stepper Tabs Header */}
          <ProgressStepper
            step={step}
            activeTab={activeTab}
            onTabPress={handleTabPress}
          />

          {/* Shipment Manifest Details Card */}
          <DeliveryShipmentCard shipment={shipment} />

          {/* Dynamic Action Section corresponding to Active Tab */}
          <DeliveryStepContent
            step={step}
            activeTab={activeTab}
            otpSentSuccess={otpSentSuccess}
            otp={otp}
            setOtp={setOtp}
            onSendOtp={handleSendOtp}
          />
        </ScrollView>

        {/* Footer Action Button synced with Active Tab */}
        <View style={styles.footerContainer}>
          {activeTab === 1 && (
            <TouchableOpacity
              style={styles.goldActionButton}
              onPress={step > 1 ? () => handleTabPress(2) : handleSendOtp}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <AppIcon
                    name={step > 1 ? 'ArrowRight' : 'Send'}
                    size={18}
                    color={COLORS.white}
                    style={styles.actionBtnIcon}
                  />
                  <AppText style={styles.actionBtnText}>
                    {step > 1
                      ? 'Proceed to Enter Code'
                      : 'Send OTP to Customer'}
                  </AppText>
                </>
              )}
            </TouchableOpacity>
          )}

          {activeTab === 2 && (
            <TouchableOpacity
              style={styles.goldActionButton}
              onPress={step === 3 ? () => handleTabPress(3) : handleVerifyOtp}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <AppIcon
                    name={step === 3 ? 'ArrowRight' : 'Check'}
                    size={18}
                    color={COLORS.white}
                    style={styles.actionBtnIcon}
                  />
                  <AppText style={styles.actionBtnText}>
                    {step === 3 ? 'Proceed to Complete' : 'Verify OTP Code'}
                  </AppText>
                </>
              )}
            </TouchableOpacity>
          )}

          {activeTab === 3 && (
            <TouchableOpacity
              style={[
                styles.goldActionButton,
                {
                  backgroundColor: COLORS.success,
                  shadowColor: COLORS.success,
                },
              ]}
              onPress={handleDone}
              activeOpacity={0.85}
            >
              <AppIcon
                name="CheckCircle"
                size={18}
                color={COLORS.white}
                style={styles.actionBtnIcon}
              />
              <AppText style={styles.actionBtnText}>Complete Manifest</AppText>
            </TouchableOpacity>
          )}
        </View>

        {/* Confirmation & Alert Modal */}
        <Suspense fallback={null}>
          <ConfirmationModal
            isVisible={modalConfig?.isVisible}
            onClose={() =>
              setModalConfig(prev => ({ ...prev, isVisible: false }))
            }
            onConfirm={() =>
              setModalConfig(prev => ({ ...prev, isVisible: false }))
            }
            title={modalConfig?.title}
            description={modalConfig?.description}
            type={modalConfig?.type}
            confirmText="Got It"
            cancelText="Close"
          />
        </Suspense>
      </KeyboardAvoidingView>
    </View>
  );
};

export default DeliveryVerificationScreen;
