import React, { useState } from 'react';
import {
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
} from 'react-native';
import { COLORS, ICON_SIZE, SCREEN_WIDTH } from '../../../../../constants';
import { useShippers } from './useShippers';
import {
  AppHeader,
  AppText,
  EmptyState,
  SearchBarCompt,
  ShipperCard,
  ShippersListSkeleton,
} from '../../../../../components';

import { useNavigation } from '@react-navigation/native';
import AppIcon from '../../../../../components/AppIcon';
import styles from './styles.Topshippers';
import AppButton from '../../../../../components/common/Button/AppButton';

const QUICK_FILTERS = ['All', 'Verified', 'Top Rated', 'Nearest'];

const TopShippersScreen = () => {
  const navigation = useNavigation<any>();
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const {
    shippers,
    loading,
    refreshing,
    searchQuery,
    setSearchQuery,
    activeFilters,
    updateFilter,
    resetFilters,
    toggleWishlist,
    refresh,
  } = useShippers();

  const handleShipperPress = (item: any) => {
    navigation.navigate('ShipperDetail', { item });
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <AppHeader showBack={true} title="Top Shippers" />
        <ShippersListSkeleton />
      </View>
    );
  }

  // --- Sub-Components ---

  const FilterSection = ({ title, options, category }: any) => {
    const currentVal = activeFilters[category as keyof typeof activeFilters];
    const isFiltered = currentVal !== 'All' && currentVal !== 'Any Price';

    return (
      <View style={styles.modalSection}>
        <View style={styles.sectionHeaderRow}>
          <AppText style={styles.modalSectionTitle}>{title}</AppText>
          {isFiltered && <View style={styles.activeDot} />}
        </View>
        <View style={styles.chipGrid}>
          {options.map((opt: string) => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.modalChip,
                currentVal === opt && styles.activeModalChip,
              ]}
              onPress={() => updateFilter(category, opt)}
              activeOpacity={0.7}
            >
              <AppText
                style={[
                  styles.modalChipText,
                  currentVal === opt && styles.activeModalChipText,
                ]}
              >
                {opt}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderHeader = () => {
    const filtersActive = Object.values(activeFilters).some(
      v => v !== 'All' && v !== 'Any Price',
    );

    return (
      <View style={styles.headerContainer}>
        <View style={styles.titleRow}>
          <View>
            <AppText style={styles.title}>Top Shippers</AppText>
            <AppText style={styles.subtitle}>
              Verified professionals for your horses
            </AppText>
          </View>
          <TouchableOpacity
            style={[
              styles.filterCircle,
              filtersActive && styles.filterCircleActive,
            ]}
            onPress={() => setIsFilterVisible(true)}
          >
            <AppIcon
              name={'SlidersHorizontal'}
              size={20}
              color={filtersActive ? COLORS.white : COLORS.primary}
            />
          </TouchableOpacity>
        </View>

        <SearchBarCompt
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search name or location..."
          containerStyle={styles.searchBar}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {QUICK_FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              onPress={() => updateFilter('quick', f)}
              style={[
                styles.filterChip,
                activeFilters.quick === f && styles.activeChip,
              ]}
            >
              <AppText
                style={[
                  styles.chipText,
                  activeFilters.quick === f && styles.activeChipText,
                ]}
              >
                {f}
              </AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader showBack={true} title="Top Shippers" />
      <FlatList
        data={shippers}
        keyExtractor={(item, index) =>
          item?._id || item?.id || index.toString()
        }
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <ShipperCard
            item={item}
            onPress={() => handleShipperPress(item)}
            onFavoritePress={toggleWishlist}
            customstyle={{ width: SCREEN_WIDTH - 20 }}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon={
              <AppIcon
                name={'FileText'}
                size={ICON_SIZE.xl}
                color={COLORS.lightGrey}
                strokeWidth={1.5}
              />
            }
            title="No Shippers Found"
            message="Try adjusting your filters or search query."
          />
        }
      />

      {/* Premium Filter Modal */}
      <Modal
        visible={isFilterVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsFilterVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setIsFilterVisible(false)}
                style={styles.closeIcon}
              >
                <AppIcon name="X" color={COLORS.textPrimary} size={24} />
              </TouchableOpacity>
              <AppText style={styles.modalTitle}>Filters</AppText>
              <TouchableOpacity onPress={resetFilters} hitSlop={10}>
                <AppText style={styles.resetText}>Reset</AppText>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
            >
              <FilterSection
                title="Price Range"
                category="price"
                options={['Any Price', 'Budget', 'Standard', 'Premium']}
              />
              <FilterSection
                title="Minimum Rating"
                category="rating"
                options={['All', '2+', '3+', '4+']}
              />
              <FilterSection
                title="Transport Type"
                category="transport"
                options={['All', 'Trucking', 'Hauling', 'Local']}
              />
              <FilterSection
                title="Experience Level"
                category="experience"
                options={['All', 'Expert', 'Professional', 'Experienced']}
              />
              <FilterSection
                title="Response Time"
                category="response"
                options={['All', 'Very Fast', 'Fast', 'Standard']}
              />
              <View style={{ height: 120 }} />
            </ScrollView>

            <View style={styles.modalFooter}>
              <AppButton
                title={`Show ${shippers.length} Shippers`}
                onPress={() => setIsFilterVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TopShippersScreen;
