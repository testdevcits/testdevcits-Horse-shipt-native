import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  Search,
  Plus,
  User,
  Power,
  Edit,
  Trash2,
  FileText,
  Mail,
  Phone,
  Award,
  SlidersHorizontal,
} from 'lucide-react-native';
import { AppHeader, AppText } from '../../../../components';
import { COLORS, FONTS, SPACING, RADIUS, FONT_SIZE } from '../../../../constants';
import shipperService from '../../../../api/services/shipperService';
import AddDriverModal from './AddDriverModal';

const TruckDriverScreen = () => {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>(''); // '' | 'active' | 'inactive'
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedDriverToEdit, setSelectedDriverToEdit] = useState<any>(null);

  const fetchDrivers = async () => {
    try {
      const res = await shipperService.getDrivers({
        page: 1,
        limit: 20,
        search: searchQuery,
        status: selectedStatus,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      const driverList = res?.data || res?.drivers || [];
      setDrivers(driverList);
    } catch (error: any) {
      console.error('Fetch Drivers Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, [searchQuery, selectedStatus]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDrivers();
  };

  const handleToggleStatus = async (id: string, currentActiveStatus: boolean) => {
    try {
      const res = await shipperService.toggleDriverStatus(id, !currentActiveStatus);
      if (res?.success) {
        Alert.alert(
          'Success',
          `Driver ${!currentActiveStatus ? 'activated' : 'deactivated'} successfully.`,
        );
        fetchDrivers();
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to update driver status.',
      );
    }
  };

  const handleDeleteDriver = (id: string, driverName: string) => {
    Alert.alert(
      'Delete Driver',
      `Are you sure you want to delete driver ${driverName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await shipperService.deleteDriver(id);
              if (res?.success) {
                Alert.alert('Success', 'Driver deleted successfully.');
                fetchDrivers();
              }
            } catch (error: any) {
              Alert.alert(
                'Error',
                error?.response?.data?.message || 'Failed to delete driver.',
              );
            }
          },
        },
      ],
    );
  };

  const handleEditDriver = (driver: any) => {
    setSelectedDriverToEdit(driver);
    setIsAddModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Truck Driver Management" showNotificationBell />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.goldPrimary}
          />
        }
      >
        {/* Top Management Header Card */}
        <View style={styles.topCard}>
          <AppText style={styles.topTitle}>Truck Driver Management</AppText>
          <AppText style={styles.topSub}>
            Manage driver profiles, contact details, and license verification.
          </AppText>

          {/* Search Input Bar */}
          <View style={styles.searchBarContainer}>
            <Search size={18} color={COLORS.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by driver name or email..."
              placeholderTextColor={COLORS.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Filters & Add Driver Row */}
          <View style={styles.filtersRow}>
            <View style={styles.filterPillsGroup}>
              <TouchableOpacity
                style={[
                  styles.filterPill,
                  selectedStatus === 'active' && styles.filterPillActive,
                ]}
                onPress={() =>
                  setSelectedStatus(selectedStatus === 'active' ? '' : 'active')
                }
              >
                <AppText
                  style={[
                    styles.filterPillText,
                    selectedStatus === 'active' && styles.filterPillTextActive,
                  ]}
                >
                  Active
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterPill,
                  selectedStatus === 'inactive' && styles.filterPillActive,
                ]}
                onPress={() =>
                  setSelectedStatus(selectedStatus === 'inactive' ? '' : 'inactive')
                }
              >
                <AppText
                  style={[
                    styles.filterPillText,
                    selectedStatus === 'inactive' && styles.filterPillTextActive,
                  ]}
                >
                  Inactive
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity style={styles.filterIconBtn}>
                <SlidersHorizontal size={18} color={COLORS.goldDarkText} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.addDriverBtn}
              onPress={() => {
                setSelectedDriverToEdit(null);
                setIsAddModalVisible(true);
              }}
              activeOpacity={0.8}
            >
              <Plus size={18} color={COLORS.white} strokeWidth={2.5} />
              <AppText style={styles.addDriverBtnText}>Add Driver</AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Drivers List */}
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.goldPrimary} />
          </View>
        ) : drivers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <User size={48} color={COLORS.textLight} />
            <AppText style={styles.emptyTitle}>No Drivers Found</AppText>
            <AppText style={styles.emptySub}>
              Add drivers to your fleet to assign them to transport vehicles and trips.
            </AppText>
            <TouchableOpacity
              style={[styles.addDriverBtn, { marginTop: SPACING.md }]}
              onPress={() => setIsAddModalVisible(true)}
            >
              <Plus size={18} color={COLORS.white} />
              <AppText style={styles.addDriverBtnText}>Add Driver</AppText>
            </TouchableOpacity>
          </View>
        ) : (
          drivers.map((driver, index) => {
            const isActive = driver.isActive ?? true;
            const profileUrl = driver.profileImage?.url || null;

            return (
              <View key={driver._id || index} style={styles.driverCard}>
                {/* Driver Top Profile Bar */}
                <View style={styles.driverHeaderRow}>
                  <View style={styles.avatarContainer}>
                    {profileUrl ? (
                      <Image source={{ uri: profileUrl }} style={styles.avatarImg} />
                    ) : (
                      <User size={24} color={COLORS.goldPrimary} />
                    )}
                  </View>

                  <View style={styles.driverNameCol}>
                    <AppText style={styles.driverName}>
                      {driver.name || 'Unnamed Driver'}
                    </AppText>
                    <View
                      style={[
                        styles.activeBadge,
                        isActive ? styles.badgeActiveBg : styles.badgeInactiveBg,
                      ]}
                    >
                      <AppText
                        style={[
                          styles.activeBadgeText,
                          isActive ? styles.badgeActiveText : styles.badgeInactiveText,
                        ]}
                      >
                        {isActive ? 'Active' : 'Inactive'}
                      </AppText>
                    </View>
                  </View>
                </View>

                {/* Top Action Pills (Deactivate, Edit, Delete) */}
                <View style={styles.actionPillsRow}>
                  <TouchableOpacity
                    style={styles.actionBtnPill}
                    onPress={() => handleToggleStatus(driver._id, isActive)}
                  >
                    <Power size={15} color={isActive ? '#D97706' : '#10B981'} />
                    <AppText style={styles.actionBtnPillText}>
                      {isActive ? 'Deactivate' : 'Activate'}
                    </AppText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionBtnPill}
                    onPress={() => handleEditDriver(driver)}
                  >
                    <Edit size={15} color={COLORS.textPrimary} />
                    <AppText style={styles.actionBtnPillText}>Edit</AppText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionBtnPill}
                    onPress={() => handleDeleteDriver(driver._id, driver.name)}
                  >
                    <Trash2 size={15} color="#EF4444" />
                    <AppText style={[styles.actionBtnPillText, { color: '#EF4444' }]}>
                      Delete
                    </AppText>
                  </TouchableOpacity>
                </View>

                {/* Detail Specification Cards */}
                <View style={styles.specCardsContainer}>
                  {/* Name Card */}
                  <View style={styles.specDetailCard}>
                    <View style={styles.specIconBox}>
                      <User size={18} color={COLORS.goldPrimary} />
                    </View>
                    <View style={styles.specTextCol}>
                      <AppText style={styles.specLabelTitle}>Name</AppText>
                      <AppText style={styles.specLabelVal}>{driver.name || 'N/A'}</AppText>
                    </View>
                  </View>

                  {/* License Card */}
                  <View style={styles.specDetailCard}>
                    <View style={styles.specIconBox}>
                      <Award size={18} color={COLORS.goldPrimary} />
                    </View>
                    <View style={styles.specTextCol}>
                      <AppText style={styles.specLabelTitle}>License</AppText>
                      <AppText style={styles.specLabelVal}>
                        {driver.licenseNumber || 'N/A'}
                      </AppText>
                    </View>
                  </View>

                  {/* Email Card */}
                  <View style={styles.specDetailCard}>
                    <View style={styles.specIconBox}>
                      <Mail size={18} color={COLORS.goldPrimary} />
                    </View>
                    <View style={styles.specTextCol}>
                      <AppText style={styles.specLabelTitle}>Email</AppText>
                      <AppText style={styles.specLabelVal}>
                        {driver.email || 'N/A'}
                      </AppText>
                    </View>
                  </View>

                  {/* Phone Card */}
                  <View style={styles.specDetailCard}>
                    <View style={styles.specIconBox}>
                      <Phone size={18} color={COLORS.goldPrimary} />
                    </View>
                    <View style={styles.specTextCol}>
                      <AppText style={styles.specLabelTitle}>Phone</AppText>
                      <AppText style={styles.specLabelVal}>
                        {driver.phone || 'N/A'}
                      </AppText>
                    </View>
                  </View>

                  {/* Notes Card */}
                  {driver.notes ? (
                    <View style={styles.specDetailCard}>
                      <View style={styles.specIconBox}>
                        <FileText size={18} color={COLORS.goldPrimary} />
                      </View>
                      <View style={styles.specTextCol}>
                        <AppText style={styles.specLabelTitle}>Notes</AppText>
                        <AppText style={styles.specLabelVal}>{driver.notes}</AppText>
                      </View>
                    </View>
                  ) : null}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Add / Edit Driver Modal */}
      <AddDriverModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onSuccess={fetchDrivers}
        driverToEdit={selectedDriverToEdit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: SPACING.xxl,
  },

  // Top Card
  topCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#EEDCBD',
  },
  topTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  topSub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: SPACING.md,
  },

  // Search Bar
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.xs,
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.md,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
  },

  // Filter Row
  filtersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  filterPillsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.xs,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  filterPillActive: {
    backgroundColor: '#FFFBEB',
    borderColor: COLORS.goldPrimary,
  },
  filterPillText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  filterPillTextActive: {
    color: COLORS.goldDarkText,
    fontFamily: FONTS.bold,
  },
  filterIconBtn: {
    padding: 8,
    borderRadius: RADIUS.xs,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  addDriverBtn: {
    backgroundColor: '#A06333',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: RADIUS.xs,
    gap: 4,
  },
  addDriverBtnText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: FONTS.bold,
  },

  loaderContainer: {
    paddingVertical: 50,
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: SPACING.xl,
    marginTop: SPACING.lg,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
  },
  emptySub: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 20,
  },

  // Driver Card
  driverCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#EEDCBD',
    padding: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  driverHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  driverNameCol: {
    flex: 1,
  },
  driverName: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  activeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: RADIUS.round || 999,
    marginTop: 4,
    borderWidth: 1,
  },
  badgeActiveBg: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  badgeActiveText: {
    color: '#059669',
  },
  badgeInactiveBg: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  badgeInactiveText: {
    color: '#6B7280',
  },
  activeBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
  },

  // Action Pills
  actionPillsRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  actionBtnPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.divider,
    paddingVertical: 8,
    borderRadius: RADIUS.xs,
    gap: 5,
  },
  actionBtnPillText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
  },

  // Specification Detail Cards
  specCardsContainer: {
    gap: SPACING.xs,
  },
  specDetailCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#EEDCBD',
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    gap: SPACING.sm,
  },
  specIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFBEB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  specTextCol: {
    flex: 1,
  },
  specLabelTitle: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    color: '#A06333',
  },
  specLabelVal: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginTop: 1,
  },
});

export default TruckDriverScreen;



