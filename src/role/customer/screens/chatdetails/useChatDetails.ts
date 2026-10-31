import { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import customerService from '../../../../api/services/customerService';
import shipperService from '../../../../api/services/shipperService';
import { AppState, AppStateStatus, Platform } from 'react-native';
import type { Socket } from 'socket.io-client';
import { createChatSocket } from '../../../../api/services/socket';

const useChatDetails = (shipmentId: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [room, setRoom] = useState<any>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [shipment, setShipment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { user } = useSelector((state: any) => state.auth || {});
  const activeRequestRef = useRef(0);

  const userId = user?.id || user?._id;
  const socketRef = useRef<Socket | null>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const peerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTyping = useRef(0);
  const [partnerTyping, setPartnerTyping] = useState(false);

  const updateTyping = useCallback((text: string) => {
    if (typingTimer.current) clearTimeout(typingTimer.current);
    const socket = socketRef.current;
    if (!socket?.connected || !roomId) return;
    const isTyping = Boolean(text.trim());
    if (!isTyping || Date.now() - lastTyping.current > 900) {
      socket.emit('horse_shipt:typing', { roomId, isTyping });
      lastTyping.current = Date.now();
    }
    if (isTyping) typingTimer.current = setTimeout(() => {
      socket.emit('horse_shipt:typing', { roomId, isTyping: false });
    }, 1500);
  }, [roomId]);

  const isShipper = user?.role === 'shipper';

  const mergeMessages = useCallback((current: any[], incoming: any[]) => {
    const messagesById = new Map<string, any>();
    current.forEach(message => {
      if (message?._id) {
        messagesById.set(String(message._id), message);
      }
    });
    incoming.forEach(message => {
      if (message?._id) {
        messagesById.set(String(message._id), message);
      }
    });

    return Array.from(messagesById.values()).sort((first, second) => {
      const firstTime = new Date(first.createdAt || 0).getTime();
      const secondTime = new Date(second.createdAt || 0).getTime();
      return secondTime - firstTime;
    });
  }, []);

  const loadMessages = useCallback(
    async (targetRoomId: string) => {
      const msgRes = isShipper
        ? await shipperService.getChatRoomMessages(targetRoomId)
        : await customerService.getChatMessages(targetRoomId);

      if (msgRes?.success && Array.isArray(msgRes.messages)) {
        setMessages(current => mergeMessages(current, msgRes.messages));
      }
    },
    [isShipper, mergeMessages],
  );

  const initChat = useCallback(async () => {
    const requestId = activeRequestRef.current + 1;
    activeRequestRef.current = requestId;
    setRoom(null);
    setRoomId(null);
    setShipment(null);
    setMessages([]);
    try {
      setLoading(true);
      const roomRes = isShipper
        ? await shipperService.getOrCreateChatRoom(shipmentId)
        : await customerService.getChatRoom(shipmentId);

      if (roomRes?.success) {
        const resolvedRoomId = roomRes?.roomId || roomRes?.room?._id;
        if (!resolvedRoomId || requestId !== activeRequestRef.current) {
          return;
        }

        setRoom(roomRes.room);
        setRoomId(String(resolvedRoomId));
        setShipment(roomRes.shipment);
        await loadMessages(resolvedRoomId);
      }
    } catch (error) {
      console.error('Chat Init Error:', error);
    } finally {
      if (requestId === activeRequestRef.current) {
        setLoading(false);
      }
    }
  }, [shipmentId, isShipper, loadMessages]);

  useEffect(() => {
    initChat();
    return () => {
      activeRequestRef.current += 1;
    };
  }, [initChat]);

  useEffect(() => {
    if (!roomId || !userId || !['customer', 'shipper'].includes(user?.role)) {
      return;
    }

    const chatSocket = createChatSocket({ userId, role: user.role });
    socketRef.current = chatSocket;
    let active = true;
    const handleConnect = () => {
      chatSocket.timeout(10000).emit('horse_shipt:join_chat_room', { roomId }, (error: Error | null, result: any) => {
        if (!active) return;
        if (error || !result?.success) {
          console.warn('[Chat socket] room join failed:', error?.message || result?.message);
          return;
        }
        console.info('[Chat socket] room joined:', roomId);
        loadMessages(roomId).catch(error => {
          console.error('Chat reconnect history load error:', error);
        });
      });
    };
    const handleTyping = (data: any) => {
      if (data?.roomId !== roomId || String(data.userId) === String(userId)) return;
      setPartnerTyping(data.isTyping === true);
      if (peerTimer.current) clearTimeout(peerTimer.current);
      peerTimer.current = setTimeout(() => setPartnerTyping(false), 3000);
    };
    const handleDisconnect = () => setPartnerTyping(false);
    const handleMessage = (message: any) => {
      const messageRoomId =
        typeof message?.chatRoom === 'object'
          ? message.chatRoom?._id
          : message?.chatRoom;
      if (messageRoomId && String(messageRoomId) !== roomId) {
        return;
      }
      if (message?._id) {
        setMessages(current => mergeMessages(current, [message]));
        if (String(message.senderId) !== String(userId)) setPartnerTyping(false);
      }
    };
    const handleConnectError = (error: Error) => {
      console.warn('Chat socket connection error:', error.message);
    };
    let previousAppState: AppStateStatus | null = AppState.currentState;
    const appStateSubscription = AppState.addEventListener(
      'change',
      nextAppState => {
        if (previousAppState !== 'active' && nextAppState === 'active') {
          if (chatSocket.connected) handleConnect();
          else chatSocket.connect();
        }
        if (nextAppState !== 'active' && chatSocket.connected) {
          chatSocket.emit('horse_shipt:typing', { roomId, isTyping: false });
        }
        previousAppState = nextAppState;
      },
    );

    chatSocket.on('connect', handleConnect);
    chatSocket.on('receiveMessage', handleMessage);
    chatSocket.on('messageEdited', handleMessage);
    chatSocket.on('messageDeleted', handleMessage);
    chatSocket.on('horse_shipt:typing', handleTyping);
    chatSocket.on('disconnect', handleDisconnect);
    chatSocket.on('connect_error', handleConnectError);
    chatSocket.connect();

    return () => {
      active = false;
      if (typingTimer.current) clearTimeout(typingTimer.current);
      if (peerTimer.current) clearTimeout(peerTimer.current);
      if (chatSocket.connected) chatSocket.emit('horse_shipt:typing', { roomId, isTyping: false });
      chatSocket.removeAllListeners();
      socketRef.current = null;
      setPartnerTyping(false);
      appStateSubscription.remove();
      chatSocket.disconnect();
    };
  }, [roomId, userId, user?.role, loadMessages, mergeMessages]);

  const onSend = async (text?: string, imageFile?: any) => {
    if (!text?.trim() && !imageFile) return false;
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
          setMessages(current => mergeMessages(current, [newMsg]));
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
    roomId,
    shipment,
    loading,
    sending,
    currentUser: user,
    sendMessage: onSend,
    refresh: initChat,
  };
};

export default useChatDetails;
