import React from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Pencil, Star } from 'lucide-react-native';
import { formatDate } from '../../../../../utils/helpers';
import { AppText } from '../../../../../components';
import { COLORS } from '../../../../../constants';
import imageIndex from '../../../../../assets/images/imageIndex';
import styles from './styles.profiletab';

interface Props {
  profileData: any;
  user: any;
  navigation: any;
  onEditProfile?: () => void;
}

const ProfileTab: React.FC<Props> = ({
  profileData,
  user,
  navigation,
  onEditProfile,
}) => {
  const reviewsList = profileData?.reviews || [];

  return (
    <View style={styles.tabSection}>
      {/* Update Locations Button */}
      <TouchableOpacity
        style={styles.goldFilledBtn}
        onPress={() => navigation.navigate('PreferredAreas')}
        activeOpacity={0.8}
      >
        <AppText style={styles.goldFilledBtnText}>Update Locations</AppText>
      </TouchableOpacity>

      {/* Basic Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.infoCardHeader}>
          <AppText style={styles.infoCardTitle}>Basic Info</AppText>
          <TouchableOpacity
            style={styles.iconEditBtn}
            onPress={onEditProfile}
            activeOpacity={0.7}
          >
            <Pencil size={16} color={COLORS.textPrimary || '#1E293B'} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <AppText style={styles.infoLabel}>Name</AppText>
          <AppText style={styles.infoVal}>
            {profileData?.name || user?.name || 'Marcus Linner'}
          </AppText>
        </View>

        <View style={styles.infoRow}>
          <AppText style={styles.infoLabel}>Email</AppText>
          <AppText style={styles.infoVal}>
            {profileData?.email || user?.email || 'email@email.com'}
          </AppText>
        </View>

        <View style={styles.infoRow}>
          <AppText style={styles.infoLabel}>Location</AppText>
          <AppText style={styles.infoVal}>
            {profileData?.locale?.address || 'Knoxville, TN, USA'}
          </AppText>
        </View>

        <View style={styles.infoRow}>
          <AppText style={styles.infoLabel}>Account</AppText>
          <AppText style={styles.infoVal}>Shipper</AppText>
        </View>

        <View style={styles.infoRow}>
          <AppText style={styles.infoLabel}>Phone</AppText>
          <AppText style={styles.infoVal}>
            {profileData?.mobile || '902 999 9999'}
          </AppText>
        </View>

        {profileData?.description ? (
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <AppText style={styles.infoLabel}>Description</AppText>
            <AppText style={styles.infoVal}>
              {profileData?.description}
            </AppText>
          </View>
        ) : null}
      </View>

      {/* Reviews Received Section */}
      <View style={styles.reviewsSection}>
        <AppText style={styles.reviewsSectionTitle}>Reviews received</AppText>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.reviewsScroll}
        >
          {reviewsList.length > 0 ? (
            reviewsList.map((rev: any, idx: number) => (
              <View key={rev._id || idx} style={styles.reviewCard}>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star
                      key={s}
                      size={16}
                      color="#F59E0B"
                      fill={s <= (rev.rating || 5) ? '#F59E0B' : 'transparent'}
                    />
                  ))}
                </View>
                <AppText style={styles.reviewText}>
                  {rev.reviewText || 'Always good to work with Mark, a great customer.'}
                </AppText>
                <View style={styles.reviewerRow}>
                  <Image
                    source={
                      rev.customerId?.profileImage?.url
                        ? { uri: rev.customerId.profileImage.url }
                        : imageIndex.AccountIcon
                    }
                    style={styles.reviewerAvatar}
                  />
                  <View>
                    <AppText style={styles.reviewerName}>
                      {rev.customerName || 'Mark'}
                    </AppText>
                    <AppText style={styles.reviewDate}>
                      {formatDate(rev.createdAt || new Date(), 'MM/DD/YYYY')}
                    </AppText>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.reviewCard}>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={16} color="#F59E0B" fill="#F59E0B" />
                ))}
              </View>
              <AppText style={styles.reviewText}>
                Always good to work with Mark, a great customer.
              </AppText>
              <View style={styles.reviewerRow}>
                <Image source={imageIndex.AccountIcon} style={styles.reviewerAvatar} />
                <View>
                  <AppText style={styles.reviewerName}>Mark</AppText>
                  <AppText style={styles.reviewDate}>11/28/2023</AppText>
                </View>
              </View>
            </View>
          )}
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
          <AppText style={styles.showMoreBtnText}>Show more reviews</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileTab;
