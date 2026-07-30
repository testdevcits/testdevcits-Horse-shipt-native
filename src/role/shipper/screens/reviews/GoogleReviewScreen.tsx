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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },

  // Main Card
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#EEDCBD',
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  cardTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.round || 999,
    borderWidth: 1,
  },
  badgeNotConnectedBg: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  badgeNotConnectedText: {
    color: '#D97706',
    fontFamily: FONTS.bold,
    fontSize: 11,
  },
  badgeConnectedBg: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  badgeConnectedText: {
    color: '#059669',
    fontFamily: FONTS.bold,
    fontSize: 11,
  },
  cardSub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SPACING.md,
  },

  // Info Callout Box
  infoCalloutBox: {
    flexDirection: 'row',
    backgroundColor: '#FDF8F0',
    borderWidth: 1,
    borderColor: '#EEDCBD',
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    gap: SPACING.sm,
    alignItems: 'flex-start',
  },
  infoIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCalloutText: {
    flex: 1,
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    lineHeight: 18,
  },

  // Form Section
  formSection: {
    marginTop: SPACING.xs,
  },
  inputTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: 2,
    marginBottom: SPACING.md,
  },
  linkIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
  },
  openBtn: {
    padding: 6,
  },
  submitBtn: {
    backgroundColor: '#A06333',
    paddingVertical: 14,
    borderRadius: RADIUS.xs,
    alignItems: 'center',
    width: 140,
  },
  submitBtnText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
  },
});

export default GoogleReviewScreen;
