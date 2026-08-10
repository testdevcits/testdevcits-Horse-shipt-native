import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import customerService from '../../../../api/services/customerService';
import shipperService from '../../../../api/services/shipperService';
import { Platform } from 'react-native';

const useChatDetails = (shipmentId: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [room, setRoom] = useState<any>(null);
  const [shipment, setShipment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { user } = useSelector((state: any) => state.auth || {});

  const isShipper = user?.role === 'shipper';

  const initChat = useCallback(async () => {
    try {
      setLoading(true);
      let roomRes: any;
      if (isShipper) {
        roomRes = await shipperService?.getOrCreateChatRoom(shipmentId);
      } else {
        roomRes = await customerService?.getChatRoom(shipmentId);
      }

      if (roomRes?.success) {

        // console.log('Chat Room:======pickupLocation========', roomRes?.shipment?.pickupLocation);
        // console.log('Chat Room:======deliveryLocation========', roomRes?.shipment?.deliveryLocation);

        setRoom(roomRes?.room);
        setShipment(roomRes?.shipment);
        const roomId = roomRes?.roomId || roomRes?.room?._id;
        let msgRes: any;
        if (isShipper) {
          msgRes = await shipperService?.getChatRoomMessages(roomId);
        } else {
          msgRes = await customerService?.getChatMessages(roomId);
        }

        if (msgRes?.success) {
          // Sort messages by latest first for inverted FlatList
          const rawMsgs = msgRes.messages || [];
          setMessages([...rawMsgs].reverse());
        }
      }
    } catch (error) {
      console.error('Chat Init Error:', error);
    } finally {
      setLoading(false);
    }
  }, [shipmentId, isShipper]);

  useEffect(() => {
    initChat();
  }, [initChat]);

  const onSend = async (text?: string, imageFile?: any) => {
    if (!text?.trim() && !imageFile) return false;
    const roomId = room?._id;
    if (!roomId) return false;

    try {
      setSending(true);
      let res: any;

      if (imageFile) {
        const formData = new FormData();

        if (text?.trim()) {
          formData?.append('message', text.trim());
        }

        formData?.append('image', {
          uri:
            Platform.OS === 'android'
              ? imageFile.path
              : imageFile.path.replace('file://', ''),
          type: imageFile.mime || 'image/jpeg',
          name: imageFile.filename || `chat_image_${Date.now()}.jpg`,
        } as any);

        if (isShipper) {
          res = await shipperService?.sendChatMessage(roomId, formData);
        } else {
          res = await customerService?.sendMessage(roomId, formData);
        }
      } else {
        const payload = { message: text?.trim() || '' };
        if (isShipper) {
          res = await shipperService?.sendChatMessage(roomId, payload);
        } else {
          res = await customerService?.sendMessage(roomId, payload);
        }
      }

      if (res?.success) {
        const newMsg = res.data || res.message;
        if (newMsg) {
          setMessages(prev => [newMsg, ...prev]);
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error('Send Error:', error);
      return false;
    } finally {
      setSending(false);
    }
  };

  return {
    messages,
    room,
    shipment,
    loading,
    sending,
    currentUser: user,
    sendMessage: onSend,
    refresh: initChat,
  };
};

export default useChatDetails;
