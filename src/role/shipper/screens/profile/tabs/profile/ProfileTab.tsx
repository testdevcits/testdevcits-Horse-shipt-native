import React from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { formatDate } from '../../../../../../utils/helpers';
import { AppText } from '../../../../../../components';
import { COLORS } from '../../../../../../constants';
import imageIndex from '../../../../../../assets/images/imageIndex';
import styles from './styles.profiletab';
import AppIcon from '../../../../../../components/app_icon/AppIcon';

interface Props {
  profileData: any;
  user: any;
  navigation: any;
  onEditProfile?: () => void;
  onLogout?: () => void;
}

const DEFAULT_LAT = 22.7195687;
const DEFAULT_LNG = 75.8577258;

const ProfileTab: React.FC<Props> = ({
  profileData,
  user,
  navigation,
  onEditProfile,
  onLogout,
}) => {
  const reviewsList = profileData?.reviews || [];
  const loc = profileData?.locale || {};
  const latitude =
    typeof loc?.latitude === 'number' ? loc.latitude : DEFAULT_LAT;
  const longitude =
    typeof loc?.longitude === 'number' ? loc.longitude : DEFAULT_LNG;
  const address = loc?.address || 'Location Not Set';

  return (
    <View style={styles.tabSection}>
      {/* Service Coverage Banner Card */}
      <View style={styles.coverageBannerCard}>
        <View style={styles.coverageLeft}>
          <View style={styles.coverageIconBox}>
            <AppIcon name="MapPin" size={20} color={COLORS.primary} />
          </View>
          <View style={styles.coverageTextCol}>
            <AppText style={styles.coverageTitle}>Service Areas</AppText>
            <AppText style={styles.coverageSubText}>
              Set up to 4 operating coverage zones
            </AppText>
          </View>
        </View>

        <TouchableOpacity
          style={styles.manageLocationsBtn}
          onPress={() => navigation.navigate('PreferredAreas')}
          activeOpacity={0.8}
        >
          <AppIcon name="Compass" size={14} color={COLORS.white} />
          <AppText style={styles.manageLocationsBtnText}>Manage</AppText>
        </TouchableOpacity>
      </View>

      {/* Basic Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.infoCardHeader}>
          <View style={styles.infoCardTitleRow}>
            <AppIcon name="UserCheck" size={18} color={COLORS.primary} />
            <AppText style={styles.infoCardTitle}>Basic Info</AppText>
          </View>
          <TouchableOpacity
            style={styles.iconEditBtn}
            onPress={onEditProfile}
            activeOpacity={0.7}
          >
            <AppIcon name="Pencil" size={14} color={COLORS.primary} />
            <AppText style={styles.editBtnText}>Edit</AppText>
          </TouchableOpacity>
        </View>

        {/* 1. Full Name Row */}
        <View style={styles.infoRow}>
          <View style={styles.infoIconContainer}>
            <AppIcon name="User" size={16} color={COLORS.textSecondary} />
          </View>
          <View style={styles.infoContentCol}>
            <AppText style={styles.infoLabel}>FULL NAME</AppText>
            <AppText style={styles.infoVal}>
              {profileData?.name || user?.name || 'Not Available'}
            </AppText>
          </View>
        </View>

        {/* 2. Email Address Row */}
        <View style={styles.infoRow}>
          <View style={styles.infoIconContainer}>
            <AppIcon name="Mail" size={16} color={COLORS.textSecondary} />
          </View>
          <View style={styles.infoContentCol}>
            <AppText style={styles.infoLabel}>EMAIL ADDRESS</AppText>
            <AppText style={styles.infoVal}>
              {profileData?.email || user?.email || 'Not Available'}
            </AppText>
          </View>
        </View>

        {/* 3. Account Type / Role Row */}
        <View style={styles.infoRow}>
          <View style={styles.infoIconContainer}>
            <AppIcon name="ShieldCheck" size={16} color={COLORS.primary} />
          </View>
          <View style={styles.infoContentCol}>
            <AppText style={styles.infoLabel}>ACCOUNT ROLE</AppText>
            <View style={styles.accountTypeBadge}>
              <AppText style={styles.accountTypeBadgeText}>
                Verified Shipper
              </AppText>
            </View>
          </View>
        </View>

        {/* 4. Phone Number Row */}
        <View style={styles.infoRow}>
          <View style={styles.infoIconContainer}>
            <AppIcon name="Phone" size={16} color={COLORS.textSecondary} />
          </View>
          <View style={styles.infoContentCol}>
            <AppText style={styles.infoLabel}>PHONE NUMBER</AppText>
            <AppText style={styles.infoVal}>
              {profileData?.mobile || user?.mobile || 'Not Available'}
            </AppText>
          </View>
        </View>

        {/* 5. Description / Bio Row (if present) */}
        {profileData?.description ? (
          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <AppIcon name="FileText" size={16} color={COLORS.textSecondary} />
            </View>
            <View style={styles.infoContentCol}>
              <AppText style={styles.infoLabel}>ABOUT / BIO</AppText>
              <AppText style={styles.infoVal}>
                {profileData?.description}
              </AppText>
            </View>
          </View>
        ) : null}

        {/* 6. Operating Location & Map Card (Right above Action / Reviews) */}
        <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
          <View style={styles.infoIconContainer}>
            <AppIcon name="MapPin" size={16} color={COLORS.textSecondary} />
          </View>
          <View style={styles.infoContentCol}>
            <AppText style={styles.infoLabel}>OPERATING LOCATION</AppText>
            <AppText style={styles.infoVal} numberOfLines={2}>
              {address}
            </AppText>

            {/* Map Preview Card */}
            <View style={styles.mapContainer}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={{
                  latitude,
                  longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
              >
                <Marker coordinate={{ latitude, longitude }} />
              </MapView>
            </View>
          </View>
        </View>
      </View>

      {/* Reviews Received Section */}
      <View style={styles.reviewsSection}>
        <View style={styles.reviewsHeaderRow}>
          <View style={styles.reviewsTitleRow}>
            <AppIcon
              name="Star"
              size={18}
              color={COLORS.warning}
              fill={COLORS.warning}
            />
            <AppText style={styles.reviewsSectionTitle}>
              Reviews Received
            </AppText>
          </View>
          {reviewsList.length > 0 && (
            <View style={styles.reviewsCountBadge}>
              <AppText style={styles.reviewsCountBadgeText}>
                {reviewsList.length}{' '}
                {reviewsList.length === 1 ? 'Review' : 'Reviews'}
              </AppText>
            </View>
          )}
        </View>

        {reviewsList.length > 0 ? (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.reviewsScroll}
            >
              {reviewsList.map((rev: any, idx: number) => (
                <View key={rev?._id || idx} style={styles.reviewCard}>
                  <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <AppIcon
                        key={s}
                        name="Star"
                        size={15}
                        color={COLORS.warning}
                        fill={
                          s <= (rev?.rating || 5)
                            ? COLORS.warning
                            : 'transparent'
                        }
                      />
                    ))}
                  </View>
                  <AppText style={styles.reviewText} numberOfLines={3}>
                    "{rev?.reviewText || 'Great service and communication!'}"
                  </AppText>
                  <View style={styles.reviewerRow}>
                    <Image
                      source={
                        rev?.customerId?.profileImage?.url
                          ? { uri: rev?.customerId.profileImage.url }
                          : imageIndex?.AccountIcon
                      }
                      style={styles.reviewerAvatar}
                    />
                    <View style={{ flex: 1 }}>
                      <AppText style={styles.reviewerName} numberOfLines={1}>
                        {rev?.customerName ||
                          rev?.customerId?.name ||
                          'Customer'}
                      </AppText>
                      <AppText style={styles.reviewDate}>
                        {formatDate(rev?.createdAt || new Date(), 'MM/DD/YYYY')}
                      </AppText>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.showMoreBtn}
              onPress={() =>
                navigation?.navigate('ShipperReviews', {
                  reviews: reviewsList,
                  profileData,
                })
              }
              activeOpacity={0.8}
            >
              <AppText style={styles.showMoreBtnText}>Show all reviews</AppText>
              <AppIcon
                name="ChevronRight"
                size={14}
                color={COLORS.textPrimary}
              />
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.emptyReviewsCard}>
            <View style={styles.emptyIconCircle}>
              <AppIcon name="Star" size={24} color={COLORS.primary} />
            </View>
            <AppText style={styles.emptyReviewsTitle}>No Reviews Yet</AppText>
            <AppText style={styles.emptyReviewsSubtitle}>
              Customer ratings and reviews from completed shipments will appear
              here.
            </AppText>
          </View>
        )}
      </View>

      {/* Logout Button */}
      {onLogout && (
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={onLogout}
          activeOpacity={0.8}
        >
          <AppIcon
            name="LogOut"
            size={18}
            color={COLORS.redPrimary || COLORS.error}
          />
          <AppText style={styles.logoutBtnText}>Logout Account</AppText>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ProfileTab;
