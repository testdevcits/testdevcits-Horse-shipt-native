import React, { useState, useMemo, useCallback } from 'react';
import {

    View,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView, // Imported ScrollView for the horizontal chip layout
    Platform,
} from 'react-native';
import { useDriverMe } from '../../../../hooks/useDriverMe';
import DriverHeader from '../../../../components/common/DriverHeader';
import { AlertCircle } from 'lucide-react-native';
import { COLORS, ICON_SIZE, } from '../../../../constants';
import { AppText, TripCard } from '../../../../components';
import styles from './styles.alltrips';

type TabType = 'ALL' | 'PENDING' | 'ACTIVE' | 'DELIVERED';

const AllTrips = ({ navigation }: { navigation?: any }) => {
    const { loading, allShipments, driver, activeShipment } = useDriverMe();
    const [selectedTab, setSelectedTab] = useState<TabType>('ALL');

    const shipments = allShipments || [];

    // Compute status counts dynamically
    const counts = useMemo(() => {
        return {
            ALL: shipments.length,
            PENDING: shipments.filter((s: any) => s.tripStatus === 'pending').length,
            ACTIVE: shipments.filter((s: any) => s.tripStatus === 'inTransit').length,
            DELIVERED: shipments.filter((s: any) => s.tripStatus === 'completed' || s.tripStatus === 'delivered').length,
        };
    }, [shipments]);

    // Filter current shipments based on tab selection
    const filteredShipments = useMemo(() => {
        switch (selectedTab) {
            case 'PENDING':
                return shipments.filter((s: any) => s.tripStatus === 'pending');
            case 'ACTIVE':
                return shipments.filter((s: any) => s.tripStatus === 'inTransit');
            case 'DELIVERED':
                return shipments.filter((s: any) => s.tripStatus === 'completed' || s.tripStatus === 'delivered');
            default:
                return shipments;
        }
    }, [selectedTab, shipments]);

    const handleCompleteDelivery = useCallback((tripId: string) => {
        console.log("Complete delivery triggered for trip id: ", tripId);
        navigation?.navigate("DeliveryVerification", { shipment: activeShipment });
    }, [navigation, activeShipment]);

    const keyExtractor = useCallback((item: any) => item?._id || String(Math.random()), []);

    const renderItem = useCallback(({ item }: { item: any }) => (
        <TripCard
            item={item}
            onCompletePress={handleCompleteDelivery}
            containerStyle={styles.cardSpacing}
        />
    ), [handleCompleteDelivery]);

    // Render method for active status filters (Horizontal Chip Layout)
    const renderFilterTab = (label: TabType, count: number) => {
        const isActive = selectedTab === label;

        // Formats "PENDING" to "Pending" for professional display
        const formattedLabel = label.charAt(0) + label.slice(1).toLowerCase();

        return (
            <TouchableOpacity
                key={label}
                style={[styles.chip, isActive && styles.chipActive]}
                activeOpacity={0.8}
                onPress={() => setSelectedTab(label)}
            >
                <AppText style={[styles.chipText, isActive && styles.chipTextActive]}>
                    {formattedLabel}
                </AppText>
                <View style={[styles.badge, isActive && styles.badgeActive]}>
                    <AppText style={[styles.badgeText, isActive && styles.badgeTextActive]}>
                        {count}
                    </AppText>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Shared Global Header */}
            <DriverHeader
                name={driver?.name || 'Test Driver'}
                statusText={driver?.driverStatus || 'ON TRIP'}
                profileImageUrl={driver?.profileImage?.url}
                isOnline={driver?.isActive !== false}
            />

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={filteredShipments}
                    keyExtractor={keyExtractor}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={5}
                    maxToRenderPerBatch={5}
                    windowSize={5}
                    removeClippedSubviews={Platform.OS === 'android'}
                    ListHeaderComponent={
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.tabScrollContent}
                        >
                            {renderFilterTab('ALL', counts.ALL)}
                            {renderFilterTab('PENDING', counts.PENDING)}
                            {renderFilterTab('ACTIVE', counts.ACTIVE)}
                            {renderFilterTab('DELIVERED', counts.DELIVERED)}
                        </ScrollView>
                    }
                    renderItem={renderItem}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <AlertCircle size={ICON_SIZE.xl} color={COLORS.textLight} />
                            <AppText style={styles.emptyText}>No shipments found for this status.</AppText>
                        </View>
                    }
                />
            )}
        </View>
    );
};

export default AllTrips;

