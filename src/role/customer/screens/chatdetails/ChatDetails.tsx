import React, { useState, useMemo } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { ChevronLeft, Send, Upload, MoreVertical, X } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from './style.chatdetail';
import { COLORS } from '../../../../constants';
import useChatDetails from './useChatDetails';
import { AppText, PhotoSourceSheet } from '../../../../components';
import ImagePicker, {
  Image as PickerImage,
} from 'react-native-image-crop-picker';
import { permissionService } from '../../../../utils/cameragalleryPermission';
const ChatDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { shipmentId }: any = route.params;
  const [inputText, setInputText] = useState('');
  const [showPhotoSheet, setShowPhotoSheet] = useState(false);
  const [photoBase64, setPhotoBase64] = useState<string | undefined>();
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [selectedImage, setSelectedImage] = useState<PickerImage | null>(null);

  const { messages, loading, shipment, sendMessage, sending } =
    useChatDetails(shipmentId);

  // Determine the user's role to identify "isMe"
  // Based on your JSON, we'll assume the App User is the 'customer'
  const MY_ROLE = 'customer';

  const handleSend = async () => {
    // Call hook with both text and the selected image object
    const success = await sendMessage(inputText, selectedImage);
    if (success) {
      setInputText('');
      setSelectedImage(null); // Clear the draft preview
    }
  };

  const formatMessageTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
    const time = date
      .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      .toLowerCase();
    return `${day} ${time}`;
  };

  const renderMessage = ({ item }: any) => {
    const isMe = item.senderRole === MY_ROLE;
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
            {isMe ? 'You' : 'Shipper'}
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

  const handlePickedImage = (image: PickerImage) => {
    if (image.data) {
      setPhotoBase64(image.data);
      setPhotoUri(image.path);
    }
  };

  // Improved Pick Handlers with Permissions
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft color={COLORS.textPrimary} size={28} />
        </TouchableOpacity>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }}
          style={styles.headerAvatar}
        />
        <View style={styles.headerInfo}>
          <AppText style={styles.headerTitle}>Shipper</AppText>
          <AppText style={styles.headerSubtitle}>
            Shipment ID {shipment?.shipmentCode || 'HS-SHIP-0000'}
          </AppText>
        </View>
        <TouchableOpacity>
          <MoreVertical color={COLORS.textPrimary} size={22} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        keyExtractor={item => item._id}
        renderItem={renderMessage}
        inverted
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        // Optional: Add Date Separator logic here if needed
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
              <X size={16} color={COLORS.white} strokeWidth={3} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Input Bar */}
      <View style={styles.footer}>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Type a message"
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
        >
          <Upload size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.squareActionBtn, styles.sendBtn]}
          onPress={handleSend}
          disabled={sending || (!inputText.trim() && !selectedImage)}
        >
          {sending ? (
            <ActivityIndicator color={COLORS.white} size="small" />
          ) : (
            <Send size={20} color={COLORS.white} />
          )}
        </TouchableOpacity>
      </View>

      <PhotoSourceSheet
        visible={showPhotoSheet}
        onClose={() => setShowPhotoSheet(!showPhotoSheet)}
        onCamera={takeProfilePhoto}
        onGallery={pickPhotoFromGallery}
        hasImage={true} // Set true if user already has a photo
        // onRemove={() => console.log('Remove logic')}
      />
    </KeyboardAvoidingView>
  );
};

export default ChatDetails;
