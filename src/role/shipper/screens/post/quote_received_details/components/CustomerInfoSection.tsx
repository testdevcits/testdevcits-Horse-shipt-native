import React from 'react';
import { View } from 'react-native';
import { AppText } from '../../../../../../components';
import AppIcon from '../../../../../../components/app_icon/AppIcon';
import { COLORS, ICON_SIZE } from '../../../../../../constants';
import styles from '../styles.QuoteReceivedDetails';

interface Customer {
  _id?: string;
  name?: string;
  email?: string;
}

interface CustomerInfoSectionProps {
  customer?: Customer;
  message?: string;
}

const truncateText = (text = '', maxLength = 90) => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const CustomerInfoSection: React.FC<CustomerInfoSectionProps> = ({
  customer,
  message,
}) => {
  if (!customer && !message) return null;

  return (
    <>
      {customer && (
        <>
          <View style={styles.sectionHeader}>
            <View>
              <AppText style={styles.sectionTitle}>Customer</AppText>
              <AppText style={styles.sectionSubtitle}>
                Shipment requested by
              </AppText>
            </View>
          </View>

          <View style={styles.customerCard}>
            <View style={styles.customerAvatar}>
              <AppIcon
                name="User"
                size={ICON_SIZE.lg}
                color={COLORS.primary}
              />
            </View>
            <View style={styles.customerInfo}>
              <AppText style={styles.customerName}>
                {customer?.name || 'Customer'}
              </AppText>
              {!!customer?.email && (
                <View style={styles.customerMeta}>
                  <AppIcon
                    name="Mail"
                    size={ICON_SIZE.xs}
                    color={COLORS.textSecondary}
                  />
                  <AppText style={styles.customerEmail}>
                    {customer?.email}
                  </AppText>
                </View>
              )}
            </View>
          </View>
        </>
      )}

      {!!message && (
        <View style={styles.messageCard}>
          <View style={styles.messageIcon}>
            <AppIcon
              name="MessageSquare"
              size={ICON_SIZE.sm}
              color={COLORS.primary}
            />
          </View>
          <View style={styles.messageContent}>
            <AppText style={styles.messageTitle}>Customer Message</AppText>
            <AppText style={styles.messageText}>
              {truncateText(message, 180)}
            </AppText>
          </View>
        </View>
      )}
    </>
  );
};
