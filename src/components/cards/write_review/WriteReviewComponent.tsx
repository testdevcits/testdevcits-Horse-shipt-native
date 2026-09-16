import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING, FONT_SIZE } from '../../../constants';
import AppText from '../../common/AppText';
import Input from '../../common/Input/Input';
import AppIcon from '../../app_icon/AppIcon';
import styles from './styles.writereview';

const FEEDBACK_CHIPS = [
  'On Time',
  'Safe Handling',
  'Professional',
  'Good Vehicle',
  'Great Chat',
];

const WriteReviewComponent = ({
  rating,
  setRating,
  selectedChips,
  onChipPress,
  comment,
  setComment,
}: any) => {
  const getEmoji = () => {
    if (rating >= 4)
      return <AppIcon name="Smile" size={48} color={COLORS.primary} />;
    if (rating >= 3)
      return <AppIcon name="Meh" size={48} color={COLORS.warning} />;
    return <AppIcon name="Frown" size={48} color={COLORS.error} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.emojiContainer}>{getEmoji()}</View>
      <AppText style={styles.question}>How was your experience?</AppText>

      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map(s => (
          <TouchableOpacity
            key={s}
            onPress={() => setRating(s)}
            activeOpacity={0.7}
          >
            <AppIcon
              name="Star"
              size={40}
              color={s <= rating ? COLORS.primary : COLORS.grey200}
              fill={s <= rating ? COLORS.primary : 'transparent'}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.chipGrid}>
        {FEEDBACK_CHIPS.map(chip => (
          <TouchableOpacity
            key={chip}
            onPress={() => onChipPress(chip)}
            style={[
              styles.chip,
              selectedChips.includes(chip) && styles.activeChip,
            ]}
          >
            <AppText
              style={[
                styles.chipText,
                selectedChips.includes(chip) && styles.activeChipText,
              ]}
            >
              {chip}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ width: '100%' }}>
        <Input
          placeholder="Tell us more about the shipment..."
          multiline
          value={comment}
          onChangeText={setComment}
          containerStyle={{ marginBottom: SPACING.md }}
        />
      </View>

      <TouchableOpacity style={styles.photoBtn}>
        <AppIcon name="Camera" size={20} color={COLORS.primary} />
        <AppText style={styles.photoBtnText}>Add Photos</AppText>
      </TouchableOpacity>
    </View>
  );
};

export default WriteReviewComponent;
