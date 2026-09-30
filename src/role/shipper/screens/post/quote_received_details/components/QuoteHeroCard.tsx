import React, { memo } from 'react';
import { View } from 'react-native';
import { AppText } from '../../../../../../components';
import AppIcon from '../../../../../../components/app_icon/AppIcon';
import { COLORS, ICON_SIZE } from '../../../../../../constants';
import styles from '../styles.QuoteReceivedDetails';

interface QuoteHeroCardProps {
  shipmentCode: string;
  status: string;
  statusColor: string;
  getStatusLabel: (status: string) => string;
  formatDate: (date: any) => string;
  quoteCreatedAt: any;
  numberOfHorses: number;
}

export const QuoteHeroCard: React.FC<QuoteHeroCardProps> = memo(
  ({
    shipmentCode,
    status,
    statusColor,
    getStatusLabel,
    formatDate,
    quoteCreatedAt,
    numberOfHorses,
  }) => {
    return (
      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.shipmentIcon}>
            <AppIcon name="Truck" size={ICON_SIZE.xl} color={COLORS.primary} />
          </View>

          <View style={styles.heroInfo}>
            <AppText style={styles.heroLabel}>SHIPMENT REQUEST</AppText>
            <AppText style={styles.heroCode}>{shipmentCode}</AppText>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${statusColor}15` },
            ]}
          >
            <View
              style={[styles.statusDot, { backgroundColor: statusColor }]}
            />
            <AppText style={[styles.statusText, { color: statusColor }]}>
              {getStatusLabel(status)}
            </AppText>
          </View>
        </View>

        <View style={styles.heroDivider} />

        <View style={styles.heroBottomRow}>
          <View style={styles.heroMeta}>
            <AppIcon
              name="Calendar"
              size={ICON_SIZE.sm}
              color={COLORS.textSecondary}
            />
            <AppText style={styles.heroMetaText}>
              Requested {formatDate(quoteCreatedAt)}
            </AppText>
          </View>

          <View style={styles.heroMeta}>
            <AppIcon
              name="Box"
              size={ICON_SIZE.sm}
              color={COLORS.textSecondary}
            />
            <AppText style={styles.heroMetaText}>
              {numberOfHorses || 1} {numberOfHorses === 1 ? 'Horse' : 'Horses'}
            </AppText>
          </View>
        </View>
      </View>
    );
  },
);

export default QuoteHeroCard;
