import React, { useState } from 'react';
import { View, Image } from 'react-native';
import AppText from '../../../../../components/common/AppText';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import { COLORS, FONTS } from '../../../../../constants';
import { Horse } from '../../../../../types/driver';
import { horsePlaceholderImage } from '../../../../../config/constants';
import styles from '../styles.shipmentdetails';

const DynamicHorseImage: React.FC<{ url?: string | null }> = ({ url }) => {
  const [imageError, setImageError] = useState(false);
  const imageUri = url && !imageError ? url : horsePlaceholderImage;

  return (
    <Image
      source={{ uri: imageUri }}
      style={styles.horseImage}
      onError={() => setImageError(true)}
    />
  );
};

interface Props {
  horsesList: Horse[];
}

export const DriverTripManifestCard: React.FC<Props> = React.memo(
  ({ horsesList }) => {
    return (
      <>
        {horsesList.map((horse: Horse, hIdx: number) => {
          const hName = horse?.registeredName || `Horse #${hIdx + 1}`;
          const bName = horse?.barnName ? `'${horse?.barnName}'` : '';
          const breedStr = horse?.breed;
          const sexStr = horse?.sex;
          const colourStr = horse?.colour;
          const ageStr = horse?.age ? `${horse?.age} Yrs` : null;
          const stallStr = horse?.requestedStallSize;
          const careNoteStr =
            horse?.generalInfo?.trim() || horse?.notes?.trim();
          const photoUrl = horse?.photo?.url;
          const noteLogEntry = horse?.notesLog?.[0];

          return (
            <View key={hIdx} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                  <AppIcon name="Shield" size={18} color={COLORS.slate900} />
                  <AppText style={styles.cardTitle}>
                    Equine Manifest{' '}
                    {horsesList.length > 1 ? `#${hIdx + 1}` : ''}
                  </AppText>
                </View>
                {stallStr ? (
                  <View style={styles.badgeTagAmber}>
                    <AppText style={styles.badgeTagAmberText}>
                      {stallStr} Reserved
                    </AppText>
                  </View>
                ) : null}
              </View>

              {/* Horse Main Info */}
              <View style={styles.horseCardInner}>
                <DynamicHorseImage url={photoUrl} />

                <View style={styles.horseMainInfo}>
                  <AppText style={styles.horseTitle}>
                    {hName}{' '}
                    {bName ? (
                      <AppText
                        style={{
                          fontSize: 13,
                          color: COLORS.slate600,
                          fontFamily: FONTS.regular,
                        }}
                      >
                        {bName}
                      </AppText>
                    ) : null}
                  </AppText>
                  {breedStr ? (
                    <AppText style={styles.horseSubtitle}>{breedStr}</AppText>
                  ) : null}

                  <View style={styles.pillRow}>
                    {sexStr ? (
                      <View style={styles.characteristicPill}>
                        <AppText style={styles.characteristicText}>
                          {sexStr}
                        </AppText>
                      </View>
                    ) : null}
                    {colourStr ? (
                      <View style={styles.characteristicPill}>
                        <AppText style={styles.characteristicText}>
                          {colourStr}
                        </AppText>
                      </View>
                    ) : null}
                    {ageStr ? (
                      <View style={styles.characteristicPill}>
                        <AppText style={styles.characteristicText}>
                          {ageStr}
                        </AppText>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>

              {/* Special Care Note */}
              {careNoteStr ? (
                <View style={styles.careNoteBox}>
                  <View style={styles.careNoteHeader}>
                    <AppIcon name="AlertCircle" size={14} color="#1E40AF" />
                    <AppText style={styles.careNoteTitle}>
                      Special Care & Instructions
                    </AppText>
                  </View>
                  <AppText style={styles.careNoteText}>"{careNoteStr}"</AppText>
                </View>
              ) : null}

              {/* Customer / Shipper Note Log Entry */}
              {noteLogEntry ? (
                <View style={styles.signOffRow}>
                  <View style={styles.avatarCircle}>
                    <AppText style={styles.avatarInitials}>
                      {(noteLogEntry.userName || 'C').charAt(0).toUpperCase()}
                    </AppText>
                  </View>
                  <View style={styles.signOffInfo}>
                    <AppText style={styles.signOffName}>
                      {noteLogEntry.userName || 'Customer'} (
                      {noteLogEntry.userRole || 'customer'})
                    </AppText>
                    <AppText style={styles.signOffSub}>
                      {noteLogEntry.note || 'Shipper manifest verified'}
                    </AppText>
                  </View>
                  <AppIcon name="CheckCircle" size={20} color="#10B981" />
                </View>
              ) : null}
            </View>
          );
        })}
      </>
    );
  },
);
