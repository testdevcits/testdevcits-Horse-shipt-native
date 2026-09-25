import React, { memo, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { AppText, Button, ImageViewer } from '../../../../../components';

import { COLORS } from '../../../../../constants';
import { horsePlaceholderImage } from '../../../../../config/constants';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import styles from './HorseInformation.Styles';

const HorseInformation = ({
  activeShipment,
  setIsMapModalVisible,
}: {
  activeShipment?: any;
  setIsMapModalVisible?: any;
}) => {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [selectedImage, setSelectedImage] = useState<{
    uri: string;
    title: string;
  } | null>(null);

  const handleImageError = (idx: number) => {
    setImageErrors(prev => ({ ...prev, [idx]: true }));
  };

  const horses = activeShipment?.shipment?.horses || [];

  return (
    <View style={styles.card}>
      {/* Sleek Main Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIconContainer}>
            <AppIcon name={'Award'} size={18} color={COLORS.primary} />
          </View>
          <View>
            <AppText style={styles.cardHeaderTitle}>
              Assigned Horses ({horses.length})
            </AppText>
            <AppText style={styles.cardHeaderSubtitle}>
              Verified Transport Manifest
            </AppText>
          </View>
        </View>
        <View style={styles.manifestBadge}>
          <AppText style={styles.manifestBadgeText}>MANIFEST</AppText>
        </View>
      </View>

      <View style={styles.cardBody}>
        {horses.map((horse: any, idx: number) => {
          const hasError = imageErrors[idx];
          const photoUrl =
            !hasError && horse?.photo?.url
              ? horse.photo.url
              : horsePlaceholderImage;
          const horseName =
            horse?.registeredName || horse?.barnName || `Horse #${idx + 1}`;

          return (
            <View key={idx} style={styles.horseCard}>
              {/* Image Section with Dark Backdrop & Tap to View Overlay */}
              <TouchableOpacity
                style={styles.imageContainer}
                activeOpacity={0.9}
                onPress={() =>
                  setSelectedImage({
                    uri: photoUrl,
                    title: horseName,
                  })
                }
              >
                <Image
                  resizeMode="contain"
                  source={{ uri: photoUrl }}
                  style={styles.horseImage}
                  onError={() => handleImageError(idx)}
                />

                {/* Bottom Overlay Gradient */}
                <View style={styles.imageBottomOverlay}>
                  {horse?.registeredName ? (
                    <View style={styles.horseNameBadge}>
                      <AppIcon name={'Award'} size={12} color={COLORS.white} />
                      <AppText
                        style={styles.horseNameBadgeText}
                        numberOfLines={1}
                      >
                        {horse.registeredName}
                      </AppText>
                    </View>
                  ) : null}

                  {/* Tap to View Zoom Pill */}
                  <View style={styles.zoomPill}>
                    <AppIcon
                      name={'Maximize2'}
                      size={12}
                      color={COLORS.white}
                    />
                    <AppText style={styles.zoomPillText}>Tap to View</AppText>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Horse Info Details Content */}
              <View style={styles.detailsContent}>
                {/* Registered & Barn Name Header */}
                <View style={styles.nameHeaderBlock}>
                  <AppText style={styles.registeredNameTitle} numberOfLines={1}>
                    {horse?.registeredName || 'Unregistered Horse'}
                  </AppText>
                  {horse?.barnName ? (
                    <AppText style={styles.barnNameSub} numberOfLines={1}>
                      Barn Name: "{horse.barnName}"
                    </AppText>
                  ) : null}
                </View>

                {/* Aesthetic 2x2 Specs Grid */}
                <View style={styles.specsGrid}>
                  <View style={styles.specBox}>
                    <View style={styles.specHeaderRow}>
                      <AppIcon
                        name={'FileText'}
                        size={12}
                        color={COLORS.primary}
                      />
                      <AppText style={styles.specLabel}>REG. NAME</AppText>
                    </View>
                    <AppText style={styles.specValue} numberOfLines={1}>
                      {horse?.registeredName || 'N/A'}
                    </AppText>
                  </View>

                  <View style={styles.specBox}>
                    <View style={styles.specHeaderRow}>
                      <AppIcon name={'Info'} size={12} color={COLORS.primary} />
                      <AppText style={styles.specLabel}>BARN NAME</AppText>
                    </View>
                    <AppText style={styles.specValue} numberOfLines={1}>
                      {horse?.barnName || 'N/A'}
                    </AppText>
                  </View>

                  <View style={styles.specBox}>
                    <View style={styles.specHeaderRow}>
                      <AppIcon
                        name={'ShieldCheck'}
                        size={12}
                        color={COLORS.primary}
                      />
                      <AppText style={styles.specLabel}>BREED</AppText>
                    </View>
                    <AppText style={styles.specValue} numberOfLines={1}>
                      {horse?.breed || 'N/A'}
                    </AppText>
                  </View>

                  <View style={styles.specBox}>
                    <View style={styles.specHeaderRow}>
                      <AppIcon
                        name={'UserCheck'}
                        size={12}
                        color={COLORS.primary}
                      />
                      <AppText style={styles.specLabel}>SEX / AGE</AppText>
                    </View>
                    <AppText style={styles.specValue} numberOfLines={1}>
                      {horse?.sex || 'N/A'}
                      {horse?.age ? ` • ${horse?.age} yrs` : ''}
                    </AppText>
                  </View>
                </View>
              </View>
            </View>
          );
        })}

        {/* Special Instructions & Shipment Notes */}
        {activeShipment?.notes ? (
          <View style={styles.notesBox}>
            <View style={styles.notesHeaderRow}>
              <AppIcon name={'FileText'} size={16} color={COLORS.primary} />
              <AppText style={styles.notesBoxLabel}>
                SPECIAL SHIPMENT INSTRUCTIONS
              </AppText>
            </View>
            <AppText style={styles.notesBoxText}>
              {activeShipment.notes}
            </AppText>
          </View>
        ) : null}

        {/* Route Map Trigger Button */}
        {setIsMapModalVisible && (
          <Button
            title="View Route on Map"
            onPress={() => setIsMapModalVisible(true)}
            buttonStyle={styles.mapBtn}
          />
        )}
      </View>

      {/* Fullscreen Image Viewer Modal */}
      <ImageViewer
        visible={!!selectedImage}
        image={selectedImage?.uri || ''}
        title={selectedImage?.title}
        onClose={() => setSelectedImage(null)}
      />
    </View>
  );
};

export default memo(HorseInformation);
