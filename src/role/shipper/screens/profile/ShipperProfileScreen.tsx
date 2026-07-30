import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Pencil,
  Star,
  ExternalLink,
  Crown,
  CheckCircle,
  Calendar,
  Bell,
  Check,
  Building2,
  Camera,
} from 'lucide-react-native';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { AppHeader, AppText } from '../../../../components';
import { COLORS, FONTS, SPACING, RADIUS, FONT_SIZE } from '../../../../constants';
import shipperService from '../../../../api/services/shipperService';
import imageIndex from '../../../../assets/images/imageIndex';
import { useSelector } from 'react-redux';
import styles from './styles.shipperprofile';

type TabType = 'Profile' | 'Shipment' | 'Payments' | 'Subscription' | 'Notification';

const ShipperProfileScreen = ({ navigation }: any) => {
  const { user } = useSelector((state: any) => state.auth || {});
  const [activeTab, setActiveTab] = useState<TabType>('Profile');

  // Data states
  const [profileData, setProfileData] = useState<any>(null);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [billingHistoryData, setBillingHistoryData] = useState<any>(null);
  const [settingsData, setSettingsData] = useState<any>(null);
  const [stripeStatus, setStripeStatus] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [profileUploading, setProfileUploading] = useState(false);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [billingFilter, setBillingFilter] = useState<'All' | 'Invoices' | 'Payments' | 'Payouts'>('All');

  const handleUploadBannerImage = async () => {
    try {
      let imagePath = '';
      let imageMime = 'image/jpeg';
      let imageName = 'banner.jpg';

      const pickerModule: any = (ImagePicker as any)?.openPicker
        ? ImagePicker
        : (ImagePicker as any)?.default;

      if (pickerModule && typeof pickerModule.openPicker === 'function') {
        const image = await pickerModule.openPicker({
          width: 1200,
          height: 400,
          cropping: true,
          mediaType: 'photo',
        });
        imagePath = image.path;
        imageMime = image.mime || 'image/jpeg';
        imageName = image.filename || 'banner.jpg';
      } else {
        const res = await launchImageLibrary({
          mediaType: 'photo',
          quality: 0.8,
        });
        if (res.didCancel || !res.assets || res.assets.length === 0) return;
        const asset = res.assets[0];
        imagePath = asset.uri || '';
        imageMime = asset.type || 'image/jpeg';
        imageName = asset.fileName || 'banner.jpg';
      }

      if (!imagePath) return;
      setBannerUploading(true);

      const formData = new FormData();
      formData.append('image', {
        uri: imagePath,
        type: imageMime,
        name: imageName,
      } as any);

      const res = await shipperService?.updateBannerImage?.(formData);
      if (res?.success && res.bannerImage?.url) {
        setBannerUrl(res.bannerImage.url);
        Alert.alert('Success', 'Banner image updated successfully');
      }
    } catch (err: any) {
      if (
        err?.message !== 'User cancelled image selection' &&
        err?.code !== 'E_PICKER_CANCELLED'
      ) {
        console.error('Update Banner Image Error:', err);
        Alert.alert('Error', 'Failed to update banner image');
      }
    } finally {
      setBannerUploading(false);
    }
  };

  const handleUploadProfileImage = async () => {
    try {
      let imagePath = '';
      let imageMime = 'image/jpeg';
      let imageName = 'profile.jpg';

      const pickerModule: any = (ImagePicker as any)?.openPicker
        ? ImagePicker
        : (ImagePicker as any)?.default;

      if (pickerModule && typeof pickerModule.openPicker === 'function') {
        const image = await pickerModule.openPicker({
          width: 400,
          height: 400,
          cropping: true,
          mediaType: 'photo',
        });
        imagePath = image.path;
        imageMime = image.mime || 'image/jpeg';
        imageName = image.filename || 'profile.jpg';
      } else {
        const res = await launchImageLibrary({
          mediaType: 'photo',
          quality: 0.8,
        });
        if (res.didCancel || !res.assets || res.assets.length === 0) return;
        const asset = res.assets[0];
        imagePath = asset.uri || '';
        imageMime = asset.type || 'image/jpeg';
        imageName = asset.fileName || 'profile.jpg';
      }

      if (!imagePath) return;
      setProfileUploading(true);

      const formData = new FormData();
      formData.append('image', {
        uri: imagePath,
        type: imageMime,
        name: imageName,
      } as any);

      const res = await shipperService?.updateProfileImage?.(formData);
      if (res?.success && res.profileImage?.url) {
        setAvatarUrl(res.profileImage.url);
        Alert.alert('Success', 'Profile image updated successfully');
      }
    } catch (err: any) {
      if (
        err?.message !== 'User cancelled image selection' &&
        err?.code !== 'E_PICKER_CANCELLED'
      ) {
        console.error('Update Profile Image Error:', err);
        Alert.alert('Error', 'Failed to update profile image');
      }
    } finally {
      setProfileUploading(false);
    }
  };

  // Notification Checkbox Toggles State
  const [notifications, setNotifications] = useState<any>({
    quote: { email: true, sms: true },
    opportunity: { email: true, sms: true },
    message: { email: true, sms: true },
    question: { email: true, sms: true },
    review: { email: true, sms: true },
    shipment: { email: true, sms: true },
  });

  const fetchAllProfileData = async () => {
    try {
      const [profRes, subRes, billRes, setRes, stripeRes] = await Promise.all([
        shipperService.getProfile().catch(() => null),
        shipperService.getSubscriptionPlan().catch(() => null),
        shipperService.getBillingHistory().catch(() => null),
        shipperService.getSettings().catch(() => null),
        shipperService.getStripeStatus().catch(() => null),
      ]);

      if (profRes?.data) {
        setProfileData(profRes.data);
      }
      if (subRes?.data) {
        setSubscriptionData(subRes.data);
      }
      if (billRes?.data) {
        setBillingHistoryData(billRes.data);
      }
      if (setRes?.data?.notifications) {
        setSettingsData(setRes.data);
        setNotifications(setRes.data.notifications);
      }
      if (stripeRes) {
        setStripeStatus(stripeRes);
      }
    } catch (error) {
      console.error('Fetch Profile Data Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllProfileData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllProfileData();
  };

  const handleToggleNotification = async (key: string, channel: 'email' | 'sms') => {
    const updated = {
      ...notifications,
      [key]: {
        ...notifications[key],
        [channel]: !notifications[key]?.[channel],
      },
    };
    setNotifications(updated);

    try {
      await shipperService.updateNotifications(updated);
    } catch (e) {
      console.error('Update Notifications Error:', e);
    }
  };

  const ratingVal = profileData?.rating || 5.0;
  const reviewsList = profileData?.reviews || [];

  return (
    <View style={styles.container}>
      <AppHeader title="Profile" showNotificationBell />

      {/* TOP HORIZONTAL SCROLLABLE TAB BAR */}
      <View style={styles.tabBarWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarScroll}
        >
          {(['Profile', 'Shipment', 'Payments', 'Subscription', 'Notification'] as TabType[]).map(
            tab => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tabItem, isActive && styles.tabItemActive]}
                  onPress={() => setActiveTab(tab)}
                >
                  <AppText style={[styles.tabText, isActive && styles.tabTextActive]}>
                    {tab}
                  </AppText>
                  {isActive && <View style={styles.activeTabIndicator} />}
                </TouchableOpacity>
              );
            },
          )}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.goldPrimary}
          />
        }
      >
        {/* COMMON TOP SECTION: BANNER IMAGE */}
        <View style={styles.bannerWrapper}>
          <Image
            source={
              bannerUrl || profileData?.bannerImage?.url
                ? { uri: bannerUrl || profileData?.bannerImage?.url }
                : imageIndex.Banner
            }
            style={styles.bannerImg}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.editBannerBtn}
            onPress={handleUploadBannerImage}
            disabled={bannerUploading}
            activeOpacity={0.8}
          >
            {bannerUploading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <>
                <Camera size={14} color={COLORS.white} />
                <AppText style={styles.editBannerText}>Edit banner</AppText>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* AVATAR & EDIT PICTURE */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircleWrapper}>
            {avatarUrl || (profileData?.profileImage && profileData.profileImage !== '/images/default_profile.png') ? (
              <Image source={{ uri: avatarUrl || profileData.profileImage }} style={styles.avatarImg} />
            ) : (
              <Image source={imageIndex.AccountIcon} style={styles.avatarImg} />
            )}
          </View>

          <TouchableOpacity
            style={styles.editPicBtn}
            onPress={handleUploadProfileImage}
            disabled={profileUploading}
          >
            {profileUploading ? (
              <ActivityIndicator size="small" color={COLORS.goldPrimary} />
            ) : (
              <>
                <Pencil size={16} color={COLORS.textPrimary} />
                <AppText style={styles.editPicText}>Edit picture</AppText>
              </>
            )}
          </TouchableOpacity>

          {/* COMMON STATS CARD CONTAINER */}
          <View style={styles.statsCard}>
            <View style={styles.statCol}>
              <AppText style={styles.statVal}>10</AppText>
              <AppText style={styles.statSub}>Shipment</AppText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <View style={styles.ratingValRow}>
                <AppText style={styles.statVal}>{ratingVal.toFixed(1)}</AppText>
                <Star size={16} color="#F59E0B" fill="#F59E0B" style={{ marginLeft: 4 }} />
              </View>
              <AppText style={styles.statSub}>Rating</AppText>
            </View>
          </View>
        </View>

        {/* TAB 1: PROFILE */}
        {activeTab === 'Profile' && (
          <View style={styles.tabSection}>
            {/* Update Locations Button */}
            <TouchableOpacity style={styles.goldFilledBtn}>
              <AppText style={styles.goldFilledBtnText}>Update Locations</AppText>
            </TouchableOpacity>

            {/* Basic Info Card */}
            <View style={styles.infoCard}>
              <View style={styles.infoCardHeader}>
                <AppText style={styles.infoCardTitle}>Basic Info</AppText>
                <TouchableOpacity style={styles.iconEditBtn}>
                  <Pencil size={16} color={COLORS.textPrimary} />
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

              <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                <AppText style={styles.infoLabel}>Phone</AppText>
                <AppText style={styles.infoVal}>
                  {profileData?.mobile || '902 999 9999'}
                </AppText>
              </View>
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
                            {moment(rev.createdAt || new Date()).format('MM/DD/YYYY')}
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

              <TouchableOpacity style={styles.showMoreBtn}>
                <AppText style={styles.showMoreBtnText}>Show more reviews</AppText>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* TAB 2: SHIPMENT */}
        {activeTab === 'Shipment' && (
          <View style={styles.tabSection}>
            {/* Vehicles & Capacity Card */}
            <View style={styles.featureCard}>
              <Image source={imageIndex.Banner} style={styles.featureCardImg} />
              <View style={styles.featureCardContent}>
                <AppText style={styles.featureTitle}>Vehicles & Capacity</AppText>
                <AppText style={styles.featureSub}>
                  Manage your shipment capacity and vehicle information.
                </AppText>
                <TouchableOpacity
                  style={styles.featureActionBtn}
                  onPress={() => navigation.navigate('MyVehicles')}
                >
                  <ExternalLink size={16} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Preferred Areas Card */}
            <View style={styles.featureCard}>
              <Image source={imageIndex.Banner} style={styles.featureCardImg} />
              <View style={styles.featureCardContent}>
                <AppText style={styles.featureTitle}>Preferred Areas</AppText>
                <AppText style={styles.featureSub}>
                  Vehicles & Capacity Manage your shipment capacity and vehicle information.
                </AppText>
                <TouchableOpacity style={styles.featureActionBtn}>
                  <ExternalLink size={16} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* TAB 3: PAYMENTS */}
        {activeTab === 'Payments' && (
          <View style={styles.tabSection}>
            <AppText style={styles.sectionHeaderTitle}>Payment Settings</AppText>
            <AppText style={styles.sectionHeaderSub}>
              Set up your payout account to securely receive payments for completed horse shipments.
            </AppText>

            {/* Shipper Payout Card */}
            <View style={styles.payoutAccountCard}>
              <View style={styles.goldHorseIconBox}>
                <Building2 size={24} color="#A06333" />
              </View>
              <View style={styles.payoutTextCol}>
                <AppText style={styles.payoutTitle}>Horse Shipper Payout Account</AppText>
                <AppText style={styles.payoutSub}>
                  Receive payments for completed shipments
                </AppText>
              </View>
            </View>

            <View style={styles.cardDivider} />

            {/* Payout Verified Container */}
            <View style={styles.verifiedCard}>
              <View style={styles.checkSquare}>
                <Check size={16} color="#A06333" />
              </View>
              <View style={styles.verifiedTextCol}>
                <AppText style={styles.verifiedTitle}>
                  {stripeStatus?.verified || stripeStatus?.chargesEnabled
                    ? 'Payout account Verified'
                    : 'Payout account Verification Pending'}
                </AppText>
                <AppText style={styles.verifiedSub}>
                  {stripeStatus?.verified || stripeStatus?.payoutsEnabled
                    ? 'Your payout accounts connected already to receive payments for your shipments.'
                    : 'Complete onboarding requirements to enable payouts and receiving funds.'}
                </AppText>
              </View>
            </View>

            {/* Bottom Encryption Callout */}
            <View style={styles.calloutBanner}>
              <AppText style={styles.calloutText}>
                All transactions are encrypted and securely processed through your payout account.
              </AppText>
            </View>
          </View>
        )}

        {/* TAB 4: SUBSCRIPTION */}
        {activeTab === 'Subscription' && (
          <View style={styles.tabSection}>
            <AppText style={styles.sectionHeaderTitle}>Billing & History</AppText>
            <AppText style={styles.sectionHeaderSub}>
              View your subscription, invoices, and transactions
            </AppText>

            {/* Subscription Status Card */}
            <View style={styles.subCardContainer}>
              <View style={styles.subCardHeader}>
                <View style={styles.goldSquareIconBox}>
                  <Crown size={22} color="#A06333" />
                </View>

                <View style={styles.subHeaderTextCol}>
                  <AppText style={styles.subHeaderTitle}>Subscription Status</AppText>
                  <AppText style={styles.subHeaderSub}>
                    Your current plan and billing details
                  </AppText>
                </View>

                <View style={styles.redCrossCircle}>
                  <AppText style={styles.redCrossText}>✕</AppText>
                </View>
              </View>

              <View style={styles.cardDivider} />

              {/* Status Pills */}
              <View style={styles.statusPillsRow}>
                <View style={styles.greenOutlinePill}>
                  <AppText style={styles.greenOutlinePillText}>Active</AppText>
                </View>

                <View style={styles.blueOutlinePill}>
                  <AppText style={styles.blueOutlinePillText}>
                    {subscriptionData?.monthly?.label || 'Monthly Plan'}
                  </AppText>
                </View>
              </View>

              {/* Plan Card */}
              <View style={styles.planDetailsBox}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Crown size={16} color="#A06333" />
                  <AppText style={styles.planLabel}>Plan</AppText>
                </View>
                <AppText style={styles.planName}>Monthly</AppText>
                <AppText style={styles.planPrice}>
                  ${subscriptionData?.monthly?.amount || '19.99'}/month USD
                </AppText>
              </View>

              {/* Subscription Active Banner */}
              <View style={styles.subActiveBanner}>
                <CheckCircle size={18} color="#059669" />
                <AppText style={styles.subActiveBannerText}>Subscription Active</AppText>
              </View>

              {/* Billing History Section */}
              <View style={{ marginTop: SPACING.lg }}>
                <View style={styles.subCardHeader}>
                  <View style={styles.goldSquareIconBox}>
                    <Calendar size={22} color="#A06333" />
                  </View>

                  <View style={styles.subHeaderTextCol}>
                    <AppText style={styles.subHeaderTitle}>Billing History</AppText>
                    <AppText style={styles.subHeaderSub}>
                      Invoices, payments, and transactions (USA (ET))
                    </AppText>
                  </View>
                </View>

                <View style={styles.cardDivider} />

                {/* Filter Pills */}
                <View style={styles.billingFilterRow}>
                  {(['All', 'Invoices', 'Payments', 'Payouts'] as any[]).map(f => (
                    <TouchableOpacity
                      key={f}
                      style={[
                        styles.billingFilterPill,
                        billingFilter === f && styles.billingFilterPillActive,
                      ]}
                      onPress={() => setBillingFilter(f)}
                    >
                      <AppText
                        style={[
                          styles.billingFilterText,
                          billingFilter === f && styles.billingFilterTextActive,
                        ]}
                      >
                        {f}
                      </AppText>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Transactions Table */}
                <View style={styles.transactionsTableContainer}>
                  <View style={styles.tableHeaderRow}>
                    <AppText style={[styles.tableColHeader, { flex: 1.5 }]}>Description</AppText>
                    <AppText style={[styles.tableColHeader, { flex: 1.2 }]}>Date & Time</AppText>
                    <AppText style={[styles.tableColHeader, { flex: 1.2 }]}>Amount</AppText>
                    <AppText style={[styles.tableColHeader, { flex: 1 }]}>Status</AppText>
                  </View>

                  {(() => {
                    const subs = billingHistoryData?.subscriptions || [];
                    const pymts = billingHistoryData?.payments || [];
                    const pyts = billingHistoryData?.payouts || [];

                    let list: any[] = [];
                    if (billingFilter === 'Invoices') list = subs;
                    else if (billingFilter === 'Payments') list = pymts;
                    else if (billingFilter === 'Payouts') list = pyts;
                    else list = [...subs, ...pymts, ...pyts];

                    if (list.length === 0) {
                      list = [
                        {
                          _id: '1',
                          title: 'Card payment receipt',
                          createdAt: '2026-07-18T00:00:00.000Z',
                          amount: 19.99,
                          currency: 'USD',
                          status: 'succeeded',
                        },
                      ];
                    }

                    return list.map((item, idx) => {
                      const titleText =
                        item.title || item.description || 'Card payment receipt';
                      const dateText = moment(
                        item.createdAt || item.paidAt || new Date(),
                      ).format('MMM DD, YYYY');
                      const amountText = `$${item.amount || '0'} ${(
                        item.currency || 'USD'
                      ).toUpperCase()}`;
                      const statusText = item.status || 'paid';

                      return (
                        <View
                          key={item._id || item.id || idx}
                          style={[
                            styles.tableBodyRow,
                            idx === list.length - 1 && { borderBottomWidth: 0 },
                          ]}
                        >
                          <AppText style={[styles.tableCellText, { flex: 1.5 }]}>
                            {titleText}
                          </AppText>
                          <AppText style={[styles.tableCellText, { flex: 1.2 }]}>
                            {dateText}
                          </AppText>
                          <AppText style={[styles.tableCellText, { flex: 1.2 }]}>
                            {amountText}
                          </AppText>
                          <View style={{ flex: 1 }}>
                            <View style={styles.succeededPill}>
                              <AppText style={styles.succeededText}>
                                {statusText.charAt(0).toUpperCase() +
                                  statusText.slice(1)}
                              </AppText>
                            </View>
                          </View>
                        </View>
                      );
                    });
                  })()}
                </View>
              </View>
            </View>
          </View>
        )}

        {/* TAB 5: NOTIFICATION */}
        {activeTab === 'Notification' && (
          <View style={styles.tabSection}>
            <AppText style={styles.sectionHeaderTitle}>Notifications</AppText>
            <AppText style={styles.sectionHeaderSub}>
              Choose how and when you receive updates about your shipments and activity.
            </AppText>

            {/* Shipment Notifications Card */}
            <View style={styles.notificationsCard}>
              <View style={styles.subCardHeader}>
                <View style={styles.goldSquareIconBox}>
                  <Bell size={22} color="#A06333" />
                </View>

                <View style={styles.subHeaderTextCol}>
                  <AppText style={styles.subHeaderTitle}>Shipment Notifications</AppText>
                </View>
              </View>

              <View style={styles.cardDivider} />

              {/* Column Headers */}
              <View style={styles.notifColHeadersRow}>
                <AppText style={styles.notifChannelText}>Email</AppText>
                <AppText style={styles.notifChannelText}>SMS</AppText>
              </View>

              {/* Checkbox Rows */}
              {[
                {
                  key: 'quote',
                  title: 'Quote won',
                  desc: 'Get notified when you win a quote.',
                },
                {
                  key: 'opportunity',
                  title: 'New Opportunity',
                  desc: 'When a new opportunity in your area is published.',
                },
                {
                  key: 'message',
                  title: 'New message',
                  desc: 'When you receive a new message from a carrier or shipper.',
                },
                {
                  key: 'question',
                  title: 'Shipment questions',
                  desc: 'When a customer answers your shipment question.',
                },
                {
                  key: 'review',
                  title: 'Review received',
                  desc: 'When a customer answers your shipment question.',
                },
                {
                  key: 'shipment',
                  title: 'Upcoming shipment',
                  desc: 'Reminders before a scheduled shipment departure.',
                },
              ].map(item => {
                const isEmailChecked = notifications[item.key]?.email;
                const isSmsChecked = notifications[item.key]?.sms;

                return (
                  <View key={item.key} style={styles.notifItemRow}>
                    <View style={styles.notifTextCol}>
                      <AppText style={styles.notifItemTitle}>{item.title}</AppText>
                      <AppText style={styles.notifItemDesc}>{item.desc}</AppText>
                    </View>

                    <View style={styles.notifCheckboxesCol}>
                      {/* Email Checkbox */}
                      <TouchableOpacity
                        style={[
                          styles.notifCheckbox,
                          isEmailChecked && styles.notifCheckboxActive,
                        ]}
                        onPress={() => handleToggleNotification(item.key, 'email')}
                      >
                        {isEmailChecked && <Check size={14} color="#A06333" />}
                      </TouchableOpacity>

                      {/* SMS Checkbox */}
                      <TouchableOpacity
                        style={[
                          styles.notifCheckbox,
                          isSmsChecked && styles.notifCheckboxActive,
                        ]}
                        onPress={() => handleToggleNotification(item.key, 'sms')}
                      >
                        {isSmsChecked && <Check size={14} color="#A06333" />}
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Bottom Callout Banner */}
            <View style={styles.calloutBanner}>
              <AppText style={styles.calloutText}>
                SMS notifications may incur carrier charges depending on your plan.
              </AppText>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ShipperProfileScreen;
