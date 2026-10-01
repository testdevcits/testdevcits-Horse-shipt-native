import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { AppText } from '../../../../../components';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../constants';
import styles from '../styles.AddEditHorses';

interface Props {
  photo: any;
  isPicking: boolean;
  onPickPhoto: () => void;
  onRemovePhoto: () => void;
}

export const HorsePhotoPickerSection: React.FC<Props> = React.memo(
  ({ photo, isPicking, onPickPhoto, onRemovePhoto }) => {
    return (
      <View style={styles.sectionCard}>
        <AppText style={styles.sectionTitle}>Horse Photo</AppText>
        <View style={styles.photoContainer}>
          {photo?.uri || photo?.url ? (
            <View style={styles.photoPreviewBox}>
              <Image
                source={{
                  uri: photo?.uri || photo?.url,
                }}
                style={styles.photoPreviewImage}
              />
              <TouchableOpacity
                style={styles.removePhotoBadge}
                onPress={onRemovePhoto}
                activeOpacity={0.7}
              >
                <AppIcon name={'Trash2'} size={14} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.uploadBox}
              onPress={onPickPhoto}
              activeOpacity={0.7}
              disabled={isPicking}
            >
              <AppIcon name={'Camera'} size={26} color={COLORS.primary} />
              <AppText style={styles.uploadBoxText}>Upload Photo</AppText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  },
);
