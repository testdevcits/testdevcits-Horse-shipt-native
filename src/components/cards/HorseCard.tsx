import React, { memo } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import {
  Pencil,
  Trash2,
  ShieldCheck,
  FileText,
} from 'lucide-react-native';
import { SPACING, RADIUS, FONT_SIZE } from '../../constants/dimensions';
import { COLORS, FONTS } from '../../constants';
import AppText from '../common/AppText';
import { Horse } from '../../types/customer';
import imageIndex from '../../assets/images/imageIndex';

interface HorseCardProps {
  item: Horse;
  onEdit: (item: Horse) => void;
  onDelete: (id: string) => void;
}

const HorseCard = memo(({ item, onEdit, onDelete }: HorseCardProps) => {
  if (!item) return null;

  const photoUrl = item?.photo?.url;
  const hasCoggins = !!item?.documents?.coggins?.url;
  const hasHealthCert = !!item?.documents?.healthCertificate?.url;

  const breedText =
    item?.breed === 'Other' || item?.breed === 'Other Breed'
      ? item?.otherBreed || item?.breed
      : item?.breed;

  return (
    <View style={styles.cardContainer}>
      {/* Top Header Row */}
      <View style={styles.topSection}>
        {/* Left Avatar / Photo */}
        <View style={styles.avatarWrapper}>
          {photoUrl ? (
            <Image source={{ uri: photoUrl }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Image
                source={imageIndex.addedithorseiocn}
                style={styles.avatarPlaceholderIcon}
                resizeMode="contain"
              />
            </View>
          )}
        </View>

        {/* Center Info */}
        <View style={styles.infoWrapper}>
          <AppText style={styles.registeredNameText} numberOfLines={1}>
            {item?.registeredName || 'Unnamed Horse'}
          </AppText>
          {item?.barnName ? (
            <AppText style={styles.barnNameText} numberOfLines={1}>
              Barn: {item.barnName}
            </AppText>
          ) : null}
          {breedText ? (
            <View style={styles.breedTag}>
              <AppText style={styles.breedTagText} numberOfLines={1}>
                {breedText}
              </AppText>
            </View>
          ) : null}
        </View>

        {/* Right Actions */}
        <View style={styles.actionsWrapper}>
          <TouchableOpacity
            onPress={() => onEdit(item)}
            activeOpacity={0.7}
            style={styles.editActionBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Pencil size={15} color={COLORS.primary} strokeWidth={2.2} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onDelete(item?._id)}
            activeOpacity={0.7}
            style={styles.deleteActionBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Trash2 size={15} color={COLORS.error} strokeWidth={2.2} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Attributes Grid */}
      <View style={styles.pillsRow}>
        {item?.sex ? (
          <View style={styles.pillItem}>
            <AppText style={styles.pillLabel}>Sex</AppText>
            <AppText style={styles.pillValue} numberOfLines={1}>
              {item.sex}
            </AppText>
          </View>
        ) : null}

        {item?.age ? (
          <View style={styles.pillItem}>
            <AppText style={styles.pillLabel}>Age</AppText>
            <AppText style={styles.pillValue} numberOfLines={1}>
              {item.age} Yrs
            </AppText>
          </View>
        ) : null}

        {item?.colour ? (
          <View style={styles.pillItem}>
            <AppText style={styles.pillLabel}>Color</AppText>
            <AppText style={styles.pillValue} numberOfLines={1}>
              {item.colour}
            </AppText>
          </View>
        ) : null}

        {item?.defaultStallSize ? (
          <View style={styles.pillItem}>
            <AppText style={styles.pillLabel}>Stall</AppText>
            <AppText style={styles.pillValue} numberOfLines={1}>
              {item.defaultStallSize}
            </AppText>
          </View>
        ) : null}
      </View>

      {/* Documents Badges */}
      {hasCoggins || hasHealthCert ? (
        <View style={styles.docsBadgesRow}>
          {hasCoggins ? (
            <View style={styles.docBadgeSuccess}>
              <ShieldCheck size={13} color="#059669" />
              <AppText style={styles.docBadgeTextSuccess}>Coggins PDF</AppText>
            </View>
          ) : null}

          {hasHealthCert ? (
            <View style={styles.docBadgeSuccess}>
              <ShieldCheck size={13} color="#059669" />
              <AppText style={styles.docBadgeTextSuccess}>Health Cert PDF</AppText>
            </View>
          ) : null}
        </View>
      ) : null}

      {/* Notes Box */}
      {item?.notes ? (
        <View style={styles.notesBox}>
          <FileText size={14} color={COLORS.primary} style={{ marginTop: 2 }} />
          <View style={styles.notesContent}>
            <AppText style={styles.notesHeading}>Notes</AppText>
            <AppText style={styles.notesBody}>{item.notes}</AppText>
          </View>
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
    borderColor: '#E5E7EB',
    marginBottom: SPACING.sm,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },

  topSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  avatarWrapper: {
    marginRight: SPACING.sm,
  },
  avatarImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    borderColor: '#F3E5C2',
  },
  avatarPlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FAF6EE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F3E5C2',
  },
  avatarPlaceholderIcon: {
    width: 26,
    height: 26,
    tintColor: COLORS.primary,
  },

  infoWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  registeredNameText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  barnNameText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  breedTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#FAF6EE',
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#F3E5C2',
  },
  breedTagText: {
    fontSize: FONT_SIZE.xs - 1,
    fontFamily: FONTS.semiBold,
    color: COLORS.primary,
  },

  actionsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  editActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FAF6EE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3E5C2',
  },
  deleteActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },

  pillsRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.xs,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  pillItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  pillLabel: {
    fontSize: FONT_SIZE.xs - 2,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pillValue: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginTop: 1,
  },

  docsBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginTop: SPACING.xs / 2,
  },
  docBadgeSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: SPACING.xs,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  docBadgeTextSuccess: {
    fontSize: FONT_SIZE.xs - 1,
    fontFamily: FONTS.semiBold,
    color: '#047857',
  },

  notesBox: {
    flexDirection: 'row',
    backgroundColor: '#FAF6EE',
    borderRadius: RADIUS.sm,
    padding: SPACING.xs + 2,
    marginTop: SPACING.xs,
    borderWidth: 1,
    borderColor: '#F3E5C2',
  },
  notesContent: {
    marginLeft: SPACING.xs,
    flex: 1,
  },
  notesHeading: {
    fontSize: FONT_SIZE.xs - 1,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  notesBody: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    lineHeight: 16,
    marginTop: 1,
  },
});

export default HorseCard;