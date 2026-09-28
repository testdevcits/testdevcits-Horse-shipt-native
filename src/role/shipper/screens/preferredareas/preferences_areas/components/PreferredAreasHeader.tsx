import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { AppText } from '../../../../../../components';
import AppIcon from '../../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../../constants';
import styles from '../styles.preferredareas';

interface PreferredAreasHeaderProps {
  filledCount: number;
  maxAreas: number;
  progressPercent: number;
  onAddNewArea: () => void;
  onViewMap: () => void;
}

const PreferredAreasHeader: React.FC<PreferredAreasHeaderProps> = ({
  filledCount,
  maxAreas,
  progressPercent,
  onAddNewArea,
  onViewMap,
}) => {
  return (
    <View style={styles.heroCard}>
      {/* HERO HEADER TITLE ROW */}
      <View style={styles.heroHeaderRow}>
        <View style={styles.heroTitleLeft}>
          <View style={styles.heroIconBox}>
            <AppIcon name={'MapPin'} size={20} color={COLORS.primary} />
          </View>
          <AppText style={styles.heroTitle}>Preferred Areas</AppText>
        </View>
        <View style={styles.heroBadge}>
          <AppText style={styles.heroBadgeText}>
            {filledCount}/{maxAreas} Active
          </AppText>
        </View>
      </View>

      <AppText style={styles.heroSubText}>
        Set up to {maxAreas} operational zones to receive matched shipment notifications
        in your active coverage regions.
      </AppText>

      {/* STEP / SLOT CAPSULES */}
      <View style={styles.slotsRow}>
        {[1, 2, 3, 4].map(slotNum => {
          const isFilled = slotNum <= filledCount;
          return (
            <View
              key={slotNum}
              style={[styles.slotBadge, isFilled && styles.slotBadgeFilled]}
            >
              <AppIcon
                name={isFilled ? 'Check' : 'Plus'}
                size={12}
                color={isFilled ? COLORS.primary : COLORS.textSecondary}
              />
              <AppText
                style={[
                  styles.slotBadgeNum,
                  isFilled && styles.slotBadgeNumFilled,
                ]}
              >
                Slot {slotNum}
              </AppText>
            </View>
          );
        })}
      </View>

      {/* PROGRESS BAR ROW */}
      <View style={styles.progressRow}>
        <View style={styles.progressBarBg}>
          <View
            style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
          />
        </View>
        <View style={styles.progressTextRow}>
          <AppText style={styles.areaCountText}>
            {filledCount} of {maxAreas} areas configured
          </AppText>
          <AppText style={styles.progressPercentText}>
            {Math.round(progressPercent)}%
          </AppText>
        </View>
      </View>

      {/* TOP ACTION BUTTONS BAR */}
      <View style={styles.actionButtonsBar}>
        <TouchableOpacity
          style={styles.addAreaBtn}
          onPress={onAddNewArea}
          activeOpacity={0.8}
        >
          <AppIcon name={'Plus'} size={18} color={COLORS.white} />
          <AppText style={styles.addAreaBtnText}>Add New Area</AppText>
        </TouchableOpacity>
        {filledCount > 0 && (
          <TouchableOpacity
            style={styles.seeAllBtn}
            onPress={onViewMap}
            activeOpacity={0.8}
          >
            <AppIcon name={'Map'} size={16} color={COLORS.textPrimary} />
            <AppText style={styles.seeAllBtnText}>View Map</AppText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default memo(PreferredAreasHeader);
