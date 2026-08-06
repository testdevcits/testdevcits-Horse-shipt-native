import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {
  ImagePlus,
  FileText,
  Package,
  X,
  Trash2,
  FileCheck,
  Info,
} from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../../../../constants';
import { AppText, Input } from '../../../../../components';
import { NewShipmentForm, NewShipmentHorse } from '../interfaces';
import styles from './ShipmentInfoStepstyles';

interface ShipmentInfoStepProps {
  form: NewShipmentForm;
  updateForm: (updates: Partial<NewShipmentForm>) => void;
  onNext: () => void;
  onPrevious: () => void;
  pickDocument: (index: number, type: 'coggins' | 'healthCert' | 'otherDocuments') => void;
  pickImage: (index: number) => void;
  removeFile: (
    index: number,
    type: 'photo' | 'coggins' | 'healthCert' | 'otherDocuments',
  ) => void;
  errors?: any;
}

const ShipmentInfoStep: React.FC<ShipmentInfoStepProps> = ({
  form,
  updateForm,
  onNext,
  onPrevious,
  pickDocument,
  pickImage,
  removeFile,
  errors = {},
}) => {
  const renderDocumentRow = (
    horseIndex: number,
    type: 'coggins' | 'healthCert' | 'otherDocuments',
    label: string,
  ) => {
    const file = form.horses[horseIndex]?.[type];

    return (
      <View style={styles.docCard}>
        <View style={styles.docInfo}>
          <View style={[styles.docIconBox, file && styles.docIconBoxSuccess]}>
            {file ? (
              <FileCheck size={20} color={COLORS.greenActive} />
            ) : (
              <FileText size={20} color={COLORS.grey400} />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <AppText style={styles.docLabel}>{label}</AppText>
            {file ? (
              <AppText style={styles.fileName} numberOfLines={1}>
                {file.name}
              </AppText>
            ) : (
              <AppText style={styles.fileStatus}>No file selected</AppText>
            )}
          </View>
        </View>

        {file ? (
          <TouchableOpacity
            onPress={() => removeFile(horseIndex, type)}
            style={styles.removeBtn}
          >
            <Trash2 size={18} color={COLORS.error} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.miniUploadBtn}
            onPress={() => pickDocument(horseIndex, type)}
          >
            <AppText style={styles.miniUploadText}>Upload</AppText>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.titleRow}>
          <AppText style={styles.mainTitle}>New Shipment</AppText>
          <TouchableOpacity onPress={onPrevious}>
            <AppText style={styles.cancelText}>Back</AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.instructionCard}>
          <View style={styles.iconBox}>
            <Package size={24} color={COLORS.primary} />
          </View>
          <View style={styles.instructionTextContent}>
            <AppText style={styles.instructionTitle}>Documentation</AppText>
            <AppText style={styles.instructionSub}>
              Upload photos and health papers for each horse in this shipment.
            </AppText>
          </View>
        </View>

        {/* HORSES DOCUMENTATION */}
        {form.horses.map((horse: NewShipmentHorse, index: number) => (
          <View key={index} style={styles.horseCard}>
            <View style={styles.horseHeader}>
              <AppText style={styles.horseHeaderText}>
                HORSE {index + 1}: {horse.registeredName || 'Unnamed Horse'}
              </AppText>
            </View>

            <View style={styles.cardPadding}>
              {/* PHOTO UPLOAD */}
              <View style={styles.sectionHeaderRow}>
                <AppText style={styles.sectionLabel}>
                  Horse Photo <AppText style={styles.requiredStar}>*</AppText>
                </AppText>
                <AppText style={styles.requiredStar}>*Required</AppText>
              </View>
              <TouchableOpacity
                style={[
                  styles.uploadBox,
                  horse?.photo && styles.uploadBoxActive,
                  (errors?.[`horses[${index}].photo`] || errors?.[`horses.${index}.photo`]) &&
                    styles.uploadBoxError,
                ]}
                onPress={() => pickImage(index)}
              >
                {horse?.photo ? (
                  <View style={styles.imagePreviewContainer}>
                    <Image
                      source={{ uri: horse?.photo?.uri }}
                      style={styles.uploadedImage}
                    />
                    <TouchableOpacity
                      style={styles.closeImageBtn}
                      onPress={() => removeFile(index, 'photo')}
                    >
                      <X size={16} color={COLORS.white} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <ImagePlus size={32} color={COLORS.primary} />
                    <AppText style={styles.uploadBtnText}>Add Photo *</AppText>
                  </View>
                )}
              </TouchableOpacity>
              {(errors?.[`horses[${index}].photo`] || errors?.[`horses.${index}.photo`]) && (
                <View style={styles.errorContainer}>
                  <Info size={14} color={COLORS.error} />
                  <AppText style={styles.errorText}>
                    {errors[`horses[${index}].photo`] || errors[`horses.${index}.photo`]}
                  </AppText>
                </View>
              )}

              {/* DOCUMENTS */}
              <AppText style={[styles.sectionLabel, { marginTop: SPACING.md }]}>
                Required Documents
              </AppText>
              {renderDocumentRow(index, 'coggins', 'Coggins Test')}
              {renderDocumentRow(index, 'healthCert', 'Health Certificate')}
              {renderDocumentRow(index, 'otherDocuments', 'Other Documents')}
            </View>
          </View>
        ))}

        {/* GENERAL NOTES */}
        <View style={styles.notesSection}>
          <AppText style={styles.sectionLabel}>
            Additional Shipment Notes
          </AppText>
          <Input
            placeholder="Example: My horse needs hay every 4 hours..."
            multiline
            numberOfLines={4}
            value={form.additionalInfo}
            onChangeText={v => updateForm({ additionalInfo: v })}
            style={styles.textArea}
            textAlignVertical="top"
          />
        </View>

        {/* SHARE TRACKING (OPTIONAL) */}
        <View style={styles.shareTrackingCard}>
          <AppText style={styles.shareTrackingTitle}>
            Share Tracking (Optional)
          </AppText>
          <Input
            label="Recipient Email Address"
            placeholder="abc@gmail.com"
            value={form.recipientEmail}
            onChangeText={v => updateForm({ recipientEmail: v })}
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={{ marginTop: SPACING.xs }}
          />
          <AppText style={styles.shareTrackingSubtext}>
            If provided, the recipient will receive tracking information via email once the shipment is published.
          </AppText>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.prevButton} onPress={onPrevious}>
            <AppText style={styles.prevButtonText}>Previous</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={onNext}>
            <AppText style={styles.nextButtonText}>Next</AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};



export default ShipmentInfoStep;
