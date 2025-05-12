import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const NotificationContext = createContext({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
});

export function NotificationProvider({ children }) {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!session) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications');
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [session]);

  const markAsRead = async (id) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);  