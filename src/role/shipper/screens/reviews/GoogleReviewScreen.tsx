import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Link, Info, ExternalLink } from 'lucide-react-native';
import { AppHeader, AppText } from '../../../../components';
import { COLORS, FONTS, SPACING, RADIUS, FONT_SIZE } from '../../../../constants';
import shipperService from '../../../../api/services/shipperService';
import styles from './styles.googlereview';

const GoogleReviewScreen = () => {
  const [googleReviewLink, setGoogleReviewLink] = useState('');
  const [loading, setLoading] = useState(false);

  const isConnected = Boolean(googleReviewLink && googleReviewLink.trim().length > 0);

  const handleSubmit = async () => {
    if (!googleReviewLink.trim()) {
      Alert.alert('Validation Error', 'Please enter a valid Google Review URL.');
      return;
    }

    if (
      !googleReviewLink.toLowerCase().includes('google.com') &&
      !googleReviewLink.toLowerCase().includes('goo.gl') &&
      !googleReviewLink.toLowerCase().includes('maps')
    ) {
      Alert.alert(
        'Warning',
        'Please make sure this is a valid Google Maps or Google Business link.',
      );
    }

    setLoading(true);
    try {
      const res = await shipperService.updateGoogleReviewLink(googleReviewLink.trim());
      if (res?.success || res?.data) {
        Alert.alert('Success', res?.message || 'Google Review link updated successfully.');
      } else {
        Alert.alert('Error', res?.message || 'Failed to update Google Review link.');
      }
    } catch (error: any) {
      console.error('Update Google Review Link Error:', error);
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to update Google Review link.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenLink = () => {
    if (googleReviewLink) {
      Linking.openURL(googleReviewLink);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Google review" showNotificationBell />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Info Card */}
          <View style={styles.card}>
            {/* Header Status Badge Row */}
            <View style={styles.cardHeaderRow}>
              <AppText style={styles.cardTitle}>Google Review Link</AppText>
              <View
                style={[
                  styles.statusBadge,
                  isConnected ? styles.badgeConnectedBg : styles.badgeNotConnectedBg,
                ]}
              >
                <AppText
                  style={[
                    styles.statusBadgeText,
                    isConnected ? styles.badgeConnectedText : styles.badgeNotConnectedText,
                  ]}
                >
                  {isConnected ? 'Connected' : 'Not Connected'}
                </AppText>
              </View>
            </View>

            <AppText style={styles.cardSub}>
              Connect your Google Business review link so horse owners can quickly verify your
              reputation before choosing you for transport.
            </AppText>

            {/* Info Callout Box */}
            <View style={styles.infoCalloutBox}>
              <View style={styles.infoIconBox}>
                <Info size={18} color="#A06333" />
              </View>
              <AppText style={styles.infoCalloutText}>
                Add the direct Google review or Google Maps business link you want customers to visit.
                This link appears on your public shipper profile.
              </AppText>
            </View>
          </View>

          {/* Form Input Section */}
          <View style={styles.formSection}>
            <AppText style={styles.inputTitle}>Your Google Review Link</AppText>

            <View style={styles.inputContainer}>
              <Link size={20} color="#A06333" style={styles.linkIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="https://www.google.com/maps/place..."
                placeholderTextColor={COLORS.textLight}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                value={googleReviewLink}
                onChangeText={setGoogleReviewLink}
              />
              {isConnected && (
                <TouchableOpacity onPress={handleOpenLink} style={styles.openBtn}>
                  <ExternalLink size={18} color={COLORS.goldPrimary} />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <AppText style={styles.submitBtnText}>
                  {isConnected ? 'Update Link' : 'Add Link'}
                </AppText>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default GoogleReviewScreen;
