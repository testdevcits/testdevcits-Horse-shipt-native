import React, { useRef, useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    SafeAreaView,
    Platform,
    StatusBar,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {
    ChevronLeft,
    MapPin,

    Clock,
    Route,
    Target,
    PackageCheck
} from 'lucide-react-native';

// Import your constants
import { COLORS, FONTS, SPACING, RADIUS, FONT_SIZE } from '../../../../constants';
import { AppText } from '../../../../components';
import { GOOGLE_MAPS_APIKEY } from '../../../../config/constants';

// Note: Replace with your actual Google Maps API Key

const ShipmentMapDirection = ({ route, navigation }: any) => {
    // Use the params provided in your JSON
    const { shipmentData } = route.params;
    console.log(" shipmentData   ", shipmentData);



    const mapRef = useRef<MapView>(null);
    const [isMapReady, setIsMapReady] = useState(false);

    // Zoom to fit both markers on mount
    const fitToRoute = () => {
        mapRef.current?.fitToCoordinates(
            [shipmentData.pickupCoords, shipmentData.deliveryCoords],
            {
                edgePadding: { top: 100, right: 50, bottom: 300, left: 50 },
                animated: true,
            }
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Map Implementation */}
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                    ...shipmentData.pickupCoords,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                showsUserLocation={true}
                showsMyLocationButton={false}
                onMapReady={() => {
                    setIsMapReady(true);
                    fitToRoute();
                }}
            >
                {/* Pickup Marker */}
                <Marker coordinate={shipmentData.pickupCoords} title="Pickup">
                    <View style={[styles.markerContainer, { backgroundColor: COLORS.greenSuccess }]}>
                        <PackageCheck size={16} color={COLORS.white} />
                    </View>
                </Marker>

                {/* Delivery Marker */}
                <Marker coordinate={shipmentData.deliveryCoords} title="Delivery">
                    <View style={[styles.markerContainer, { backgroundColor: COLORS.primary }]}>
                        <MapPin size={16} color={COLORS.white} />
                    </View>
                </Marker>

                {/* Route Directions */}
                <MapViewDirections
                    origin={shipmentData.pickupCoords}
                    destination={shipmentData.deliveryCoords}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeWidth={4}
                    strokeColor={COLORS.primary}
                    optimizeWaypoints={true}
                    onReady={result => {
                        console.log(`Distance: ${result.distance} km`);
                        console.log(`Duration: ${result.duration} min.`);
                    }}
                />
            </MapView>

            {/* Floating Header */}
            <SafeAreaView style={styles.headerContainer}>
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation?.goBack()}
                    >
                        <ChevronLeft size={24} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                    <View style={styles.headerTextContainer}>
                        <AppText style={styles.headerTitle}>{shipmentData.shipmentCode}</AppText>
                        <View style={styles.statusBadge}>
                            <View style={styles.statusDot} />
                            <AppText style={styles.statusText}>Open for Offers</AppText>
                        </View>
                    </View>
                </View>
            </SafeAreaView>

            {/* Recenter Button */}
            <TouchableOpacity
                style={styles.recenterButton}
                onPress={fitToRoute}
            >
                <Target size={24} color={COLORS.primary} />
            </TouchableOpacity>

            {/* Bottom Info Card */}
            <View style={styles.bottomCard}>
                <View style={styles.dragHandle} />

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Route size={20} color={COLORS.primary} />
                        <View style={styles.statTextContent}>
                            <AppText style={styles.statLabel}>Distance</AppText>
                            <AppText style={styles.statValue}>{shipmentData.estimatedDistance.km} km</AppText>
                        </View>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Clock size={20} color={COLORS.primary} />
                        <View style={styles.statTextContent}>
                            <AppText style={styles.statLabel}>Est. Time</AppText>
                            <AppText style={styles.statValue}>{shipmentData.estimatedDuration} hrs</AppText>
                        </View>
                    </View>
                </View>

                <View style={styles.addressSection}>
                    <View style={styles.addressRow}>
                        <View style={styles.dotContainer}>
                            <View style={[styles.dot, { backgroundColor: COLORS.greenSuccess }]} />
                            <View style={styles.line} />
                        </View>
                        <View style={styles.addressTextWrapper}>
                            <AppText style={styles.addressLabel}>Pickup</AppText>
                            <AppText style={styles.addressText} numberOfLines={1}>{shipmentData.pickupLocation}</AppText>
                        </View>
                    </View>

                    <View style={[styles.addressRow, { marginTop: 10 }]}>
                        <View style={styles.dotContainer}>
                            <MapPin size={16} color={COLORS.primary} />
                        </View>
                        <View style={styles.addressTextWrapper}>
                            <AppText style={styles.addressLabel}>Delivery</AppText>
                            <AppText style={styles.addressText} numberOfLines={1}>{shipmentData.deliveryLocation}</AppText>
                        </View>
                    </View>
                </View>

                {/* <TouchableOpacity style={styles.actionButton}>
                    <Navigation size={20} color={COLORS.white} />
                    <AppText style={styles.actionButtonText}>View Offer Details</AppText>
                </TouchableOpacity> */}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: COLORS.background,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    headerTextContainer: {
        marginLeft: SPACING.md,
        backgroundColor: COLORS.white,
        paddingHorizontal: SPACING.md,
        paddingVertical: 6,
        borderRadius: RADIUS.md,
        elevation: 4,
    },
    headerTitle: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZE.md,
        color: COLORS.textPrimary,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.success,
        marginRight: 6,
    },
    statusText: {
        fontSize: FONT_SIZE.xs,
        fontFamily: FONTS.medium,
        color: COLORS.textSecondary,
        textTransform: 'uppercase',
    },
    markerContainer: {
        padding: 6,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: COLORS.white,
        elevation: 5,
    },
    recenterButton: {
        position: 'absolute',
        right: SPACING.lg,
        bottom: 320, // Above the bottom card
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    bottomCard: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: RADIUS.xl,
        borderTopRightRadius: RADIUS.xl,
        padding: SPACING.xl,
        paddingTop: SPACING.md,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    dragHandle: {
        width: 40,
        height: 5,
        backgroundColor: COLORS.grey200,
        borderRadius: 3,
        alignSelf: 'center',
        marginBottom: SPACING.lg,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: COLORS.grey50,
        borderRadius: RADIUS.lg,
        padding: SPACING.md,
        marginBottom: SPACING.xl,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    statTextContent: {
        marginLeft: SPACING.sm,
    },
    statDivider: {
        width: 1,
        height: '100%',
        backgroundColor: COLORS.grey200,
        marginHorizontal: SPACING.md,
    },
    statLabel: {
        fontSize: FONT_SIZE.xs,
        fontFamily: FONTS.medium,
        color: COLORS.textLight,
    },
    statValue: {
        fontSize: FONT_SIZE.md,
        fontFamily: FONTS.bold,
        color: COLORS.textPrimary,
    },
    addressSection: {
        marginBottom: SPACING.xl,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    dotContainer: {
        width: 20,
        alignItems: 'center',
        marginTop: 4,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    line: {
        width: 2,
        height: 30,
        backgroundColor: COLORS.grey200,
        marginVertical: 2,
    },
    addressTextWrapper: {
        flex: 1,
        marginLeft: SPACING.sm,
    },
    addressLabel: {
        fontSize: FONT_SIZE.xs,
        fontFamily: FONTS.bold,
        color: COLORS.textLight,
        textTransform: 'uppercase',
    },
    addressText: {
        fontSize: FONT_SIZE.md,
        fontFamily: FONTS.medium,
        color: COLORS.textPrimary,
        marginTop: 2,
    },
    actionButton: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        height: 55,
        borderRadius: RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    actionButtonText: {
        color: COLORS.white,
        fontSize: FONT_SIZE.lg,
        fontFamily: FONTS.bold,
    },
});

export default ShipmentMapDirection;