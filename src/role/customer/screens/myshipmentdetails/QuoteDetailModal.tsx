import React from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import {
  X,
  MessageCircle,
  FileText,
  Download,
  User,
} from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../../../constants';
import { AppText } from '../../../../components';

const QuoteDetailModal = ({ visible, quote, onClose }: any) => {
  if (!quote) return null;

  const DetailItem = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.gridItem}>
      <AppText style={styles.gridLabel}>{label}</AppText>
      <AppText style={styles.gridValue}>{value}</AppText>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <AppText style={styles.title}>Quote Details</AppText>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <AppText style={styles.dateSub}>
              Offer accepted in Dec 30, 2023
            </AppText>

            {/* Shipper Info */}
            <View style={styles.shipperCard}>
              <View style={styles.avatar}>
                <User size={20} color={COLORS.goldPrimary} />
              </View>
              <AppText style={styles.shipperName}>{quote.provider}</AppText>
              <TouchableOpacity style={styles.msgIcon}>
                <MessageCircle size={20} color={COLORS.goldPrimary} />
              </TouchableOpacity>
            </View>

            {/* Pricing */}
            <View style={styles.priceRow}>
              <AppText style={styles.priceLabel}>Agreed price</AppText>
              <AppText style={styles.priceValue}>
                ${quote.price.toLocaleString()}
              </AppText>
            </View>

            {/* Info Grid */}
            <View style={styles.grid}>
              <DetailItem label="Payment Due" value="On pickup" />
              <DetailItem label="Payment Method" value="Cash, Other" />
              <DetailItem label="Pickup Time" value="8:45 am" />
              <DetailItem label="Est. Arrival Time" value="11:30 am" />
              <DetailItem label="Transport Type" value="Trucking - SUV" />
              <DetailItem label="Stall Size" value="Single Stall" />
              <DetailItem label="Trailer Type" value="Stall Trailer" />
              <DetailItem label="Stalls Required" value="1" />
            </View>

            {/* Notes */}
            <AppText style={styles.sectionTitle}>Notes</AppText>
            <AppText style={styles.notesText}>
              Information left by the shipper about the offer or shipment
              process
            </AppText>

            {/* Terms */}
            <AppText style={styles.sectionTitle}>Terms and conditions</AppText>
            <TouchableOpacity style={styles.docBtn}>
              <FileText size={20} color={COLORS.textPrimary} />
              <AppText style={styles.docName}>Contract.pdf</AppText>
              <Download size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.lg,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: { fontSize: 18, fontFamily: FONTS.bold },
  dateSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  shipperCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.grey100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shipperName: { flex: 1, fontFamily: FONTS.medium, fontSize: 14 },
  msgIcon: { padding: 8 },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SPACING.lg,
  },
  priceLabel: { fontSize: 14, color: COLORS.textSecondary },
  priceValue: { fontSize: 18, fontFamily: FONTS.bold },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 20,
    marginBottom: SPACING.xl,
  },
  gridItem: { width: '50%' },
  gridLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    fontFamily: FONTS.medium,
    textTransform: 'uppercase',
  },
  gridValue: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontFamily: FONTS.bold,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    marginBottom: 8,
    marginTop: 10,
  },
  notesText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 20,
  },
  docBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.grey100,
    padding: 12,
    borderRadius: RADIUS.md,
  },
  docName: { flex: 1, fontSize: 13, fontFamily: FONTS.bold },
});

export default QuoteDetailModal;
