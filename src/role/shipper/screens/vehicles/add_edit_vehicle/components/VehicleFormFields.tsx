import React from 'react';
import { View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { AppText, Input } from '../../../../../../components';
import AppIcon from '../../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../../constants';
import { isValidVIN } from '../../../../../../utils/valiations';
import styles from '../styles.addvehicle';

interface VehicleFormFieldsProps {
  transportType: string;
  setTransportType: (v: string) => void;
  vehicleType: string;
  vehicleNumber: string;
  setVehicleNumber: (v: string) => void;
  vinNumber: string;
  setVinNumber: (v: string) => void;
  numberOfStalls: string;
  setNumberOfStalls: (v: string) => void;
  stallType: string;
  stallSize: string;
  notes: string;
  setNotes: (v: string) => void;
  selectedImage: any;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  isPicking: boolean;
  handlePickImage: () => void;
  setActivePicker: (
    picker: 'vehicleType' | 'stallType' | 'stallSize' | null,
  ) => void;
}

export const VehicleFormFields: React.FC<VehicleFormFieldsProps> = React.memo(
  ({
    transportType,
    setTransportType,
    vehicleType,
    vehicleNumber,
    setVehicleNumber,
    vinNumber,
    setVinNumber,
    numberOfStalls,
    setNumberOfStalls,
    stallType,
    stallSize,
    notes,
    setNotes,
    selectedImage,
    errors,
    setErrors,
    isPicking,
    handlePickImage,
    setActivePicker,
  }) => {
    return (
      <>
        {/* Vehicle Details Card Header */}
        <View style={styles.vehicleDetailsHeader}>
          <View style={styles.steeringIconBox}>
            <AppIcon name={'Compass'} size={22} color={COLORS.saddleBrown} />
          </View>
          <View style={styles.headerTextCol}>
            <AppText style={styles.vehicleDetailsTitle}>
              Vehicle details
            </AppText>
            <AppText style={styles.vehicleDetailsSub}>
              Tell us about your vehicle(s) so we can match you with the right
              shipments.
            </AppText>
          </View>
        </View>

        {/* Form Fields */}
        <Input
          label="Transport Type *"
          placeholder="Trucking"
          value={transportType}
          onChangeText={setTransportType}
        />

        <View style={{ marginBottom: 12 }}>
          <AppText style={styles.label}>
            Vehicle Type <AppText style={styles.required}>*</AppText>
          </AppText>
          <TouchableOpacity
            style={[
              styles.dropdownInput,
              !!errors.vehicleType && { borderColor: COLORS.error },
            ]}
            onPress={() => setActivePicker('vehicleType')}
          >
            <AppText
              style={
                vehicleType
                  ? styles.dropdownTextSelected
                  : styles.dropdownTextPlaceholder
              }
            >
              {vehicleType || 'Select vehicle type'}
            </AppText>
            <AppIcon
              name={'ChevronDown'}
              size={18}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
          {!!errors.vehicleType && (
            <AppText style={styles.errorText}>{errors.vehicleType}</AppText>
          )}
        </View>

        <Input
          label="Vehicle Number *"
          placeholder="Enter Vehicle Number"
          value={vehicleNumber}
          error={errors.vehicleNumber}
          onChangeText={(text: string) => {
            setVehicleNumber(text);
            if (errors.vehicleNumber) {
              setErrors(prev => ({ ...prev, vehicleNumber: '' }));
            }
          }}
        />

        <Input
          label="VIN Number (Optional)"
          placeholder="Enter VIN Number"
          value={vinNumber}
          onChangeText={(text: string) => {
            setVinNumber(text);
            if (errors.vinNumber) {
              setErrors(prev => ({ ...prev, vinNumber: '' }));
            }
          }}
          onBlur={() => {
            if (vinNumber.trim() && !isValidVIN(vinNumber)) {
              setErrors(prev => ({
                ...prev,
                vinNumber: 'Please enter a valid 17-character VIN.',
              }));
            } else if (errors.vinNumber) {
              setErrors(prev => ({ ...prev, vinNumber: '' }));
            }
          }}
          error={errors.vinNumber}
        />

        <Input
          label="Number of stalls *"
          placeholder="Enter Number of stalls"
          keyboardType="numeric"
          value={numberOfStalls}
          error={errors.numberOfStalls}
          onChangeText={(text: string) => {
            setNumberOfStalls(text);
            if (errors.numberOfStalls) {
              setErrors(prev => ({ ...prev, numberOfStalls: '' }));
            }
          }}
          maxLength={2}
        />

        <View style={{ marginBottom: 12 }}>
          <AppText style={styles.label}>
            Stall Type <AppText style={styles.required}>*</AppText>
          </AppText>
          <TouchableOpacity
            style={[
              styles.dropdownInput,
              !!errors.stallType && { borderColor: COLORS.error },
            ]}
            onPress={() => setActivePicker('stallType')}
          >
            <AppText
              style={
                stallType
                  ? styles.dropdownTextSelected
                  : styles.dropdownTextPlaceholder
              }
            >
              {stallType || 'Select Stall Type'}
            </AppText>
            <AppIcon
              name={'ChevronDown'}
              size={18}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
          {!!errors.stallType && (
            <AppText style={styles.errorText}>{errors.stallType}</AppText>
          )}
        </View>

        <View style={{ marginBottom: 12 }}>
          <AppText style={styles.label}>
            Stall Size <AppText style={styles.required}>*</AppText>
          </AppText>
          <TouchableOpacity
            style={[
              styles.dropdownInput,
              !!errors.stallSize && { borderColor: COLORS.error },
            ]}
            onPress={() => setActivePicker('stallSize')}
          >
            <AppText
              style={
                stallSize
                  ? styles.dropdownTextSelected
                  : styles.dropdownTextPlaceholder
              }
            >
              {stallSize || 'Select Stall Size'}
            </AppText>
            <AppIcon
              name={'ChevronDown'}
              size={18}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
          {!!errors.stallSize && (
            <AppText style={styles.errorText}>{errors.stallSize}</AppText>
          )}
        </View>

        {/* Vehicle Image Upload Section */}
        <View style={{ marginBottom: 12 }}>
          <AppText style={styles.label}>
            Upload Vehicle Images <AppText style={styles.required}>*</AppText>
          </AppText>
          <TouchableOpacity
            style={[
              styles.uploadDashedCard,
              !!errors.selectedImage && { borderColor: COLORS.error },
              isPicking && { opacity: 0.7 },
            ]}
            onPress={handlePickImage}
            activeOpacity={0.8}
            disabled={isPicking}
          >
            {isPicking ? (
              <View style={styles.uploadPlaceholder}>
                <ActivityIndicator size="small" color={COLORS.primary} />
              </View>
            ) : selectedImage ? (
              <Image
                source={{ uri: selectedImage.uri }}
                style={styles.previewImage}
              />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <AppIcon
                  name={'ImagePlus'}
                  size={36}
                  color={COLORS.textSecondary}
                />
              </View>
            )}
          </TouchableOpacity>
          {!!errors.selectedImage && (
            <AppText style={styles.errorText}>{errors.selectedImage}</AppText>
          )}
        </View>

        <Input
          label="Notes (General Info)"
          placeholder="Enter Notes about vehicle specs, condition, etc..."
          multiline
          inputContainerStyle={{ height: 100 }}
          numberOfLines={4}
          value={notes}
          style={styles.textArea}
          onChangeText={setNotes}
        />
      </>
    );
  },
);
