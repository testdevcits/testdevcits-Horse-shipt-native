import { View, Image, TouchableOpacity } from 'react-native';
import React, { memo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles.profile';
import { AppText } from '../../../../../components';
import { COLORS } from '../../../../../constants';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import { DriverShipmentItem, Horse } from '../../../../../types/driver';
import { horsePlaceholderImage } from '../../../../../config/constants';

export interface CompletedShipmentsProps {
  completedShipments?: DriverShipmentItem[];
  completedCount?: number;
}

const HorseCardAvatar: React.FC<{ url?: string | null }> = ({ url }) => {
  const [imageError, setImageError] = useState(false);
  const imageUri = url && !imageError ? url : horsePlaceholderImage;

  return (
    <Image
      source={{ uri: imageUri }}
      style={styles.horseAvatar}
      onError={() => setImageError(true)}
    />
  );
};

const CompletedShipments: React.FC<CompletedShipmentsProps> = ({
  completedShipments = [],
  completedCount = 0,
}) => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.detailsCard}>
      <View style={styles.detailsHeader}>
        <View style={styles.row}>
          <AppText style={styles.detailsHeaderTitle}>
            Completed Shipments
          </AppText>
          <View style={styles.completedBadgeCount}>
            <AppText style={styles.badgeCountText}>{completedCount}</AppText>
          </View>
        </View>
      </View>

      <View style={styles.shipmentsBody}>
        {completedCount === 0 || !completedShipments?.length ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBox}>
              <AppIcon name={'Box'} size={24} color={COLORS.primary} />
            </View>
            <AppText style={styles.emptyText}>
              No completed shipments yet
            </AppText>
          </View>
        ) : (
          completedShipments.map((item: DriverShipmentItem, index: number) => {
            const shipmentData = item?.shipment || item;
            const pickupLoc =
              shipmentData?.pickupLocation || 'Pickup location unavailable';
            const deliveryLoc =
              shipmentData?.deliveryLocation || 'Delivery location unavailable';
            const shipmentId =
              item?._id || shipmentData?._id || `shipment-${index}`;
            const shortId = shipmentId
              ? `#${shipmentId.slice(0, 8)}`
              : `#MANIFEST`;

            const firstHorse: Horse | undefined = shipmentData?.horses?.[0];
            const horsePhotoUrl = firstHorse?.photo?.url;

            const vehicleNumber = item?.vehicle?.vehicleNumber || 'NA';
            const priceDisplay =
              item?.totalPrice != null
                ? `$${item.totalPrice.toLocaleString()}`
                : '$0';
            const paymentStatusText = item?.paymentStatus
              ? item.paymentStatus.toUpperCase()
              : 'NA';
            const notesText = item?.notes?.trim() || firstHorse?.notes?.trim();

            return (
              <TouchableOpacity
                key={shipmentId}
                style={styles.shipmentCard}
                activeOpacity={0.85}
                onPress={() =>
                  navigation.navigate('ShipmentDetails', { shipment: item })
                }
              >
                {/* Header Row: ID, Status, Price */}
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <AppText style={styles.manifestTag}>{shortId}</AppText>
                    <View style={styles.statusChip}>
                      <View style={styles.statusDotGreen} />
                      <AppText style={styles.statusChipText}>Completed</AppText>
                    </View>
                  </View>

                  <View style={styles.priceBadge}>
                    <AppText style={styles.priceAmountText}>
                      {priceDisplay}
                    </AppText>
                    <AppText style={styles.priceStatusText}>
                      {paymentStatusText}
                    </AppText>
                  </View>
                </View>

                {/* Route Visualizer */}
                <View style={styles.routeContainer}>
                  {/* Origin */}
                  <View style={styles.routeRow}>
                    <View style={styles.routeIconBox}>
                      <View style={styles.routeDotOrigin} />
                    </View>
                    <View style={styles.routeContent}>
                      <AppText style={styles.routeLabel} numberOfLines={1}>
                        {pickupLoc}
                      </AppText>
                      {shipmentData?.pickupCoords && (
                        <AppText style={styles.routeCoords}>
                          {shipmentData.pickupCoords.latitude?.toFixed(3)}° N,{' '}
                          {shipmentData.pickupCoords.longitude?.toFixed(3)}° E
                        </AppText>
                      )}
                    </View>
                  </View>

                  {/* Vertical Line */}
                  <View style={styles.routeRow}>
                    <View style={styles.routeIconBox}>
                      <View style={styles.routeLineVertical} />
                    </View>
                  </View>

                  {/* Destination */}
                  <View style={styles.routeRow}>
                    <View style={styles.routeIconBox}>
                      <AppIcon name="MapPin" size={14} color={COLORS.primary} />
                    </View>
                    <View style={styles.routeContent}>
                      <AppText style={styles.routeLabel} numberOfLines={1}>
                        {deliveryLoc}
                      </AppText>
                      {shipmentData?.deliveryCoords && (
                        <AppText style={styles.routeCoords}>
                          {shipmentData.deliveryCoords.latitude?.toFixed(3)}° N,{' '}
                          {shipmentData.deliveryCoords.longitude?.toFixed(3)}° E
                        </AppText>
                      )}
                    </View>
                  </View>
                </View>

                {/* Equine Section */}
                {firstHorse && (
                  <View style={styles.horseSection}>
                    <HorseCardAvatar url={horsePhotoUrl} />
                    <View style={styles.horseDetails}>
                      <View style={styles.horseHeaderRow}>
                        <AppText style={styles.horseName}>
                          {firstHorse.registeredName || 'Horse Manifest'}
                        </AppText>
                        {firstHorse.requestedStallSize && (
                          <View style={styles.stallBadge}>
                            <AppText style={styles.stallBadgeText}>
                              {firstHorse.requestedStallSize}
                            </AppText>
                          </View>
                        )}
                      </View>
                      <AppText style={styles.horseSubtext}>
                        {[
                          firstHorse.breed,
                          firstHorse.sex,
                          firstHorse.age ? `${firstHorse.age}yo` : null,
                          firstHorse.barnName
                            ? `Barn: ${firstHorse.barnName}`
                            : null,
                        ]
                          .filter(Boolean)
                          .join(' • ')}
                      </AppText>
                    </View>
                  </View>
                )}

                {/* Vehicle & Transport Type Footer */}
                <View style={styles.cardFooterRow}>
                  <View style={styles.vehicleChip}>
                    <AppIcon name="Truck" size={14} color={COLORS.slate600} />
                    <AppText style={styles.vehicleText}>
                      Rig #{vehicleNumber} • {item?.stallsRequired || 0} Stalls
                    </AppText>
                  </View>
                </View>

                {/* Special Care Notes Banner */}
                {notesText ? (
                  <View style={styles.notesBanner}>
                    <AppIcon
                      name="Info"
                      size={14}
                      color={COLORS.amberPrimary}
                    />
                    <AppText style={styles.notesText} numberOfLines={2}>
                      {notesText}
                    </AppText>
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </View>
  );
};

export default memo(CompletedShipments);
