import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import {
  AppText,
  SearchBarCompt,
  SectionHeader,
} from '../../../../../components';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import { COLORS, SPACING } from '../../../../../constants';
import styles from '../styles.shipperhome';

interface HomeHeaderSectionProps {
  user: any;
  shipperStatus: any;
  subscriptionStatus: any;
  quotesCount: number;
  availableLoadsCount: number;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedFilter: string;
  setSelectedFilter: (val: string) => void;
  viewMode: 'list' | 'map';
  setViewMode: (val: 'list' | 'map') => void;
  onOpenCardModal: () => void;
  onOpenBankModal: () => void;
  onOpenSubModal: () => void;
  onNavigatePost: () => void;
  onSelectMapFirstShipment: () => void;
}

export const HomeHeaderSection: React.FC<HomeHeaderSectionProps> = ({
  user: _user,
  shipperStatus: _shipperStatus,
  subscriptionStatus: _subscriptionStatus,
  quotesCount,
  availableLoadsCount,
  searchQuery,
  setSearchQuery,
  selectedFilter,
  setSelectedFilter,
  viewMode,
  setViewMode,
  onOpenCardModal: _onOpenCardModal,
  onOpenBankModal: _onOpenBankModal,
  onOpenSubModal: _onOpenSubModal,
  onNavigatePost,
  onSelectMapFirstShipment,
}) => {
  // const userName = user?.name || 'Shipper';

  return (
    <View style={{ width: '100%' }}>
      {/* Welcome Greeting Header */}
      {/* <View style={styles.welcomeHeader}>
        <AppText style={styles.welcomeTitle}>Hello {userName},</AppText>
        <AppText style={styles.welcomeSub}>Good to see you again!</AppText>
      </View> */}

      {/* Stats Row Cards */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <View style={styles.statTextCol}>
            <AppText style={styles.statTitle}>Upcoming Shipments</AppText>
            <AppText style={styles.statCount}>{quotesCount}</AppText>
          </View>
          <View style={styles.statIconBox}>
            <AppIcon name="Truck" size={24} color={COLORS.saddleBrown} />
          </View>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statTextCol}>
            <AppText style={styles.statTitle}>Available Loads</AppText>
            <AppText style={styles.statCount}>{availableLoadsCount}</AppText>
          </View>
          <View style={styles.statIconBox}>
            <AppIcon name="FileText" size={24} color={COLORS.saddleBrown} />
          </View>
        </View>
      </View>

      {/* New Opportunities Section */}
      <View style={styles.opportunitiesCard}>
        <View style={styles.sectionHeaderRow}>
          <AppText style={styles.sectionTitle}>New Opportunities</AppText>
        </View>
        <AppText style={styles.sectionSub}>
          Browse available horse shipments & bid now
        </AppText>

        {/* Search Input Bar */}
        {/* <Input
          placeholder="Search by pickup or delivery location..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={
            <AppIcon name="Search" size={18} color={COLORS.textSecondary} />
          }
          containerStyle={{ marginBottom: SPACING.md }}
        /> */}
        <SearchBarCompt
          placeholder="Search by pickup or delivery location..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Filter By Row */}
        <View style={styles.filterRow}>
          <AppText style={styles.filterLabel}>Filter By :</AppText>
          <View style={styles.filterPillsGroup}>
            <TouchableOpacity
              style={[
                styles.filterPill,
                selectedFilter === 'pickup' && styles.filterPillActive,
              ]}
              onPress={() =>
                setSelectedFilter(selectedFilter === 'pickup' ? '' : 'pickup')
              }
            >
              <AppText
                style={[
                  styles.filterPillText,
                  selectedFilter === 'pickup' && styles.filterPillTextActive,
                ]}
              >
                Pickup Distance
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterPill,
                selectedFilter === 'dropoff' && styles.filterPillActive,
              ]}
              onPress={() =>
                setSelectedFilter(selectedFilter === 'dropoff' ? '' : 'dropoff')
              }
            >
              <AppText
                style={[
                  styles.filterPillText,
                  selectedFilter === 'dropoff' && styles.filterPillTextActive,
                ]}
              >
                Dropoff Distance
              </AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* View Toggle Row (List View vs View Map) */}
        <View style={styles.viewToggleRow}>
          <TouchableOpacity
            style={[
              styles.viewToggleBtn,
              viewMode === 'list'
                ? styles.viewToggleBtnActive
                : styles.viewToggleBtnInactive,
            ]}
            onPress={() => setViewMode('list')}
          >
            <AppIcon
              name="List"
              size={16}
              color={viewMode === 'list' ? COLORS.white : COLORS.saddleBrown}
            />
            <AppText
              style={[
                styles.viewToggleBtnText,
                viewMode === 'list' && styles.viewToggleBtnTextActive,
              ]}
            >
              List View
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.viewToggleBtn,
              viewMode === 'map'
                ? styles.viewToggleBtnActive
                : styles.viewToggleBtnInactive,
            ]}
            onPress={() => {
              setViewMode('map');
              onSelectMapFirstShipment();
            }}
          >
            <AppIcon
              name="Map"
              size={16}
              color={viewMode === 'map' ? COLORS.white : COLORS.saddleBrown}
            />
            <AppText
              style={[
                styles.viewToggleBtnText,
                viewMode === 'map' && styles.viewToggleBtnTextActive,
              ]}
            >
              View Map
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Current Shipments Section Title */}
      {viewMode === 'list' && (
        <View style={{ marginTop: SPACING.sm, marginBottom: SPACING.xs }}>
          <SectionHeader
            title="New Shipment"
            showAction={true}
            onPress={onNavigatePost}
            containerStyle={{ paddingHorizontal: 0, paddingVertical: 0 }}
          />
        </View>
      )}
    </View>
  );
};
