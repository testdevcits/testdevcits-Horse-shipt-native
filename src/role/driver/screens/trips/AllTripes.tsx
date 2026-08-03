import React, { useState, useMemo } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView, // Imported ScrollView for the horizontal chip layout
} from 'react-native';
import { useDriverMe } from '../../../../hooks/useDriverMe';
import DriverHeader from '../../../../components/common/DriverHeader';
import { AlertCircle } from 'lucide-react-native';
import { COLORS, FONT_SIZE, FONTS, ICON_SIZE, RADIUS, SPACING } from '../../../../constants';
import { TripCard } from '../../../../components';
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

    const handleCompleteDelivery = (tripId: string) => {
        console.log("Complete delivery triggered for trip id: ", tripId);

        navigation.navigate("DeliveryVerification", { shipment: activeShipment })



    };

    // Render method for active status filters (Horizontal Chip Layout)
    const renderFilterTab = (label: TabType, count: number) => {
        const isActive = selectedTab === label;

        // Formats "PENDING" to "Pending" for professional display
        const formattedLabel = label.charAt(0) + label.slice(1).toLowerCase();

        return (
            <TouchableOpacity
                style={[styles.chip, isActive && styles.chipActive]}
                activeOpacity={0.8}
                onPress={() => setSelectedTab(label)}
            >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                    {formattedLabel}
                </Text>
                <View style={[styles.badge, isActive && styles.badgeActive]}>
                    <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>
                        {count}
                    </Text>
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
                    <ActivityIndicator size="large" color={COLORS.goldPrimary} />
                </View>
            ) : (
                <FlatList
                    data={filteredShipments}
                    keyExtractor={(item) => item?._id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
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
                    renderItem={({ item }) => (
                        <TripCard
                            item={item}
                            onCompletePress={handleCompleteDelivery}
                            containerStyle={styles.cardSpacing}
                        />
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <AlertCircle size={ICON_SIZE.xl} color={COLORS.textLight} />
                            <Text style={styles.emptyText}>No shipments found for this status.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
};

export default AllTrips;

