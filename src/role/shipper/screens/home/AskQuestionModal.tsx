import React, { useState, useEffect, useRef, memo } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { X, Send, MessageSquare, Clock, CheckCheck, Check } from 'lucide-react-native';
import { formatDate } from '../../../../utils/helpers';
import { AppText, Input } from '../../../../components';
import { COLORS, FONTS, SPACING, RADIUS, FONT_SIZE } from '../../../../constants';

interface AskQuestionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (question: string) => Promise<void> | void;
  shipmentCode?: string;
  pendingQuestion?: any;
  loadingQuestions?: boolean;
  answeredQuestion?: any;
}

const TypingDots: React.FC = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAnim = (anim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: -5,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.delay(600 - delay),
        ]),
      );
    };

    const a1 = createAnim(dot1, 0);
    const a2 = createAnim(dot2, 180);
    const a3 = createAnim(dot3, 360);

    a1.start();
    a2.start();
    a3.start();

    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.typingBubbleContainer}>
      <Animated.View
        style={[styles.statusDot, { transform: [{ translateY: dot1 }] }]}
      />
      <Animated.View
        style={[styles.statusDot, { transform: [{ translateY: dot2 }] }]}
      />
      <Animated.View
        style={[styles.statusDot, { transform: [{ translateY: dot3 }] }]}
      />
    </View>
  );
};

