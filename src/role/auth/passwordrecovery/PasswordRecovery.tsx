import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, ScrollView, Image, ImageBackground, StatusBar, Keyboard, TouchableOpacity } from 'react-native';
import { Mail, ChevronLeft } from 'lucide-react-native';
import { COLORS, SCREEN_HEIGHT } from '../../../constants';
import { AppText, Button, Input, } from '../../../components';
import imageIndex from '../../../assets/images/imageIndex';
import styles from './recovery.styles';
import authService from '../../../api/services/authService';
import Toast from 'react-native-toast-message';

const PasswordRecovery = ({ navigation }: any) => {
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isNotRobot, setIsNotRobot] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const show = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardOpen(true));
        const hide = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardOpen(false));
        return () => { show.remove(); hide.remove(); };
    }, []);

    const handleSendLink = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);

        try {
            // Assuming role comes from a global constant or prop, e.g., 'customer'
            const res = await authService.forgotPassword(email, 'customer');

            if (res.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Email Sent',
                    text2: 'Please check your inbox for reset instructions.'
                });
                // Navigate to a success screen or back to Login
                navigation.navigate('VerifyOtp');
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Something went wrong');
            // Toast.show({
            //     type: 'error',
            //     text1: 'Error',
            //     text2: 'Unable to send recovery email.'
            // });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <ImageBackground
                source={imageIndex.HorseBg}
                style={[styles.headerImage, { height: isKeyboardOpen ? SCREEN_HEIGHT * 0.15 : SCREEN_HEIGHT * 0.45 }]}
                resizeMode="cover"
            >
                <View style={styles.overlay} />
                <TouchableOpacity style={{ padding: 20, marginTop: 40 }} onPress={() => navigation.goBack()}>
                    <ChevronLeft color="white" size={30} />
                </TouchableOpacity>
            </ImageBackground>

            <KeyboardAvoidingView style={styles.keyboardView} behavior="padding">
                <View style={styles.contentCard}>

                    <Image source={imageIndex.Logo} style={styles.logoIcon} />


                    <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                        <View style={styles.textHeader}>
                            <AppText style={styles.title}>Password Recovery</AppText>
                            <AppText style={styles.subtitle}>Forgot your password? Enter your email and we'll send you a secure reset link.</AppText>
                        </View>

                        <Input
                            label="Email Address"
                            placeholder="antestmail@123.com"
                            value={email}
                            onChangeText={(t) => { setEmail(t); setError(''); }}
                            error={error}
                            leftIcon={<Mail size={20} color={COLORS.textSecondary} />}
                        />

                        <TouchableOpacity
                            style={styles.captchaContainer}
                            onPress={() => setIsNotRobot(!isNotRobot)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.captchaLeft}>
                                <View style={[styles.checkbox, isNotRobot && styles.checkboxActive]}>
                                    {isNotRobot && <View style={styles.checkInner} />}
                                </View>
                                <AppText style={styles.captchaText}>I'm not a robot</AppText>
                            </View>
                            <Image source={{ uri: 'https://www.gstatic.com/recaptcha/api2/logo_48.png' }} style={styles.recaptchaLogo} />
                        </TouchableOpacity>

                        <Button title="Send Reset Link" isLoading={isLoading} onPress={handleSendLink} buttonStyle={styles.submitBtn} />
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

export default PasswordRecovery;