import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Edit3, Trash2, ShieldCheck, Info, Calendar, Ruler } from 'lucide-react-native';
import AppText from '../common/AppText';
import { COLORS, FONTS, RADIUS, SPACING } from '../../constants';

interface HorseCardProps {
  item: any;
  onEdit: () => void;
  onDelete: () => void;
}

const HorseCard = ({ item, onEdit, onDelete }: HorseCardProps) => {
  return (
    <View style={styles.card}>
      {/* Top Section: Header & Badge */}
      <View style={styles.headerRow}>
        <View style={styles.nameContainer}>
          <AppText style={styles.barnName}>{item.barnName}</AppText>
          <View style={styles.sexBadge}>
             <AppText style={styles.sexText}>{item.sex}</AppText>
          </View>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity onPress={onEdit} style={styles.iconBtn} activeOpacity={0.7}>
            <Edit3 size={18} color={COLORS.goldPrimary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={[styles.iconBtn, styles.deleteBtn]} activeOpacity={0.7}>
            <Trash2 size={18} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>

      <AppText style={styles.regName}>{item.registeredName}</AppText>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Info Grid */}
      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <ShieldCheck size={14} color={COLORS.goldPrimary} style={styles.infoIcon} />
          <AppText style={styles.infoLabel}>{item.breed}</AppText>
        </View>

        <View style={styles.infoItem}>
          <Calendar size={14} color={COLORS.goldPrimary} style={styles.infoIcon} />
          <AppText style={styles.infoLabel}>{item.age} Years</AppText>
        </View>

        <View style={styles.infoItem}>
          <Info size={14} color={COLORS.goldPrimary} style={styles.infoIcon} />
          <AppText style={styles.infoLabel}>{item.colour}</AppText>
        </View>

        <View style={styles.infoItem}>
          <Ruler size={14} color={COLORS.goldPrimary} style={styles.infoIcon} />
          <AppText style={styles.infoLabel}>{item.defaultStallSize}</AppText>
        </View>
      </View>

      {/* Footer Notes (Optional/Subtle) */}
      {item.notes && (
        <View style={styles.notesContainer}>
          <AppText numberOfLines={1} style={styles.notesText}>
            "{item.notes}"
          </AppText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg, // More rounded for modern look
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
    
    // Deeper, softer shadow for premium feel
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  barnName: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.textPrimary,
    marginRight: SPACING.sm,
  },
  sexBadge: {
    backgroundColor: COLORS.goldLightBg, // Light gold background
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
  },
  sexText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: COLORS.goldPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  regName: {
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.md,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: '40%', // Creates a nice 2-column grid
  },
  infoIcon: {
    marginRight: 6,
  },
  infoLabel: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontFamily: FONTS.medium,
  },
  actions: {
    flexDirection: 'row',
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.grey50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.grey100,
  },
  deleteBtn: {
    marginLeft: SPACING.sm,
    backgroundColor: '#FFF5F5', // Very light red
    borderColor: '#FED7D7',
  },
  notesContainer: {
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    borderStyle: 'dashed',
  },
  notesText: {
    fontSize: 12,
    fontFamily: FONTS.italic,
    color: COLORS.textLight,
  },
});

export default memo(HorseCard);