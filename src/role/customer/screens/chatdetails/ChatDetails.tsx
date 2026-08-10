import React, { useState, lazy, Suspense } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {
  ChevronLeft,
  Send,
  Upload,
  MoreVertical,
  X,
  Lock,
  Image as ImageIcon,
} from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import styles from './style.chatdetail';
import { COLORS, ICON_SIZE } from '../../../../constants';
import useChatDetails from './useChatDetails';
import { AppText, Input } from '../../../../components';
import ImagePicker, {
  Image as PickerImage,
} from 'react-native-image-crop-picker';
import Toast from 'react-native-toast-message';
import { permissionService } from '../../../../utils/cameragalleryPermission';
import imageIndex from '../../../../assets/images/imageIndex';
import { set } from 'date-fns';

const PhotoSourceSheet = lazy(
  () => import('../../../../components/common/PhotoSourceSheet'),
);

const ChatMessageImage = ({ uri }: { uri?: string }) => {
  const [hasError, setHasError] = useState(false);

  if (!uri || hasError) {
    return (
      <View style={styles.mediaImageFallback}>
        <ImageIcon size={22} color={COLORS.grey400} />
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
  const { shipmentId, name, isChatLocked }: any = route.params || {};
  const [inputText, setInputText] = useState('');
  const [showPhotoSheet, setShowPhotoSheet] = useState(false);
  const [selectedImage, setSelectedImage] = useState<PickerImage | null>(null);
  const [pickingImage, setPickingImage] = useState(false);

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
        Toast.show({
          type: 'error',
          text1: 'File Too Large',
          text2: 'Selected chat image must be 1 MB or less.',
        });
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
        Toast.show({
          type: 'error',
          text1: 'File Too Large',
          text2: 'Selected chat image must be 1 MB or less.',
        });
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

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    );

  const canSend = !!inputText.trim() || !!selectedImage;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft color={COLORS.textPrimary} size={ICON_SIZE.md} />
        </TouchableOpacity>
        <Image source={imageIndex.AccountIcon} style={styles.headerAvatar} />
        <View style={styles.headerInfo}>
          <AppText style={styles.headerTitle}>{partnerName}</AppText>
          <AppText style={styles.headerSubtitle}>
            Shipment ID {shipment?.shipmentCode || 'Not Available'}
          </AppText>
        </View>
        <TouchableOpacity>
          <MoreVertical color={COLORS.textPrimary} size={ICON_SIZE.sm} />
        </TouchableOpacity>
      </View>

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
              <X size={ICON_SIZE.xs} color={COLORS.white} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Bottom Area: Input Bar or Locked Notice */}
      {isLocked ? (
        <View style={styles.lockedContainer}>
          <Lock size={18} color={COLORS.grey500} style={{ marginRight: 8 }} />
          <AppText style={styles.lockedText}>
            Chat is locked because this shipment is completed.
          </AppText>
        </View>
      ) : (
        <View style={styles.footer}>
          <View style={{ flex: 1 }}>
            <Input
              placeholder="Type a message..."
              value={inputText}
              onChangeText={setInputText}
              multiline
              containerStyle={{ marginBottom: 0 }}
            />
          </View>

          <TouchableOpacity
            onPress={() => setShowPhotoSheet(!showPhotoSheet)}
            style={styles.squareActionBtn}
            activeOpacity={0.7}
          >
            <Upload size={ICON_SIZE.sm} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.squareActionBtn,
              styles.sendBtn,
              (!canSend || sending) && styles.disabledSendBtn,
            ]}
            onPress={handleSend}
            disabled={sending || !canSend}
            activeOpacity={0.8}
          >
            {sending ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <Send size={ICON_SIZE.sm} color={COLORS.white} />
            )}
          </TouchableOpacity>
        </View>
      )}

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
    </KeyboardAvoidingView>
  );
};

export default ChatDetails;
