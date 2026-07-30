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

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xl,
  },
  modalCard: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },

  // Banner Header
  contractBannerHeader: {
    backgroundColor: '#A06333',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoBadge: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
  },
  logoBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: '#A06333',
  },
  bannerTextCol: {
    alignItems: 'flex-end',
  },
  brandTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    letterSpacing: 0.5,
  },
  shipmentCodeText: {
    color: '#FDE68A',
    fontSize: 10,
    fontFamily: FONTS.medium,
    marginTop: 1,
  },

  // WebView Container
  webViewContainer: {
    height: height * 0.52,
    backgroundColor: '#FAFAFA',
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contractImage: {
    width: '100%',
    height: '100%',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  noContractText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },

  // Action Buttons
  actionContainer: {
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    gap: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  downloadBtn: {
    backgroundColor: '#A06333',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm + 4,
    borderRadius: RADIUS.sm,
    gap: 8,
  },
  downloadBtnText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
  },
  laterBtn: {
    paddingVertical: SPACING.xs + 2,
    alignItems: 'center',
  },
  laterBtnText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
  },
});

export default ContractModal;
