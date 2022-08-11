import { Notification } from '../../types';
import { createNotification } from '../broker/notification';

export const showNotification = async (_: any, notification: Notification) => {
  createNotification(notification);
};
