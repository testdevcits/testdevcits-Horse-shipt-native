import React, { memo } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AppText } from '../../../../../../components';
import AppIcon from '../../../../../../components/app_icon/AppIcon';
import { COLORS, SPACING } from '../../../../../../constants';
import { formatDate } from '../../../../../../utils/helpers';
import styles from './styles.OverViewTab';

interface HorseDetailsListProps {
  horses?: any[];
  status?: string;
  loading?: boolean;
  onEditDocumentsNotes: () => void;
  onOpenUrl: (url: string | null) => void;
}

const HorseDetailsList: React.FC<HorseDetailsListProps> = ({
  horses,
  status,
  loading,
  onEditDocumentsNotes,
  onOpenUrl,
}) => {
  if (!horses || horses.length === 0) return null;

  return (
    <>
      {horses.map((horse: any, index: number) => (
        <View key={horse?._id || horse?.id || index} style={styles.horseCard}>
          <View style={styles.horseCardBadgeHeader}>
            <AppText style={styles.horseCardBadgeText}>
              HORSE {index + 1}
            </AppText>
          </View>

          <View style={styles.horseCardBody}>
            {/* Horse Profile Grid */}
            <View style={styles.horseSpecGrid}>
              <View style={styles.specItem}>
                <AppText style={styles.specLabel}>Registered Name</AppText>
                <AppText style={styles.specValue}>
                  {horse?.registeredName || 'N/A'}
                </AppText>
              </View>

              <View style={styles.specItem}>
                <AppText style={styles.specLabel}>Barn Name</AppText>
                <AppText style={styles.specValue}>
                  {horse?.barnName || 'N/A'}
                </AppText>
              </View>

              <View style={styles.specItem}>
                <AppText style={styles.specLabel}>Breed</AppText>
                <AppText style={styles.specValue}>
                  {horse?.breed || 'N/A'}
                </AppText>
              </View>

              <View style={styles.specItem}>
                <AppText style={styles.specLabel}>Colour</AppText>
                <AppText style={styles.specValue}>
                  {horse?.colour || 'N/A'}
                </AppText>
              </View>

              <View style={styles.specItem}>
                <AppText style={styles.specLabel}>Age</AppText>
                <AppText style={styles.specValue}>
                  {horse?.age || 'N/A'}
                </AppText>
              </View>

              <View style={styles.specItem}>
                <AppText style={styles.specLabel}>Sex</AppText>
                <AppText style={styles.specValue}>
                  {horse?.sex || 'N/A'}
                </AppText>
              </View>
            </View>

            {/* General Info Box */}
            <View style={styles.infoQuoteBox}>
              <AppText style={styles.infoQuoteTitle}>
                General Info / Care Notes
              </AppText>
              <AppText style={styles.infoQuoteText}>
                {horse?.generalInfo || horse?.notes || 'No notes provided.'}
              </AppText>
            </View>

            {/* Chronological Notes Log */}
            {horse?.notesLog && horse?.noteslog?.length > 0 && (
              <View style={styles.logSection}>
                <AppText style={styles.logSectionHeader}>
                  CHRONOLOGICAL NOTES
                </AppText>
                {horse?.noteslog?.map((log: any, lIdx: number) => (
                  <View key={lIdx} style={styles.logCardItem}>
                    <View style={styles.logCardItemHeader}>
                      <View style={styles.logUserRow}>
                        <AppIcon
                          name={'User'}
                          size={12}
                          color={COLORS.primary}
                        />
                        <AppText style={styles.logUserNameText}>
                          {log?.userName || 'User'} (
                          {log?.userRole || 'Customer'})
                        </AppText>
                      </View>
                      <View style={styles.logUserRow}>
                        <AppIcon
                          name={'Clock'}
                          size={11}
                          color={COLORS.textLight}
                        />
                        <AppText style={styles.logTimeText}>
                          {formatDate(log?.createdAt, 'MM/DD/YYYY, h:mm A')}
                        </AppText>
                      </View>
                    </View>
                    <AppText style={styles.logBodyText}>{log?.note}</AppText>
                  </View>
                ))}
              </View>
            )}

            {/* Uploaded Documents */}
            <View style={styles.documentsContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: SPACING.xs,
                }}
              >
                <AppText style={styles.documentsHeaderTitle}>
                  Uploaded Documents
                </AppText>
                {status !== 'delivered' && (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                    }}
                    disabled={loading}
                    onPress={onEditDocumentsNotes}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color={COLORS.primary} />
                    ) : (
                      <View style={styles.editDocsContainer}>
                        <AppIcon
                          name="Edit3"
                          size={14}
                          color={COLORS.primary}
                        />
                        <AppText style={styles.editDocsText}>
                          Edit Docs / Notes
                        </AppText>
                      </View>
                    )}
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.docListGrid}>
                {horse?.documents?.coggins?.url && (
                  <TouchableOpacity
                    style={styles.docCardPill}
                    onPress={() => onOpenUrl(horse?.documents?.coggins?.url)}
                    activeOpacity={0.8}
                  >
                    <AppIcon
                      name={'FileText'}
                      size={16}
                      color={COLORS.primary}
                    />
                    <View style={styles.docCardPillTextCol}>
                      <AppText style={styles.docTitle}>Coggins Test</AppText>
                      <AppText style={styles.docSub}>Tap to view</AppText>
                    </View>
                    <AppIcon
                      name={'ExternalLink'}
                      size={13}
                      color={COLORS.textSecondary}
                    />
                  </TouchableOpacity>
                )}

                {horse?.documents?.healthCertificate?.url && (
                  <TouchableOpacity
                    style={styles.docCardPill}
                    onPress={() =>
                      onOpenUrl(horse?.documents?.healthCertificate?.url)
                    }
                    activeOpacity={0.8}
                  >
                    <AppIcon
                      name={'FileText'}
                      size={16}
                      color={COLORS.primary}
                    />
                    <View style={styles.docCardPillTextCol}>
                      <AppText style={styles.docTitle}>
                        Health Certificate
                      </AppText>
                      <AppText style={styles.docSub}>Tap to view</AppText>
                    </View>
                    <AppIcon
                      name={'ExternalLink'}
                      size={13}
                      color={COLORS.textSecondary}
                    />
                  </TouchableOpacity>
                )}

                {horse?.documents?.other?.url && (
                  <TouchableOpacity
                    style={styles.docCardPill}
                    onPress={() => onOpenUrl(horse?.documents?.other?.url)}
                    activeOpacity={0.8}
                  >
                    <AppIcon
                      name={'FileText'}
                      size={16}
                      color={COLORS.primary}
                    />
                    <View style={styles.docCardPillTextCol}>
                      <AppText style={styles.docTitle}>Other Document</AppText>
                      <AppText style={styles.docSub}>Tap to view</AppText>
                    </View>
                    <AppIcon
                      name={'ExternalLink'}
                      size={13}
                      color={COLORS.textSecondary}
                    />
                  </TouchableOpacity>
                )}

                {!horse?.documents?.coggins?.url &&
                  !horse?.documents?.healthCertificate?.url &&
                  !horse?.documents?.other?.url && (
                    <AppText style={styles.emptyDocsText}>
                      No documents uploaded for this horse.
                    </AppText>
                  )}
              </View>
            </View>
          </View>
        </View>
      ))}
    </>
  );
};

export default memo(HorseDetailsList);
