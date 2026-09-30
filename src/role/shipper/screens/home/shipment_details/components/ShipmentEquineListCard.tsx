import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { AppText } from '../../../../../../components';
import AppIcon from '../../../../../../components/app_icon/AppIcon';
import imageIndex from '../../../../../../assets/images/imageIndex';
import { COLORS } from '../../../../../../constants';
import { formatDate } from '../../../../../../utils/helpers';
import styles from '../styles.shippershipmentdetails';

interface ShipmentEquineListCardProps {
  horsesList: any[];
  expandedHorseIndices: number[];
  toggleHorseExpanded: (index: number) => void;
}

export const ShipmentEquineListCard: React.FC<ShipmentEquineListCardProps> = ({
  horsesList,
  expandedHorseIndices,
  toggleHorseExpanded,
}) => {
  return (
    <>
      {horsesList.map((horse: any, index: number) => {
        const isExpanded = expandedHorseIndices.includes(index);
        const hPhoto =
          typeof horse?.photo === 'string'
            ? horse.photo
            : horse?.photo?.url || null;
        const registeredName = horse?.registeredName || 'Not Available';
        const barnName = horse?.barnName || 'Not Available';
        const breed = horse?.breed || 'Not Available';
        const sex = horse?.sex || 'Not Available';
        const colour = horse?.colour || horse?.color || 'Not Available';
        const age =
          horse?.age !== undefined && horse?.age !== null
            ? `${horse?.age}`
            : 'Not Available';
        const stallSize =
          horse?.requestedStallSize || horse?.stallSize || 'Not Available';
        const notesText =
          horse?.notes ||
          horse?.generalInfo ||
          horse?.notesLog?.[0]?.note ||
          'Not Available';
        const noteDate = horse?.notesLog?.[0]?.createdAt || new Date();

        return (
          <View key={horse?._id || index} style={styles.horseDetailsCard}>
            <TouchableOpacity
              style={styles.accordionHeader}
              onPress={() => toggleHorseExpanded(index)}
              activeOpacity={0.8}
            >
              <View style={styles.accordionTitleRow}>
                <AppIcon name="Box" size={18} color={COLORS.brandBrown} />
                <AppText style={styles.cardHeaderTitle}>
                  Horse Details {index + 1}/{horsesList?.length}
                </AppText>
              </View>

              {isExpanded ? (
                <AppIcon
                  name="ChevronUp"
                  size={20}
                  color={COLORS.textSecondary}
                />
              ) : (
                <AppIcon
                  name="ChevronDown"
                  size={20}
                  color={COLORS.textSecondary}
                />
              )}
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.accordionContent}>
                {/* Horse Thumbnail Row */}
                <View style={styles.horseProfileRow}>
                  {hPhoto ? (
                    <Image source={{ uri: hPhoto }} style={styles.horseThumb} />
                  ) : (
                    <Image
                      source={imageIndex?.Banner}
                      style={styles.horseThumb}
                    />
                  )}

                  <View style={styles.horseProfileInfo}>
                    <AppText style={styles.horseNameText}>
                      {registeredName} - {barnName}
                    </AppText>
                    <AppText style={styles.horseBreedText}>
                      Breed: {breed} | Sex: {sex}
                    </AppText>

                    <View style={styles.horsePillsRow}>
                      <View style={styles.horseMiniPill}>
                        <AppText style={styles.horseMiniPillText}>
                          STALL: {stallSize}
                        </AppText>
                      </View>
                      <View style={styles.horseMiniPill}>
                        <AppText style={styles.horseMiniPillText}>
                          AGE: {age}{' '}
                          {typeof age === 'number' || !isNaN(Number(age))
                            ? 'YRS'
                            : ''}
                        </AppText>
                      </View>
                    </View>
                  </View>
                </View>

                {/* 2x2 Horse Specs Grid */}
                <View style={styles.horseSpecsGrid}>
                  <View style={styles.horseSpecBox}>
                    <AppText style={styles.horseSpecLabel}>BREED</AppText>
                    <AppText style={styles.horseSpecValue}>{breed}</AppText>
                  </View>

                  <View style={styles.horseSpecBox}>
                    <AppText style={styles.horseSpecLabel}>COLOR</AppText>
                    <AppText style={styles.horseSpecValue}>{colour}</AppText>
                  </View>

                  <View style={styles.horseSpecBox}>
                    <AppText style={styles.horseSpecLabel}>SEX</AppText>
                    <AppText style={styles.horseSpecValue}>{sex}</AppText>
                  </View>

                  <View style={styles.horseSpecBox}>
                    <AppText style={styles.horseSpecLabel}>AGE</AppText>
                    <AppText style={styles.horseSpecValue}>
                      {age}{' '}
                      {typeof age === 'number' || !isNaN(Number(age))
                        ? 'Yrs'
                        : ''}
                    </AppText>
                  </View>

                  <View style={[styles.horseSpecBox, { width: '100%' }]}>
                    <AppText style={styles.horseSpecLabel}>
                      REGISTERED NAME
                    </AppText>
                    <AppText style={styles.horseSpecValue}>
                      {registeredName}
                    </AppText>
                  </View>
                </View>

                {/* Chronological Notes */}
                <View style={styles.notesBox}>
                  <View style={styles.notesHeaderRow}>
                    <AppText style={styles.notesTitle}>
                      Chronological Notes
                    </AppText>
                    <AppText style={styles.notesDateText}>
                      {formatDate(noteDate, 'MMM D, YYYY, h:mm A')}
                    </AppText>
                  </View>
                  <AppText style={styles.notesBodyText}>"{notesText}"</AppText>
                </View>
              </View>
            )}
          </View>
        );
      })}
    </>
  );
};
