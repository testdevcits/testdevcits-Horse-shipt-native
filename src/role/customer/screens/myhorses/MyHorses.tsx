import React, { lazy, Suspense, useCallback } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Wind } from 'lucide-react-native';
import { COLORS } from '../../../../constants';

import useMyHorses from './usemyhorses';
import {
  AppHeader,
  AppText,
  EmptyState,
  HorseCard,
  MyHorsesSkeleton,
} from '../../../../components';
import styles from './style.myhorses';

const ConfirmationModal = lazy(
  () => import('../../../../components/common/ConfirmationModal'),
);

const MyHorses = ({ navigation }: any) => {
  const {
    horses,
    loading,
    refreshing,
    fetchHorses,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
    isDeleteModalVisible,
    handleEdit,
    setRefreshing,
  } = useMyHorses();

  const keyExtractor = useCallback(
    (item: any) => item?._id || String(Math.random()),
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <HorseCard
        item={item}
        onDelete={() => handleDelete(item?._id)}
        onEdit={() => handleEdit(item)}
      />
    ),
    [handleDelete, handleEdit],
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <MyHorsesSkeleton />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader />

      <FlatList
        data={horses}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
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
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            tintColor={COLORS.primary}
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
      <Suspense fallback={null}>
        <ConfirmationModal
          isVisible={isDeleteModalVisible}
          type="danger"
          title="Delete Horse"
          description="Are you sure you want to remove this horse? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          isLoading={loading}
        />
      </Suspense>
    </View>
  );
};

export default MyHorses;
