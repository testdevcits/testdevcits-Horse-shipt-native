import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { PlusCircle } from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../../../../constants';
import { AppText, Input, AppSelect } from '../../../../../components';
import useMyHorses from '../../myhorses/usemyhorses';
import { Horse } from '../../../../../types/customer';
import { breedsList, sexes, stallTypes } from '../../addedithorse/constants';
import { NewShipmentForm, NewShipmentHorse } from '../interfaces';

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
  const { horses: savedHorses, loading } = useMyHorses();

  const handleNumberOfHorsesChange = (val: string) => {
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
      updatedHorses[index] = {
        ...updatedHorses[index],
        registeredName: selectedHorse.registeredName,
        barnName: selectedHorse.barnName || '',
        breed: selectedHorse.breed || '',
        colour: selectedHorse.colour || '',
        age: selectedHorse.age?.toString() || '',
        sex: selectedHorse.sex || '',
        requestedStallSize:
          selectedHorse.defaultStallSize || selectedHorse.requestedStallSize || 'Box',
        generalInfo: selectedHorse.notes || '',
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
          <View style={styles.noHorsesAlert}>
            <PlusCircle size={20} color={COLORS.primary} />
            <AppText style={styles.noHorsesText}>
              You don't have any saved horses. Enter details manually below.
            </AppText>
          </View>
        )}

        <Input
          label="Total Number of Horses"
          placeholder="e.g. 1"
          keyboardType="numeric"
          value={form.numberOfHorses?.toString()}
          onChangeText={handleNumberOfHorsesChange}
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
              value={horse.requestedStallSize}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollView: { flex: 1 },
  scrollContent: { padding: SPACING.lg, paddingBottom: 60 },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  mainTitle: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  cancelText: { color: COLORS.primary, fontFamily: FONTS.medium },
  noHorsesAlert: {
    flexDirection: 'row',
    backgroundColor: COLORS.goldLightBg,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: 10,
  },
  noHorsesText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.primary,
    fontFamily: FONTS.medium,
  },
  horseSection: {
    marginBottom: SPACING.xl,
    backgroundColor: '#FBFAf8',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  line: { flex: 1, height: 1, backgroundColor: COLORS.grey300 },
  sectionLabel: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.grey500,
    marginHorizontal: 10,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  radioLabel: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
    color: COLORS.grey700,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  radioGroup: { flexDirection: 'row', gap: 30, marginBottom: SPACING.md },
  radioButton: { flexDirection: 'row', alignItems: 'center' },
  radioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.grey300,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioOuterActive: { borderColor: COLORS.primary },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  radioText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontFamily: FONTS.medium,
  },
  footer: {
    flexDirection: 'row',
    paddingVertical: SPACING.lg,
    gap: SPACING.md,
    marginTop: SPACING.xl,
  },
  prevButton: {
    flex: 1,
    height: 52,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prevButtonText: { fontFamily: FONTS.bold, color: COLORS.grey600 },
  nextButton: {
    flex: 1,
    height: 52,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: { backgroundColor: COLORS.grey300 },
  nextButtonText: { fontFamily: FONTS.bold, color: COLORS.white },
});

export default HorseDetailsStep;
