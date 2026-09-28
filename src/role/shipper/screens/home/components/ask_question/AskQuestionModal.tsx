import React, { useState, useEffect, useRef, memo } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';

import { AppText } from '../../../../../../components';
import { COLORS } from '../../../../../../constants';
import AppIcon from '../../../../../../components/app_icon/AppIcon';
import Toast from 'react-native-toast-message';
import styles from './styles.AskQuestion';
import QuestionHistorySection from './components/QuestionHistorySection';
import QuestionInputForm from './components/QuestionInputForm';

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
            ) : answeredQuestion || pendingQuestion ? (
              <QuestionHistorySection
                answeredQuestion={answeredQuestion}
                pendingQuestion={pendingQuestion}
                onClose={onClose}
                TypingDots={TypingDots}
              />
            ) : (
              <QuestionInputForm
                question={question}
                setQuestion={setQuestion}
                error={error}
                setError={setError}
                isLoading={isLoading}
                onSubmit={handleSubmit}
                onClose={onClose}
              />
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
      <Toast />
    </Modal>
  );
};

export default memo(AskQuestionModal);
