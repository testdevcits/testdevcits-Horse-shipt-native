import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Link, Info, ExternalLink } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { AppHeader, AppText, Input, Button } from '../../../../components';
import { COLORS } from '../../../../constants';
import shipperService from '../../../../api/services/shipperService';
import styles from './styles.googlereview';

const GoogleReviewScreen = () => {
  const [googleReviewLink, setGoogleReviewLink] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isConnected = Boolean(googleReviewLink && googleReviewLink.trim().length > 0);

  const handleInputChange = (text: string) => {
    setGoogleReviewLink(text);
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async () => {
    const trimmed = googleReviewLink.trim();

    if (!trimmed) {
      setError('Please enter a valid Google Review URL.');
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter a valid Google Review URL.',
      });
      return;
    }

    const lower = trimmed.toLowerCase();
    if (
      !lower.includes('google.com') &&
      !lower.includes('goo.gl') &&
      !lower.includes('maps') &&
      !lower.includes('g.page')
    ) {
      setError('Please make sure this is a valid Google Maps or Google Business link.');
      Toast.show({
        type: 'error',
        text1: 'Invalid Link',
        text2: 'Please make sure this is a valid Google Maps or Google Business link.',
      });
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await shipperService.updateGoogleReviewLink(trimmed);
      if (res?.success || res?.data) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: res?.message || 'Google Review link updated successfully.',
        });
      } else {
        const msg = res?.message || 'Failed to update Google Review link.';
        setError(msg);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: msg,
        });
      }
    } catch (err: any) {
      console.error('Update Google Review Link Error:', err);
      const msg = err?.response?.data?.message || 'Failed to update Google Review link.';
      setError(msg);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: msg,
      });
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
      <AppHeader title="Google review" />

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
            <Input
              label="Your Google Review Link"
              placeholder="https://www.google.com/maps/place..."
              value={googleReviewLink}
              onChangeText={handleInputChange}
              error={error}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              leftIcon={<Link size={20} color="#A06333" />}
              rightIcon={
                isConnected ? (
                  <ExternalLink size={18} color={COLORS.primary} />
                ) : undefined
              }
              onRightIconPress={isConnected ? handleOpenLink : undefined}
            />

            <Button
              title={isConnected ? 'Update Link' : 'Add Link'}
              isLoading={loading}
              onPress={handleSubmit}
              buttonStyle={styles.submitBtn}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default GoogleReviewScreen;
