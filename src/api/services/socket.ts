import { io, Socket } from 'socket.io-client';
import { API_ORIGIN } from '../../config/constants';

export const createChatSocket = (identity: { userId: string; role: string }): Socket =>
  io(API_ORIGIN, {
    path: '/socket.io',
    transports: ['polling', 'websocket'],
    auth: { userId: identity.userId, role: identity.role },
    autoConnect: false,
    reconnection: true,
    reconnectionDelay: 1000,
  });
