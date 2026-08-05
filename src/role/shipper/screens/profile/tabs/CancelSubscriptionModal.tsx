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
import { AlertCircle, X, CheckSquare, Square } from 'lucide-react-native';
import { AppText } from '../../../../../components';
import { COLORS, FONT_SIZE, FONTS, SPACING, RADIUS } from '../../../../../constants';

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
                <AlertCircle size={22} color="#D97706" />
              </View>

              <View style={styles.headerTextCol}>
                <AppText style={styles.title}>We're sorry to see you go</AppText>
                <AppText style={styles.subtitle}>
                  Please help us understand why you're canceling your subscription
                </AppText>
              </View>

              <TouchableOpacity
                style={styles.closeBtn}
                onPress={onClose}
                disabled={submitting}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={18} color={COLORS.textSecondary} />
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
              Why are you canceling? <AppText style={styles.asterisk}>*</AppText>
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
                  placeholderTextColor={COLORS.textLight || '#94A3B8'}
                  value={otherText}
                  onChangeText={setOtherText}
                  multiline
                  numberOfLines={3}
                  editable={!submitting}
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
                  <CheckSquare size={20} color={COLORS.primary || '#A06333'} />
                ) : (
                  <Square size={20} color={COLORS.textLight || '#94A3B8'} />
                )}
              </View>
              <AppText style={styles.checkboxText}>
                I understand that my subscription will be canceled and I will lose access at the end of my billing period
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
                <ActivityIndicator size="small" color="#FFFFFF" />
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

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  container: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '90%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg || 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  alertIconBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextCol: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZE.md + 1,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary || '#1E293B',
  },
  subtitle: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary || '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  planImpactBox: {
    backgroundColor: '#FFFBEB',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary || '#A06333',
    borderRadius: RADIUS.xs || 6,
    padding: SPACING.sm + 2,
    marginBottom: SPACING.md,
  },
  planImpactTitle: {
    fontSize: FONT_SIZE.xs + 1,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary || '#1E293B',
  },
  planImpactSub: {
    fontSize: FONT_SIZE.xs - 1,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary || '#64748B',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.xs + 1,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary || '#1E293B',
    marginBottom: SPACING.sm,
  },
  asterisk: {
    color: '#EF4444',
  },
  reasonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs + 2,
    marginBottom: SPACING.md,
  },
  reasonBtn: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: RADIUS.xs || 8,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    justifyContent: 'center',
  },
  reasonBtnSelected: {
    borderColor: COLORS.primary || '#A06333',
    backgroundColor: COLORS.goldLightBg || '#FAF6EE',
  },
  reasonBtnText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary || '#1E293B',
  },
  reasonBtnTextSelected: {
    fontFamily: FONTS.bold,
    color: COLORS.primary || '#A06333',
  },
  otherInputWrapper: {
    marginBottom: SPACING.md,
  },
  otherInputLabel: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary || '#64748B',
    marginBottom: 4,
  },
  otherTextInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: RADIUS.xs || 8,
    padding: SPACING.sm,
    fontSize: FONT_SIZE.xs + 1,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary || '#1E293B',
    textAlignVertical: 'top',
    minHeight: 70,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.xs,
    marginVertical: SPACING.xs,
  },
  checkboxBox: {
    marginTop: 2,
  },
  checkboxText: {
    flex: 1,
    fontSize: FONT_SIZE.xs - 1,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary || '#64748B',
    lineHeight: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  keepBtn: {
    flex: 1,
    height: 44,
    borderRadius: RADIUS.xs || 8,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keepBtnText: {
    fontSize: FONT_SIZE.xs + 1,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary || '#1E293B',
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: RADIUS.xs || 8,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnDisabled: {
    backgroundColor: '#FCA5A5',
    opacity: 0.7,
  },
  cancelBtnText: {
    fontSize: FONT_SIZE.xs + 1,
    fontFamily: FONTS.bold,
    color: '#FFFFFF',
  },
  cancelBtnTextDisabled: {
    color: '#FFFFFF',
  },
});

export default memo(CancelSubscriptionModal);
