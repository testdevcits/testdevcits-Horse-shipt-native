import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  ActivityIndicator,
  Pressable,
  Platform,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import styles from './style.chatdetail';
import { COLORS, ICON_SIZE } from '../../../../constants';
import useChatDetails from './useChatDetails';
import {
  AppText,
  ChatDetailsSkeleton,
  ImageViewer,
} from '../../../../components';
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

const ChatMessageImage = ({
  uri,
  onPress,
}: {
  uri?: string;
  onPress: () => void;
}) => {
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
    <Pressable onPress={onPress}>
      <Image
        source={{ uri }}
        style={styles.mediaImage}
        resizeMode="cover"
        onError={() => setHasError(true)}
      />
    </Pressable>
  );
};

const ChatDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { shipmentId, name, isChatLocked, avatar }: any = route.params || {};
  const [inputText, setInputText] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [showPhotoSheet, setShowPhotoSheet] = useState(false);
  const [selectedImage, setSelectedImage] = useState<PickerImage | null>(null);
  const [pickingImage, setPickingImage] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [chatselectedImage, setChatSelectedImage] = useState<string>('');

  const { user } = useSelector((state: any) => state.auth || {});
  const MY_ROLE = user?.role || 'customer';

  const { messages, loading, shipment, sendMessage, sending, partnerTyping, updateTyping } =
    useChatDetails(shipmentId);

  const initialContainerHeight = useRef(0);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const showSubscription = Keyboard.addListener('keyboardDidShow', event => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const androidKeyboardOverlap =
    Platform.OS === 'android'
      ? Math.max(
          0,
          keyboardHeight - (initialContainerHeight.current - containerHeight),
        )
      : 0;

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
    const hasMedia = item?.media && item?.media?.length > 0;
    const hasMessage =
      typeof item?.message === 'string' && item.message.length > 0;

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
          {!hasMedia && (
            <AppText style={styles.timestamp}>
              {formatMessageTime(item?.createdAt)}
            </AppText>
          )}
        </View>

        <View
          style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}
        >
          {hasMedia && (
            <ChatMessageImage
              uri={item?.media?.[0]?.url}
              onPress={() => {
                setChatSelectedImage(item?.media?.[0]?.url);
                setImageViewerVisible(true);
              }}
            />
          )}
          {typeof item?.message === 'string' &&
          item.message.length === 0 &&
          !hasMedia ? (
            <AppText
              style={[
                styles.messageText,
                isMe ? styles.myText : styles.otherText,
              ]}
            >
              This message is deleted
            </AppText>
          ) : hasMessage ? (
            <AppText
              style={[
                styles.messageText,
                isMe ? styles.myText : styles.otherText,
              ]}
            >
              {item?.message}
            </AppText>
          ) : null}
          {hasMedia && (
            <AppText style={styles.timestamp}>
              {formatMessageTime(item?.createdAt)}
            </AppText>
          )}
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
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      onLayout={({ nativeEvent }) => {
        const { height } = nativeEvent.layout;
        if (height > initialContainerHeight.current) {
          initialContainerHeight.current = height;
        }
        setContainerHeight(height);
      }}
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

      <View style={{ marginBottom: androidKeyboardOverlap }}>
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

        {partnerTyping && !isLocked && (
          <AppText style={[styles.headerSubtitle, { marginHorizontal: 16, marginBottom: 6 }]}>
            {partnerName} is typing...
          </AppText>
        )}

        <ChatInputBar
          isLocked={isLocked}
          inputText={inputText}
          setInputText={(text: string) => { setInputText(text); updateTyping(text); }}
          setShowPhotoSheet={setShowPhotoSheet}
          showPhotoSheet={showPhotoSheet}
          canSend={canSend}
          sending={sending}
          handleSend={handleSend}
        />
      </View>

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

      <Suspense fallback={null}>
        <ImageViewer
          visible={imageViewerVisible}
          image={chatselectedImage}
          title="Image"
          onClose={() => setImageViewerVisible(false)}
        />
      </Suspense>
    </KeyboardAvoidingView>
  );
};

export default ChatDetails;
