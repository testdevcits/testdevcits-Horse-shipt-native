import React, { useState } from 'react';
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
import { ChevronLeft, Send, Upload, MoreVertical, X } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import styles from './style.chatdetail';
import { COLORS, ICON_SIZE } from '../../../../constants';
import useChatDetails from './useChatDetails';
import { AppText, PhotoSourceSheet } from '../../../../components';
import ImagePicker, {
  Image as PickerImage,
} from 'react-native-image-crop-picker';
import { permissionService } from '../../../../utils/cameragalleryPermission';
import imageIndex from '../../../../assets/images/imageIndex';

const ChatDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { shipmentId, name }: any = route.params || {};
  const [inputText, setInputText] = useState('');
  const [showPhotoSheet, setShowPhotoSheet] = useState(false);
  const [selectedImage, setSelectedImage] = useState<PickerImage | null>(null);

  const { user } = useSelector((state: any) => state.auth || {});
  const MY_ROLE = user?.role || 'customer';

  const { messages, loading, shipment, sendMessage, sending } =
    useChatDetails(shipmentId);

  const partnerName = name || (MY_ROLE === 'shipper' ? 'Customer' : 'Shipper');

  const handleSend = async () => {
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
      item.senderRole === MY_ROLE ||
      (user?._id && item.senderId === user._id);
    const hasMedia = item.media && item.media.length > 0;

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
            {formatMessageTime(item.createdAt)}
          </AppText>
        </View>

        <View
          style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}
        >
          {hasMedia && (
            <Image
              source={{ uri: item.media[0].url }}
              style={styles.mediaImage}
              resizeMode="cover"
            />
          )}
          {item.message ? (
            <AppText
              style={[
                styles.messageText,
                isMe ? styles.myText : styles.otherText,
              ]}
            >
              {item.message}
            </AppText>
          ) : null}
        </View>
      </View>
    );
  };

  const pickPhotoFromGallery = async () => {
    const hasPermission = await permissionService.request('gallery');
    if (!hasPermission) return;

    try {
      const image = await ImagePicker.openPicker({
        width: 1000,
        height: 1000,
        cropping: true,
        mediaType: 'photo',
      });
      setSelectedImage(image);
      setShowPhotoSheet(false);
    } catch (e) {
      console.log(e);
    }
  };

  const takeProfilePhoto = async () => {
    const hasPermission = await permissionService.request('camera');
    if (!hasPermission) return;

    try {
      const image = await ImagePicker.openCamera({
        width: 1000,
        height: 1000,
        cropping: true,
        mediaType: 'photo',
      });
      setSelectedImage(image);
      setShowPhotoSheet(false);
    } catch (e) {
      console.log(e);
    }
  };

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={COLORS.goldPrimary} size="large" />
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
        <Image
          source={imageIndex.AccountIcon}
          style={styles.headerAvatar}
        />
        <View style={styles.headerInfo}>
          <AppText style={styles.headerTitle}>{partnerName}</AppText>
          <AppText style={styles.headerSubtitle}>
            Shipment ID {shipment?.shipmentCode || 'HS-SHIP-0000'}
          </AppText>
        </View>
        <TouchableOpacity>
          <MoreVertical color={COLORS.textPrimary} size={ICON_SIZE.sm} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        keyExtractor={item => item._id}
        renderItem={renderMessage}
        inverted
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* --- IMAGE DRAFT PREVIEW SECTION --- */}
      {selectedImage && (
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

      {/* Input Bar */}
      <View style={styles.footer}>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Type a message..."
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholderTextColor={COLORS.textLight}
            multiline
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

      <PhotoSourceSheet
        visible={showPhotoSheet}
        onClose={() => setShowPhotoSheet(!showPhotoSheet)}
        onCamera={takeProfilePhoto}
        onGallery={pickPhotoFromGallery}
        hasImage={true}
      />
    </KeyboardAvoidingView>
  );
};

export default ChatDetails;
