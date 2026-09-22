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

import { formatDate } from '../../../../../../utils/helpers';
import { AppText, Input } from '../../../../../../components';
import {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  FONT_SIZE,
} from '../../../../../../constants';
import AppIcon from '../../../../../../components/app_icon/AppIcon';
import Toast from 'react-native-toast-message';
import styles from './styles.AskQuestion';

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
  answeredQuestion,
}) => {
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
    } catch (_e) {
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
                Get clarity about this shipment{' '}
                {shipmentCode ? `(${shipmentCode})` : ''}
              </AppText>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <AppIcon name="X" size={18} color={COLORS.white} />
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
                <ActivityIndicator size="large" color={COLORS.saddleBrown} />
              </View>
            ) : answeredQuestion ? (
              /* ANSWERED QUESTION STATE (MATCHING SCREENSHOT) */
              <View style={{ width: '100%' }}>
                {/* 1. Your Question Card */}
                <View style={styles.pendingQuestionCard}>
                  <View style={styles.pendingHeaderRow}>
                    <View style={styles.pendingIconSquare}>
                      <AppIcon
                        name="MessageSquare"
                        size={16}
                        color={COLORS.saddleBrown}
                      />
                    </View>
                    <AppText style={styles.pendingHeaderLabel}>
                      YOUR QUESTION
                    </AppText>
                  </View>

                  <AppText style={styles.pendingQuestionText}>
                    "{answeredQuestion.question}"
                  </AppText>

                  <View style={styles.pendingDivider} />

                  <AppText style={styles.pendingAskedDateText}>
                    Asked on{' '}
                    {formatDate(
                      answeredQuestion.createdAt,
                      'MM/DD/YYYY [at] h:mm A',
                    )}
                  </AppText>
                </View>

                {/* 2. Customer Response Card */}
                <View style={styles.responseCard}>
                  <View style={styles.responseHeaderRow}>
                    <View style={styles.responseLeftHeader}>
                      <View style={styles.responseIconSquare}>
                        <AppIcon
                          name="CheckCheck"
                          size={16}
                          color={COLORS.emeraldPrimary}
                        />
                      </View>
                      <AppText style={styles.responseHeaderLabel}>
                        CUSTOMER RESPONSE
                      </AppText>
                    </View>

                    <View style={styles.answeredBadge}>
                      <AppIcon
                        name="Check"
                        size={12}
                        color={COLORS.emeraldDark}
                      />
                      <AppText style={styles.answeredBadgeText}>
                        Answered
                      </AppText>
                    </View>
                  </View>

                  <AppText style={styles.responseText}>
                    "{answeredQuestion.answer}"
                  </AppText>

                  <View style={styles.responseDivider} />

                  <AppText style={styles.responseDateText}>
                    Answered on{' '}
                    {formatDate(
                      answeredQuestion.answeredAt,
                      'MM/DD/YYYY [at] h:mm A',
                    )}
                  </AppText>
                </View>

                {/* 3. Footer Action */}
                <View style={styles.pendingFooter}>
                  <TouchableOpacity
                    style={styles.pendingCloseBtn}
                    onPress={onClose}
                  >
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
                      <AppIcon
                        name="MessageSquare"
                        size={16}
                        color={COLORS.saddleBrown}
                      />
                    </View>
                    <AppText style={styles.pendingHeaderLabel}>
                      YOUR QUESTION
                    </AppText>
                  </View>

                  <AppText style={styles.pendingQuestionText}>
                    "{pendingQuestion.question}"
                  </AppText>

                  <View style={styles.pendingDivider} />

                  <AppText style={styles.pendingAskedDateText}>
                    Asked on{' '}
                    {formatDate(
                      pendingQuestion.createdAt,
                      'MM/DD/YYYY [at] h:mm A',
                    )}
                  </AppText>
                </View>

                {/* 2. Status Card */}
                <View style={styles.statusCard}>
                  <View style={styles.statusHeaderRow}>
                    <View style={styles.statusIconSquare}>
                      <AppIcon
                        name="Clock"
                        size={16}
                        color={COLORS.amberWarning}
                      />
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
                  <TouchableOpacity
                    style={styles.pendingCloseBtn}
                    onPress={onClose}
                  >
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
                    Ask a specific question about this shipment. The customer
                    will review and respond as soon as possible.
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
                    <AppText style={styles.counterText}>
                      {charCount}/500
                    </AppText>
                  }
                />

                {/* Progress Bar & Hint */}
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${progressPercent}%` },
                    ]}
                  />
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
                      <AppIcon name="Send" size={18} color={COLORS.white} />
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
      <Toast />
    </Modal>
  );
};

 

export default memo(AskQuestionModal);
