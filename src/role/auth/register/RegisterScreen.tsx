import React from 'react';
import {
    StyleSheet,
    View,
    ImageBackground,
    TouchableOpacity,
    StatusBar,
    Image,
    ScrollView,
    Platform,
} from 'react-native';
import { Apple } from 'lucide-react-native'; // Standard icons
import { COLORS, FONTS, RADIUS, SPACING, SCREEN_HEIGHT, SCREEN_WIDTH, FONT_SIZE, SIZES } from '../../../constants';
import { AppText } from '../../../components';
import AppButton from '../../../components/common/Button/AppButton';
import imageIndex from '../../../assets/images/imageIndex';


// Local component for the Google Icon (since it's multi-colored)
const GoogleIcon = () => (
    <Image
        source={imageIndex.Google}
        style={{ width: 18, height: 18, marginRight: 10 }}
    />
);

const FacebookIcon = () => (
    <Image
        source={imageIndex.Facebook}
        style={{ width: 18, height: 18, marginRight: 10, tintColor: COLORS.white }}
    />
);

const AppleIcon = () => (
    <Image
        source={imageIndex.Apple}
        style={{ width: 18, height: 18, marginRight: 10, tintColor: COLORS.white }}
    />
);

const RegisterScreen = ({ navigation }: any) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* 1. Top Image Section */}
            <ImageBackground
                source={imageIndex.HorseBg}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <View style={styles.overlay} />
            </ImageBackground>

            {/* 2. Content Card (Overlapping) */}
            <View style={styles.contentCard}>

                {/* 3. Circular Logo Seal */}
                {/* <View style={styles.logoOuterRing}>
                    <View style={styles.logoInnerRing}>
                        <Image
                            source={imageIndex.LogoIcon}
                            style={styles.logoIcon}
                            resizeMode="contain"
                        />
                    </View>
                </View> */}

                <Image
                    source={imageIndex.Logo}
                    style={styles.logoIcon}
                    resizeMode="contain"
                />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.textSection}>
                        <AppText style={styles.title}>Create new account</AppText>
                        <AppText style={styles.description}>
                            Create your free SAM Global account to shop smarter, track orders, and enjoy a seamless buying experience.
                        </AppText>
                    </View>

                    {/* 4. Action Buttons */}
                    <View style={styles.buttonContainer}>
                        <AppButton
                            title="Create an account"
                            buttonStyle={styles.primaryBtn}
                            onPress={() => navigation.navigate('SignupFlowScreen')}
                        />

                        <View style={styles.dividerRow}>
                            <AppText style={styles.dividerText}>Or</AppText>
                        </View>

                        {/* Social Logins */}
                        {
                            Platform.OS === "ios" &&
                            <AppButton
                                title="Continue with Apple"
                                leftIcon={<AppleIcon />}
                                buttonStyle={styles.appleBtn}
                                textStyle={styles.whiteBtnText}
                            />
                        }


                        <AppButton
                            title="Continue with Google"
                            leftIcon={<GoogleIcon />}
                            buttonStyle={styles.googleBtn}
                            textStyle={styles.darkBtnText}
                        />

                        <AppButton
                            title="Continue with Facebook"
                            leftIcon={<FacebookIcon />}
                            buttonStyle={styles.facebookBtn}
                            textStyle={styles.whiteBtnText}
                        />
                    </View>

                    {/* 5. Footer Link */}
                    <TouchableOpacity
                        style={styles.loginRow}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <AppText style={styles.loginText}>
                            Already have an account? <AppText style={styles.loginLink}>Login</AppText>
                        </AppText>
                    </TouchableOpacity>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black,
    },
    backgroundImage: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT * 0.40, // Slightly shorter than welcome to fit more buttons
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.15)',
    },
    contentCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        marginTop: -RADIUS.xl * 2,
        borderTopLeftRadius: RADIUS.xl * 1.5,
        borderTopRightRadius: RADIUS.xl * 1.5,
        paddingHorizontal: SPACING.xxl,
    },
    logoOuterRing: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(163, 127, 61, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: -50,
        borderWidth: 1,
        borderColor: COLORS.goldBorder,
    },
    logoInnerRing: {
        width: 84,
        height: 84,
        borderRadius: 42,
        backgroundColor: COLORS.goldLightBg,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    logoIcon: {
        width: 100,
        height: 100,
        marginTop: -50, alignSelf: "center"
    },
    scrollContent: {
        paddingTop: SPACING.xl,
    },
    textSection: {
        gap: SPACING.sm,
    },
    title: {
        fontSize: FONT_SIZE.display,
        fontFamily: FONTS.bold,
        color: COLORS.textPrimary,
    },
    description: {
        fontSize: FONT_SIZE.md,
        fontFamily: FONTS.medium,
        color: COLORS.textPrimary,
        lineHeight: SPACING.xl,
        paddingHorizontal: SPACING.sm,
    },
    buttonContainer: {
        marginTop: SPACING.xl,
        gap: SPACING.md,
    },
    primaryBtn: {
        backgroundColor: COLORS.primary,
        height: 54,
        borderRadius: RADIUS.md,
    },
    dividerRow: {
        alignItems: 'center',
        marginVertical: SPACING.sm,
    },
    dividerText: {
        color: COLORS.grey600,
        fontFamily: FONTS.medium,
        fontSize: FONT_SIZE.lg,
    },
    // Social Button Styles
    appleBtn: {
        backgroundColor: '#1F2937', // Dark navy/black
        height: 52,
        borderRadius: RADIUS.round,
    },
    googleBtn: {
        backgroundColor: '#F3F4F6', // Light gray
        height: 52,
        borderRadius: RADIUS.round,
        borderWidth: 1,
        borderColor: COLORS.divider,
    },
    facebookBtn: {
        backgroundColor: '#3B5998', // Facebook Blue
        height: 52,
        borderRadius: RADIUS.round,
    },
    whiteBtnText: {
        color: COLORS.white,
    },
    darkBtnText: {
        color: COLORS.textPrimary,
    },
    loginRow: {
        alignItems: 'center',
        marginTop: SPACING.xl,
    },
    loginText: {
        fontSize: FONT_SIZE.md,
        color: COLORS.grey600,
        fontFamily: FONTS.regular,
    },
    loginLink: {
        color: COLORS.primary,
        fontFamily: FONTS.semiBold,
    },
});

export default RegisterScreen;