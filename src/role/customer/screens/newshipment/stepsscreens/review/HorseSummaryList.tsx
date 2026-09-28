import React, { memo } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { AppText } from '../../../../../../components';
import AppIcon from '../../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../../constants';
import { NewShipmentHorse } from '../../interfaces';
import styles from './ReviewStepstyles';

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <AppText style={styles.infoLabel}>{label}</AppText>
    <AppText style={styles.infoValue}>{value || 'N/A'}</AppText>
  </View>
);

interface HorseSummaryListProps {
  horses: NewShipmentHorse[];
  isHorseExpanded: boolean;
  setIsHorseExpanded: (expanded: boolean) => void;
  onEditSection: (stepIndex: number) => void;
  getDocUri: (doc: any) => string | null;
}

const HorseSummaryList: React.FC<HorseSummaryListProps> = ({
  horses,
  isHorseExpanded,
  setIsHorseExpanded,
  onEditSection,
  getDocUri,
}) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardHeaderToggle}
        onPress={() => setIsHorseExpanded(!isHorseExpanded)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeaderLeft}>
          <View style={styles.iconCircle}>
            <AppIcon name={'ShieldCheck'} size={16} color={COLORS.primary} />
          </View>
          <AppText style={styles.cardTitle}>HORSE DETAILS</AppText>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity
            style={styles.miniEditBtn}
            onPress={() => onEditSection(2)}
            activeOpacity={0.8}
          >
            <AppIcon name={'Edit3'} size={13} color={COLORS.primary} />
            <AppText style={styles.miniEditText}>Edit</AppText>
          </TouchableOpacity>
          {isHorseExpanded ? (
            <AppIcon name={'ChevronUp'} size={18} color={COLORS.grey600} />
          ) : (
            <AppIcon name={'ChevronDown'} size={18} color={COLORS.grey600} />
          )}
        </View>
      </TouchableOpacity>

      {isHorseExpanded && (
        <View style={styles.accordionContent}>
          {(horses || []).map((horse: NewShipmentHorse, index: number) => {
            const photoUri = getDocUri(horse?.photo);
            return (
              <View
                key={index}
                style={[
                  styles.horseSectionBox,
                  index < (horses?.length || 0) - 1 && styles.horseBoxBorder,
                ]}
              >
                <View style={styles.horseHeaderRow}>
                  <View style={styles.horseTag}>
                    <AppText style={styles.horseTagText}>
                      HORSE {index + 1}
                    </AppText>
                  </View>
                  <AppText style={styles.horseNameTitle}>
                    {horse?.registeredName || 'Unnamed Horse'}
                  </AppText>
                </View>

                <View style={styles.infoGrid}>
                  <InfoRow
                    label="Registered Name:"
                    value={horse?.registeredName}
                  />
                  {!!horse?.barnName && (
                    <InfoRow label="Barn Name:" value={horse?.barnName} />
                  )}
                  <InfoRow label="Breed:" value={horse?.breed} />
                  <InfoRow label="Sex:" value={horse?.sex} />
                  {!!horse?.age && (
                    <InfoRow label="Age:" value={`${horse?.age} yrs`} />
                  )}
                  {!!horse?.colour && (
                    <InfoRow label="Colour:" value={horse?.colour} />
                  )}
                  <InfoRow
                    label="Stall Size:"
                    value={horse?.requestedStallSize || 'Box'}
                  />
                </View>

                {/* HORSE PHOTO PREVIEW */}
                <View style={styles.photoContainer}>
                  <AppText style={styles.subFieldLabel}>Horse Photo</AppText>
                  {photoUri ? (
                    <View style={styles.photoPreviewCard}>
                      <Image
                        source={{ uri: photoUri }}
                        style={styles.horseImagePreview}
                        resizeMode="contain"
                      />
                      <View style={styles.photoOverlayBadge}>
                        <AppIcon
                          name={'CheckCircle2'}
                          size={12}
                          color={COLORS.white}
                        />
                        <AppText style={styles.photoOverlayText}>
                          Photo Attached
                        </AppText>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.noPhotoBox}>
                      <AppIcon
                        name={'Image'}
                        size={20}
                        color={COLORS.grey400}
                      />
                      <AppText style={styles.noPhotoText}>
                        No photo attached
                      </AppText>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default memo(HorseSummaryList);
