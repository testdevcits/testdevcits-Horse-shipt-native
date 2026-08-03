import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MessageCircle, Send } from 'lucide-react-native';
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

const QuestionsTab = ({ questions, onRefresh }: any) => {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState<string | null>(null);

  const allQuestions = [
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
      Alert.alert('Success', 'Answer submitted successfully');
      if (onRefresh) onRefresh();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit answer. Please try again.');
    } finally {
      setSubmitting(null);
    }
  };

  if (totalCount === 0) {
    return (
      <View style={styles.emptyWrap}>
        <MessageCircle size={ICON_SIZE.xl} color={COLORS.grey200} />
        <AppText style={styles.emptyText}>No questions asked yet.</AppText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Total Header Bar */}
      <View style={styles.subHeaderBar}>
        <AppText style={styles.subHeaderText}>
          Total questions: {totalCount}
        </AppText>
      </View>

      <View style={styles.cardContainer}>
        {allQuestions.map((item, index) => {
          const isAnswered = item?.status === 'answered';

          return (
            <View
              key={item?._id}
              style={[
                styles.questionItem,
                index === 0 && { borderTopWidth: 0 },
              ]}
            >
              {/* Shipper Name */}
              <AppText style={styles.shipperName}>
                {item?.shipperId?.name || 'Shipper name'}
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
    backgroundColor: COLORS.goldPrimary,
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
  // Empty State
  emptyWrap: {
    alignItems: 'center',
    padding: SPACING.xxxl,
    gap: SPACING.sm,
  },
  emptyText: {
    color: COLORS.textLight,
    textAlign: 'center',
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
  },
});