const AskQuestionModal: React.FC<AskQuestionModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  shipmentCode,
  pendingQuestion,
  loadingQuestions = false,
  answeredQuestion
}) => {

  console.log("=====answeredQuestion=============", answeredQuestion)

  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setQuestion('');
      setError('');
      setIsLoading(false);
    }
  }, [isVisible]);

  const handleSubmit = async () => {
    if (!question.trim()) {
      setError('Please enter a question before submitting.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await onSubmit(question.trim());
    } catch (e) {
      // Error handled by parent
    } finally {
      setIsLoading(false);
    }
  };

  const charCount = question.length;
  const progressPercent = Math.min((charCount / 500) * 100, 100);

  const getHintText = () => {
    if (charCount === 0) return 'Start typing your question...';
    if (charCount < 15) return 'Keep typing details...';
    if (charCount < 100) return 'Good start!';
    return 'Detailed question!';
  };

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.modalCard}>
          {/* Top Gold Header */}
          <View style={styles.headerBanner}>
            <View style={styles.headerTextCol}>
              <AppText style={styles.headerTitle}>Ask a question</AppText>
              <AppText style={styles.headerSub}>
                Get clarity about this shipment {shipmentCode ? `(${shipmentCode})` : ''}
              </AppText>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {/* Modal Body */}
          <ScrollView
            contentContainerStyle={styles.bodyContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {loadingQuestions ? (
              <View style={styles.loaderBox}>
                <ActivityIndicator size="large" color="#A06333" />
              </View>
            ) : answeredQuestion ? (
              /* ANSWERED QUESTION STATE (MATCHING SCREENSHOT) */
              <View style={{ width: '100%' }}>
                {/* 1. Your Question Card */}
                <View style={styles.pendingQuestionCard}>
                  <View style={styles.pendingHeaderRow}>
                    <View style={styles.pendingIconSquare}>
                      <MessageSquare size={16} color="#A06333" />
                    </View>
                    <AppText style={styles.pendingHeaderLabel}>YOUR QUESTION</AppText>
                  </View>

                  <AppText style={styles.pendingQuestionText}>
                    "{answeredQuestion.question}"
                  </AppText>

                  <View style={styles.pendingDivider} />

                  <AppText style={styles.pendingAskedDateText}>
                    Asked on {formatDate(answeredQuestion.createdAt, 'DD/MM/YYYY [at] HH:mm')}
                  </AppText>
                </View>

                {/* 2. Customer Response Card */}
                <View style={styles.responseCard}>
                  <View style={styles.responseHeaderRow}>
                    <View style={styles.responseLeftHeader}>
                      <View style={styles.responseIconSquare}>
                        <CheckCheck size={16} color="#059669" />
                      </View>
                      <AppText style={styles.responseHeaderLabel}>CUSTOMER RESPONSE</AppText>
                    </View>

                    <View style={styles.answeredBadge}>
                      <Check size={12} color="#047857" />
                      <AppText style={styles.answeredBadgeText}>Answered</AppText>
                    </View>
                  </View>

                  <AppText style={styles.responseText}>
                    "{answeredQuestion.answer}"
                  </AppText>

                  <View style={styles.responseDivider} />

                  <AppText style={styles.responseDateText}>
                    Answered on {formatDate(answeredQuestion.answeredAt, 'DD/MM/YYYY [at] HH:mm')}
                  </AppText>
                </View>

                {/* 3. Footer Action */}
                <View style={styles.pendingFooter}>
                  <TouchableOpacity style={styles.pendingCloseBtn} onPress={onClose}>
                    <AppText style={styles.pendingCloseBtnText}>Close</AppText>
                  </TouchableOpacity>
                </View>
              </View>
            ) : pendingQuestion ? (
              /* PENDING QUESTION STATE (MATCHING SCREENSHOT) */
              <View style={{ width: '100%' }}>
                {/* 1. Your Question Card */}
                <View style={styles.pendingQuestionCard}>
                  <View style={styles.pendingHeaderRow}>
                    <View style={styles.pendingIconSquare}>
                      <MessageSquare size={16} color="#A06333" />
                    </View>
                    <AppText style={styles.pendingHeaderLabel}>YOUR QUESTION</AppText>
                  </View>

                  <AppText style={styles.pendingQuestionText}>
                    "{pendingQuestion.question}"
                  </AppText>

                  <View style={styles.pendingDivider} />

                  <AppText style={styles.pendingAskedDateText}>
                    Asked on {formatDate(pendingQuestion.createdAt, 'DD/MM/YYYY [at] HH:mm')}
                  </AppText>
                </View>

                {/* 2. Status Card */}
                <View style={styles.statusCard}>
                  <View style={styles.statusHeaderRow}>
                    <View style={styles.statusIconSquare}>
                      <Clock size={16} color="#B45309" />
                    </View>
                    <AppText style={styles.statusHeaderLabel}>STATUS</AppText>
                  </View>

                  <AppText style={styles.statusMainTitle}>
                    Waiting for customer response...
                  </AppText>

                  <TypingDots />

                  <AppText style={styles.statusSubText}>
                    Typically responds within 24 hours
                  </AppText>
                </View>

                {/* 3. Footer Action */}
                <View style={styles.pendingFooter}>
                  <TouchableOpacity style={styles.pendingCloseBtn} onPress={onClose}>
                    <AppText style={styles.pendingCloseBtnText}>Close</AppText>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              /* NORMAL ASK QUESTION FORM */
              <>
                {/* Top Notice Box with Left Accent Line */}
                <View style={styles.noticeBox}>
                  <AppText style={styles.noticeText}>
                    Ask a specific question about this shipment. The customer will review and respond
                    as soon as possible.
                  </AppText>
                </View>

                {/* Input Label */}
                <View style={styles.labelRow}>
                  <AppText style={styles.inputLabel}>Your Question </AppText>
                  <AppText style={styles.asterisk}>*</AppText>
                </View>

                <Input
                  placeholder="Type your question here.."
                  multiline
                  maxLength={500}
                  value={question}
                  onChangeText={text => {
                    setQuestion(text);
                    if (error) setError('');
                  }}
                  error={error}
                  rightIcon={
                    <AppText style={styles.counterText}>{charCount}/500</AppText>
                  }
                />

                {/* Progress Bar & Hint */}
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
                </View>
                <AppText style={styles.hintText}>{getHintText()}</AppText>

                {/* Tips Callout Box */}
                <View style={styles.tipsBox}>
                  <AppText style={styles.tipItem}>
                    1. Be specific about what you need to know
                  </AppText>
                  <AppText style={styles.tipItem}>
                    2. Include relevant shipment details if needed
                  </AppText>
                  <AppText style={styles.tipItem}>
                    3. Ask one question at a time
                  </AppText>
                </View>

                {/* Action Buttons */}
                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={handleSubmit}
                  disabled={isLoading}
                  activeOpacity={0.85}
                >
                  {isLoading ? (
                    <ActivityIndicator color={COLORS.white} />
                  ) : (
                    <View style={styles.submitBtnContent}>
                      <Send size={18} color={COLORS.white} />
                      <AppText style={styles.submitBtnText}>Submit</AppText>
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelLink}
                  onPress={onClose}
                  disabled={isLoading}
                >
                  <AppText style={styles.cancelLinkText}>Cancel</AppText>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    overflow: 'hidden',
  },

  // Header Banner
  headerBanner: {
    backgroundColor: '#A06333',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTextCol: {
    flex: 1,
    paddingRight: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  headerSub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Body Content
  bodyContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  loaderBox: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Notice Box
  noticeBox: {
    backgroundColor: '#FAF6F0',
    borderLeftWidth: 4,
    borderLeftColor: '#A06333',
    borderRadius: RADIUS.xs,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  noticeText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: '#8C5226',
    lineHeight: 18,
  },

  // Label Row
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  inputLabel: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  asterisk: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.error,
  },

  // Textarea Input
  textAreaContainer: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    position: 'relative',
    marginBottom: SPACING.xs,
  },
  textAreaContainerError: {
    borderColor: COLORS.error,
    backgroundColor: '#FEF2F2',
  },
  textAreaInput: {
    height: 120,
    textAlignVertical: 'top',
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    paddingBottom: 20,
  },
  counterText: {
    position: 'absolute',
    right: SPACING.md,
    bottom: SPACING.sm,
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: '#94A3B8',
  },
  errorText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.error,
    marginBottom: SPACING.xs,
  },

  // Progress Bar
  progressTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: SPACING.xs,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#A06333',
    borderRadius: 3,
  },
  hintText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },

  // Tips Box
  tipsBox: {
    backgroundColor: '#FAF6F0',
    borderLeftWidth: 4,
    borderLeftColor: '#A06333',
    borderRadius: RADIUS.xs,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    gap: 6,
  },
  tipItem: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: '#8C5226',
    lineHeight: 18,
  },

  // Buttons
  submitBtn: {
    width: '100%',
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: '#A06333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    shadowColor: '#A06333',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  submitBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  submitBtnText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  cancelLink: {
    alignSelf: 'center',
    paddingVertical: SPACING.xs,
  },
  cancelLinkText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },

  // Pending Question State Styles
  pendingQuestionCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  pendingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  pendingIconSquare: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendingHeaderLabel: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: '#8C5226',
    letterSpacing: 0.5,
  },
  pendingQuestionText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginVertical: SPACING.xs,
    lineHeight: 20,
  },
  pendingDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: SPACING.xs,
  },
  pendingAskedDateText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  // Status Card
  statusCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#FCD34D',
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  statusHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  statusIconSquare: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusHeaderLabel: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: '#92400E',
    letterSpacing: 0.5,
  },
  statusMainTitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: '#92400E',
    marginTop: 2,
  },
  typingBubbleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderBottomLeftRadius: 3,
    alignSelf: 'flex-start',
    marginVertical: SPACING.xs + 2,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#D97706',
  },
  statusSubText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: '#B45309',
    marginTop: 2,
  },

  // Customer Response Card Styles
  responseCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#6EE7B7',
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  responseHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  responseLeftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  responseIconSquare: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  responseHeaderLabel: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: '#065F46',
    letterSpacing: 0.5,
  },
  answeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  answeredBadgeText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: '#047857',
  },
  responseText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginVertical: SPACING.xs,
    lineHeight: 20,
  },
  responseDivider: {
    height: 1,
    backgroundColor: '#A7F3D0',
    marginVertical: SPACING.xs,
  },
  responseDateText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: '#047857',
    marginTop: 2,
  },

  // Pending Footer Close Action
  pendingFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: SPACING.md,
    alignItems: 'flex-end',
  },
  pendingCloseBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
  },
  pendingCloseBtnText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
});

export default memo(AskQuestionModal);
