import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Dimensions,
  Image,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Download, FileText } from 'lucide-react-native';
import { AppText } from '../../../../components';
import { COLORS, FONTS, RADIUS, SPACING, FONT_SIZE } from '../../../../constants';
import styles from './styles.contractmodal';

interface ContractModalProps {
  visible: boolean;
  onClose: () => void;
  contractUrl?: string;
  shipmentCode?: string;
  quoteData?: any;
}

const { height } = Dimensions.get('window');

const ContractModal: React.FC<ContractModalProps> = ({
  visible,
  onClose,
  contractUrl,
  shipmentCode = 'HS-SHIP-2026-CE9DC1',
}) => {
  const isImage = (url?: string) => {
    if (!url) return false;
    const l = url.toLowerCase();
    return (
      l.endsWith('.jpg') ||
      l.endsWith('.jpeg') ||
      l.endsWith('.png') ||
      l.includes('/image/upload/')
    );
  };

  const handleDownload = () => {
    if (contractUrl) {
      Linking.openURL(contractUrl);
    }
  };

  const getWebViewSource = () => {
    if (!contractUrl) return { html: '<div>No Contract Available</div>' };

    const lower = contractUrl.toLowerCase();
    if (lower.endsWith('.pdf') || lower.includes('.raw/upload/')) {
      return {
        uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
          contractUrl,
        )}`,
      };
    }
    return { uri: contractUrl };
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Top Contract Header Banner */}
          <View style={styles.contractBannerHeader}>
            <View style={styles.logoRow}>
              <View style={styles.logoBadge}>
                <AppText style={styles.logoBadgeText}>HorseShipt</AppText>
              </View>
              <View style={styles.bannerTextCol}>
                <AppText style={styles.brandTitle}>HORSESHIPT™</AppText>
                <AppText style={styles.shipmentCodeText}>
                  Shipment Code: {shipmentCode}
                </AppText>
              </View>
            </View>
          </View>

          {/* WebView Contract Content Preview */}
          <View style={styles.webViewContainer}>
            {contractUrl ? (
              isImage(contractUrl) ? (
                <Image
                  source={{ uri: contractUrl }}
                  style={styles.contractImage}
                  resizeMode="contain"
                />
              ) : (
                <WebView
                  source={getWebViewSource()}
                  style={styles.webView}
                  startInLoadingState
                  renderLoading={() => (
                    <View style={styles.loader}>
                      <ActivityIndicator size="large" color={COLORS.goldPrimary} />
                    </View>
                  )}
                />
              )
            ) : (
              <View style={styles.loader}>
                <FileText size={40} color={COLORS.textLight} />
                <AppText style={styles.noContractText}>
                  Contract preview unavailable
                </AppText>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.downloadBtn}
              onPress={handleDownload}
              activeOpacity={0.8}
            >
              <Download size={18} color={COLORS.white} />
              <AppText style={styles.downloadBtnText}>Download Contract</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.laterBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <AppText style={styles.laterBtnText}>Maybe Later</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ContractModal;
