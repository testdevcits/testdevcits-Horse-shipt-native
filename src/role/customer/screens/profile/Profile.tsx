// import React, { useState } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
//   FlatList,
//   RefreshControl,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { MessageCircle, PencilLine, Star, User } from 'lucide-react-native'; // Lucide icons
// import {
//   COLORS,
//   FONT_SIZE,
//   FONTS,
//   RADIUS,
//   SPACING,
// } from '../../../../constants';
// import { useProfile } from './useProfile';
// import {
//   AppHeader,
//   AppLoader,
//   EmptyState,
//   ReviewCard,
// } from '../../../../components';
// import NotificationSettings from '../notificationsettings/NotificationSettings';
// import Payments from '../payments/Payments';
// import { useReviews } from '../reviews/useReviews';
// import styles from './style.profile';

// const Profile = ({ navigation }) => {
//   const { profile, loading, refetch } = useProfile();
//   const [activeTab, setActiveTab] = useState('Profile');
//   const { reviews, loading: reviewsLOading, fetchReviews } = useReviews();

//   // if (loading) {
//   //   return <AppLoader visible={loading} />;
//   // }

//   if (!profile && !loading) {
//     return (
//       <View style={styles.centered}>
//         <Text>Error loading profile. Please try again.</Text>
//         <TouchableOpacity onPress={refetch}>
//           <Text>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <AppHeader />
//       <AppLoader visible={loading} />
//       {/* Top Tabs */}
//       <View style={styles.tabContainer}>
//         {['Profile', 'Notifications', 'Payments'].map(tab => (
//           <TouchableOpacity
//             key={tab}
//             onPress={() => setActiveTab(tab)}
//             style={[styles.tab, activeTab === tab && styles.activeTab]}
//           >
//             <Text
//               style={[
//                 styles.tabText,
//                 activeTab === tab && styles.activeTabText,
//               ]}
//             >
//               {tab}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//       {activeTab === 'Profile' && (
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.scrollContent}
//         >
//           {/* Avatar Section */}
//           <View style={styles.avatarSection}>
//             <View style={styles.imageWrapper}>
//               {profile?.profileImage?.url ? (
//                 <Image
//                   source={{ uri: profile?.profileImage?.url }}
//                   style={styles.avatar}
//                 />
//               ) : (
//                 <View style={[styles.avatar, styles.placeholderAvatar]}>
//                   <User size={50} color={COLORS.grey400} />
//                 </View>
//               )}
//             </View>
//             <TouchableOpacity style={styles.editPictureBtn}>
//               <PencilLine size={16} color={COLORS.textPrimary} />
//               <Text style={styles.editPictureText}>Edit picture</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Stats Card */}
//           <View style={styles.statsCard}>
//             <View style={styles.statBox}>
//               <Text style={styles.statNumber}>10</Text>
//               <Text style={styles.statLabel}>Shipment</Text>
//             </View>
//             <View style={styles.statDivider} />
//             <View style={styles.statBox}>
//               <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                 <Text style={styles.statNumber}>5.0 </Text>
//                 <Star size={18} color="#EAB308" fill="#EAB308" />
//               </View>
//               <Text style={styles.statLabel}>Rating</Text>
//             </View>
//           </View>

//           {/* Basic Info Section */}
//           <View style={styles.infoCard}>
//             <View style={styles.cardHeader}>
//               <Text style={styles.cardTitle}>Basic Info</Text>
//               <TouchableOpacity style={styles.editIconBtn}>
//                 <PencilLine size={18} color={COLORS.textPrimary} />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.infoList}>
//               <InfoRow
//                 label="Name"
//                 value={`${profile?.firstName} ${profile?.lastName}`}
//               />
//               <InfoRow label="Email" value={profile?.email} />
//               <InfoRow label="Phone" value={profile?.phone} isLast />
//             </View>
//           </View>

//           {/* Reviews Section Title */}
//           <Text
//             style={[
//               styles.cardTitle,
//               { marginTop: SPACING.xl, marginBottom: SPACING.md },
//             ]}
//           >
//             Reviews received
//           </Text>

//           {/* Horizontal Reviews */}
//           <FlatList
//             data={reviews}
//             horizontal={true}
//             showsHorizontalScrollIndicator={false}
//             keyExtractor={item => item._id}
//             renderItem={({ item }) => <ReviewCard item={item} />}
//             contentContainerStyle={{ padding: SPACING.lg }}
//             refreshControl={
//               <RefreshControl
//                 refreshing={loading}
//                 onRefresh={fetchReviews}
//                 tintColor={COLORS.goldPrimary}
//               />
//             }
//             ListEmptyComponent={
//               <EmptyState
//                 icon={MessageCircle}
//                 title="No Reviews Yet"
//                 message="Your shipment feedback from shippers will appear here."
//               />
//             }
//           />

//           <TouchableOpacity
//             activeOpacity={1}
//             onPress={() => navigation.navigate('ReviewsScreen')}
//             style={styles.showMoreBtn}
//           >
//             <Text style={styles.showMoreText}>Show more reviews</Text>
//           </TouchableOpacity>
//         </ScrollView>
//       )}
//       {activeTab === 'Notifications' && <NotificationSettings />}
//       {activeTab === 'Payments' && <Payments />}
//     </View>
//   );
// };

// // Internal components
// const InfoRow = ({
//   label,
//   value,
//   isLast,
// }: {
//   label: string;
//   value: string;
//   isLast?: boolean;
// }) => (
//   <View style={[styles.infoRow, isLast && { borderBottomWidth: 0 }]}>
//     <Text style={styles.infoLabel}>{label}</Text>
//     <Text style={styles.infoValue}>{value}</Text>
//   </View>
// );

 

// export default Profile;


import { View, Text } from 'react-native'
import React from 'react'

const Profile = () => {
  return (
    <View>
      <Text>Profile</Text>
    </View>
  )
}

export default Profile