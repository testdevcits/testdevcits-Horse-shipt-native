import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MessageCircle, Send } from 'lucide-react-native';
import { AppText } from '../../../../../components';
import { COLORS, FONTS, RADIUS, SPACING } from '../../../../../constants';
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
      if (onRefresh) onRefresh(); // Refresh data to move question to answered list
    } catch (error) {
      Alert.alert('Error', 'Failed to submit answer. Please try again.');
    } finally {
      setSubmitting(null);
    }
  };

  if (totalCount === 0) {
    return (
      <View style={styles.emptyWrap}>
        <MessageCircle size={48} color={COLORS.grey200} />
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
          const isAnswered = item.status === 'answered';

          return (
            <View
              key={item._id}
              style={[
                styles.questionItem,
                index === 0 && { borderTopWidth: 0 },
              ]}
            >
              {/* Shipper Name */}
              <AppText style={styles.shipperName}>
                {item.shipperId?.name || 'Shipper name'}
              </AppText>

              {/* Question Text */}
              <AppText style={styles.questionText}>{item.question}</AppText>

              {isAnswered ? (
                /* Answered View */
                <View style={styles.answerDisplay}>
                  <AppText style={styles.answerText}>
                    <AppText style={styles.boldText}>You: </AppText>
                    {item.answer}
                  </AppText>
                </View>
              ) : (
                /* Pending Answer Input */
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Answer question"
                    placeholderTextColor={COLORS.textLight}
                    multiline
                    value={answers[item._id] || ''}
                    onChangeText={text => handleInputChange(item._id, text)}
                  />
                  <TouchableOpacity
                    style={[
                      styles.sendBtn,
                      !answers[item._id]?.trim() && styles.disabledBtn,
                    ]}
                    onPress={() => handleSubmit(item._id)}
                    disabled={
                      submitting === item._id || !answers[item._id]?.trim()
                    }
                  >
                    {submitting === item._id ? (
                      <ActivityIndicator size="small" color={COLORS.white} />
                    ) : (
                      <Send size={18} color={COLORS.white} />
                    )}
                  </TouchableOpacity>
                </View>
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
    paddingBottom: 20,
  },
  subHeaderBar: {
    backgroundColor: COLORS.goldLightBg,
    padding: 12,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    borderRadius: 4,
  },
  subHeaderText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.goldDarkText,
  },
  cardContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
    overflow: 'hidden',
  },
  questionItem: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  shipperName: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.goldDarkText,
    marginBottom: 8,
  },
  questionText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
    lineHeight: 18,
    marginBottom: 12,
  },
  // Answered
  answerDisplay: {
    marginTop: 4,
  },
  answerText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  boldText: {
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  // Input
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  textInput: {
    flex: 1,
    minHeight: 80,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.sm,
    padding: 10,
    textAlignVertical: 'top',
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  sendBtn: {
    backgroundColor: COLORS.goldPrimary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  disabledBtn: {
    backgroundColor: COLORS.grey200,
  },
  // Empty State
  emptyWrap: {
    alignItems: 'center',
    padding: 60,
    gap: 12,
  },
  emptyText: {
    color: COLORS.textLight,
    textAlign: 'center',
    fontFamily: FONTS.medium,
  },
});
