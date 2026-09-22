import React, { useState, memo } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { AppText } from '../../../../../../components';
import {
  COLORS,
  FONT_SIZE,
  FONTS,
  SPACING,
  RADIUS,
} from '../../../../../../constants';
import AppIcon from '../../../../../../components/app_icon/AppIcon';
import styles from './styles.CancelSubscription';

interface CancelSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirmCancel: (reason: string) => Promise<void>;
  planName?: string;
  submitting?: boolean;
}

const REASON_OPTIONS = [
  'Too expensive',
  'Not using the service',
  'Poor quality or performance',
  'Found a better alternative',
  'Technical issues',
  'Poor customer service',
  'Other reason',
];

const CancelSubscriptionModal: React.FC<CancelSubscriptionModalProps> = ({
  visible,
  onClose,
  onConfirmCancel,
  planName = 'Monthly Plan',
  submitting = false,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [otherText, setOtherText] = useState<string>('');
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleSelectReason = (reason: string) => {
    setSelectedReason(reason);
  };

  const handleCancelSubmit = async () => {
    if (!selectedReason || !isChecked || submitting) return;

    let finalReason = selectedReason;
    if (selectedReason === 'Other reason') {
      finalReason = `Other: ${otherText.trim() || 'No detail provided'}`;
    }

    await onConfirmCancel(finalReason);
  };

  const isSubmitDisabled = !selectedReason || !isChecked || submitting;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.alertIconBox}>
                <AppIcon
                  name="AlertCircle"
                  size={22}
                  color={COLORS.amberPrimary}
                />
              </View>

              <View style={styles.headerTextCol}>
                <AppText style={styles.title}>
                  We're sorry to see you go
                </AppText>
                <AppText style={styles.subtitle}>
                  Please help us understand why you're canceling your
                  subscription
                </AppText>
              </View>

              <TouchableOpacity
                style={styles.closeBtn}
                onPress={onClose}
                disabled={submitting}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <AppIcon name="X" size={18} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Canceling Plan Warning Box */}
            <View style={styles.planImpactBox}>
              <AppText style={styles.planImpactTitle}>
                Canceling {planName}
              </AppText>
              <AppText style={styles.planImpactSub}>
                You'll lose access at the end of your current billing period
              </AppText>
            </View>

            {/* Reason Selection Title */}
            <AppText style={styles.sectionTitle}>
              Why are you canceling?{' '}
              <AppText style={styles.asterisk}>*</AppText>
            </AppText>

            {/* Reason Buttons Grid */}
            <View style={styles.reasonsGrid}>
              {REASON_OPTIONS.map(reason => {
                const isSelected = selectedReason === reason;
                return (
                  <TouchableOpacity
                    key={reason}
                    style={[
                      styles.reasonBtn,
                      isSelected && styles.reasonBtnSelected,
                    ]}
                    onPress={() => handleSelectReason(reason)}
                    activeOpacity={0.7}
                    disabled={submitting}
                  >
                    <AppText
                      style={[
                        styles.reasonBtnText,
                        isSelected && styles.reasonBtnTextSelected,
                      ]}
                    >
                      {reason}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Other Reason Text Input */}
            {selectedReason === 'Other reason' && (
              <View style={styles.otherInputWrapper}>
                <AppText style={styles.otherInputLabel}>
                  Please specify the reason:
                </AppText>
                <TextInput
                  style={styles.otherTextInput}
                  placeholder="Tell us why you are canceling..."
                  placeholderTextColor={COLORS.textLight}
                  value={otherText}
                  onChangeText={setOtherText}
                  multiline
                  numberOfLines={3}
                  editable={!submitting}
                  allowFontScaling={false}
                />
              </View>
            )}

            {/* Checkbox Confirmation */}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setIsChecked(!isChecked)}
              activeOpacity={0.8}
              disabled={submitting}
            >
              <View style={styles.checkboxBox}>
                {isChecked ? (
                  <AppIcon
                    name="CheckSquare"
                    size={20}
                    color={COLORS.primary}
                  />
                ) : (
                  <AppIcon name="Square" size={20} color={COLORS.textLight} />
                )}
              </View>
              <AppText style={styles.checkboxText}>
                I understand that my subscription will be canceled and I will
                lose access at the end of my billing period
              </AppText>
            </TouchableOpacity>
          </ScrollView>

          {/* Modal Bottom Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.keepBtn}
              onPress={onClose}
              disabled={submitting}
              activeOpacity={0.8}
            >
              <AppText style={styles.keepBtnText}>Keep Subscription</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.cancelBtn,
                isSubmitDisabled && styles.cancelBtnDisabled,
              ]}
              onPress={handleCancelSubmit}
              disabled={isSubmitDisabled}
              activeOpacity={0.85}
            >
              {submitting ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <AppText
                  style={[
                    styles.cancelBtnText,
                    isSubmitDisabled && styles.cancelBtnTextDisabled,
                  ]}
                >
                  Cancel Subscription
                </AppText>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

 

export default memo(CancelSubscriptionModal);
