// src/types/notification.ts
export interface NotificationActivity {
  _id: string;
  type: 'chat_message' | 'vehicle_assigned' | string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data: {
    shipmentId?: string;
    [key: string]: any;
  };
}

export interface GetNotificationsResponse {
  success: boolean;
  data: NotificationActivity[];
  unreadCount: number;
  pagination: {
    total: number;
    totalPages: number;
  };
}

 