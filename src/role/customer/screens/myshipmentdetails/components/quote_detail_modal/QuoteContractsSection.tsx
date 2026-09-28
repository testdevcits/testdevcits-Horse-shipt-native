import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { AppText } from '../../../../../../components';
import AppIcon from '../../../../../../components/app_icon/AppIcon';
import { COLORS, ICON_SIZE, SPACING } from '../../../../../../constants';
import styles from './styles.QuoteDetailModal';

interface QuoteContractsSectionProps {
  quote: any;
  onClose: () => void;
  navigation: any;
}

const QuoteContractsSection: React.FC<QuoteContractsSectionProps> = ({
  quote,
  onClose,
  navigation,
}) => {
  const hasContract =
    quote?.contract?.url ||
    quote?.contract ||
    quote?.shipperContract?.url ||
    quote?.shipperContract;

  if (!hasContract) return null;

  return (
    <View style={styles.cardContainer}>
      <AppText style={styles.cardTitle}>Contracts & Documents</AppText>

      {(quote?.contract?.url || typeof quote?.contract === 'string') && (
        <TouchableOpacity
          style={styles.docItem}
          activeOpacity={0.8}
          onPress={() => {
            const contractUrl =
              typeof quote?.contract === 'string'
                ? quote?.contract
                : quote?.contract.url;
            if (contractUrl) {
              onClose();
              navigation.navigate('PdfViewer', {
                url: contractUrl,
                title: 'Shipment Contract',
              });
            }
          }}
        >
          <View style={styles.docLeftRow}>
            <View style={styles.docIconBox}>
              <AppIcon
                name={'FileText'}
                size={ICON_SIZE.sm}
                color={COLORS.primary}
              />
            </View>
            <View style={styles.docInfo}>
              <AppText style={styles.docName}>Shipment Contract</AppText>
              <AppText style={styles.docSub}>
                Official shipment agreement
              </AppText>
            </View>
          </View>
          <View style={styles.docActionWrap}>
            <AppText style={styles.docActionText}>View</AppText>
            <AppIcon
              name={'ChevronRight'}
              size={ICON_SIZE.xs}
              color={COLORS.primary}
            />
          </View>
        </TouchableOpacity>
      )}

      {(quote?.shipperContract?.url ||
        typeof quote?.shipperContract === 'string') && (
        <TouchableOpacity
          style={[
            styles.docItem,
            (quote?.contract?.url || typeof quote?.contract === 'string') && {
              marginTop: SPACING.sm,
            },
          ]}
          activeOpacity={0.8}
          onPress={() => {
            const shipperUrl =
              typeof quote?.shipperContract === 'string'
                ? quote?.shipperContract
                : quote?.shipperContract.url;
            const docTitle =
              quote?.shipperContract?.originalName || 'Not Available';
            if (shipperUrl) {
              onClose();
              navigation.navigate('PdfViewer', {
                url: shipperUrl,
                title: docTitle,
              });
            }
          }}
        >
          <View style={styles.docLeftRow}>
            <View style={styles.docIconBox}>
              <AppIcon
                name={'FileText'}
                size={ICON_SIZE.sm}
                color={COLORS.primary}
              />
            </View>
            <View style={styles.docInfo}>
              <AppText style={styles.docName} numberOfLines={1}>
                {quote?.shipperContract?.originalName || 'Shipper Contract'}
              </AppText>
              <AppText style={styles.docSub}>Uploaded contract terms</AppText>
            </View>
          </View>
          <View style={styles.docActionWrap}>
            <AppText style={styles.docActionText}>View</AppText>
            <AppIcon
              name={'ChevronRight'}
              size={ICON_SIZE.xs}
              color={COLORS.primary}
            />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default memo(QuoteContractsSection);
