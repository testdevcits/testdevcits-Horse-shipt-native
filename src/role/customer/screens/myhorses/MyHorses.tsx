import React from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Edit2, Trash2, Wind } from 'lucide-react-native';
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
  FloatingButton,
  HorseCard,
} from '../../../../components';

const MyHorses = ({ navigation }) => {
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
      <AppText
        style={{
          margin: SPACING.lg,
          fontSize: FONT_SIZE.xl,
          fontFamily: FONTS.semiBold,
        }}
      >
        My Horses
      </AppText>
      <AppText style={{ margin: SPACING.lg, marginTop: 0 }}>
        Manage your horses, update their details, and keep all transportation
        information in one place.
      </AppText>
      <AppText onPress={()=>navigation.navigate("AddEditHorse")}
        style={{
          padding: SPACING.sm,
          backgroundColor: COLORS.primary,
          alignSelf: 'flex-start',
          color: COLORS.white,
          fontFamily: FONTS.semiBold,
          marginHorizontal:SPACING.lg,
          borderRadius:10,
          paddingHorizontal:50
        }}
      >
        + Horse
      </AppText>
      {/* <FlatList
                data={horses}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => <HorseCard item={item} onDelete={() => handleDelete(item._id)} onEdit={() => handleEdit(item)} />}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchHorses(); }} />}
                ListEmptyComponent={!loading ? <EmptyState icon={Wind} title="No Horses Found" message="You haven't added any horses yet. Click the + button to start." /> : null}
            /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  listContent: { padding: SPACING.lg, paddingBottom: 100 },
});

export default MyHorses;
