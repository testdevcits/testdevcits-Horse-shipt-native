import React from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Share,
  StatusBar,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { 
  ChevronLeft, 
  ShieldCheck, 
  Star, 
  MapPin, 
  Share2, 
  MessageCircle, 
  Phone, 
  Globe,
  Award,
  Calendar,
  Truck
} from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../../../constants';
import styles from './shipperDetail.styles';
import { AppText } from '../../../../components';
import imageIndex from '../../../../assets/images/imageIndex';
  
const ShipperDetail = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  
  // Destructure data passed from the Top Rated Shippers list
  const { item } = route.params;

  const isNew = item.rating === 0;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${item.name} on HorseShipt. Expert horse transport in ${item.region}!`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* 1. HERO HEADER */}
      <View style={styles.heroContainer}>
        <Image 
          source={item.profileImage.startsWith('http') ? { uri: item.profileImage } : imageIndex.AccountIcon} 
          style={styles.heroImage} 
        />
        <View style={styles.headerOverlay}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backBtn}
          >
            <ChevronLeft color={COLORS.white} size={28} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.backBtn}>
            <Share2 color={COLORS.white} size={22} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {/* 2. PROFILE HEADER INFO */}
        <View style={styles.profileInfo}>
          <View style={styles.nameRow}>
            <AppText style={styles.name}>{item.name}</AppText>
            <ShieldCheck size={20} color={COLORS.info} fill={`${COLORS.info}20`} />
          </View>
          
          <View style={styles.locationRow}>
            <MapPin size={14} color={COLORS.goldPrimary} />
            <AppText style={styles.locationText}>{item.region}</AppText>
          </View>

          {/* Stats Summary Bar */}
          <View style={styles.statsBar}>
            <View style={styles.statItem}>
              <AppText style={styles.statValue}>
                {isNew ? 'New' : item.rating.toFixed(1)}
              </AppText>
              <View style={styles.statLabelRow}>
                <Star size={10} color={COLORS.goldPrimary} fill={COLORS.goldPrimary} />
                <AppText style={styles.statLabel}>Rating</AppText>
              </View>
            </View>
            <View style={styles.vDivider} />
            <View style={styles.statItem}>
              <AppText style={styles.statValue}>{item.reviewCount}</AppText>
              <AppText style={styles.statLabel}>Reviews</AppText>
            </View>
            <View style={styles.vDivider} />
            <View style={styles.statItem}>
              <AppText style={styles.statValue}>50+</AppText>
              <AppText style={styles.statLabel}>Trips</AppText>
            </View>
          </View>
        </View>

        {/* 3. LATEST FEEDBACK SECTION */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppText style={styles.sectionTitle}>Latest Feedback</AppText>
            <Award size={18} color={COLORS.goldPrimary} />
          </View>
          <View style={styles.reviewCard}>
            <AppText style={styles.reviewText}>"{item.reviewText}"</AppText>
            {item.googleReviewLink && (
              <TouchableOpacity 
                style={styles.googleLink}
                onPress={() => Linking.openURL(item.googleReviewLink)}
              >
                <Globe size={14} color={COLORS.goldPrimary} />
                <AppText style={styles.googleLinkText}>Verified Google Review</AppText>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 4. SERVICE DETAILS */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Transport Details</AppText>
          <View style={styles.serviceGrid}>
             <View style={styles.serviceItem}>
                <Truck size={20} color={COLORS.textLight} />
                <AppText style={styles.serviceLabel}>Local & Inter-state</AppText>
             </View>
             <View style={styles.serviceItem}>
                <Calendar size={20} color={COLORS.textLight} />
                <AppText style={styles.serviceLabel}>Next Avail: 24 Jul</AppText>
             </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* 5. STICKY BOTTOM ACTION BAR */}
      {/* <View style={styles.footer}>
        <TouchableOpacity style={styles.chatBtn}>
          <MessageCircle color={COLORS.goldPrimary} size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.callBtn}>
          <Phone color={COLORS.goldPrimary} size={22} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookBtn}>
          <AppText style={styles.bookText}>Request Quote</AppText>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

export default ShipperDetail;