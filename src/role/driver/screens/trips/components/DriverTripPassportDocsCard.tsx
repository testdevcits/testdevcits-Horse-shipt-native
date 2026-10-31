import React from 'react';
import { View, TouchableOpacity, Linking } from 'react-native';
import AppText from '../../../../../components/common/AppText';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../constants';
import styles from '../styles.shipmentdetails';

interface DocItem {
  title: string;
  subtitle: string;
  url: string | null;
}

interface Props {
  docsList: DocItem[];
}

export const DriverTripPassportDocsCard: React.FC<Props> = React.memo(
  ({ docsList }) => {
    if (!docsList || docsList.length === 0) {
      return null;
    }

    const handleOpenDoc = (url: string | null) => {
      if (url) {
        Linking.openURL(url).catch(err =>
          console.log('Could not open document URL:', err),
        );
      }
    };

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <AppIcon name="Shield" size={18} color={COLORS.slate900} />
            <AppText style={styles.cardTitle}>Digital Equine Passport</AppText>
          </View>
          <View style={styles.badgeTagGreen}>
            <AppText style={styles.badgeTagGreenText}>
              {docsList.length} Verified
            </AppText>
          </View>
        </View>

        {docsList.map((doc, dIdx) => (
          <TouchableOpacity
            key={dIdx}
            style={styles.docRow}
            activeOpacity={0.7}
            onPress={() => handleOpenDoc(doc.url)}
          >
            <View style={styles.docIconTile}>
              <AppIcon name="FileText" size={18} color={COLORS.slate900} />
            </View>
            <View style={styles.docInfo}>
              <AppText style={styles.docTitle}>{doc.title}</AppText>
              <AppText style={styles.docSubtext}>{doc.subtitle}</AppText>
            </View>
            <AppIcon name="ExternalLink" size={16} color={COLORS.slate700} />
          </TouchableOpacity>
        ))}
      </View>
    );
  },
);
