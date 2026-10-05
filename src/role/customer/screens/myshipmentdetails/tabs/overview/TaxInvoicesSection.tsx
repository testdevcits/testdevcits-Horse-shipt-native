import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { AppText } from '../../../../../../components';
import AppIcon from '../../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../../constants';
import { formatDate } from '../../../../../../utils/helpers';
import { showSuccessToast } from '../../../../../../utils/toast';
import styles from './styles.OverViewTab';

interface TaxInvoiceItem {
  key: string;
  title: string;
  invoiceNumber: string;
  url: string | null;
  generatedAt?: string;
  type: string;
}

interface TaxInvoicesSectionProps {
  taxInvoices?: any;
  onOpenUrl: (url: string | null) => void;
}

const parseTaxInvoices = (taxInvoicesData: any): TaxInvoiceItem[] => {
  if (!taxInvoicesData) return [];

  // Case 1: Array of invoices
  if (Array.isArray(taxInvoicesData)) {
    return taxInvoicesData
      .filter((item) => item && (item?.url || item?.invoiceNumber))
      .map((item, idx) => ({
        key: item?.type || item?.id || `invoice-${idx}`,
        title:
          item?.title ||
          (item?.type
            ? `${item?.type.charAt(0).toUpperCase() + item?.type.slice(1)} Tax Invoice`
            : `Tax Invoice #${idx + 1}`),
        invoiceNumber: item?.invoiceNumber || item?.invoice_number || 'N/A',
        url: item?.url || item?.pdfUrl || null,
        generatedAt: item?.generatedAt || item?.createdAt,
        type: item?.type || 'invoice',
      }));
  }

  // Case 2: Object with sub-keys (e.g., { customer: {...}, shipper: {...} })
  if (typeof taxInvoicesData === 'object') {
    // Single item object with direct properties
    if (taxInvoicesData.url) {
      return [
        {
          key: 'tax-invoice',
          title: 'Tax Invoice',
          invoiceNumber: taxInvoicesData.invoiceNumber || 'N/A',
          url: taxInvoicesData.url,
          generatedAt: taxInvoicesData.generatedAt,
          type: 'invoice',
        },
      ];
    }

    const list: TaxInvoiceItem[] = [];
    Object.keys(taxInvoicesData).forEach((key) => {
      const item = taxInvoicesData[key];
      if (item && typeof item === 'object' && (item?.url || item?.invoiceNumber)) {
        let title = 'Tax Invoice';
        const keyLower = key?.toLowerCase();
        if (keyLower === 'customer') title = 'Customer Tax Invoice';
        else if (keyLower === 'shipper') title = 'Shipper Tax Invoice';
        else title = `${key?.charAt(0).toUpperCase() + key?.slice(1)} Tax Invoice`;

        list.push({
          key,
          title,
          invoiceNumber: item?.invoiceNumber || item?.invoice_number || 'N/A',
          url: item?.url || null,
          generatedAt: item?.generatedAt || item?.createdAt,
          type: key,
        });
      }
    });
    return list;
  }

  return [];
};

const TaxInvoicesSection: React.FC<TaxInvoicesSectionProps> = ({
  taxInvoices,
  onOpenUrl,
}) => {
  const invoicesList = parseTaxInvoices(taxInvoices);

  if (!invoicesList || invoicesList.length === 0) return null;

  const handleCopyNumber = (invoiceNumber: string) => {
    if (!invoiceNumber || invoiceNumber === 'N/A') return;
    Clipboard.setString(invoiceNumber);
    showSuccessToast('Copied', 'Invoice number copied to clipboard.');
  };

  return (
    <View style={styles.taxInvoicesContainer}>
      <View style={styles.taxInvoicesHeader}>
        <View style={styles.taxInvoicesTitleRow}>
          <AppIcon name={'FileCheck'} size={16} color={COLORS.goldDarkText} />
          <AppText style={styles.taxInvoicesHeaderTitle}>
            TAX INVOICES ({invoicesList.length})
          </AppText>
        </View>
        <View style={styles.taxInvoiceVerifiedBadge}>
          <AppText style={styles.taxInvoiceVerifiedBadgeText}>
            OFFICIAL PDF
          </AppText>
        </View>
      </View>

      <View style={styles.taxInvoicesBody}>
        {invoicesList.map((inv) => (
          <View key={inv.key} style={styles.taxInvoiceCard}>
            <View style={styles.taxInvoiceCardHeader}>
              <View style={styles.taxInvoiceCardTitleRow}>
                <AppIcon
                  name={'FileText'}
                  size={18}
                  color={COLORS.primary}
                />
                <AppText style={styles.taxInvoiceTitle}>{inv.title}</AppText>
              </View>
              <View style={styles.taxInvoiceRoleBadge}>
                <AppText style={styles.taxInvoiceRoleBadgeText}>
                  {inv.type.toUpperCase()}
                </AppText>
              </View>
            </View>

            <View style={styles.taxInvoiceDetailsBox}>
              <View style={styles.taxInvoiceMetaRow}>
                <AppText style={styles.taxInvoiceMetaLabel}>
                  Invoice No:
                </AppText>
                <TouchableOpacity
                  style={styles.taxInvoiceMetaValueRow}
                  onPress={() => handleCopyNumber(inv.invoiceNumber)}
                  activeOpacity={0.7}
                >
                  <AppText style={styles.taxInvoiceMetaValue}>
                    {inv.invoiceNumber}
                  </AppText>
                  {inv.invoiceNumber !== 'N/A' && (
                    <AppIcon
                      name={'Copy'}
                      size={12}
                      color={COLORS.textSecondary}
                    />
                  )}
                </TouchableOpacity>
              </View>

              {inv.generatedAt && (
                <View style={styles.taxInvoiceMetaRow}>
                  <AppText style={styles.taxInvoiceMetaLabel}>
                    Generated Date:
                  </AppText>
                  <AppText style={styles.taxInvoiceMetaValue}>
                    {formatDate(inv.generatedAt, 'MMM DD, YYYY, h:mm A')}
                  </AppText>
                </View>
              )}
            </View>

            {inv.url ? (
              <TouchableOpacity
                style={styles.taxInvoiceViewBtn}
                onPress={() => onOpenUrl(inv.url)}
                activeOpacity={0.8}
              >
                <AppIcon name={'Download'} size={14} color={COLORS.white} />
                <AppText style={styles.taxInvoiceViewBtnText}>
                  View / Download Tax Invoice
                </AppText>
                <AppIcon name={'ExternalLink'} size={12} color={COLORS.white} />
              </TouchableOpacity>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
};

export default memo(TaxInvoicesSection);
