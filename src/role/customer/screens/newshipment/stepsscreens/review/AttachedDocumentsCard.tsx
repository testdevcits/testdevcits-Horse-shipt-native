import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { COLORS } from '../../../../../../constants';
import { AppText } from '../../../../../../components';
import AppIcon from '../../../../../../components/app_icon/AppIcon';
import { NewShipmentHorse } from '../../interfaces';
import styles from './ReviewStepstyles';

interface AttachedDocumentsCardProps {
  horses: NewShipmentHorse[];
  isDocsExpanded: boolean;
  setIsDocsExpanded: (expanded: boolean) => void;
  onEditSection: (stepIndex: number) => void;
  getDocName: (doc: any, fallback: string) => string | null;
}

const AttachedDocumentsCard: React.FC<AttachedDocumentsCardProps> = ({
  horses,
  isDocsExpanded,
  setIsDocsExpanded,
  onEditSection,
  getDocName,
}) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardHeaderToggle}
        onPress={() => setIsDocsExpanded(!isDocsExpanded)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeaderLeft}>
          <View style={styles.iconCircle}>
            <AppIcon name={'Paperclip'} size={16} color={COLORS.primary} />
          </View>
          <AppText style={styles.cardTitle}>ATTACHED DOCUMENTS</AppText>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity
            style={styles.miniEditBtn}
            onPress={() => onEditSection(3)}
            activeOpacity={0.8}
          >
            <AppIcon name={'Upload'} size={13} color={COLORS.primary} />
            <AppText style={styles.miniEditText}>Upload / Edit</AppText>
          </TouchableOpacity>
          {isDocsExpanded ? (
            <AppIcon name={'ChevronUp'} size={18} color={COLORS.grey600} />
          ) : (
            <AppIcon name={'ChevronDown'} size={18} color={COLORS.grey600} />
          )}
        </View>
      </TouchableOpacity>

      {isDocsExpanded && (
        <View style={styles.accordionContent}>
          <AppText style={styles.docsSectionSub}>
            Verify health documents and paperwork attached for transit.
          </AppText>

          {horses.map((horse: NewShipmentHorse, index: number) => {
            const cogginsName = getDocName(horse?.coggins, 'Coggins_Test.pdf');
            const healthCertName = getDocName(
              horse?.healthCert,
              'Health_Certificate.pdf',
            );

            return (
              <View key={index} style={styles.horseDocsCard}>
                <View style={styles.horseDocHeader}>
                  <AppText style={styles.horseDocHeaderText}>
                    {horse?.registeredName || `Horse ${index + 1}`} Documents
                  </AppText>
                </View>

                {/* COGGINS TEST ROW */}
                <View style={styles.docRow}>
                  <View
                    style={[
                      styles.docIconBox,
                      horse?.coggins
                        ? styles.docIconBoxSuccess
                        : styles.docIconBoxMuted,
                    ]}
                  >
                    {horse?.coggins ? (
                      <AppIcon
                        name={'FileCheck'}
                        size={18}
                        color={COLORS.greenSuccess}
                      />
                    ) : (
                      <AppIcon
                        name={'FileText'}
                        size={18}
                        color={COLORS.grey400}
                      />
                    )}
                  </View>

                  <View style={styles.docTextGroup}>
                    <AppText style={styles.docTitleText}>Coggins Test</AppText>
                    <AppText style={styles.docFileName} numberOfLines={1}>
                      {cogginsName || 'Not uploaded yet'}
                    </AppText>
                  </View>

                  {horse?.coggins ? (
                    <View style={styles.uploadedBadge}>
                      <AppIcon
                        name={'CheckCircle2'}
                        size={12}
                        color={COLORS.greenSuccess}
                      />
                      <AppText style={styles.uploadedBadgeText}>
                        Attached
                      </AppText>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.uploadQuickBtn}
                      onPress={() => onEditSection(3)}
                    >
                      <AppText style={styles.uploadQuickText}>+ Upload</AppText>
                    </TouchableOpacity>
                  )}
                </View>

                {/* HEALTH CERTIFICATE ROW */}
                <View style={styles.docRow}>
                  <View
                    style={[
                      styles.docIconBox,
                      horse?.healthCert
                        ? styles.docIconBoxSuccess
                        : styles.docIconBoxMuted,
                    ]}
                  >
                    {horse?.healthCert ? (
                      <AppIcon
                        name={'FileCheck'}
                        size={18}
                        color={COLORS.greenSuccess}
                      />
                    ) : (
                      <AppIcon
                        name={'FileText'}
                        size={18}
                        color={COLORS.grey400}
                      />
                    )}
                  </View>

                  <View style={styles.docTextGroup}>
                    <AppText style={styles.docTitleText}>
                      Health Certificate
                    </AppText>
                    <AppText style={styles.docFileName} numberOfLines={1}>
                      {healthCertName || 'Not uploaded yet'}
                    </AppText>
                  </View>

                  {horse?.healthCert ? (
                    <View style={styles.uploadedBadge}>
                      <AppIcon
                        name={'CheckCircle2'}
                        size={12}
                        color={COLORS.greenSuccess}
                      />
                      <AppText style={styles.uploadedBadgeText}>
                        Attached
                      </AppText>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.uploadQuickBtn}
                      onPress={() => onEditSection(3)}
                    >
                      <AppText style={styles.uploadQuickText}>+ Upload</AppText>
                    </TouchableOpacity>
                  )}
                </View>

                {/* OTHER DOCUMENTS ROW */}
                <View style={styles.docRow}>
                  <View
                    style={[
                      styles.docIconBox,
                      horse?.otherDocuments
                        ? styles.docIconBoxSuccess
                        : styles.docIconBoxMuted,
                    ]}
                  >
                    {horse?.otherDocuments ? (
                      <AppIcon
                        name={'FileCheck'}
                        size={18}
                        color={COLORS.greenSuccess}
                      />
                    ) : (
                      <AppIcon
                        name={'FileText'}
                        size={18}
                        color={COLORS.grey400}
                      />
                    )}
                  </View>

                  <View style={styles.docTextGroup}>
                    <AppText style={styles.docTitleText}>
                      Other Documents
                    </AppText>
                    <AppText style={styles.docFileName} numberOfLines={1}>
                      {getDocName(
                        horse?.otherDocuments,
                        'Other_Document.pdf',
                      ) || 'Not uploaded yet'}
                    </AppText>
                  </View>

                  {horse?.otherDocuments ? (
                    <View style={styles.uploadedBadge}>
                      <AppIcon
                        name={'CheckCircle2'}
                        size={12}
                        color={COLORS.greenSuccess}
                      />
                      <AppText style={styles.uploadedBadgeText}>
                        Attached
                      </AppText>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.uploadQuickBtn}
                      onPress={() => onEditSection(3)}
                    >
                      <AppText style={styles.uploadQuickText}>+ Upload</AppText>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default memo(AttachedDocumentsCard);
