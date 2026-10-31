import { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import customerService from '../../../../api/services/customerService';
import shipperService from '../../../../api/services/shipperService';
import { io, Socket } from 'socket.io-client';
import { BASE_URL } from '../../../../config/constants';
import { AppState, Platform } from 'react-native';

const useChatDetails = (shipmentId: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [room, setRoom] = useState<any>(null);
  const [shipment, setShipment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { user } = useSelector((state: any) => state.auth || {});

  const socketRef = useRef<Socket | null>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const peerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTyping = useRef(0);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const upsertMessage = useCallback((message: any) => {
    if (!message?._id) return;
    setMessages(previous => {
      const found = previous.some(item => item._id === message._id);
      const next = found ? previous.map(item => item._id === message._id ? message : item) : [message, ...previous];
      return next.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    });
  }, []);
  const updateTyping = useCallback((text: string) => {
    const socket = socketRef.current;
    if (typingTimer.current) clearTimeout(typingTimer.current);
    if (!socket?.connected || !room?._id) return;
    const isTyping = Boolean(text.trim());
    if (!isTyping || Date.now() - lastTyping.current > 900) {
      socket.emit('horse_shipt:typing', { roomId: room._id, isTyping });
      lastTyping.current = Date.now();
    }
    if (isTyping) typingTimer.current = setTimeout(() => {
      socket.emit('horse_shipt:typing', { roomId: room._id, isTyping: false });
    }, 1500);
  }, [room?._id]);

  const userId = user?._id || user?.id;
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

        setRoom({ ...roomRes?.room, _id: roomRes?.roomId || roomRes?.room?._id });
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
          setMessages(previous => {
            const merged = new Map(previous.map(item => [item._id, item]));
            rawMsgs.forEach((item: any) => merged.set(item._id, item));
            return [...merged.values()].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          });
        }
      }
    } catch (error) {
      console.error('Chat Init Error:', error);
    } finally {
      setLoading(false);
    }
  }, [shipmentId, isShipper]);

  useEffect(() => {
    setMessages([]);
    setRoom(null);
    initChat();
  }, [initChat]);

  useEffect(() => {
    const roomId = room?._id;
    if (!roomId || !userId || !user?.role) return;
    const socket = io(BASE_URL.replace(/\/api\/?$/, '').replace(/\/+$/, ''), {
      path: '/socket.io', autoConnect: false,
      auth: { userId, role: user.role },
      transports: ['polling', 'websocket'], reconnection: true,
    });
    socketRef.current = socket;
    const join = () => socket.timeout(10000).emit('horse_shipt:join_chat_room', { roomId }, async (error: any, result: any) => {
      if (error || !result?.success) {
        console.warn('[Chat socket] room join failed', error?.message || result?.message);
        return;
      }
      // Recover messages sent while disconnected without closing the socket.
      try {
        const response: any = isShipper ? await shipperService.getChatRoomMessages(roomId) : await customerService.getChatMessages(roomId);
        if (socket.connected && response?.success) response.messages?.forEach(upsertMessage);
      } catch { console.warn('[Chat socket] history sync failed'); }
    });
    const receive = (message: any) => {
      if (String(message?.chatRoom) !== String(roomId)) return;
      upsertMessage(message);
      if (String(message.senderId) !== String(userId)) setPartnerTyping(false);
    };
    socket.on('connect', join);
    socket.on('connect_error', error => console.warn('[Chat socket] connection failed', error.message));
    socket.on('receiveMessage', receive);
    socket.on('messageEdited', receive);
    socket.on('messageDeleted', receive);
    socket.on('horse_shipt:typing', data => {
      if (data.roomId !== roomId || data.userId === userId) return;
      setPartnerTyping(Boolean(data.isTyping));
      if (peerTimer.current) clearTimeout(peerTimer.current);
      peerTimer.current = setTimeout(() => setPartnerTyping(false), 3000);
    });
    socket.on('disconnect', () => setPartnerTyping(false));
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') { if (socket.connected) join(); else socket.connect(); }
      else { socket.emit('horse_shipt:typing', { roomId, isTyping: false }); }
    });
    socket.connect();
    return () => {
      subscription.remove();
      if (typingTimer.current) clearTimeout(typingTimer.current);
      if (peerTimer.current) clearTimeout(peerTimer.current);
      socket.emit('horse_shipt:typing', { roomId, isTyping: false });
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
      setPartnerTyping(false);
    };
  }, [room?._id, userId, user?.role, isShipper, upsertMessage]);

  const onSend = async (text?: string, imageFile?: any) => {
    if (!text?.trim() && !imageFile) return false;
    const roomId = room?._id;
    if (!roomId) return false;

    try {
      setSending(true);
      updateTyping('');
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
          upsertMessage(newMsg);
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
    partnerTyping,
    updateTyping,
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
