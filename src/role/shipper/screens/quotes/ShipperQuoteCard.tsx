import React, { memo, useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import {
  Truck,
  CreditCard,
  Box,
  RefreshCw,
  FileText,
  Calendar,
  Trash2,
  FileCheck,
} from 'lucide-react-native';
import { formatDate } from '../../../../utils/helpers';
import { AppText } from '../../../../components';
import { COLORS, FONTS } from '../../../../constants';
import imageIndex from '../../../../assets/images/imageIndex';
import styles from './styles.myquotes';
import { horsePlaceholderImage } from '../../../../config/constants';

interface ShipperQuoteCardProps {
  quote: any;
  onViewContract: (quote: any) => void;
  onDelete: (quoteId: string) => void;
  onAssignVehicle?: (quote: any) => void;
}

const ShipperQuoteCard: React.FC<ShipperQuoteCardProps> = ({
  quote,
  onViewContract,
  onDelete,
  onAssignVehicle,
}) => {
  const [imageError, setImageError] = useState(false);

  const shipment = quote?.shipment || {};
  const horsePhoto =
    shipment.horses && shipment.horses[0]?.photo?.url
      ? shipment.horses[0].photo.url
      : null;

  const rawStatus = (shipment.status || quote?.status || 'open').toLowerCase();

  let statusLabel = 'In Transit';
  let statusBadgeStyle: any = styles.badgeInTransit;
  let statusTextStyle: any = styles.badgeInTransitText;

  if (rawStatus === 'delivered' || rawStatus === 'completed') {
    statusLabel = 'Delivered';
    statusBadgeStyle = styles.badgeDelivered;
    statusTextStyle = styles.badgeDeliveredText;
  } else if (rawStatus === 'assigned' || rawStatus === 'accepted') {
    statusLabel = 'Assigned';
    statusBadgeStyle = styles.badgeAssigned;
    statusTextStyle = styles.badgeAssignedText;
  } else if (rawStatus === 'rejected' || rawStatus === 'cancelled') {
    statusLabel = 'Cancelled';
    statusBadgeStyle = styles.badgeCancelled;
    statusTextStyle = styles.badgeCancelledText;
  }

  const quoteId = quote?._id || quote?.id;

  const isAssignedOrAccepted = rawStatus === 'assigned' || rawStatus === 'accepted';

  const vehicleObj =
    typeof quote?.vehicle === 'object' && quote?.vehicle !== null
      ? quote?.vehicle
      : typeof quote?.assignedVehicle === 'object' && quote?.assignedVehicle !== null
        ? quote?.assignedVehicle
        : null;

  const driverObj = vehicleObj?.driver;

  const vehicleName =
    vehicleObj
      ? `${vehicleObj?.vehicleType || vehicleObj?.make || 'Vehicle'} (${vehicleObj?.vehicleNumber || vehicleObj?.licensePlate || ''})`.trim()
      : typeof quote?.vehicle === 'string'
        ? quote?.vehicle
        : typeof quote?.assignedVehicle === 'string'
          ? quote?.assignedVehicle
          : null;

  return (
    <View style={styles.quoteCard}>
      {/* Banner Image */}
      <View style={styles.imageContainer}>
        {horsePhoto && !imageError ? (
          <Image
            source={{ uri: horsePhoto }}
            style={styles.horseBanner}
            onError={() => setImageError(true)}
            resizeMode="cover"
          />
        ) : (
          <Image source={{ uri: horsePlaceholderImage }} style={styles.horseBanner} />
        )}
        {/* Status Badge */}
        <View style={[styles.statusPill, statusBadgeStyle]}>
          <AppText style={[styles.statusPillText, statusTextStyle]}>
            {statusLabel}
          </AppText>
        </View>
      </View>

      {/* Card Main Info */}
      <View style={styles.cardBody}>
        <AppText style={styles.shipmentCode}>
          {shipment.shipmentCode || 'HS-SHIP-2026-CODE'}
        </AppText>
        <AppText style={styles.cardSubText}>
          Review shipment offers, contracts, vehicles, and payment status.
        </AppText>

        {/* Pricing */}
        <View style={styles.priceRow}>
          <AppText style={styles.priceLabel}>Pricing : </AppText>
          <AppText style={styles.priceValue}>
            ${quote?.totalPrice || 200}
          </AppText>
        </View>

        {/* 2x2 Specs Grid */}
        <View style={styles.specsGrid}>
          <View style={styles.specBox}>
            <Truck size={18} color={COLORS.primary} />
            <View style={styles.specTextCol}>
              <AppText style={styles.specLabel}>Transport</AppText>
              <AppText style={styles.specValue} numberOfLines={1}>
                {quote?.transportType || 'Trucking'}
              </AppText>
            </View>
          </View>

          <View style={styles.specBox}>
            <CreditCard size={18} color={COLORS.primary} />
            <View style={styles.specTextCol}>
              <AppText style={styles.specLabel}>Payment</AppText>
              <AppText style={styles.specValue} numberOfLines={1}>
                {(quote?.paymentMethod || 'Card').toUpperCase()}
              </AppText>
            </View>
          </View>

          <View style={styles.specBox}>
            <Box size={18} color={COLORS.primary} />
            <View style={styles.specTextCol}>
              <AppText style={styles.specLabel}>Stall</AppText>
              <AppText style={styles.specValue}>
                {quote?.stallsRequired ? String(quote?.stallsRequired).padStart(2, '0') : '01'}
              </AppText>
            </View>
          </View>

          <View style={styles.specBox}>
            <RefreshCw size={18} color={COLORS.primary} />
            <View style={styles.specTextCol}>
              <AppText style={styles.specLabel}>Refund</AppText>
              <AppText style={styles.specValue} numberOfLines={1}>
                {(quote?.payoutStatus || quote?.paymentStatus || 'Pending').toUpperCase()}
              </AppText>
            </View>
          </View>
        </View>

        {/* Assigned Vehicle Display */}
        {vehicleObj ? (
          <View style={styles.assignedVehicleCard}>
            <View style={styles.vehicleHeaderRow}>
              <Truck size={16} color={COLORS.primary} />
              <AppText style={styles.vehicleTitleText}>
                Assigned Vehicle & Driver Details
              </AppText>
            </View>
            <View style={styles.vehicleInfoGrid}>
              <AppText style={styles.vehicleDetailText}>
                <AppText style={styles.boldLabel}>Vehicle Type: </AppText>
                {vehicleObj?.vehicleType || 'N/A'}
              </AppText>
              <AppText style={styles.vehicleDetailText}>
                <AppText style={styles.boldLabel}>Vehicle Number: </AppText>
                {vehicleObj?.vehicleNumber || 'N/A'}
              </AppText>
              {vehicleObj?.numberOfStalls !== undefined && vehicleObj?.numberOfStalls !== null && (
                <AppText style={styles.vehicleDetailText}>
                  <AppText style={styles.boldLabel}>Stalls: </AppText>
                  {vehicleObj?.numberOfStalls}
                </AppText>
              )}
              {driverObj?.name ? (
                <AppText style={styles.vehicleDetailText}>
                  <AppText style={styles.boldLabel}>Driver: </AppText>
                  {driverObj?.name}
                </AppText>
              ) : null}
              {driverObj?.email ? (
                <AppText style={styles.vehicleDetailText}>
                  <AppText style={styles.boldLabel}>Email: </AppText>
                  {driverObj?.email}
                </AppText>
              ) : null}
              {driverObj?.phone ? (
                <AppText style={styles.vehicleDetailText}>
                  <AppText style={styles.boldLabel}>Phone: </AppText>
                  {driverObj?.phone}
                </AppText>
              ) : null}
            </View>
          </View>
        ) : vehicleName ? (
          <View style={styles.assignedVehicleContainer}>
            <Truck size={16} color={COLORS.primary} style={{ marginTop: 2 }} />
            <AppText style={styles.assignedVehicleText}>
              <AppText style={{ fontFamily: FONTS.bold }}>Assigned Vehicle : </AppText>
              {vehicleName}
            </AppText>
          </View>
        ) : null}

        {/* Notes Container */}
        {quote?.notes ? (
          <View style={styles.notesContainer}>
            <FileText size={16} color={COLORS.primary} style={{ marginTop: 2 }} />
            <AppText style={styles.notesText}>
              <AppText style={{ fontFamily: FONTS.bold }}>Notes : </AppText>
              {quote?.notes.trim()}
            </AppText>
          </View>
        ) : null}

        {/* Cancel Notice Container */}
        <View style={styles.cancelNoticeContainer}>
          <Calendar size={16} color="#EF4444" style={{ marginTop: 2 }} />
          <AppText style={styles.cancelNoticeText}>
            Cancel before : {formatDate(quote?.cancellationLastDate, 'DD/MM/YYYY, h:mm:ss A')}
          </AppText>
        </View>

        {/* Action Buttons Row */}
        <View style={styles.actionsRow}>
          {onAssignVehicle && !vehicleObj && (
            <TouchableOpacity
              style={styles.assignVehicleBtn}
              onPress={() => onAssignVehicle(quote)}
              activeOpacity={0.8}
            >
              <Truck size={16} color={COLORS.primary} />
              <AppText style={styles.assignVehicleBtnText}>Assign Vehicle</AppText>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.viewContractBtn]}
            onPress={() => onViewContract(quote)}
            activeOpacity={0.8}
          >
            <FileCheck size={16} color={COLORS.white} />
            <AppText style={styles.viewContractBtnText}>Contract</AppText>
          </TouchableOpacity>

          {!isAssignedOrAccepted && (
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => onDelete(quoteId)}
              activeOpacity={0.8}
            >
              <Trash2 size={16} color={COLORS.textPrimary} />
              <AppText style={styles.deleteBtnText}>Cancel Quote</AppText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default memo(ShipperQuoteCard);
