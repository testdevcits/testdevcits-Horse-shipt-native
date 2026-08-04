import React, { memo, useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Truck, MapPin, Calendar, ExternalLink } from 'lucide-react-native';
import { AppText } from '../../../../components';
import { COLORS } from '../../../../constants';
import imageIndex from '../../../../assets/images/imageIndex';
import { formatDate } from '../../../../utils/helpers';
import styles from './styles.shipperhome';
import { horsePlaceholderImage } from '../../../../config/constants';

interface AvailableShipmentCardProps {
  item: any;
  onPress: (item: any) => void;
}

const AvailableShipmentCard: React.FC<AvailableShipmentCardProps> = ({ item, onPress }) => {
  const [imageError, setImageError] = useState(false);

  const horsePhoto =
    item?.horses && item?.horses[0]?.photo?.url
      ? item?.horses[0].photo.url
      : null;

  const horseName =
    item?.horses && item?.horses[0]?.registeredName
      ? item?.horses[0].registeredName
      : 'Thunder - Sky';

  const horseSpecs =
    item?.horses && item?.horses[0]
      ? `${item?.horses[0].breed || 'Belgian Warmblood'} | ${item?.horses[0].age || '2'
      }yr | ${item?.horses[0].colour || 'Blood bay'}`
      : 'Belgian Warmblood | 2yr | Blood bay';

  const locationText = item?.pickupLocation
    ? item?.pickupLocation.split(',')[0] +
    ', ' +
    (item?.pickupLocation.split(',')[1] || '')
    : 'Ghbaleh, Lebanon';

  return (
    <TouchableOpacity
      style={styles.shipmentCard}
      onPress={() => onPress(item)}
      activeOpacity={0.85}
    >
      {/* Left Horse Image */}
      <View style={styles.cardImageContainer}>
        {horsePhoto && !imageError ? (
          <Image
            source={{ uri: horsePhoto }}
            style={styles.cardImage}
            onError={() => setImageError(true)}
          />
        ) : (
          <Image
            source={{ uri: horsePlaceholderImage }}
            style={[styles.cardImage, { opacity: 0.7 }]}
          />
        )}
      </View>

      {/* Center Info Col */}
      <View style={styles.cardInfoCol}>
        <AppText style={styles.horseTitle}>{horseName}</AppText>
        <AppText style={styles.horseSpecs}>{horseSpecs}</AppText>
        <AppText style={styles.shipmentCode}>
          {item?.shipmentCode || 'HS-SHIP-2026-3B7C23'}
        </AppText>

        <View style={styles.infoMetaRow}>
          <MapPin size={14} color={COLORS.textSecondary} />
          <AppText style={styles.infoMetaText} numberOfLines={1}>
            {locationText}
          </AppText>
        </View>

        <View style={styles.infoMetaRow}>
          <Calendar size={14} color={COLORS.textSecondary} />
          <AppText style={styles.infoMetaText}>
            {item?.pickupDateRange?.start
              ? `Pickup ${formatDate(item?.pickupDateRange.start, 'MMM DD')}`
              : 'Pickup Jul 23-31'}
          </AppText>
        </View>
      </View>

      {/* Right Action & Timeline Col */}
      <View style={styles.cardRightCol}>
        <TouchableOpacity
          style={styles.externalActionBtn}
          onPress={() => onPress(item)}
          activeOpacity={0.8}
        >
          <ExternalLink size={14} color={COLORS.white} />
        </TouchableOpacity>

        <View style={styles.timelineCol}>
          <View style={styles.timelineDot} />
          <View style={styles.timelineDashedLine} />
          <View style={styles.timelineTruckNode}>
            <Truck size={12} color="#059669" />
          </View>
          <View style={styles.timelineDashedLine} />
          <View style={styles.timelineDot} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(AvailableShipmentCard);
