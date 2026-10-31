import React, { memo } from 'react';
import { View } from 'react-native';
import { AppText } from '../../../../../../components';
import AppIcon from '../../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../../constants';
import styles from './ReviewStepstyles';

interface ShipmentSummaryCardProps {
  numberOfHorses?: number;
  horsesCount: number;
  uploadedDocCount: number;
  totalDocCount: number;
  additionalInfo?: string;
  hasSpecialRequirement?: boolean;
  specialRequirementDetails?: string;
  recipientEmail?: string;
}

const ShipmentSummaryCard: React.FC<ShipmentSummaryCardProps> = ({
  numberOfHorses,
  horsesCount,
  uploadedDocCount,
  totalDocCount,
  additionalInfo,
  hasSpecialRequirement,
  specialRequirementDetails,
  recipientEmail,
}) => {
  const showNotesCard =
    Boolean(additionalInfo) ||
    Boolean(hasSpecialRequirement) ||
    Boolean(recipientEmail);

  return (
    <>
      {/* HORSES SUMMARY BANNER */}
      <View style={styles.summaryBanner}>
        <View style={styles.bannerLeft}>
          <AppText style={styles.bannerTitle}>Shipment Overview</AppText>
          <AppText style={styles.bannerSub}>
            {numberOfHorses || horsesCount || 0} Horse(s) • {uploadedDocCount}{' '}
            of {totalDocCount} Papers Attached
          </AppText>
        </View>
        <View style={styles.bannerBadge}>
          <AppText style={styles.bannerBadgeText}>
            {uploadedDocCount === totalDocCount ? 'Complete' : 'Pending Docs'}
          </AppText>
        </View>
      </View>

      {/* NOTES & SPECIAL REQUIREMENTS CARD */}
      {showNotesCard && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={styles.iconCircle}>
                <AppIcon name={'Info'} size={16} color={COLORS.primary} />
              </View>
              <AppText style={styles.cardTitle}>
                NOTES & SPECIAL INSTRUCTIONS
              </AppText>
            </View>
          </View>

          {hasSpecialRequirement && (
            <View style={styles.notesBlock}>
              <AppText style={styles.notesLabel}>Special Requirements:</AppText>
              <AppText style={styles.notesValue}>
                {specialRequirementDetails || 'None details provided.'}
              </AppText>
            </View>
          )}

          {Boolean(additionalInfo) && (
            <View style={styles.notesBlock}>
              <AppText style={styles.notesLabel}>
                General Shipment Notes:
              </AppText>
              <AppText style={styles.notesValue}>{additionalInfo}</AppText>
            </View>
          )}

          {Boolean(recipientEmail) && (
            <View style={styles.notesBlock}>
              <AppText style={styles.notesLabel}>
                Share Tracking Recipient Email:
              </AppText>
              <AppText style={styles.notesValue}>{recipientEmail}</AppText>
            </View>
          )}
        </View>
      )}
    </>
  );
};

export default memo(ShipmentSummaryCard);
