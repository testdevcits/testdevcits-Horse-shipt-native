import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Star, Smile, Meh, Frown, Camera } from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../constants';
import AppText from '../common/AppText';
import Input from '../common/Input/Input';

const FEEDBACK_CHIPS = ["On Time", "Safe Handling", "Professional", "Good Vehicle", "Great Chat"];

const WriteReviewComponent = ({ rating, setRating, selectedChips, onChipPress, comment, setComment }: any) => {
  const getEmoji = () => {
    if (rating >= 4) return <Smile size={48} color={COLORS.goldPrimary} />;
    if (rating >= 3) return <Meh size={48} color={COLORS.warning} />;
    return <Frown size={48} color={COLORS.error} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.emojiContainer}>{getEmoji()}</View>
      <AppText style={styles.question}>How was your experience?</AppText>
      
      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map((s) => (
          <TouchableOpacity key={s} onPress={() => setRating(s)} activeOpacity={0.7}>
            <Star size={40} color={s <= rating ? COLORS.goldPrimary : COLORS.grey200} fill={s <= rating ? COLORS.goldPrimary : 'transparent'} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.chipGrid}>
        {FEEDBACK_CHIPS.map(chip => (
          <TouchableOpacity 
            key={chip} 
            onPress={() => onChipPress(chip)}
            style={[styles.chip, selectedChips.includes(chip) && styles.activeChip]}
          >
            <AppText style={[styles.chipText, selectedChips.includes(chip) && styles.activeChipText]}>{chip}</AppText>
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
        <Camera size={20} color={COLORS.goldPrimary} />
        <AppText style={styles.photoBtnText}>Add Photos</AppText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.xl, alignItems: 'center' },
  emojiContainer: { marginBottom: SPACING.md },
  question: { fontSize: 18, fontFamily: FONTS.bold, color: COLORS.textPrimary, marginBottom: SPACING.lg },
  starRow: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.xl },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: SPACING.xl },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: RADIUS.round, borderWidth: 1, borderColor: COLORS.divider },
  activeChip: { backgroundColor: COLORS.goldPrimary, borderColor: COLORS.goldPrimary },
  chipText: { fontSize: 13, fontFamily: FONTS.medium, color: COLORS.textSecondary },
  activeChipText: { color: COLORS.white },
  input: { width: '100%', minHeight: 100, backgroundColor: COLORS.grey50, borderRadius: RADIUS.lg, padding: SPACING.md, fontFamily: FONTS.regular, color: COLORS.textPrimary, textAlignVertical: 'top', marginBottom: SPACING.md },
  photoBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: SPACING.md, borderWidth: 1, borderStyle: 'dashed', borderColor: COLORS.goldPrimary, borderRadius: RADIUS.lg, width: '100%', justifyContent: 'center' },
  photoBtnText: { color: COLORS.goldPrimary, fontFamily: FONTS.bold }
});

export default WriteReviewComponent;