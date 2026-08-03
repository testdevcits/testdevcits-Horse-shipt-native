import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
  Platform,
} from 'react-native';
import { SlidersHorizontal, Award, X, Check } from 'lucide-react-native';
import {
  COLORS,
  SPACING,
  FONTS,
  RADIUS,
  SCREEN_WIDTH,
} from '../../../../constants';
import { useShippers } from './useShippers';
import {
  AppHeader,
  AppLoader,
  AppText,
  EmptyState,
  SearchBarCompt,
  ShipperCard,
} from '../../../../components';
import { useNavigation } from '@react-navigation/native';

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
    refresh,
  } = useShippers();

  console.log('==============================', shippers);

  const handleShipperPress = (item: any) => {
    navigation.navigate('ShipperDetail', { item });
  };

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
            <SlidersHorizontal
              size={20}
              color={filtersActive ? COLORS.white : COLORS.goldPrimary}
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
        keyExtractor={(item, index) => item?._id ?? index.toString()} // ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <ShipperCard
            item={item}
            onPress={() => handleShipperPress(item)}
            customstyle={{ width: SCREEN_WIDTH - 20 }}
          />
        )}
        contentContainerStyle={styles.list}
        stickyHeaderIndices={[0]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={COLORS.goldPrimary}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon={Award}
              title="No Shippers Found"
              message="Try adjusting your filters or search query."
            />
          ) : (
            <AppLoader visible={true} />
          )
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
                <X color={COLORS.textPrimary} size={24} />
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
              <TouchableOpacity
                style={styles.applyBtn}
                onPress={() => setIsFilterVisible(false)}
              >
                <AppText style={styles.applyBtnText}>
                  Show {shippers.length} Shippers
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerContainer: {
    backgroundColor: COLORS.background,
    paddingBottom: SPACING.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  title: { fontSize: 26, fontFamily: FONTS.bold, color: COLORS.textPrimary },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  filterCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  filterCircleActive: {
    backgroundColor: COLORS.goldPrimary,
    borderColor: COLORS.goldPrimary,
  },
  searchBar: { marginHorizontal: SPACING.lg, marginBottom: SPACING.md },
  filterScroll: {
    paddingHorizontal: SPACING.lg,
    gap: 10,
    paddingBottom: SPACING.sm,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  activeChip: {
    backgroundColor: COLORS.goldPrimary,
    borderColor: COLORS.goldPrimary,
  },
  chipText: { fontSize: 13, fontFamily: FONTS.bold, color: COLORS.grey600 },
  activeChipText: { color: COLORS.white },
  list: { paddingBottom: 100 },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    height: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  closeIcon: { padding: 4 },
  modalTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  resetText: {
    color: COLORS.goldPrimary,
    fontFamily: FONTS.bold,
    fontSize: 14,
  },
  modalScroll: { padding: SPACING.lg },
  modalSection: { marginBottom: SPACING.xl },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalSectionTitle: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.goldPrimary,
    marginLeft: 8,
  },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  modalChip: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
    backgroundColor: COLORS.white,
    minWidth: '22%',
    alignItems: 'center',
  },
  activeModalChip: {
    backgroundColor: COLORS.goldPrimary,
    borderColor: COLORS.goldPrimary,
  },
  modalChipText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  activeModalChipText: { color: COLORS.white, fontFamily: FONTS.bold },
  modalFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    backgroundColor: COLORS.white,
    paddingBottom: Platform.OS === 'ios' ? 34 : SPACING.lg,
  },
  applyBtn: {
    backgroundColor: COLORS.goldPrimary,
    height: 56,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: COLORS.goldPrimary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  applyBtnText: { color: COLORS.white, fontFamily: FONTS.bold, fontSize: 16 },
});

export default TopShippersScreen;
