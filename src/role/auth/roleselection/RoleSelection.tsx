import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    ImageBackground,
    TouchableOpacity,
    StatusBar,
    Image,
    ScrollView,
} from 'react-native';
import { User, Building2, Truck, ChevronRight } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 1. Import AsyncStorage
import { COLORS, FONTS, RADIUS, SPACING, SCREEN_HEIGHT, SCREEN_WIDTH, FONT_SIZE } from '../../../constants';
import { AppText } from '../../../components';
import AppButton from '../../../components/common/Button/AppButton';
import imageIndex from '../../../assets/images/imageIndex';
import Toast from 'react-native-toast-message'; // Optional but recommended for professional apps

type UserRole = 'customer' | 'shipper' | 'driver';

const RoleSelection = ({ navigation }: any) => {
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const [isStoring, setIsStoring] = useState(false); // Add a small loading state for storage action

    useEffect(() => {
        const loadSavedRole = async () => {
            try {
                const savedRole = await AsyncStorage.getItem('@user_role');
                if (savedRole && (savedRole === 'customer' || savedRole === 'shipper' || savedRole === 'driver')) {
                    setSelectedRole(savedRole as UserRole);
                }
            } catch (error) {
                console.error('Error loading saved role:', error);
            }
        };
        loadSavedRole();
    }, []);

    // 2. Updated handleContinue with AsyncStorage Logic
    const handleContinue = async () => {
        if (!selectedRole) return;

        setIsStoring(true);
        try {
            // Store the role with the specific key requested
            await AsyncStorage.setItem('@user_role', selectedRole);

            // Navigate to the SignupFlow passing the role
            navigation.replace('Welcome', { role: selectedRole });
        } catch (error) {
            console.error('Error storing user role:', error);
            Toast.show({
                type: 'error',
                text1: 'Storage Error',
                text2: 'Could not save your preference. Please try again.'
            });
        } finally {
            setIsStoring(false);
        }
    };

    const RoleCard = ({
        role,
        title,
        desc,
        Icon
    }: {
        role: UserRole,
        title: string,
        desc: string,
        Icon: any
    }) => {
        const isSelected = selectedRole === role;

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setSelectedRole(role)}
                style={[
                    styles.roleCard,
                    isSelected && styles.roleCardActive
                ]}
            >
                <View style={[styles.iconBox, isSelected && styles.iconBoxActive]}>
                    <Icon
                        size={20}
                        color={isSelected ? COLORS.white : COLORS.goldPrimary}
                        strokeWidth={2}
                    />
                </View>

                <View style={styles.roleTextContainer}>
                    <AppText style={[styles.roleTitle, isSelected && styles.textWhite]}>
                        {title}
                    </AppText>
                    <AppText style={[styles.roleDesc, isSelected && styles.textLightGold]}>
                        {desc}
                    </AppText>
                </View>

                <View style={[styles.radioCircle, isSelected && styles.radioActive]}>
                    {isSelected && <View style={styles.radioInner} />}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <ImageBackground
                source={imageIndex.HorseBg}
                style={styles.headerImage}
                resizeMode="cover"
            >
                <View style={styles.overlay} />
            </ImageBackground>

            <View style={styles.contentCard}>


                <Image source={imageIndex.Logo} style={styles.logoIcon} resizeMode="contain" />


                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.headerTextSection}>
                        <AppText style={styles.title}>Join the Network</AppText>
                        <AppText style={styles.subtitle}>
                            Select your profile type to get started with HorseShipt transportation services.
                        </AppText>
                    </View>

                    <View style={styles.cardsContainer}>
                        <RoleCard
                            role="customer"
                            title="Customer"
                            desc="I want to ship my horses"
                            Icon={User}
                        />
                        <RoleCard
                            role="shipper"
                            title="Shipper"
                            desc="I run a transport company"
                            Icon={Building2}
                        />
                        <RoleCard
                            role="driver"
                            title="Driver"
                            desc="I am an individual transporter"
                            Icon={Truck}
                        />
                    </View>

                    <AppButton
                        title="Continue"
                        disabled={!selectedRole}
                        isLoading={isStoring} // Show loading spinner while storing
                        onPress={handleContinue}
                        buttonStyle={styles.continueBtn}
                        rightIcon={<ChevronRight color="white" size={18} />}
                    />
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.black },
    headerImage: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.28 },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)' },

    contentCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        marginTop: -RADIUS.xl,
        borderTopLeftRadius: RADIUS.xl,
        borderTopRightRadius: RADIUS.xl,
        paddingHorizontal: SPACING.lg,
    },

    // Logo Styles
    logoIcon: { width: 80, height: 80, marginTop: -32, alignSelf: "center" },

    scrollContent: { paddingTop: SPACING.md, paddingBottom: 40 },
    headerTextSection: { alignItems: 'center', marginBottom: SPACING.lg },
    title: { fontSize: FONT_SIZE.heading, fontFamily: FONTS.bold, color: COLORS.textPrimary },
    subtitle: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.medium, color: COLORS.textSecondary, textAlign: 'center', marginTop: 4, paddingHorizontal: 12 },

    // Card Styles
    cardsContainer: { gap: SPACING.sm, marginBottom: SPACING.lg },
    roleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        borderWidth: 1.5,
        borderColor: COLORS.divider,
        backgroundColor: COLORS.white,
    },
    roleCardActive: {
        backgroundColor: COLORS.goldPrimary,
        borderColor: COLORS.goldPrimary,
        // Premium Shadow for active card
        shadowColor: COLORS.goldPrimary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    iconBox: {
        width: 42, height: 42, borderRadius: RADIUS.sm,
        backgroundColor: COLORS.goldLightBg,
        justifyContent: 'center', alignItems: 'center',
    },
    iconBoxActive: { backgroundColor: 'rgba(255,255,255,0.2)' },
    roleTextContainer: { flex: 1, marginLeft: SPACING.md },
    roleTitle: { fontSize: FONT_SIZE.md, fontFamily: FONTS.bold, color: COLORS.textPrimary },
    roleDesc: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.medium, color: COLORS.textSecondary, marginTop: 2 },

    // Custom Radio UI
    radioCircle: {
        width: 20, height: 20, borderRadius: 10,
        borderWidth: 2, borderColor: COLORS.divider,
        justifyContent: 'center', alignItems: 'center',
    },
    radioActive: { borderColor: COLORS.white },
    radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.white },

    textWhite: { color: COLORS.white },
    textLightGold: { color: COLORS.goldLightBg },

    continueBtn: {
        backgroundColor: COLORS.goldPrimary,
        height: 48,
        borderRadius: RADIUS.md,
        shadowColor: COLORS.goldPrimary,
        shadowOpacity: 0.25, shadowRadius: 8, elevation: 4
    },

    footer: { marginTop: SPACING.lg, alignItems: 'center' },
    footerText: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, fontFamily: FONTS.medium },
    contactLink: { color: COLORS.goldPrimary, fontFamily: FONTS.bold },
});

export default RoleSelection;