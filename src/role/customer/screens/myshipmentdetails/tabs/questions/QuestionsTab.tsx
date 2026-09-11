import React, { useState } from 'react';
import {
   
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { AppText, Input } from '../../../../../../components';
import {
  COLORS,
   
  ICON_SIZE,
} from '../../../../../../constants';
import customerService from '../../../../../../api/services/customerService';
import Toast from 'react-native-toast-message';
import AppIcon from '../../../../../../components/AppIcon';
import styles from './styles.QuestionTab';

const QuestionsTab = ({ questions, onRefresh }: any) => {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState<string | null>(null);

  const allQuestions = Array.isArray(questions)
    ? questions
    : [...(questions?.pending || []), ...(questions?.answered || [])];
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
            <AppIcon name={'MessageSquare'} size={32} color={COLORS.primary} />
          </View>

          <AppText style={styles.emptyTitle}>No Questions Asked Yet</AppText>

          <AppText style={styles.emptySubtitle}>
            Service providers haven't submitted any questions regarding this
            shipment. Any inquiries about route or horse care will appear here.
          </AppText>

          <View style={styles.infoCardsContainer}>
            <View style={styles.infoCard}>
              <View style={styles.infoIconBox}>
                <AppIcon name={'HelpCircle'} size={16} color={COLORS.primary} />
              </View>
              <View style={styles.infoTextWrapper}>
                <AppText style={styles.infoCardTitle}>
                  Pre-Quote Inquiries
                </AppText>
                <AppText style={styles.infoCardText}>
                  Shippers may ask questions to clarify details before bidding.
                </AppText>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoIconBox}>
                <AppIcon name={'Bell'} size={16} color={COLORS.primary} />
              </View>
              <View style={styles.infoTextWrapper}>
                <AppText style={styles.infoCardTitle}>
                  Instant Notifications
                </AppText>
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
                          submitting === item?._id ||
                          !answers[item?._id]?.trim()
                        }
                      >
                        {submitting === item?._id ? (
                          <ActivityIndicator
                            size="small"
                            color={COLORS.white}
                          />
                        ) : (
                          <AppIcon
                            name={'Send'}
                            size={ICON_SIZE.xs}
                            color={COLORS.white}
                          />
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

 