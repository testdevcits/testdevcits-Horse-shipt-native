import { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import customerService from '../../../../api/services/customerService';
 
const useChatDetails = (shipmentId: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [room, setRoom] = useState<any>(null);
  const [shipment, setShipment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { user } = useSelector((state: any) => state.auth); // To identify "Me"

  const initChat = useCallback(async () => {
    try {
      setLoading(true);
      const roomRes = await customerService.getChatRoom(shipmentId);
      if (roomRes.success) {
        setRoom(roomRes.room);
        setShipment(roomRes.shipment);
        
        const msgRes = await customerService.getChatMessages(roomRes.roomId);
        if (msgRes.success) {
          // Sort messages by latest first for inverted FlatList
          setMessages(msgRes.messages.reverse());
        }
      }
    } catch (error) {
      console.error("Chat Init Error:", error);
    } finally {
      setLoading(false);
    }
  }, [shipmentId]);

  useEffect(() => { initChat(); }, [initChat]);

  const onSend = async (text: string) => {
    if (!text.trim() || !room?._id) return;
    try {
      setSending(true);
      const res = await customerService.sendMessage(room._id, { message: text });
      if (res.success) {
        setMessages(prev => [res.data, ...prev]);
      }
    } catch (error) {
      console.error("Send Error:", error);
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
    refresh: initChat
  };
};

export default useChatDetails;