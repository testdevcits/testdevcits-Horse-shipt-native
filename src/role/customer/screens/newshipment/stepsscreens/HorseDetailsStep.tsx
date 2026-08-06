import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Pressable,
} from 'react-native';
import { PlusCircle } from 'lucide-react-native';
import { useRoute } from '@react-navigation/native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../../../../constants';
import { AppText, Input, AppSelect } from '../../../../../components';
import useMyHorses from '../../myhorses/usemyhorses';
import { Horse } from '../../../../../types/customer';
import { breedsList, sexes, stallTypes } from '../../addedithorse/constants';
import { NewShipmentForm, NewShipmentHorse } from '../interfaces';
import { useNavigation } from '@react-navigation/native';
import styles from './HorseDetailsStepstyles';

interface HorseDetailsStepProps {
  form: NewShipmentForm;
  updateForm: (updates: Partial<NewShipmentForm>) => void;
  onNext: () => void;
  onPrevious: () => void;
  errors: any;
}

const HorseDetailsStep: React.FC<HorseDetailsStepProps> = ({
  form,
  updateForm,
  onNext,
  onPrevious,
}) => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const isEdit = route.params?.isEdit;
  const { horses: savedHorses, loading } = useMyHorses();

  console.log("===savedHorses======", savedHorses)

  const handleNumberOfHorsesChange = (val: string) => {
    if (isEdit) return;
    const num = Math.max(1, parseInt(val) || 1);
    if (num > 10) {
      Alert.alert('Limit Exceeded', 'Maximum 10 horses per shipment.');
      return;
    }
    updateForm({ numberOfHorses: num });
  };

  const updateHorseField = (
    index: number,
    field: keyof NewShipmentHorse,
    value: any,
  ) => {
    const updatedHorses = [...form.horses];
    updatedHorses[index] = { ...updatedHorses[index], [field]: value };
    updateForm({ horses: updatedHorses });
  };

  const horseOptions = useMemo(() => {
    return savedHorses.map((h: Horse) => h.registeredName);
  }, [savedHorses]);

  const handleHorseSelect = (index: number, selectedName: string) => {
    const selectedHorse = savedHorses.find(
      (h: Horse) => h.registeredName === selectedName,
    );

    if (selectedHorse) {
      const updatedHorses = [...form.horses];

      // Extract photo from saved horse
      let photoObj: any = updatedHorses[index]?.photo || null;
      if (selectedHorse.photo?.url || selectedHorse.photo?.uri) {
        const photoUri = selectedHorse.photo.url || selectedHorse.photo.uri;
        photoObj = {
          uri: photoUri,
          type: selectedHorse.photo.type || 'image/jpeg',
          name: selectedHorse.photo.name || 'photo.jpg',
        };
      } else if (typeof selectedHorse.photo === 'string') {
        photoObj = {
          uri: selectedHorse.photo,
          type: 'image/jpeg',
          name: 'photo.jpg',
        };
      }

      // Extract coggins document from saved horse
      let cogginsObj: any = updatedHorses[index]?.coggins || null;
      const cogginsData =
        selectedHorse.documents?.coggins || (selectedHorse as any).coggins;
      if (cogginsData?.url || cogginsData?.uri) {
        const cogginsUri = cogginsData.url || cogginsData.uri;
        cogginsObj = {
          uri: cogginsUri,
          type: cogginsData.type || 'application/pdf',
          name: cogginsData.originalName || cogginsData.name || 'coggins.pdf',
        };
      }

      // Extract health certificate document from saved horse
      let healthCertObj: any = updatedHorses[index]?.healthCert || null;
      const healthData =
        selectedHorse.documents?.healthCertificate ||
        (selectedHorse.documents as any)?.healthCert ||
        (selectedHorse as any).healthCert ||
        (selectedHorse as any).healthCertificate;
      if (healthData?.url || healthData?.uri) {
        const healthUri = healthData.url || healthData.uri;
        healthCertObj = {
          uri: healthUri,
          type: healthData.type || 'application/pdf',
          name: healthData.originalName || healthData.name || 'health.pdf',
        };
      }

      // Extract other documents from saved horse
      let otherDocsObj: any = updatedHorses[index]?.otherDocuments || null;
      const otherData =
        (selectedHorse.documents as any)?.otherDocuments ||
        (selectedHorse.documents as any)?.other ||
        (selectedHorse as any).otherDocuments;
      if (otherData?.url || otherData?.uri) {
        const otherUri = otherData.url || otherData.uri;
        otherDocsObj = {
          uri: otherUri,
          type: otherData.type || 'application/pdf',
          name: otherData.originalName || otherData.name || 'other_document.pdf',
        };
      }

      updatedHorses[index] = {
        ...updatedHorses[index],
        registeredName: selectedHorse.registeredName,
        barnName: selectedHorse.barnName || '',
        breed: selectedHorse.breed || '',
        colour: selectedHorse.colour || '',
        age: selectedHorse.age?.toString() || '',
        sex: selectedHorse.sex || '',
        requestedStallSize:
          selectedHorse.defaultStallSize ||
          (selectedHorse as any).requestedStallSize ||
          'Box',
        generalInfo: selectedHorse.notes || '',
        photo: photoObj,
        coggins: cogginsObj,
        healthCert: healthCertObj,
        otherDocuments: otherDocsObj,
      };
      updateForm({ horses: updatedHorses });
    } else {
      updateHorseField(index, 'registeredName', selectedName);
    }
  };

  const isFormValid = useMemo(() => {
    if (!form.numberOfHorses || form.numberOfHorses < 1) return false;
    return form.horses.every(
      (h: NewShipmentHorse) =>
        h.registeredName?.trim() !== '' &&
        h.breed?.trim() !== '' &&
        h.sex?.trim() !== '' &&
        h.requestedStallSize?.trim() !== '',
    );
  }, [form.horses, form.numberOfHorses]);

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

        {!loading && savedHorses.length === 0 && (
          <Pressable
            onPress={() => navigation.navigate('AddEditHorse')}
            style={styles.noHorsesAlert}
          >
            <PlusCircle size={20} color={COLORS.primary} />
            <AppText style={styles.noHorsesText}>
              You don't have any saved horses. Tap here to add one, or enter details manually below.
            </AppText>
          </Pressable>
        )}

        <Input
          label="Total Number of Horses"
          placeholder="e.g. 1"
          keyboardType="numeric"
          value={form.numberOfHorses?.toString()}
          onChangeText={handleNumberOfHorsesChange}
          disabled={isEdit}
          editable={!isEdit}
        />

        {form.horses.map((horse: NewShipmentHorse, index: number) => (
          <View key={index} style={styles.horseSection}>
            <View style={styles.dividerRow}>
              <View style={styles.line} />
              <AppText style={styles.sectionLabel}>HORSE {index + 1}</AppText>
              <View style={styles.line} />
            </View>

            <AppSelect
              label="Registered Name"
              placeholder={
                loading ? 'Loading...' : 'Select saved horse or type'
              }
              value={horse.registeredName}
              options={horseOptions}
              onSelect={val => handleHorseSelect(index, val)}
              searchable
            />

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Input
                  label="Barn Name"
                  placeholder="e.g. Thunder"
                  value={horse.barnName}
                  onChangeText={v => updateHorseField(index, 'barnName', v)}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <AppSelect
                  label="Sex"
                  placeholder="Select"
                  value={horse.sex}
                  options={sexes}
                  onSelect={v => updateHorseField(index, 'sex', v)}
                />
              </View>
            </View>

            <AppSelect
              label="Breed"
              placeholder="Select breed"
              value={horse.breed}
              options={breedsList}
              onSelect={v => updateHorseField(index, 'breed', v)}
              searchable
            />

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Input
                  label="Age"
                  placeholder="Age"
                  keyboardType="numeric"
                  value={horse.age}
                  onChangeText={v => updateHorseField(index, 'age', v)}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Input
                  label="Colour"
                  placeholder="e.g. Bay"
                  value={horse.colour}
                  onChangeText={v => updateHorseField(index, 'colour', v)}
                />
              </View>
            </View>

            <AppSelect
              label="Request Stall Size"
              placeholder="Select Stall"
              value={horse.requestedStallSize || 'Box'}
              options={stallTypes}
              onSelect={v => updateHorseField(index, 'requestedStallSize', v)}
            />
          </View>
        ))}

        {form.horses.length > 0 && (
          <>
            <AppText style={styles.radioLabel}>
              Does this shipment have special requirements?
            </AppText>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => updateForm({ hasSpecialRequirement: true })}
              >
                <View
                  style={[
                    styles.radioOuter,
                    form.hasSpecialRequirement && styles.radioOuterActive,
                  ]}
                >
                  {form.hasSpecialRequirement && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <AppText style={styles.radioText}>Yes</AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => updateForm({ hasSpecialRequirement: false })}
              >
                <View
                  style={[
                    styles.radioOuter,
                    !form.hasSpecialRequirement && styles.radioOuterActive,
                  ]}
                >
                  {!form.hasSpecialRequirement && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <AppText style={styles.radioText}>No</AppText>
              </TouchableOpacity>
            </View>

            {form.hasSpecialRequirement && (
              <Input
                label="Details"
                placeholder="Describe medication, behavior, etc."
                multiline
                value={form.specialRequirementDetails}
                onChangeText={v => updateForm({ specialRequirementDetails: v })}
                style={{ height: 80 }}
              />
            )}
          </>
        )}

        {/* FOOTER */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.prevButton} onPress={onPrevious}>
            <AppText style={styles.prevButtonText}>Previous</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.nextButton, !isFormValid && styles.disabledButton]}
            onPress={() =>
              isFormValid
                ? onNext()
                : Alert.alert(
                  'Missing Info',
                  'Please fill in registered name, breed, sex, and stall size for all horses.',
                )
            }
          >
            <AppText style={styles.nextButtonText}>Next</AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};



export default HorseDetailsStep;
