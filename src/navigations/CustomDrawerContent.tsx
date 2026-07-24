import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ImageSourcePropType,
} from 'react-native';
import {
    DrawerContentScrollView,
    DrawerContentComponentProps,
} from '@react-navigation/drawer';

// Import your constants
import { COLORS } from '../constants/colors';
import { SPACING, FONT_SIZE, ICON_SIZE } from '../constants/dimensions';
import { FONTS } from '../constants/fonts';
import imageIndex from '../assets/images/imageIndex';
import { AppText } from '../components';

/**
 * Props for our internal Menu Item component
 * Changed icon type to ImageSourcePropType for PNGs
 */
interface DrawerMenuItemProps {
    label: string;
    iconSource: ImageSourcePropType;
    onPress: () => void;
    isLast?: boolean;
}

const DrawerMenuItem: React.FC<DrawerMenuItemProps> = ({
    label,
    iconSource,
    onPress,
    isLast,
}) => (
    <TouchableOpacity
        style={[styles.menuItem, isLast ? { marginBottom: 0 } : null]}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View style={styles.iconContainer}>
            <Image
                source={iconSource}
                style={styles.menuIcon}
                resizeMode="contain"
            />
        </View>
        <AppText style={styles.menuLabel}>{label}</AppText>
    </TouchableOpacity>
);

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
    const { navigation } = props;

    return (
        <View style={styles.safeArea}>
            {/* Header Section with Logo */}
            <View style={styles.headerContainer}>
                <Image
                    source={imageIndex.LogoIcon}
                    style={styles.logoIcon}
                    resizeMode="contain"
                />
                <AppText style={styles.logoText}>HorseShipt</AppText>
            </View>

            <DrawerContentScrollView
                {...props}
                contentContainerStyle={styles.drawerScroll}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.menuContainer}>
                    <DrawerMenuItem
                        label="Home"
                        iconSource={imageIndex.Drawer_Home}
                        onPress={() => navigation.navigate('Home')}
                    />
                    <DrawerMenuItem
                        label="Shipping"
                        iconSource={imageIndex.Shipping}
                        onPress={() => navigation.navigate('New')}
                    />
                    <DrawerMenuItem
                        label="My Shipments"
                        iconSource={imageIndex.Drawer_Shipments}
                        onPress={() => navigation.navigate('Shipments')}
                    />
                    <DrawerMenuItem
                        label="Chat"
                        iconSource={imageIndex.Messages}
                        onPress={() => navigation.navigate('Chats')}
                    />
                    <DrawerMenuItem
                        label="Help Center"
                        iconSource={imageIndex.Help}
                        onPress={() => {
                            /* Handle Help action */
                        }}
                        isLast={true}
                    />
                </View>
            </DrawerContentScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderTopRightRadius:20,
        borderBottomRightRadius:20
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING.xxxl, 
        paddingBottom: SPACING.xxl,
    },
    logoIcon: {
        width: 40,
        height: 40,
        marginRight: SPACING.sm,
    },
    logoText: {
        fontSize: FONT_SIZE.title,
        fontFamily: FONTS.bold,
        color: COLORS.textPrimary,
        letterSpacing: -0.5,
    },
    drawerScroll: {
        paddingTop: 0,
    },
    menuContainer: {
        paddingHorizontal: SPACING.sm,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.xs,

        paddingHorizontal: SPACING.md,
        marginBottom: SPACING.xs,
    },
    iconContainer: {
        width: 32, // Fixed width to keep labels perfectly aligned
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuIcon: {
        width: ICON_SIZE.md,
        height: ICON_SIZE.md,
        // Optional: If your PNGs are monochrome and you want to match text color:
        // tintColor: COLORS.textPrimary 
    },
    menuLabel: {
        fontSize: FONT_SIZE.lg,
        fontFamily: FONTS.medium,
        color: COLORS.textPrimary,
        marginLeft: SPACING.md,
    },
});

export default CustomDrawerContent;