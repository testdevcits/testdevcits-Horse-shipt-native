import React from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { AppHeader, AppText, Input, Button } from '../../../../../components';
import { COLORS } from '../../../../../constants';
import styles from './styles.googlereview';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import useGoogleLink from './useGoogleLink';

const GoogleReviewScreen = () => {
  const {
    loading,
    initialLoading,
    handleInputChange,
    handleSubmit,
    handleOpenLink,
    handleCopyLink,
    isConnected,
    savedLink,
    googleReviewLink,
    error,
  } = useGoogleLink();

  return (
    <View style={styles.container}>
      <AppHeader title="Google review" showProfileImage={false} />

      {initialLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <AppText style={styles.loadingText}>
            Loading Google Review details...
          </AppText>
        </View>
      ) : (
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
                    isConnected
                      ? styles.badgeConnectedBg
                      : styles.badgeNotConnectedBg,
                  ]}
                >
                  <AppIcon
                    name={isConnected ? 'CheckCircle2' : 'AlertCircle'}
                    size={14}
                    color={isConnected ? COLORS.greenSuccess : COLORS.warning}
                  />
                  <AppText
                    style={[
                      styles.statusBadgeText,
                      isConnected
                        ? styles.badgeConnectedText
                        : styles.badgeNotConnectedText,
                    ]}
                  >
                    {isConnected ? 'Connected' : 'Not Connected'}
                  </AppText>
                </View>
              </View>

              <AppText style={styles.cardSub}>
                Connect your Google Business review link so horse owners can
                quickly verify your reputation before choosing you for
                transport.
              </AppText>

              {/* Active Link Preview Box if Connected */}
              {isConnected && (
                <View style={styles.activePreviewCard}>
                  <View style={styles.activePreviewHeader}>
                    <AppText style={styles.activePreviewTitle}>
                      Active Review Link
                    </AppText>
                  </View>

                  <AppText
                    style={styles.activeUrlText}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {savedLink}
                  </AppText>

                  <View style={styles.activePreviewActions}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={handleOpenLink}
                      activeOpacity={0.7}
                    >
                      <AppIcon
                        name="ExternalLink"
                        size={14}
                        color={COLORS.textPrimary}
                      />
                      <AppText style={styles.actionBtnText}>Test Link</AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={handleCopyLink}
                      activeOpacity={0.7}
                    >
                      <AppIcon
                        name="Copy"
                        size={14}
                        color={COLORS.textPrimary}
                      />
                      <AppText style={styles.actionBtnText}>Copy Link</AppText>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Info Callout Box */}
              <View style={styles.infoCalloutBox}>
                <View style={styles.infoIconBox}>
                  <AppIcon name="Info" size={18} color={COLORS.saddleBrown} />
                </View>
                <AppText style={styles.infoCalloutText}>
                  Add the direct Google review or Google Maps business link you
                  want customers to visit. This link appears on your public
                  shipper profile.
                </AppText>
              </View>
            </View>

            {/* Form Input Section */}
            <View style={styles.formSection}>
              <AppText style={styles.inputTitle}>
                {isConnected ? 'Update Review Link' : 'Add Review Link'}
              </AppText>

              <Input
                label="Your Google Review Link"
                placeholder="https://www.google.com/maps/place..."
                value={googleReviewLink}
                onChangeText={handleInputChange}
                error={error}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                leftIcon={
                  <AppIcon name="Link" size={20} color={COLORS.saddleBrown} />
                }
                rightIcon={
                  googleReviewLink ? (
                    <AppIcon
                      name="ExternalLink"
                      size={18}
                      color={COLORS.primary}
                    />
                  ) : undefined
                }
                onRightIconPress={googleReviewLink ? handleOpenLink : undefined}
              />

              <Button
                title={isConnected ? 'Update Link' : 'Add Link'}
                isLoading={loading}
                onPress={handleSubmit}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

export default GoogleReviewScreen;
