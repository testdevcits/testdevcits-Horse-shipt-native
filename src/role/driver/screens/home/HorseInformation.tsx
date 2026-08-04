import { Image, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { AppText, Button } from '../../../../components';
import { FileText, Award } from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SPACING, FONT_SIZE } from '../../../../constants';
import { horsePlaceholderImage } from '../../../../config/constants';

const HorseInformation = ({
  activeShipment,
  setIsMapModalVisible,
}: {
  activeShipment?: any;
  setIsMapModalVisible?: any;
}) => {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const handleImageError = (idx: number) => {
    setImageErrors(prev => ({ ...prev, [idx]: true }));
  };

  const horses = activeShipment?.shipment?.horses || [];

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Award size={20} color={COLORS.goldPrimary} />
        <AppText style={styles.cardHeaderTitle}>
          Horses ({horses.length})
        </AppText>
      </View>

      <View style={styles.cardBody}>
        {horses.map((horse: any, idx: number) => {
          const hasError = imageErrors[idx];
          const photoUrl = !hasError && horse?.photo?.url ? horse.photo.url : horsePlaceholderImage;

          return (
            <View key={idx} style={styles.horseCard}>
              {/* Horse Image */}
              <View style={styles.imageContainer}>
                <Image
                  resizeMode="cover"
                  source={{ uri: photoUrl }}
                  style={styles.horseImage}
                  onError={() => handleImageError(idx)}
                />
                {horse?.registeredName ? (
                  <View style={styles.horseNameBadge}>
                    <AppText style={styles.horseNameBadgeText} numberOfLines={1}>
                      {horse.registeredName}
                    </AppText>
                  </View>
                ) : null}
              </View>

              {/* Horse Specs Grid */}
              <View style={styles.horseGrid}>
                <View style={styles.gridCell}>
                  <AppText style={styles.gridLabel}>REGISTERED NAME</AppText>
                  <AppText style={styles.gridValue} numberOfLines={1}>
                    {horse?.registeredName || 'N/A'}
                  </AppText>
                </View>
                <View style={styles.gridCell}>
                  <AppText style={styles.gridLabel}>BARN NAME</AppText>
                  <AppText style={styles.gridValue} numberOfLines={1}>
                    {horse?.barnName || 'N/A'}
                  </AppText>
                </View>
                <View style={styles.gridCell}>
                  <AppText style={styles.gridLabel}>BREED</AppText>
                  <AppText style={styles.gridValue} numberOfLines={1}>
                    {horse?.breed || 'N/A'}
                  </AppText>
                </View>
                <View style={styles.gridCell}>
                  <AppText style={styles.gridLabel}>SEX / AGE</AppText>
                  <AppText style={styles.gridValue} numberOfLines={1}>
                    {horse?.sex || 'N/A'} {horse?.age ? `• ${horse.age} yrs` : ''}
                  </AppText>
                </View>
              </View>
            </View>
          );
        })}

        {/* Shipment Notes Container */}
        {activeShipment?.notes ? (
          <View style={styles.notesBox}>
            <View style={styles.notesHeaderRow}>
              <FileText size={16} color={COLORS.goldPrimary} />
              <AppText style={styles.notesBoxLabel}>SHIPMENT NOTES</AppText>
            </View>
            <AppText style={styles.notesBoxText}>
              {activeShipment.notes}
            </AppText>
          </View>
        ) : null}

        {/* Navigation Trigger Button */}
        {setIsMapModalVisible && (
          <Button
            title="View Route on Map"
            onPress={() => setIsMapModalVisible(true)}
          />
        )}
      </View>
    </View>
  );
};

export default HorseInformation;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.goldLightBg,
    borderBottomWidth: 1,
    borderColor: COLORS.goldBorder,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  cardHeaderTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
    color: COLORS.goldDarkText,
  },
  cardBody: {
    padding: 16,
  },
  horseCard: {
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: COLORS.grey50,
  },
  imageContainer: {
    width: '100%',
    height: 160,
    position: 'relative',
    backgroundColor: COLORS.grey200,
  },
  horseImage: {
    width: '100%',
    height: '100%',
  },
  horseNameBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
    maxWidth: '85%',
  },
  horseNameBadgeText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
  },
  horseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 8,
  },
  gridCell: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.xs,
    padding: 10,
  },
  gridLabel: {
    fontFamily: FONTS.bold,
    fontSize: 9,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  gridValue: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textPrimary,
  },
  notesBox: {
    backgroundColor: COLORS.goldLightBg,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    borderRadius: RADIUS.sm,
    padding: 14,
    marginBottom: 16,
  },
  notesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  notesBoxLabel: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.goldPrimary,
    letterSpacing: 0.5,
  },
  notesBoxText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.xs,
    color: COLORS.goldDarkText,
    lineHeight: 18,
  },
});
