import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import AppText from '../../../../../../components/common/AppText';
import AppIcon from '../../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../../constants';
import imageIndex from '../../../../../../assets/images/imageIndex';
import styles from '../styles.shippershipmentdetails';

interface Props {
  shipment: any;
  horsePhoto: string | null;
  heroRegisteredName: string;
  heroBarnName: string;
  heroBreed: string;
  heroAge: string | number;
  heroSex: string;
  heroColour: string;
  pickupDateFormatted: string;
  deliveryDateFormatted: string;
  onShare: () => void;
}

export const ShipperHeroBannerCard: React.FC<Props> = React.memo(
  ({
    shipment,
    horsePhoto,
    heroRegisteredName,
    heroBarnName,
    heroBreed,
    heroAge,
    heroSex,
    heroColour,
    pickupDateFormatted,
    deliveryDateFormatted,
    onShare,
  }) => {
    return (
      <View style={styles.heroCard}>
        <View style={styles.heroBannerContainer}>
          {horsePhoto ? (
            <Image
              source={{ uri: horsePhoto }}
              style={styles.heroBannerImage}
            />
          ) : (
            <Image source={imageIndex?.Banner} style={styles.heroBannerImage} />
          )}
          <View style={styles.heroBannerBadge}>
            <AppText style={styles.heroBannerBadgeText}>
              {(shipment?.status || 'Not Available').replace(/_/g, ' ')}
            </AppText>
          </View>
        </View>

        <View style={styles.heroBody}>
          <View style={styles.horseCountTag}>
            <AppText style={styles.horseCountTagText}>
              Horse {shipment?.horses?.length || '0'}
            </AppText>
          </View>

          <AppText style={styles.heroTitle}>
            {heroRegisteredName} ( {heroBarnName} )
          </AppText>
          <AppText style={styles.heroSubtitle}>
            {heroBreed} • {heroAge} yrs • {heroSex} • {heroColour}
          </AppText>
          <AppText style={styles.shipmentCodeText}>
            {shipment?.shipmentCode}
          </AppText>

          <View style={styles.customerRow}>
            <AppText style={styles.customerNameText}>
              Customer: {shipment?.customer?.name || 'Not Available'}
            </AppText>
            <TouchableOpacity style={styles.shareBtn} onPress={onShare}>
              <AppIcon name="Share2" size={14} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Date Cards Row */}
          <View style={styles.dateCardsRow}>
            <View style={styles.dateCard}>
              <AppText style={styles.dateCardLabel}>PICKUP</AppText>
              <AppText style={styles.dateCardValue}>
                {pickupDateFormatted}
              </AppText>
            </View>

            <View style={styles.dateCard}>
              <AppText style={styles.dateCardLabel}>DELIVERY</AppText>
              <AppText style={styles.dateCardValue}>
                {deliveryDateFormatted}
              </AppText>
            </View>
          </View>
        </View>
      </View>
    );
  },
);
