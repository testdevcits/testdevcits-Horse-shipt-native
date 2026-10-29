import { io, Socket } from 'socket.io-client';
import { API_ORIGIN } from '../../config/constants';

export const createChatSocket = (): Socket =>
  io(API_ORIGIN, {
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    autoConnect: false,
    reconnection: true,
    reconnectionDelay: 1000,
  });
