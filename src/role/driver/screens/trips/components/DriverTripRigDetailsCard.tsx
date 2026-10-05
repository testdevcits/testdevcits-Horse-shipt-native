import React from 'react';
import { View } from 'react-native';
import AppText from '../../../../../components/common/AppText';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import { COLORS, FONTS } from '../../../../../constants';
import styles from '../styles.shipmentdetails';

interface Props {
  vehicleNumber?: string;
  stallsRequired?: number;
  shipmentNotes?: string;
}

export const DriverTripRigDetailsCard: React.FC<Props> = React.memo(
  ({ vehicleNumber, stallsRequired, shipmentNotes }) => {
    if (!vehicleNumber && stallsRequired == null && !shipmentNotes) {
      return null;
    }

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <AppIcon name="Truck" size={18} color={COLORS.slate900} />
            <AppText style={styles.cardTitle}>Rig & Transport Details</AppText>
          </View>
          {vehicleNumber && (
            <AppText
              style={{
                fontFamily: FONTS.bold,
                fontSize: 12,
                color: COLORS.slate600,
              }}
            >
              {vehicleNumber}
            </AppText>
          )}
        </View>

        {stallsRequired != null && (
          <View style={styles.capacityRow}>
            <AppIcon name="Box" size={16} color={COLORS.slate600} />
            <AppText style={styles.capacityText}>
              Stalls Required Allocation:{' '}
              <AppText style={styles.capacityValue}>
                {stallsRequired} Stalls
              </AppText>
            </AppText>
          </View>
        )}

        {shipmentNotes ? (
          <View style={[styles.careNoteBox, { marginTop: 10 }]}>
            <View style={styles.careNoteHeader}>
              <AppIcon name="Info" size={14} color={COLORS.goldBrownText} />
              <AppText
                style={[styles.careNoteTitle, { color: COLORS.goldBrownText }]}
              >
                Additional Shipment Notes
              </AppText>
            </View>
            <AppText
              style={[styles.careNoteText, { color: COLORS.goldDarkText }]}
            >
              "{shipmentNotes}"
            </AppText>
          </View>
        ) : null}
      </View>
    );
  },
);
