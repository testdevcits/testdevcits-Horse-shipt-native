import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import { COLORS } from '../../../../../../constants';
import { AppText } from '../../../../../../components';
import { NewShipmentForm, NewShipmentHorse } from '../../interfaces';
import styles from './ReviewStepstyles';
import AppIcon from '../../../../../../components/app_icon/AppIcon';
import RouteOverviewCard from './RouteOverviewCard';
import HorseSummaryList from './HorseSummaryList';
import ShipmentSummaryCard from './ShipmentSummaryCard';
import AttachedDocumentsCard from './AttachedDocumentsCard';

interface ReviewStepProps {
  form: NewShipmentForm;
  onPublish: () => void;
  onSaveDraft: () => void;
  onEditSection: (stepIndex: number) => void;
  loading?: boolean;
  draftLoading?: boolean;
  publishLoading?: boolean;
  isEdit?: boolean;
  isDraft?: boolean;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  form,
  onPublish,
  onSaveDraft,
  onEditSection,
  loading = false,
  draftLoading = false,
  publishLoading = false,
  isEdit = false,
  isDraft = false,
}) => {
  const [isHorseExpanded, setIsHorseExpanded] = useState(true);
  const [isDocsExpanded, setIsDocsExpanded] = useState(true);

  const formatDateDisplay = (dateVal: any) => {
    if (!dateVal) return 'Not set';
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return 'Not set';
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDocName = (doc: any, fallback: string) => {
    if (!doc) return null;
    if (typeof doc === 'string') return doc.split('/').pop() || fallback;
    if (doc.name) return doc.name;
    if (doc.uri) return doc.uri.split('/').pop() || fallback;
    if (doc.url) return doc.url.split('/').pop() || fallback;
    return fallback;
  };

  const getDocUri = (doc: any) => {
    if (!doc) return null;
    if (typeof doc === 'string') return doc;
    return doc.uri || doc.url || null;
  };

  // Calculate total documents uploaded across all horses
  let uploadedDocCount = 0;
  let totalDocCount = (form.horses?.length || 1) * 2; // Coggins + HealthCert per horse

  form.horses?.forEach((h: NewShipmentHorse) => {
    if (h.coggins) uploadedDocCount++;
    if (h.healthCert) uploadedDocCount++;
  });

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* STEP HEADER CARD */}
        <View style={styles.headerCard}>
          <View style={styles.headerBadgeRow}>
            <View style={styles.stepChip}>
              <AppText style={styles.stepChipText}>STEP 5 OF 5</AppText>
            </View>
            <View style={styles.statusBadge}>
              <AppIcon
                name={'CheckCircle2'}
                size={13}
                color={COLORS.greenSuccess}
              />
              <AppText style={styles.statusBadgeText}>
                {isEdit && isDraft
                  ? 'Ready to Update Draft'
                  : isEdit
                  ? 'Ready to Update'
                  : 'Ready to Publish'}
              </AppText>
            </View>
          </View>
          <View style={styles.headerTitleRow}>
            <View style={styles.headerIconBox}>
              <AppIcon name={'ShieldCheck'} size={22} color={COLORS.primary} />
            </View>
            <View style={styles.headerTextGroup}>
              <AppText style={styles.headerTitle}>
                {isEdit && isDraft
                  ? 'Review & Update Draft'
                  : isEdit
                  ? 'Review & Update Shipment'
                  : 'Review & Confirm'}
              </AppText>
              <AppText style={styles.headerSubtitle}>
                {isEdit && isDraft
                  ? 'Review your updated details before saving draft changes or publishing.'
                  : isEdit
                  ? 'Verify your updated details and documents before saving.'
                  : 'Review your route, horse details, and attached documents before publishing.'}
              </AppText>
            </View>
          </View>
        </View>

        {/* SHIPMENT OVERVIEW BANNER */}
        <ShipmentSummaryCard
          numberOfHorses={form?.numberOfHorses}
          horsesCount={form.horses?.length || 0}
          uploadedDocCount={uploadedDocCount}
          totalDocCount={totalDocCount}
          additionalInfo={form.additionalInfo}
          hasSpecialRequirement={form.hasSpecialRequirement}
          specialRequirementDetails={form.specialRequirementDetails}
          recipientEmail={form.recipientEmail}
        />

        {/* SECTION 1: PICKUP & DELIVERY ROUTE CARD */}
        <RouteOverviewCard
          pickupLocation={form?.pickupLocation}
          pickupStartDate={form?.pickupStartDate}
          pickupEndDate={form?.pickupEndDate}
          deliveryLocation={form?.deliveryLocation}
          deliveryStartDate={form?.deliveryStartDate}
          deliveryEndDate={form?.deliveryEndDate}
          onEditSection={onEditSection}
          formatDateDisplay={formatDateDisplay}
        />

        {/* SECTION 2: HORSE DETAILS ACCORDION CARD */}
        <HorseSummaryList
          horses={form.horses}
          isHorseExpanded={isHorseExpanded}
          setIsHorseExpanded={setIsHorseExpanded}
          onEditSection={onEditSection}
          getDocUri={getDocUri}
        />

        {/* SECTION 3: UPLOADED DOCUMENTS & MEDIA CARD */}
        <AttachedDocumentsCard
          horses={form.horses}
          isDocsExpanded={isDocsExpanded}
          setIsDocsExpanded={setIsDocsExpanded}
          onEditSection={onEditSection}
          getDocName={getDocName}
        />

        {/* FOOTER ACTION BUTTONS */}
        <View style={styles.footer}>
          {(!isEdit || isDraft) && (
            <TouchableOpacity
              disabled={loading}
              style={styles.draftBtn}
              onPress={onSaveDraft}
              activeOpacity={0.85}
            >
              {draftLoading ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <>
                  <AppText style={styles.draftBtnText}>
                    {isEdit && isDraft ? 'Update Shipment' : 'Save Draft'}
                  </AppText>
                </>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity
            disabled={loading}
            style={[styles.publishBtn, isEdit && !isDraft && { flex: 1 }]}
            onPress={onPublish}
            activeOpacity={0.85}
          >
            {publishLoading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <>
                <AppText style={styles.publishBtnText}>
                  {isEdit && !isDraft
                    ? 'Update Shipment Details'
                    : 'Save & Publish'}
                </AppText>
                <AppIcon
                  name={'ArrowRight'}
                  size={18}
                  color={COLORS.white}
                  style={{ marginLeft: 6 }}
                />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ReviewStep;
