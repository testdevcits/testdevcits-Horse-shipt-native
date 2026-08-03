import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { AppText } from '../../../../components';
import { Map } from 'lucide-react-native';
import { COLORS, FONTS } from '../../../../constants';

const HorseInformation = ({
  activeShipment,
  setIsMapModalVisible,
}: {
  activeShipment?: any;
  setIsMapModalVisible?: any;
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <AppText style={styles.cardHeaderTitle}>
          🐴 Horses ({activeShipment?.shipment?.numberOfHorses})
        </AppText>
      </View>
      <View style={styles.cardBody}>
        {activeShipment?.shipment?.horses?.map((horse: any, idx: number) => (
          <View key={idx} style={styles.horseDetailsWrapper}>
            {/* Horse Image */}
            {horse?.photo?.url ? (
              <Image
                resizeMode="stretch"
                source={{
                  uri: horse?.photo?.url,
                }}
                style={styles.horseImage}
              />
            ) : (
              <Image
                resizeMode="stretch"
                source={{
                  uri: 'https://thumbs.dreamstime.com/b/simple-horse-logo-icon-vector-art-illustration-simple-horse-logo-icon-vector-art-illustration-features-clean-minimalist-design-351219938.jpg',
                }}
                style={styles.horseImage}
              />
            )}

            {/* Horse Grid details */}
            <View style={styles.horseGrid}>
              <View style={styles.gridCell}>
                <AppText style={styles.gridLabel}>REGISTERED</AppText>
                <AppText style={styles.gridValue}>
                  {horse?.registeredName}
                </AppText>
              </View>
              <View style={styles.gridCell}>
                <AppText style={styles.gridLabel}>BARN</AppText>
                <AppText style={styles.gridValue}>{horse?.barnName}</AppText>
              </View>
              <View style={styles.gridCell}>
                <AppText style={styles.gridLabel}>BREED</AppText>
                <AppText style={styles.gridValue}>{horse?.breed}</AppText>
              </View>
              <View style={styles.gridCell}>
                <AppText style={styles.gridLabel}>SEX</AppText>
                <AppText style={styles.gridValue}>{horse?.sex}</AppText>
              </View>
            </View>
          </View>
        ))}

        {/* Shipment Notes Container */}
        {activeShipment?.notes && (
          <View style={styles.notesBox}>
            <AppText style={styles.notesBoxLabel}>NOTES</AppText>
            <AppText style={styles.notesBoxText}>
              {activeShipment?.notes}
            </AppText>
          </View>
        )}

        {/* Navigation Trigger Button */}
        <TouchableOpacity
          style={styles.goldButton}
          activeOpacity={0.8}
          onPress={() => setIsMapModalVisible(true)}
        >
          <Map size={18} color={COLORS.white} style={styles.btnIcon} />
          <AppText style={styles.goldButtonText}>View Route on Map</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HorseInformation;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.goldBorder,
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  cardHeader: {
    backgroundColor: COLORS.goldLightBg,
    borderBottomWidth: 1.5,
    borderColor: COLORS.goldBorder,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  cardHeaderTitle: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: COLORS.goldDarkText,
  },
  cardBody: {
    padding: 16,
  },
  horseDetailsWrapper: {
    borderWidth: 1.2,
    borderColor: COLORS.goldBorder,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  horseImage: {
    width: '100%',
    height: 140,
    resizeMode: 'stretch',
  },
  horseImageFallback: {
    width: '100%',
    height: 140,
    backgroundColor: COLORS.grey200,
  },
  horseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
  },
  gridCell: {
    width: '50%',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  gridLabel: {
    fontFamily: FONTS.bold,
    fontSize: 9,
    color: COLORS.textLight,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  gridValue: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  notesBox: {
    backgroundColor: COLORS.goldLightBg,
    borderWidth: 1.2,
    borderColor: COLORS.goldBorder,
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },
  notesBoxLabel: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    color: COLORS.goldPrimary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  notesBoxText: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  goldButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.goldPrimary,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnIcon: {
    marginRight: 8,
  },
  goldButtonText: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: COLORS.white,
  },
});
