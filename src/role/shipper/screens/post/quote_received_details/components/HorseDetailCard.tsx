import React from 'react';
import { View, Image } from 'react-native';
import { AppText } from '../../../../../../components';
import AppIcon from '../../../../../../components/app_icon/AppIcon';
import { COLORS, ICON_SIZE } from '../../../../../../constants';
import styles from '../styles.QuoteReceivedDetails';

interface Horse {
  photo?: {
    url?: string | null;
    public_id?: string | null;
  };
  registeredName?: string;
  barnName?: string;
  breed?: string;
  otherBreed?: string;
  sex?: string;
  colour?: string;
  age?: number;
  requestedStallSize?: string;
  generalInfo?: string;
  notes?: string;
}

interface HorseDetailCardProps {
  horse?: Horse;
}

const HorseDetailItem = ({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => (
  <View style={styles.horseDetailItem}>
    <View style={styles.horseDetailIcon}>
      <AppIcon name={icon} size={ICON_SIZE.xs} color={COLORS.primary} />
    </View>

    <View style={styles.horseDetailContent}>
      <AppText style={styles.horseDetailLabel}>{label}</AppText>
      <AppText style={styles.horseDetailValue} numberOfLines={1}>
        {value}
      </AppText>
    </View>
  </View>
);

export const HorseDetailCard: React.FC<HorseDetailCardProps> = ({ horse }) => {
  if (!horse) return null;

  const photoUrl = horse?.photo?.url;

  return (
    <>
      <View style={styles.sectionHeader}>
        <View>
          <AppText style={styles.sectionTitle}>Equine Information</AppText>
          <AppText style={styles.sectionSubtitle}>
            Details for horse transportation
          </AppText>
        </View>
      </View>

      <View style={styles.horseCard}>
        <View style={styles.horseHeader}>
          {photoUrl ? (
            <Image source={{ uri: photoUrl }} style={styles.horseAvatar} />
          ) : (
            <View style={styles.horseAvatar}>
              <AppIcon
                name="Award"
                size={ICON_SIZE.md}
                color={COLORS.primary}
              />
            </View>
          )}

          <View style={styles.horseNameContainer}>
            <AppText style={styles.horseName}>
              {horse?.registeredName || 'Registered name not provided'}
            </AppText>
            <AppText style={styles.horseBarnName}>
              {horse?.barnName || 'Barn not specified'}
            </AppText>
          </View>

          <View style={styles.horseAgeBadge}>
            <AppText style={styles.horseAge}>{horse?.age ?? '--'}</AppText>
            <AppText style={styles.horseAgeLabel}>yrs</AppText>
          </View>
        </View>

        <View style={styles.horseDivider} />

        <View style={styles.horseDetailsGrid}>
          <HorseDetailItem
            icon="Award"
            label="Breed"
            value={horse?.breed || horse?.otherBreed || 'Not specified'}
          />
          <HorseDetailItem
            icon="User"
            label="Sex"
            value={horse?.sex || 'Not specified'}
          />
          <HorseDetailItem
            icon="Circle"
            label="Colour"
            value={horse?.colour || 'Not specified'}
          />
          <HorseDetailItem
            icon="Box"
            label="Stall Size"
            value={horse?.requestedStallSize || 'Not specified'}
          />
        </View>

        {horse?.generalInfo ? (
          <View style={styles.infoBox}>
            <View style={styles.infoBoxHeader}>
              <AppIcon name="Info" size={ICON_SIZE.xs} color={COLORS.primary} />
              <AppText style={styles.infoBoxTitle}>General Information</AppText>
            </View>
            <AppText style={styles.infoBoxText}>{horse?.generalInfo}</AppText>
          </View>
        ) : null}

        {horse?.notes ? (
          <View style={styles.notesBox}>
            <View style={styles.infoBoxHeader}>
              <AppIcon
                name="FileText"
                size={ICON_SIZE.xs}
                color={COLORS.textSecondary}
              />
              <AppText style={styles.notesTitle}>Notes</AppText>
            </View>
            <AppText style={styles.notesText}>{horse?.notes}</AppText>
          </View>
        ) : null}
      </View>
    </>
  );
};
