import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    Platform,
    ViewStyle,
    StyleProp,

} from 'react-native';
import { COLORS, FONTS } from '../../constants'; // Adjust relative path as needed
import AppText from './AppText';

// Header color palette mapped to match your beige/gold driver aesthetic
const HEADER_COLORS = {
    goldPrimary: '#A37F3D',
    goldLightBg: '#FAF6EE',
    goldBorder: '#DCCEB2',
    goldDarkText: '#5C441E',
    greenIndicator: '#10B981',
    background: '#FAF6EE', // Pale beige header background matching screenshot
};

interface DriverHeaderProps {
    name: string;             // Driver's name (e.g., "Test Driver")
    statusText?: string;      // Status text (e.g., "ON TRIP")
    profileImageUrl?: string | null;
    isOnline?: boolean;       // Toggles the green connection status dot
    rightComponent?: React.ReactNode; // Optional slot for notifications/settings icon
    containerStyle?: StyleProp<ViewStyle>;
}

const DriverHeader: React.FC<DriverHeaderProps> = ({
    name,
    statusText = 'ON TRIP',
    profileImageUrl,
    isOnline = true,
    rightComponent,
    containerStyle,
}) => {
    // Extract initial for monogram box
    const firstLetter = name ? name.trim().charAt(0).toUpperCase() : 'D';

    const getAvatarUri = (img: any): string | null => {
        if (!img) return null;
        if (typeof img === 'string' && img.trim() !== '' && img !== '/default-avatar.png') {
            return img;
        }
        if (typeof img === 'object' && img.url) {
            return img.url;
        }
        return null;
    };

    const avatarUri = getAvatarUri(profileImageUrl);

    return (
        <View style={[styles.safeArea, containerStyle]}>
            <View style={styles.headerRow}>

                {/* Left Side: Avatar Box & Status Dot */}
                <View style={styles.leftContainer}>
                    <View style={styles.avatarWrapper}>
                        {avatarUri ? (
                            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
                        ) : (
                            <AppText style={styles.monogramText}>{firstLetter}</AppText>
                        )}
                    </View>

                    {/* Active green indicator dot on bottom-right corner of avatar box */}
                    {isOnline && <View style={styles.indicatorDot} />}
                </View>

                {/* Center: Name & Status Badge */}
                <View style={styles.middleContainer}>
                    <AppText style={styles.driverName} numberOfLines={1}>
                        {name || 'Driver'}
                    </AppText>

                    <View style={styles.statusBadge}>
                        <View style={styles.statusBadgeDot} />
                        <AppText style={styles.statusBadgeText}>
                            {statusText.toUpperCase()}
                        </AppText>
                    </View>
                </View>

                {/* Right Side: Action Button Slot (Optional) */}
                {rightComponent && (
                    <View style={styles.rightContainer}>
                        {rightComponent}
                    </View>
                )}

            </View>
        </View>
    );
};

export default DriverHeader;

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: HEADER_COLORS.background,
        borderBottomWidth: 1,
        borderBottomColor: HEADER_COLORS.goldBorder,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        ...Platform.select({
            android: {
                paddingTop: 16, // Extra breathing space on Android
            },
        }),
    },
    leftContainer: {
        position: 'relative',
        marginRight: 12,
    },
    avatarWrapper: {
        width: 48,
        height: 48,
        borderWidth: 1.5,
        borderColor: HEADER_COLORS.goldPrimary,
        borderRadius: 6,
        backgroundColor: HEADER_COLORS.goldLightBg,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    monogramText: {
        fontFamily: FONTS.bold,
        fontSize: 20,
        color: HEADER_COLORS.goldPrimary,
    },
    indicatorDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: HEADER_COLORS.greenIndicator,
        borderWidth: 1.5,
        borderColor: HEADER_COLORS.background,
        position: 'absolute',
        bottom: -2,
        right: -2,
        zIndex: 10,
    },
    middleContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    driverName: {
        fontFamily: FONTS.bold,
        fontSize: 16,
        color: COLORS.textPrimary,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: HEADER_COLORS.goldBorder,
        backgroundColor: HEADER_COLORS.goldLightBg,
        borderRadius: 12,
        paddingVertical: 2,
        paddingHorizontal: 8,
        marginTop: 4,
        alignSelf: 'flex-start',
    },
    statusBadgeDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: HEADER_COLORS.goldPrimary,
        marginRight: 4,
    },
    statusBadgeText: {
        fontFamily: FONTS.bold,
        fontSize: 9,
        color: HEADER_COLORS.goldDarkText,
        letterSpacing: 0.3,
    },
    rightContainer: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginLeft: 8,
    },
});