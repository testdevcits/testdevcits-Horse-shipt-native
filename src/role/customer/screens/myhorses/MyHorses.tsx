import React from 'react';
import { View, FlatList, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import { Wind } from 'lucide-react-native';
import {
  COLORS,
  SPACING,
  RADIUS,
  FONTS,
  FONT_SIZE,
} from '../../../../constants';

import useMyHorses from './usemyhorses';
import {
  AppHeader,
  AppLoader,
  AppText,
  EmptyState,
  HorseCard,
} from '../../../../components';

const MyHorses = ({ navigation }: any) => {
  const {
    horses,
    loading,
    refreshing,
    fetchHorses,
    handleDelete,
    handleEdit,
    setRefreshing,
  } = useMyHorses();

  return (
    <View style={styles.container}>
      <AppHeader />
      <AppLoader visible={loading && !refreshing} />

      <FlatList
        data={horses}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View style={styles.headerWrap}>
            <AppText style={styles.headerTitle}>My Horses</AppText>
            <AppText style={styles.headerSubtitle}>
              Manage your horses, update their details, and keep all
              transportation information in one place.
            </AppText>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddEditHorse')}
              activeOpacity={0.8}
              style={styles.addBtn}
            >
              <AppText style={styles.addBtnText}>+ Horse</AppText>
            </TouchableOpacity>
          </View>
        )}
        renderItem={({ item }) => (
          <HorseCard
            item={item}
            onDelete={() => handleDelete(item._id)}
            onEdit={() => handleEdit(item)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            tintColor={COLORS.goldPrimary}
            onRefresh={() => {
              setRefreshing(true);
              fetchHorses();
            }}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon={Wind}
              title="No Horses Found"
              message="You haven't added any horses yet. Click the + button to start."
            />
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  listContent: { padding: SPACING.md, paddingBottom: 100 },
  headerWrap: { marginBottom: SPACING.sm },
  headerTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: SPACING.sm,
    lineHeight: 16,
  },
  addBtn: {
    backgroundColor: COLORS.goldPrimary,
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.lg,
    alignSelf: 'flex-start',
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  addBtnText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
  },
});

export default MyHorses;
