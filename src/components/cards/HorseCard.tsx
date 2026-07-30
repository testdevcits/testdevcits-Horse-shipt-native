import React, { memo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Pencil, Trash2 } from 'lucide-react-native';
import { SPACING, RADIUS, FONT_SIZE, ICON_SIZE } from '../../constants/dimensions';
import { COLORS, FONTS } from '../../constants';
import AppText from '../common/AppText';

export interface Horse {
  _id: string;
  owner: string;
  registeredName: string;
  barnName: string;
  breed: string;
  otherBreed: string;
  colour: string;
  age: string;
  sex: string;
  defaultStallSize: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface HorseCardProps {
  item: Horse;
  onEdit: (item: Horse) => void;
  onDelete: (id: string) => void;
}

const DetailItem = memo(({ label, value }: { label: string; value?: string }) => (
  <View style={styles.detailRow}>
    <AppText style={styles.label}>{label} : </AppText>
    <AppText style={styles.value} numberOfLines={1}>
      {value || 'N/A'}
    </AppText>
  </View>
));

const HorseCard = memo(({ item, onEdit, onDelete }: HorseCardProps) => {
  if (!item) return null;

  return (
    <View style={styles.cardContainer}>
      {/* Header: Registered Name and Action Icons */}
      <View style={styles.header}>
        <AppText style={styles.horseNameText} numberOfLines={1}>
          {item?.registeredName || 'Unnamed Horse'}
        </AppText>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => onEdit(item)}
            activeOpacity={0.6}
            style={styles.iconButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Pencil
              size={ICON_SIZE.xs}
              color={COLORS.goldPrimary}
              strokeWidth={2}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onDelete(item?._id)}
            activeOpacity={0.6}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Trash2
              size={ICON_SIZE.xs}
              color={COLORS.error}
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Details Grid: 2 Column Layout */}
      <View style={styles.detailsGrid}>
        {/* Left Column */}
        <View style={styles.column}>
          <DetailItem label="Barn Name" value={item?.barnName} />
          <DetailItem label="Sex" value={item?.sex} />
          <DetailItem
            label="Age"
            value={item?.age ? `${item.age} Years` : undefined}
          />
        </View>

        {/* Right Column */}
        <View style={styles.column}>
          <DetailItem label="Color" value={item?.colour} />
          <DetailItem
            label="Breed"
            value={item?.breed === 'Other' ? item?.otherBreed : item?.breed}
          />
          <DetailItem label="Stall" value={item?.defaultStallSize} />
        </View>
      </View>

      {/* Notes Section */}
      {item?.notes ? (
        <View style={styles.notesContainer}>
          <AppText style={styles.notesLabel}>NOTES :</AppText>
          <AppText style={styles.notesText}>{item.notes}</AppText>
        </View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
    marginBottom: SPACING.sm,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  horseNameText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: SPACING.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: SPACING.md,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.xs,
  },
  column: {
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: SPACING.xs,
    alignItems: 'center',
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.semiBold,
    color: COLORS.goldPrimary,
  },
  value: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
    flex: 1,
  },
  notesContainer: {
    backgroundColor: COLORS.goldLightBg || '#FDF9F0',
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.goldBorder || '#F3E5C2',
    marginTop: SPACING.sm,
  },
  notesLabel: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.goldPrimary,
    marginBottom: 2,
  },
  notesText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
});

export default HorseCard;