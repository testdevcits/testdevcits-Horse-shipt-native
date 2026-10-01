import React from 'react';
import { View } from 'react-native';
import AppText from '../../../../../../components/common/AppText';
import AppIcon from '../../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../../constants';
import styles from '../styles.shippershipmentdetails';

interface Props {
  shipment: any;
  distanceMiles: string;
  distanceKm: string;
  heroStallSize: string;
}

export const ShipperRouteInfoCard: React.FC<Props> = React.memo(
  ({ shipment, distanceMiles, distanceKm, heroStallSize }) => {
    return (
      <>
        {/* 4-Grid Spec Cards */}
        <View style={styles.gridContainer}>
          <View style={styles.specStatCard}>
            <View style={styles.specStatIconBox}>
              <AppIcon name="Compass" size={18} color={COLORS.saddleBrown} />
            </View>
            <View style={styles.specStatTextCol}>
              <AppText style={styles.specStatLabel}>DISTANCE</AppText>
              <AppText style={styles.specStatValue}>{distanceMiles} mi</AppText>
            </View>
          </View>

          <View style={styles.specStatCard}>
            <View style={styles.specStatIconBox}>
              <AppIcon name="Box" size={18} color={COLORS.saddleBrown} />
            </View>
            <View style={styles.specStatTextCol}>
              <AppText style={styles.specStatLabel}>HORSES</AppText>
              <AppText style={styles.specStatValue}>
                {shipment?.numberOfHorses || 1}
              </AppText>
            </View>
          </View>

          <View style={styles.specStatCard}>
            <View style={styles.specStatIconBox}>
              <AppIcon name="Box" size={18} color={COLORS.saddleBrown} />
            </View>
            <View style={styles.specStatTextCol}>
              <AppText style={styles.specStatLabel}>STALL</AppText>
              <AppText style={styles.specStatValue}>{heroStallSize}</AppText>
            </View>
          </View>

          <View style={styles.specStatCard}>
            <View style={styles.specStatIconBox}>
              <AppIcon name="Box" size={18} color={COLORS.saddleBrown} />
            </View>
            <View style={styles.specStatTextCol}>
              <AppText style={styles.specStatLabel}>STALL</AppText>
              <AppText style={styles.specStatValue}>{heroStallSize}</AppText>
            </View>
          </View>
        </View>

        {/* Route Information Card */}
        <View style={styles.routeInfoCard}>
          <View style={styles.cardTitleRow}>
            <AppIcon name="Compass" size={18} color={COLORS.saddleBrown} />
            <AppText style={styles.cardHeaderTitle}>Route Information</AppText>
          </View>

          <View style={styles.timelineContainer}>
            {/* Pickup Node */}
            <View style={styles.timelineRow}>
              <View style={styles.timelineIconBoxPickup}>
                <AppIcon name="MapPin" size={16} color={COLORS.saddleBrown} />
              </View>

              <View style={styles.timelineTextCol}>
                <AppText style={styles.timelineLabel}>PICKUP LOCATION</AppText>
                <AppText style={styles.timelineAddress}>
                  {shipment?.pickupLocation || 'Not Available'}
                </AppText>
              </View>
            </View>

            {/* Connecting Vertical Line */}
            <View style={styles.timelineLine} />

            {/* Delivery Node */}
            <View style={styles.timelineRow}>
              <View style={styles.timelineIconBoxDelivery}>
                <AppIcon name="Flag" size={16} color={COLORS.saddleBrown} />
              </View>

              <View style={styles.timelineTextCol}>
                <AppText style={styles.timelineLabel}>
                  DELIVERY LOCATION
                </AppText>
                <AppText style={styles.timelineAddress}>
                  {shipment?.deliveryLocation || 'Not Available'}
                </AppText>
              </View>
            </View>
          </View>

          <View style={styles.totalDistanceContainer}>
            <AppText style={styles.totalDistanceLabel}>TOTAL DISTANCE</AppText>
            <AppText style={styles.totalDistanceValue}>
              {distanceMiles}{' '}
              <AppText style={styles.totalDistanceSub}>
                miles ({distanceKm} km)
              </AppText>
            </AppText>
          </View>
        </View>
      </>
    );
  },
);
