import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MessageSquare, Send, HelpCircle, Bell } from 'lucide-react-native';
import { AppText, Input } from '../../../../../components';
import {
  COLORS,
  FONTS,
  RADIUS,
  SPACING,
  FONT_SIZE,
  ICON_SIZE,
} from '../../../../../constants';
import customerService from '../../../../../api/services/customerService';
import Toast from 'react-native-toast-message';

const QuestionsTab = ({ questions, onRefresh }: any) => {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState<string | null>(null);

  const allQuestions = Array.isArray(questions)
    ? questions
    : [
      ...(questions?.pending || []),
      ...(questions?.answered || []),
    ];
  const totalCount = allQuestions.length;

  const handleInputChange = (id: string, text: string) => {
    setAnswers(prev => ({ ...prev, [id]: text }));
  };

  const handleSubmit = async (questionId: string) => {
    const answerText = answers[questionId];
    if (!answerText?.trim()) return;

    setSubmitting(questionId);
    try {
      await customerService.submitAnswer(questionId, answerText);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Answer submitted successfully',
      });
      if (onRefresh) onRefresh();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to submit answer. Please try again.',
      });
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <View style={styles.container}>
      {/* Total Header Bar */}
      <View style={styles.subHeaderBar}>
        <AppText style={styles.subHeaderText}>
          Total questions: {totalCount}
        </AppText>
      </View>

      {totalCount === 0 ? (
        /* Empty Condition UI */
        <View style={styles.emptyCardContainer}>
          <View style={styles.emptyIconCircle}>
            <MessageSquare size={32} color={COLORS.primary} />
          </View>

          <AppText style={styles.emptyTitle}>No Questions Asked Yet</AppText>

          <AppText style={styles.emptySubtitle}>
            Service providers haven't submitted any questions regarding this shipment. Any inquiries about route or horse care will appear here.
          </AppText>

          <View style={styles.infoCardsContainer}>
            <View style={styles.infoCard}>
              <View style={styles.infoIconBox}>
                <HelpCircle size={16} color={COLORS.primary} />
              </View>
              <View style={styles.infoTextWrapper}>
                <AppText style={styles.infoCardTitle}>Pre-Quote Inquiries</AppText>
                <AppText style={styles.infoCardText}>
                  Shippers may ask questions to clarify details before bidding.
                </AppText>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoIconBox}>
                <Bell size={16} color={COLORS.primary} />
              </View>
              <View style={styles.infoTextWrapper}>
                <AppText style={styles.infoCardTitle}>Instant Notifications</AppText>
                <AppText style={styles.infoCardText}>
                  You'll be notified immediately when a question is posted.
                </AppText>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.cardContainer}>
          {allQuestions.map((item, index) => {
            const isAnswered = item?.status === 'answered';

            return (
              <View
                key={item?._id || index}
                style={[
                  styles.questionItem,
                  index === 0 && { borderTopWidth: 0 },
                ]}
              >
                {/* Shipper Name */}
                <AppText style={styles.shipperName}>
                  {item?.shipperId?.name || 'Not Available'}
                </AppText>

                {/* Question Text */}
                <AppText style={styles.questionText}>{item?.question}</AppText>

                {isAnswered ? (
                  /* Answered View */
                  <View style={styles.answerDisplay}>
                    <AppText style={styles.answerText}>
                      <AppText style={styles.boldText}>You: </AppText>
                      {item?.answer}
                    </AppText>
                  </View>
                ) : (
                  /* Pending Answer Input */
                  <Input
                    placeholder="Answer question"
                    multiline
                    value={answers[item?._id] || ''}
                    onChangeText={text => handleInputChange(item?._id, text)}
                    containerStyle={{ marginBottom: 0 }}
                    rightIcon={
                      <TouchableOpacity
                        style={[
                          styles.sendBtn,
                          !answers[item?._id]?.trim() && styles.disabledBtn,
                        ]}
                        onPress={() => handleSubmit(item?._id)}
                        disabled={
                          submitting === item?._id || !answers[item?._id]?.trim()
                        }
                      >
                        {submitting === item?._id ? (
                          <ActivityIndicator size="small" color={COLORS.white} />
                        ) : (
                          <Send size={ICON_SIZE.xs} color={COLORS.white} />
                        )}
                      </TouchableOpacity>
                    }
                  />
                )}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default QuestionsTab;

const styles = StyleSheet.create({
  container: {
    paddingBottom: SPACING.xl,
  },
  subHeaderBar: {
    backgroundColor: COLORS.goldLightBg,
    padding: SPACING.sm,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
  },
  subHeaderText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.goldDarkText,
  },
  cardContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
    overflow: 'hidden',
  },
  questionItem: {
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  shipperName: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.goldDarkText,
    marginBottom: SPACING.xs,
  },
  questionText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  // Answered
  answerDisplay: {
    marginTop: 2,
  },
  answerText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  boldText: {
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  // Input
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: SPACING.xs,
  },
  textInput: {
    flex: 1,
    minHeight: 60,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.sm,
    padding: SPACING.xs,
    textAlignVertical: 'top',
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
  },
  sendBtn: {
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  disabledBtn: {
    backgroundColor: COLORS.grey200,
  },

  /* Empty State Styles */
  emptyCardContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.divider,
    padding: SPACING.xl,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.goldLightBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  emptySubtitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  infoCardsContainer: {
    width: '100%',
    gap: SPACING.sm,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.grey50,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.grey200,
  },
  infoIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.goldLightBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  infoTextWrapper: {
    flex: 1,
  },
  infoCardTitle: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  infoCardText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
});

