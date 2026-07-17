import React, { useRef, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Modal,
    TouchableOpacity,
    Dimensions,
    Platform,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { X, Navigation, AlertTriangle, Compass } from 'lucide-react-native';
import { COLORS, FONT_SIZE, FONTS, ICON_SIZE, RADIUS, SPACING } from '../../../../constants';

// Import your centralized style constants

interface Coords {
    latitude: number;
    longitude: number;
}

interface RouteMapModalProps {
    visible: boolean;
    onClose: () => void;
    pickupLocation?: string;
    deliveryLocation?: string;
    pickupCoords?: Coords;
    deliveryCoords?: Coords;
    driverCoords?: Coords; // Current location pointer if available
}

export const RouteMapModal: React.FC<RouteMapModalProps> = ({
    visible,
    onClose,
    pickupLocation = 'New Mexico, USA',
    deliveryLocation = 'Washington, DC, USA',
    pickupCoords,
    deliveryCoords,
    driverCoords,
}) => {
    const mapRef = useRef<MapView | null>(null);

    // Validate coordinates existence
    const hasCoords = !!(
        pickupCoords?.latitude &&
        pickupCoords?.longitude &&
        deliveryCoords?.latitude &&
        deliveryCoords?.longitude
    );

    // Automatically fit map view boundary around pickup & delivery markers on open
    const handleReCenter = () => {
        if (hasCoords && mapRef.current && pickupCoords && deliveryCoords) {
            mapRef.current.fitToCoordinates([pickupCoords, deliveryCoords], {
                edgePadding: { top: 80, right: 50, bottom: 80, left: 50 },
                animated: true,
            });
        }
    };

    useEffect(() => {
        if (visible && hasCoords) {
            // Delay slightly to allow MapView layout instantiation
            setTimeout(handleReCenter, 500);
        }
    }, [visible, hasCoords]);

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            {/* Semi-transparent Backdrop Overlay */}
            <View style={styles.backdrop}>

                {/* Bottom Sheet Modal Panel */}
                <View style={styles.modalSheet}>

                    {/* Header Panel */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <View style={styles.iconContainer}>
                                <Navigation size={ICON_SIZE.sm} color={COLORS.white} />
                            </View>
                            <View>
                                <Text style={styles.title}>Route Map</Text>
                                <Text style={styles.subtitle}>Full route shown</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onClose}
                            activeOpacity={0.7}
                        >
                            <X size={ICON_SIZE.sm} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Route Navigation Subbar */}
                    <View style={styles.routeBar}>
                        <View style={styles.routePoint}>
                            <View style={[styles.dot, { backgroundColor: COLORS.goldPrimary }]} />
                            <Text numberOfLines={1} style={styles.routeText}>
                                {pickupLocation}
                            </Text>
                        </View>
                        <Text style={styles.routeArrow}>→</Text>
                        <View style={styles.routePoint}>
                            <View style={[styles.dot, { backgroundColor: COLORS.success }]} />
                            <Text numberOfLines={1} style={styles.routeText}>
                                {deliveryLocation}
                            </Text>
                        </View>
                    </View>

                    {/* Map Area */}
                    <View style={styles.mapContainer}>
                        {hasCoords ? (
                            <MapView
                                ref={mapRef}
                                provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined} // Uses Google on Android, Apple on iOS                style={styles.map}
                                initialRegion={{
                                    latitude: pickupCoords!.latitude,
                                    longitude: pickupCoords!.longitude,
                                    latitudeDelta: 10,
                                    longitudeDelta: 10,
                                }}
                            >
                                {/* Pickup Marker */}
                                <Marker coordinate={pickupCoords!} title="Pickup Location" />

                                {/* Delivery Marker */}
                                <Marker coordinate={deliveryCoords!} title="Delivery Location" />

                                {/* Optional Driver Location Pointer */}
                                {driverCoords?.latitude && (
                                    <Marker coordinate={driverCoords} title="Your Location">
                                        <View style={styles.customDriverMarker}>
                                            <Text style={styles.customDriverText}>You</Text>
                                        </View>
                                    </Marker>
                                )}

                                {/* Route Line Drawing */}
                                <Polyline
                                    coordinates={[pickupCoords!, deliveryCoords!]}
                                    strokeColor={COLORS.goldPrimary}
                                    strokeWidth={3}
                                />
                            </MapView>
                        ) : (
                            // Empty Map Placeholder View if Coordinates Fail
                            <View style={[styles.map, styles.fallbackMapBg]} />
                        )}

                        {/* Error Notification Banner (Triggers dynamically if no coords exist) */}
                        {!hasCoords && (
                            <View style={styles.alertBanner}>
                                <AlertTriangle size={ICON_SIZE.sm} color={COLORS.goldDarkText} />
                                <Text style={styles.alertText}>
                                    Route could not load. Coordinates may be missing.
                                </Text>
                            </View>
                        )}

                        {/* Float overlay Action Re-Center Button */}
                        {hasCoords && (
                            <TouchableOpacity
                                style={styles.reCenterButton}
                                activeOpacity={0.85}
                                onPress={handleReCenter}
                            >
                                <Compass size={ICON_SIZE.xs} color={COLORS.white} />
                                <Text style={styles.reCenterText}>Re-center</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: COLORS.overlay,
        justifyContent: 'flex-end', // Pushes the sheet down to bottom
    },
    modalSheet: {
        width: '100%',
        height: '90%', // Leaves a professional gap displaying the parent screen on top
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: RADIUS.xl,
        borderTopRightRadius: RADIUS.xl,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.divider,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    iconContainer: {
        backgroundColor: COLORS.goldPrimary,
        padding: SPACING.sm,
        borderRadius: RADIUS.sm,
    },
    title: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZE.lg,
        color: COLORS.textPrimary,
    },
    subtitle: {
        fontFamily: FONTS.regular,
        fontSize: FONT_SIZE.xs,
        color: COLORS.textSecondary,
        marginTop: 1,
    },
    closeButton: {
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: SPACING.sm,
        borderRadius: RADIUS.sm,
        backgroundColor: COLORS.surface,
    },
    routeBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.goldLightBg,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.goldBorder,
    },
    routePoint: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: RADIUS.round,
    },
    routeText: {
        fontFamily: FONTS.semiBold,
        fontSize: FONT_SIZE.sm,
        color: COLORS.textPrimary,
        flex: 1,
    },
    routeArrow: {
        fontFamily: FONTS.medium,
        color: COLORS.textLight,
        marginHorizontal: SPACING.md,
    },
    mapContainer: {
        flex: 1,
        position: 'relative',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    fallbackMapBg: {
        backgroundColor: '#EAE8E4', // Clean background color placeholder when map coordinates fail
    },
    alertBanner: {
        position: 'absolute',
        top: SPACING.md,
        left: SPACING.md,
        right: SPACING.md,
        backgroundColor: COLORS.goldLightBg,
        borderColor: COLORS.goldBorder,
        borderWidth: 1,
        borderRadius: RADIUS.sm,
        padding: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        zIndex: 10,
    },
    alertText: {
        fontFamily: FONTS.medium,
        fontSize: FONT_SIZE.sm,
        color: COLORS.goldDarkText,
        flex: 1,
    },
    reCenterButton: {
        position: 'absolute',
        top: SPACING.md,
        left: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.goldPrimary,
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        borderRadius: RADIUS.sm,
        gap: SPACING.xs,
        zIndex: 9,
    },
    reCenterText: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZE.sm,
        color: COLORS.white,
    },
    customDriverMarker: {
        backgroundColor: '#2563EB',
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.sm,
        borderRadius: RADIUS.xs,
        borderWidth: 1,
        borderColor: COLORS.white,
    },
    customDriverText: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZE.xs,
        color: COLORS.white,
    },
});