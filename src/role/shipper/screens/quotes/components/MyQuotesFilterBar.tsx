import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { AppText, SearchBarCompt } from '../../../../../components';
import styles from '../styles.myquotes';

type TabKey =
  | 'all'
  | 'pending'
  | 'in_transit'
  | 'upcoming'
  | 'cancelled'
  | 'completed';

interface MyQuotesFilterBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  counts: {
    all: number;
    pending: number;
    in_transit: number;
    upcoming: number;
    cancelled: number;
    completed: number;
  };
}

export const MyQuotesFilterBar: React.FC<MyQuotesFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  counts,
}) => {
  const tabs: { label: string; key: TabKey; count: number }[] = [
    { label: 'All Quotes', key: 'all', count: counts.all },
    { label: 'In Transit', key: 'in_transit', count: counts.in_transit },
    { label: 'Upcoming', key: 'upcoming', count: counts.upcoming },
    { label: 'Completed', key: 'completed', count: counts.completed },
    { label: 'Cancelled', key: 'cancelled', count: counts.cancelled },
    { label: 'Pending', key: 'pending', count: counts.pending },
  ];

  return (
    <>
      {/* Top Header Card */}
      <View style={styles.topCard}>
        <AppText style={styles.topTitle}>My Quotes</AppText>
        <AppText style={styles.topSub}>
          Review shipment offers, contracts, vehicles, and payment status.
        </AppText>

        {/* Search Input Bar Component */}
        <SearchBarCompt
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by pickup or delivery location..."
        />
      </View>

      {/* Horizontal Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabContainer}
      >
        {tabs.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabBtn, isActive && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <AppText
                style={[styles.tabBtnText, isActive && styles.tabBtnTextActive]}
              >
                {tab.label}
              </AppText>
              <View style={styles.badgePill}>
                <AppText style={styles.badgePillText}>{tab.count}</AppText>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </>
  );
};
