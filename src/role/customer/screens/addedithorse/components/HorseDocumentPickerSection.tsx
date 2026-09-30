import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { AppText } from '../../../../../components';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../constants';
import styles from '../styles.AddEditHorses';

interface HorseDocumentPickerSectionProps {
  coggins: any;
  healthCertificate: any;
  isPicking: boolean;
  onPickDocument: (field: 'coggins' | 'healthCertificate') => void;
  onRemoveDocument: (field: 'coggins' | 'healthCertificate') => void;
}

const HorseDocumentPickerSection: React.FC<HorseDocumentPickerSectionProps> = ({
  coggins,
  healthCertificate,
  isPicking,
  onPickDocument,
  onRemoveDocument,
}) => {
  return (
    <View style={styles.sectionCard}>
      <AppText style={styles.sectionTitle}>Documents (PDF only)</AppText>

      {/* Coggins Row */}
      <View style={styles.docRow}>
        <View style={styles.docLeft}>
          <AppIcon name={'Paperclip'} size={18} color={COLORS.primary} />
          <View style={styles.docTextWrap}>
            <AppText style={styles.docLabel}>Coggins Test</AppText>
            <AppText style={styles.docSubtext} numberOfLines={1}>
              {coggins?.name || coggins?.originalName || 'No document selected'}
            </AppText>
          </View>
        </View>
        {coggins ? (
          <TouchableOpacity
            disabled={isPicking}
            style={styles.docDeleteBtn}
            onPress={() => onRemoveDocument('coggins')}
          >
            <AppIcon name={'Trash2'} size={16} color={COLORS.error} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            disabled={isPicking}
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
        <View style={styles.docLeft}>
          <AppIcon name={'Paperclip'} size={18} color={COLORS.primary} />
          <View style={styles.docTextWrap}>
            <AppText style={styles.docLabel}>Health Certificate</AppText>
            <AppText style={styles.docSubtext} numberOfLines={1}>
              {healthCertificate?.name ||
                healthCertificate?.originalName ||
                'No document selected'}
            </AppText>
          </View>
        </View>
        {healthCertificate ? (
          <TouchableOpacity
            disabled={isPicking}
            style={styles.docDeleteBtn}
            onPress={() => onRemoveDocument('healthCertificate')}
          >
            <AppIcon name={'Trash2'} size={16} color={COLORS.error} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            disabled={isPicking}
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
