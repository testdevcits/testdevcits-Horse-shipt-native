import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  Plus,
  Truck,
  Box,
  Layers,
  UserCheck,
  AlertTriangle,
  FileText,
  UserPlus,
  Edit,
  Trash2,
} from 'lucide-react-native';
import { AppHeader, AppText } from '../../../../components';
import { COLORS, FONTS, SPACING, RADIUS, FONT_SIZE } from '../../../../constants';
import shipperService from '../../../../api/services/shipperService';
import AddVehicleModal from './AddVehicleModal';

const MyVehiclesScreen = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedVehicleToEdit, setSelectedVehicleToEdit] = useState<any>(null);

  const fetchVehicles = async () => {
    try {
      const res = await shipperService.getVehicles();
      if (res?.success || res?.vehicles) {
        setVehicles(res.vehicles || []);
      }
    } catch (error: any) {
      console.error('Fetch Vehicles Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVehicles();
  };

  const handleDeleteVehicle = (id: string, vehicleNum: string) => {
    Alert.alert(
      'Delete Vehicle',
      `Are you sure you want to delete vehicle ${vehicleNum}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await shipperService.deleteVehicle(id);
              if (res?.success) {
                Alert.alert('Success', 'Vehicle deleted successfully.');
                fetchVehicles();
              }
            } catch (error: any) {
              Alert.alert(
                'Error',
                error?.response?.data?.message || 'Failed to delete vehicle.',
              );
            }
          },
        },
      ],
    );
  };

  const handleEdit = (vehicle: any) => {
    setSelectedVehicleToEdit(vehicle);
    setIsAddModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="My Vehicles" showNotificationBell />

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
        {/* Top Header Card */}
        <View style={styles.topCard}>
          <View style={styles.topCardTextCol}>
            <AppText style={styles.topCardTitle}>My Registered Vehicles</AppText>
            <AppText style={styles.topCardSub}>
              {vehicles.length} vehicle(s) added to your carrier profile
            </AppText>
          </View>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => {
              setSelectedVehicleToEdit(null);
              setIsAddModalVisible(true);
            }}
            activeOpacity={0.8}
          >
            <Plus size={18} color={COLORS.white} strokeWidth={2.5} />
            <AppText style={styles.addBtnText}>Add Vehicle</AppText>
          </TouchableOpacity>
        </View>

        {/* Vehicles List */}
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.goldPrimary} />
          </View>
        ) : vehicles.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Truck size={48} color={COLORS.textLight} />
            <AppText style={styles.emptyTitle}>No Vehicles Registered</AppText>
            <AppText style={styles.emptySub}>
              Add your trucks and trailers to start offering horse transport quotes.
            </AppText>
            <TouchableOpacity
              style={[styles.addBtn, { marginTop: SPACING.md }]}
              onPress={() => setIsAddModalVisible(true)}
            >
              <Plus size={18} color={COLORS.white} />
              <AppText style={styles.addBtnText}>Add Vehicle</AppText>
            </TouchableOpacity>
          </View>
        ) : (
          vehicles.map((vehicle, index) => {
            const vehicleImg =
              vehicle.images && vehicle.images[0]?.url
                ? vehicle.images[0].url
                : null;
            const status = vehicle.verificationStatus || 'PENDING';

            return (
              <View key={vehicle._id || index} style={styles.vehicleCard}>
                {/* Vehicle Banner Image */}
                <View style={styles.imageContainer}>
                  {vehicleImg ? (
                    <Image source={{ uri: vehicleImg }} style={styles.vehicleImage} />
                  ) : (
                    <View style={styles.fallbackImage}>
                      <Truck size={44} color={COLORS.goldPrimary} />
                    </View>
                  )}
                  {/* Status Badge */}
                  <View
                    style={[
                      styles.statusBadge,
                      status === 'APPROVED'
                        ? styles.statusApproved
                        : status === 'REJECTED'
                        ? styles.statusRejected
                        : styles.statusPending,
                    ]}
                  >
                    <AppText
                      style={[
                        styles.statusBadgeText,
                        status === 'APPROVED'
                          ? styles.statusApprovedText
                          : status === 'REJECTED'
                          ? styles.statusRejectedText
                          : styles.statusPendingText,
                      ]}
                    >
                      {status}
                    </AppText>
                  </View>
                </View>

                {/* Card Main Info */}
                <View style={styles.cardContent}>
                  <AppText style={styles.vehicleNum}>
                    {vehicle.vehicleNumber || 'No Plate Number'}
                  </AppText>
                  <AppText style={styles.vehicleType}>
                    {vehicle.vehicleType || 'Truck'} - {vehicle.transportType || 'Trucking'}
                  </AppText>

                  {/* 2x2 Specs Grid */}
                  <View style={styles.specsGrid}>
                    <View style={styles.specBox}>
                      <Truck size={18} color={COLORS.goldPrimary} />
                      <View style={styles.specBoxTextCol}>
                        <AppText style={styles.specLabel}>VIN</AppText>
                        <AppText style={styles.specValue} numberOfLines={1}>
                          {vehicle.vinNumber || 'N/A'}
                        </AppText>
                      </View>
                    </View>

                    <View style={styles.specBox}>
                      <Box size={18} color={COLORS.goldPrimary} />
                      <View style={styles.specBoxTextCol}>
                        <AppText style={styles.specLabel}>Size</AppText>
                        <AppText style={styles.specValue} numberOfLines={1}>
                          {vehicle.stallSize || 'Standard'}
                        </AppText>
                      </View>
                    </View>

                    <View style={styles.specBox}>
                      <Layers size={18} color={COLORS.goldPrimary} />
                      <View style={styles.specBoxTextCol}>
                        <AppText style={styles.specLabel}>Stalls</AppText>
                        <AppText style={styles.specValue}>
                          {vehicle.numberOfStalls ? String(vehicle.numberOfStalls).padStart(2, '0') : '01'}
                        </AppText>
                      </View>
                    </View>

                    <View style={styles.specBox}>
                      <Truck size={18} color={COLORS.goldPrimary} />
                      <View style={styles.specBoxTextCol}>
                        <AppText style={styles.specLabel}>Stall Type</AppText>
                        <AppText style={styles.specValue} numberOfLines={1}>
                          {vehicle.trailerType || 'N/A'}
                        </AppText>
                      </View>
                    </View>
                  </View>

                  {/* Assigned Driver Box */}
                  {vehicle.driver ? (
                    <View style={styles.assignedDriverBox}>
                      <UserCheck size={20} color="#10B981" />
                      <View style={styles.assignedDriverTextCol}>
                        <AppText style={styles.assignedDriverTitle}>Assigned Driver</AppText>
                        <AppText style={styles.assignedDriverName}>
                          {vehicle.driver.name || 'Assigned'}
                        </AppText>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.driverWarningBox}>
                      <AlertTriangle size={20} color="#D97706" />
                      <View style={styles.assignedDriverTextCol}>
                        <AppText style={styles.warningTitle}>Driver not available</AppText>
                        <AppText style={styles.warningSub}>
                          Please assign a driver before accepting shipments.
                        </AppText>
                      </View>
                    </View>
                  )}

                  {/* Notes Box */}
                  {vehicle.notes ? (
                    <View style={styles.notesBox}>
                      <FileText size={18} color={COLORS.goldPrimary} />
                      <View style={styles.notesTextCol}>
                        <AppText style={styles.notesTitle}>Notes</AppText>
                        <AppText style={styles.notesText}>{vehicle.notes}</AppText>
                      </View>
                    </View>
                  ) : null}

                  {/* Action Buttons Row */}
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={styles.actionPill}
                      onPress={() => Alert.alert('Assign Driver', 'Select a driver from your carrier fleet.')}
                    >
                      <UserPlus size={15} color={COLORS.textPrimary} />
                      <AppText style={styles.actionPillText}>Assign Driver</AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionPill}
                      onPress={() => handleEdit(vehicle)}
                    >
                      <Edit size={15} color={COLORS.textPrimary} />
                      <AppText style={styles.actionPillText}>Edit</AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionPill}
                      onPress={() => handleDeleteVehicle(vehicle._id, vehicle.vehicleNumber)}
                    >
                      <Trash2 size={15} color="#EF4444" />
                      <AppText style={[styles.actionPillText, { color: '#EF4444' }]}>Delete</AppText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Add / Edit Vehicle Modal */}
      <AddVehicleModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onSuccess={fetchVehicles}
        vehicleToEdit={selectedVehicleToEdit}
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
  topCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#EEDCBD',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topCardTextCol: {
    flex: 1,
    marginRight: SPACING.xs,
  },
  topCardTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  topCardSub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  addBtn: {
    backgroundColor: '#A06333',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.xs,
    gap: 4,
  },
  addBtnText: {
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

  // Vehicle Card
  vehicleCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#EEDCBD',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    height: 180,
    width: '100%',
    backgroundColor: '#F4F4F5',
    position: 'relative',
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  fallbackImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.round || 999,
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusPendingText: {
    color: '#D97706',
  },
  statusApproved: {
    backgroundColor: '#D1FAE5',
  },
  statusApprovedText: {
    color: '#059669',
  },
  statusRejected: {
    backgroundColor: '#FEE2E2',
  },
  statusRejectedText: {
    color: '#DC2626',
  },
  statusBadgeText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
  },
  cardContent: {
    padding: SPACING.md,
  },
  vehicleNum: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: '#A06333',
  },
  vehicleType: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
    marginTop: 2,
    marginBottom: SPACING.md,
  },

  // 2x2 Grid Specs
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  specBox: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    gap: SPACING.xs,
  },
  specBoxTextCol: {
    flex: 1,
  },
  specLabel: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    color: '#A06333',
  },
  specValue: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginTop: 1,
  },

  // Assigned Driver Box
  assignedDriverBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  assignedDriverTextCol: {
    flex: 1,
  },
  assignedDriverTitle: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: '#059669',
  },
  assignedDriverName: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: '#065F46',
  },

  // Warning Box
  driverWarningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  warningTitle: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: '#D97706',
  },
  warningSub: {
    fontSize: 10,
    fontFamily: FONTS.regular,
    color: '#B45309',
    marginTop: 1,
  },

  // Notes Box
  notesBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  notesTextCol: {
    flex: 1,
  },
  notesTitle: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  notesText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    marginTop: 2,
    lineHeight: 16,
  },

  // Action Pills
  actionsRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  actionPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.divider,
    paddingVertical: 8,
    borderRadius: RADIUS.xs,
    gap: 4,
  },
  actionPillText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
  },
});

export default MyVehiclesScreen;
