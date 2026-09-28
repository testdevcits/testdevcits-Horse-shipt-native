import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { AppText } from '../../../../../../../components';
import AppIcon from '../../../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../../../constants';
import { formatDate } from '../../../../../../../utils/helpers';
import styles from '../styles.AskQuestion';

interface QuestionHistorySectionProps {
  answeredQuestion?: any;
  pendingQuestion?: any;
  onClose: () => void;
  TypingDots: React.ComponentType;
}

const QuestionHistorySection: React.FC<QuestionHistorySectionProps> = ({
  answeredQuestion,
  pendingQuestion,
  onClose,
  TypingDots,
}) => {
  if (answeredQuestion) {
    return (
      <View style={{ width: '100%' }}>
        {/* Your Question Card */}
        <View style={styles.pendingQuestionCard}>
          <View style={styles.pendingHeaderRow}>
            <View style={styles.pendingIconSquare}>
              <AppIcon
                name="MessageSquare"
                size={16}
                color={COLORS.saddleBrown}
              />
            </View>
            <AppText style={styles.pendingHeaderLabel}>YOUR QUESTION</AppText>
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

        {/* Customer Response Card */}
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
              <AppText style={styles.answeredBadgeText}>Answered</AppText>
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

        {/* Footer Action */}
        <View style={styles.pendingFooter}>
          <TouchableOpacity style={styles.pendingCloseBtn} onPress={onClose}>
            <AppText style={styles.pendingCloseBtnText}>Close</AppText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (pendingQuestion) {
    return (
      <View style={{ width: '100%' }}>
        {/* Your Question Card */}
        <View style={styles.pendingQuestionCard}>
          <View style={styles.pendingHeaderRow}>
            <View style={styles.pendingIconSquare}>
              <AppIcon
                name="MessageSquare"
                size={16}
                color={COLORS.saddleBrown}
              />
            </View>
            <AppText style={styles.pendingHeaderLabel}>YOUR QUESTION</AppText>
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

        {/* Status Card */}
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

        {/* Footer Action */}
        <View style={styles.pendingFooter}>
          <TouchableOpacity style={styles.pendingCloseBtn} onPress={onClose}>
            <AppText style={styles.pendingCloseBtnText}>Close</AppText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return null;
};

export default memo(QuestionHistorySection);
