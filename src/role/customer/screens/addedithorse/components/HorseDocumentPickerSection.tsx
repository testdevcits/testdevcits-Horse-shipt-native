import React, { memo } from 'react';
import { View, TouchableOpacity, Linking } from 'react-native';
import { AppText } from '../../../../../components';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../constants';
import { showErrorToast } from '../../../../../utils/toast';
import styles from '../styles.AddEditHorses';

interface HorseDocumentPickerSectionProps {
  coggins: any;
  healthCertificate: any;
  isPicking: boolean;
  isEdit?: boolean;
  onPickDocument: (field: 'coggins' | 'healthCertificate') => void;
  onRemoveDocument: (field: 'coggins' | 'healthCertificate') => void;
  onViewDocument?: (doc: any) => void;
}

const isDocumentPresent = (doc: any): boolean => {
  if (!doc) return false;
  if (typeof doc === 'string') return doc.trim().length > 0;
  if (typeof doc === 'object') {
    return !!(
      doc.uri ||
      doc.url ||
      doc.name ||
      (doc.originalName && typeof doc.originalName === 'string')
    );
  }
  return false;
};

const getDocUrl = (doc: any): string | null => {
  if (!doc) return null;
  if (typeof doc === 'string' && doc.trim().length > 0) return doc;
  if (typeof doc === 'object') {
    return doc.url || doc.uri || null;
  }
  return null;
};

const getDocDisplayName = (doc: any): string => {
  if (!isDocumentPresent(doc)) return 'No document selected';
  if (typeof doc === 'string') {
    const filename = doc.split('/').pop();
    return filename || 'Document uploaded';
  }
  if (doc.name) return doc.name;
  if (doc.originalName) return doc.originalName;
  if (doc.filename) return doc.filename;
  if (doc.uri) {
    const filename = doc.uri.split('/').pop();
    return filename || 'Document selected';
  }
  if (doc.url) {
    const filename = doc.url.split('/').pop();
    return filename || 'Document uploaded';
  }
  return 'Document attached';
};

const isLocalDraft = (doc: any): boolean => {
  return typeof doc === 'object' && !!doc?.uri;
};

const HorseDocumentPickerSection: React.FC<HorseDocumentPickerSectionProps> = ({
  coggins,
  healthCertificate,
  isPicking,
  isEdit = false,
  onPickDocument,
  onRemoveDocument,
  onViewDocument,
}) => {
  const hasCoggins = isDocumentPresent(coggins);
  const hasHealthCert = isDocumentPresent(healthCertificate);

  const handleViewDoc = (doc: any) => {
    if (onViewDocument) {
      onViewDocument(doc);
      return;
    }
    const url = getDocUrl(doc);
    if (url) {
      Linking.openURL(url).catch(err => {
        console.log('Error opening document:', err);
        showErrorToast('Error', 'Unable to open document');
      });
    } else {
      showErrorToast('Error', 'Document file URL not found');
    }
  };

  return (
    <View style={styles.sectionCard}>
      <AppText style={styles.sectionTitle}>Documents (PDF only)</AppText>

      {/* Coggins Row */}
      <View style={styles.docRow}>
        <TouchableOpacity
          disabled={!hasCoggins}
          activeOpacity={hasCoggins ? 0.7 : 1}
          style={styles.docLeft}
          onPress={() => hasCoggins && handleViewDoc(coggins)}
        >
          <AppIcon
            name={hasCoggins ? 'FileCheck' : 'Paperclip'}
            size={18}
            color={hasCoggins ? COLORS.emeraldPrimary : COLORS.primary}
          />
          <View style={styles.docTextWrap}>
            <AppText style={styles.docLabel}>Coggins Test</AppText>
            <AppText
              style={[
                styles.docSubtext,
                hasCoggins && { color: COLORS.textPrimary },
              ]}
              numberOfLines={1}
            >
              {getDocDisplayName(coggins)}
            </AppText>
          </View>
        </TouchableOpacity>
        {hasCoggins ? (
          <View style={styles.docActions}>
            <TouchableOpacity
              disabled={isPicking}
              activeOpacity={0.7}
              style={styles.docActionBtn}
              onPress={() => handleViewDoc(coggins)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <AppIcon name={'Eye'} size={18} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              disabled={isPicking}
              activeOpacity={0.7}
              style={styles.docChangeBtn}
              onPress={() => onPickDocument('coggins')}
            >
              <AppIcon name={'Upload'} size={12} color={COLORS.primary} />
              <AppText style={styles.docChangeBtnText}>Change</AppText>
            </TouchableOpacity>
            {(!isEdit || isLocalDraft(coggins)) && (
              <TouchableOpacity
                disabled={isPicking}
                activeOpacity={0.7}
                style={styles.docActionBtn}
                onPress={() => onRemoveDocument('coggins')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <AppIcon name={'Trash2'} size={17} color={COLORS.error} />
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <TouchableOpacity
            disabled={isPicking}
            activeOpacity={0.7}
            style={styles.docUploadBtn}
            onPress={() => onPickDocument('coggins')}
          >
            <AppIcon name={'Upload'} size={14} color={COLORS.primary} />
            <AppText style={styles.docUploadBtnText}>Upload</AppText>
          </TouchableOpacity>
        )}
      </View>

      {/* Health Certificate Row */}
      <View style={[styles.docRow, { borderBottomWidth: 0 }]}>
        <TouchableOpacity
          disabled={!hasHealthCert}
          activeOpacity={hasHealthCert ? 0.7 : 1}
          style={styles.docLeft}
          onPress={() => hasHealthCert && handleViewDoc(healthCertificate)}
        >
          <AppIcon
            name={hasHealthCert ? 'FileCheck' : 'Paperclip'}
            size={18}
            color={hasHealthCert ? COLORS.emeraldPrimary : COLORS.primary}
          />
          <View style={styles.docTextWrap}>
            <AppText style={styles.docLabel}>Health Certificate</AppText>
            <AppText
              style={[
                styles.docSubtext,
                hasHealthCert && { color: COLORS.textPrimary },
              ]}
              numberOfLines={1}
            >
              {getDocDisplayName(healthCertificate)}
            </AppText>
          </View>
        </TouchableOpacity>
        {hasHealthCert ? (
          <View style={styles.docActions}>
            <TouchableOpacity
              disabled={isPicking}
              activeOpacity={0.7}
              style={styles.docActionBtn}
              onPress={() => handleViewDoc(healthCertificate)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <AppIcon name={'Eye'} size={18} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              disabled={isPicking}
              activeOpacity={0.7}
              style={styles.docChangeBtn}
              onPress={() => onPickDocument('healthCertificate')}
            >
              <AppIcon name={'Upload'} size={12} color={COLORS.primary} />
              <AppText style={styles.docChangeBtnText}>Change</AppText>
            </TouchableOpacity>
            {(!isEdit || isLocalDraft(healthCertificate)) && (
              <TouchableOpacity
                disabled={isPicking}
                activeOpacity={0.7}
                style={styles.docActionBtn}
                onPress={() => onRemoveDocument('healthCertificate')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <AppIcon name={'Trash2'} size={17} color={COLORS.error} />
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <TouchableOpacity
            disabled={isPicking}
            activeOpacity={0.7}
            style={styles.docUploadBtn}
            onPress={() => onPickDocument('healthCertificate')}
          >
            <AppIcon name={'Upload'} size={14} color={COLORS.primary} />
            <AppText style={styles.docUploadBtnText}>Upload</AppText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default memo(HorseDocumentPickerSection);
