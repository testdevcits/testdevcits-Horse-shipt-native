import React, { memo } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AppText, Input } from '../../../../../../../components';
import AppIcon from '../../../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../../../constants';
import styles from '../styles.AskQuestion';

interface QuestionInputFormProps {
  question: string;
  setQuestion: (text: string) => void;
  error: string;
  setError: (err: string) => void;
  isLoading: boolean;
  onSubmit: () => void;
  onClose: () => void;
}

const QuestionInputForm: React.FC<QuestionInputFormProps> = ({
  question,
  setQuestion,
  error,
  setError,
  isLoading,
  onSubmit,
  onClose,
}) => {
  const charCount = question.length;
  const progressPercent = Math.min((charCount / 500) * 100, 100);

  const getHintText = () => {
    if (charCount === 0) return 'Start typing your question...';
    if (charCount < 15) return 'Keep typing details...';
    if (charCount < 100) return 'Good start!';
    return 'Detailed question!';
  };

  return (
    <>
      {/* Top Notice Box with Left Accent Line */}
      <View style={styles.noticeBox}>
        <AppText style={styles.noticeText}>
          Ask a specific question about this shipment. The customer will review
          and respond as soon as possible.
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
        <View
          style={[styles.progressFill, { width: `${progressPercent}%` }]}
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
        onPress={onSubmit}
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
  );
};

export default memo(QuestionInputForm);
