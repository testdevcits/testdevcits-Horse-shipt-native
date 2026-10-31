import React, { memo } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';

import { COLORS } from '../../../constants';
import AppText from '../../common/AppText';
import { Horse } from '../../../types/customer';
import imageIndex from '../../../assets/images/imageIndex';
import AppIcon from '../../app_icon/AppIcon';
import styles from './styles.HorseCard';

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
                source={imageIndex?.addedithorseiocn}
                style={styles.avatarPlaceholderIcon}
                resizeMode="contain"
              />
            </View>
          )}
        </View>

        {/* Center Info */}
        <View style={styles.infoWrapper}>
          <AppText style={styles.registeredNameText} numberOfLines={1}>
            {item?.registeredName || 'Not Available'}
          </AppText>
          {item?.barnName ? (
            <AppText style={styles.barnNameText} numberOfLines={1}>
              Barn: {item?.barnName}
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
            <AppIcon
              name={'Pencil'}
              size={15}
              color={COLORS.primary}
              strokeWidth={2.2}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onDelete(item?._id)}
            activeOpacity={0.7}
            style={styles.deleteActionBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <AppIcon
              name={'Trash2'}
              size={15}
              color={COLORS.error}
              strokeWidth={2.2}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Attributes Grid */}
      <View style={styles.pillsRow}>
        {item?.sex ? (
          <View style={styles.pillItem}>
            <AppText style={styles.pillLabel}>Sex</AppText>
            <AppText style={styles.pillValue} numberOfLines={1}>
              {item?.sex}
            </AppText>
          </View>
        ) : null}

        {item?.age ? (
          <View style={styles.pillItem}>
            <AppText style={styles.pillLabel}>Age</AppText>
            <AppText style={styles.pillValue} numberOfLines={1}>
              {item?.age} Yrs
            </AppText>
          </View>
        ) : null}

        {item?.colour ? (
          <View style={styles.pillItem}>
            <AppText style={styles.pillLabel}>Color</AppText>
            <AppText style={styles.pillValue} numberOfLines={1}>
              {item?.colour}
            </AppText>
          </View>
        ) : null}

        {item?.defaultStallSize ? (
          <View style={styles.pillItem}>
            <AppText style={styles.pillLabel}>Stall</AppText>
            <AppText style={styles.pillValue} numberOfLines={1}>
              {item?.defaultStallSize}
            </AppText>
          </View>
        ) : null}
      </View>

      {/* Documents Badges */}
      {hasCoggins || hasHealthCert ? (
        <View style={styles.docsBadgesRow}>
          {hasCoggins ? (
            <View style={styles.docBadgeSuccess}>
              <AppIcon
                name={'ShieldCheck'}
                size={13}
                color={COLORS.emeraldPrimary}
              />
              <AppText style={styles.docBadgeTextSuccess}>Coggins PDF</AppText>
            </View>
          ) : null}

          {hasHealthCert ? (
            <View style={styles.docBadgeSuccess}>
              <AppIcon
                name={'ShieldCheck'}
                size={13}
                color={COLORS.emeraldPrimary}
              />
              <AppText style={styles.docBadgeTextSuccess}>
                Health Cert PDF
              </AppText>
            </View>
          ) : null}
        </View>
      ) : null}

      {/* Notes Box */}
      {item?.notes ? (
        <View style={styles.notesBox}>
          <AppIcon
            name={'FileText'}
            size={14}
            color={COLORS.primary}
            style={styles.fileicon}
          />
          <View style={styles.notesContent}>
            <AppText style={styles.notesHeading}>Notes</AppText>
            <AppText style={styles.notesBody}>{item?.notes}</AppText>
          </View>
        </View>
      ) : null}
    </View>
  );
});

export default HorseCard;
