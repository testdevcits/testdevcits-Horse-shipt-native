import React, { useState, lazy, Suspense } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import styles from './style.chatdetail';
import { COLORS, ICON_SIZE } from '../../../../constants';
import useChatDetails from './useChatDetails';
import { AppText, ChatDetailsSkeleton } from '../../../../components';
import ImagePicker, {
  Image as PickerImage,
} from 'react-native-image-crop-picker';

import { permissionService } from '../../../../utils/cameragalleryPermission';
import AppIcon from '../../../../components/app_icon/AppIcon';
import { showErrorToast } from '../../../../utils/toast';
import ChatHeaderBar from './ChatHeaderBar';
import ChatInputBar from './ChatInputBar';

const PhotoSourceSheet = lazy(
  () =>
    import('../../../../components/common/PhotoSourceSheet/PhotoSourceSheet'),
);

const ShipmentLocationModal = lazy(
  () =>
    import(
      '../../../../components/common/ShipmentLocationModal/ShipmentLocationModal'
    ),
);

const ChatMessageImage = ({ uri }: { uri?: string }) => {
  const [hasError, setHasError] = useState(false);

  if (!uri || hasError) {
    return (
      <View style={styles.mediaImageFallback}>
        <AppIcon name={'Image'} size={22} color={COLORS.grey400} />
        <AppText style={styles.mediaImageErrorText}>
          {!uri ? 'No image' : 'Image unavailable'}
        </AppText>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={styles.mediaImage}
      resizeMode="cover"
      onError={() => setHasError(true)}
    />
  );
};

const ChatDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { shipmentId, name, isChatLocked, avatar }: any = route.params || {};
  const [inputText, setInputText] = useState('');
  const [showPhotoSheet, setShowPhotoSheet] = useState(false);
  const [selectedImage, setSelectedImage] = useState<PickerImage | null>(null);
  const [pickingImage, setPickingImage] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const { user } = useSelector((state: any) => state.auth || {});
  const MY_ROLE = user?.role || 'customer';

  const { messages, loading, shipment, sendMessage, sending } =
    useChatDetails(shipmentId);

  const partnerName = name || (MY_ROLE === 'shipper' ? 'Customer' : 'Shipper');
  const isLocked = Boolean(
    isChatLocked || shipment?.isChatLocked || shipment?.status === 'completed',
  );

  const handleSend = async () => {
    if (isLocked) return;
    const success = await sendMessage(inputText, selectedImage);
    if (success) {
      setInputText('');
      setSelectedImage(null);
    }
  };

  const formatMessageTime = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    const time = date
      .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      .toLowerCase();
    return `${day} ${time}`;
  };

  const renderMessage = ({ item }: any) => {
    const isMe =
      item?.senderRole === MY_ROLE ||
      (user?._id && item?.senderId === user._id);
    const hasMedia = item?.media && item?.media.length > 0;

    return (
      <View
        style={[
          styles.messageWrapper,
          isMe ? styles.myWrapper : styles.otherWrapper,
        ]}
      >
        <View style={styles.bubbleHeader}>
          <AppText style={styles.senderName}>
            {isMe ? 'You' : partnerName}
          </AppText>
          <AppText style={styles.timestamp}>
            {formatMessageTime(item?.createdAt)}
          </AppText>
        </View>

        <View
          style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}
        >
          {hasMedia && <ChatMessageImage uri={item?.media?.[0]?.url} />}
          {item?.message ? (
            <AppText
              style={[
                styles.messageText,
                isMe ? styles.myText : styles.otherText,
              ]}
            >
              {item?.message}
            </AppText>
          ) : null}
        </View>
      </View>
    );
  };

  const pickPhotoFromGallery = async () => {
    if (isLocked || pickingImage) return;
    const hasPermission = await permissionService.request('gallery');
    if (!hasPermission) return;
    setPickingImage(true);
    try {
      const image = await ImagePicker.openPicker({
        width: 1000,
        height: 1000,
        cropping: true,
        mediaType: 'photo',
        compressImageQuality: 0.8,
      });

      if (image?.size && image.size > 1 * 1024 * 1024) {
        showErrorToast(
          'File Too Large',
          'Selected chat image must be 1 MB or less.',
        );
        return;
      }

      setSelectedImage(image);
      setShowPhotoSheet(false);
    } catch (e) {
      console.log(e);
    } finally {
      setPickingImage(false);
    }
  };

  const takeProfilePhoto = async () => {
    if (isLocked || pickingImage) return;
    const hasPermission = await permissionService.request('camera');
    if (!hasPermission) return;
    setPickingImage(true);

    try {
      const image = await ImagePicker.openCamera({
        width: 1000,
        height: 1000,
        cropping: true,
        mediaType: 'photo',
        compressImageQuality: 0.8,
      });

      if (image?.size && image.size > 1 * 1024 * 1024) {
        showErrorToast(
          'File Too Large',
          'Selected chat image must be 1 MB or less.',
        );
        return;
      }

      setSelectedImage(image);
      setShowPhotoSheet(false);
    } catch (e) {
      console.log(e);
    } finally {
      setPickingImage(false);
    }
  };

  if (loading) return <ChatDetailsSkeleton />;

  const canSend = !!inputText.trim() || !!selectedImage;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {/* Header */}
      <ChatHeaderBar
        navigation={navigation}
        setShowLocationModal={setShowLocationModal}
        partnerName={partnerName}
        avatar={avatar}
        shipment={shipment}
      />
      <FlatList
        data={messages}
        keyExtractor={item => item?._id}
        renderItem={renderMessage}
        inverted
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* --- IMAGE DRAFT PREVIEW SECTION --- */}
      {selectedImage && !isLocked && (
        <View style={styles.draftPreviewContainer}>
          <View style={styles.draftImageWrapper}>
            <Image
              source={{ uri: selectedImage.path }}
              style={styles.draftImage}
            />
            <TouchableOpacity
              style={styles.cancelDraftBtn}
              onPress={() => setSelectedImage(null)}
            >
              <AppIcon
                name={'X'}
                size={ICON_SIZE.xs}
                color={COLORS.white}
                strokeWidth={2.5}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Bottom Area: Input Bar or Locked Notice */}

      <ChatInputBar
        isLocked={isLocked}
        inputText={inputText}
        setInputText={setInputText}
        setShowPhotoSheet={setShowPhotoSheet}
        showPhotoSheet={showPhotoSheet}
        canSend={canSend}
        sending={sending}
        handleSend={handleSend}
      />

      {showPhotoSheet && !isLocked && (
        <Suspense fallback={null}>
          <PhotoSourceSheet
            visible={showPhotoSheet}
            onClose={() => setShowPhotoSheet(!showPhotoSheet)}
            onCamera={takeProfilePhoto}
            onGallery={pickPhotoFromGallery}
            hasImage={true}
          />
        </Suspense>
      )}

      {/* Shipment Location Details Modal */}
      {showLocationModal && (
        <Suspense fallback={<ActivityIndicator size={'small'} />}>
          <ShipmentLocationModal
            isVisible={showLocationModal}
            onClose={() => setShowLocationModal(false)}
            shipment={shipment}
          />
        </Suspense>
      )}
    </KeyboardAvoidingView>
  );
};

export default ChatDetails;
