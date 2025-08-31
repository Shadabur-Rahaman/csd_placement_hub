import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/client';
import { useTheme } from '../../contexts/ThemeContext';
import { toast } from 'react-hot-toast';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Form state
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info'); // info, success, warning, error
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [priority, setPriority] = useState('normal'); // low, normal, high

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const notificationsCollection = collection(db, 'notifications');
      const notificationsSnapshot = await getDocs(notificationsCollection);
      const notificationsData = notificationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate?.toDate(),
        endDate: doc.data().endDate?.toDate()
      }));
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const startTimestamp = Timestamp.fromDate(new Date(startDate));
      const endTimestamp = Timestamp.fromDate(new Date(endDate));

      console.log('Creating notification with data:', {
        title,
        message,
        type,
        startDate: startTimestamp.toDate(),
        endDate: endTimestamp.toDate(),
        priority,
        active: true
      });

      const notificationData = {
        title,
        message,
        type,
        startDate: startTimestamp,
        endDate: endTimestamp,
        priority,
        createdAt: Timestamp.now(),
        active: true
      };

      if (currentNotification) {
        // Update existing notification
        await updateDoc(doc(db, 'notifications', currentNotification.id), notificationData);
        console.log('Updated notification:', currentNotification.id);
        toast.success('Notification updated successfully');
      } else {
        // Add new notification
        const docRef = await addDoc(collection(db, 'notifications'), notificationData);
        console.log('Created new notification:', docRef.id);
        toast.success('Notification created successfully');
      }

      // Reset form and refresh list
      resetForm();
      fetchNotifications();
    } catch (error) {
      console.error('Error saving notification:', error);
      toast.error('Failed to save notification');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'notifications', id));
      toast.success('Notification deleted successfully');
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const handleEdit = (notification) => {
    setCurrentNotification(notification);
    setTitle(notification.title);
    setMessage(notification.message);
    setType(notification.type);
    setStartDate(notification.startDate.toISOString().split('T')[0]);
    setEndDate(notification.endDate.toISOString().split('T')[0]);
    setPriority(notification.priority);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setCurrentNotification(null);
    setTitle('');
    setMessage('');
    setType('info');
    setStartDate('');
    setEndDate('');
    setPriority('normal');
    setIsModalOpen(false);
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>
          Notification Management
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className={`px-4 py-2 rounded-lg ${
            isLight
              ? 'bg-violet-600 text-white hover:bg-violet-700'
              : 'bg-violet-500 text-white hover:bg-violet-400'
          } transition-colors`}
        >
          Add New Notification
        </button>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
            isLight ? 'border-violet-600' : 'border-violet-400'
          }`}></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg ${
                isLight
                  ? 'bg-white shadow-lg'
                  : 'bg-white/5 backdrop-blur-sm'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getTypeStyles(notification.type)}`}>
                      {notification.type.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      notification.priority === 'high'
                        ? 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400'
                        : notification.priority === 'normal'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400'
                    }`}>
                      {notification.priority.toUpperCase()}
                    </span>
                  </div>
                  <h3 className={`text-lg font-semibold mb-1 ${
                    isLight ? 'text-gray-900' : 'text-white'
                  }`}>{notification.title}</h3>
                  <p className={`mb-2 ${
                    isLight ? 'text-gray-600' : 'text-gray-400'
                  }`}>{notification.message}</p>
                  <div className={`text-sm ${
                    isLight ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    {notification.startDate.toLocaleDateString()} - {notification.endDate.toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(notification)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors text-red-600 dark:text-red-400"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`w-full max-w-lg rounded-2xl ${
              isLight
                ? 'bg-white'
                : 'bg-gray-900'
            } p-6 shadow-2xl`}
          >
            <h2 className={`text-xl font-bold mb-4 ${
              isLight ? 'text-gray-900' : 'text-white'
            }`}>
              {currentNotification ? 'Edit Notification' : 'Add New Notification'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block mb-1 ${
                  isLight ? 'text-gray-700' : 'text-gray-300'
                }`}>Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg ${
                    isLight
                      ? 'bg-gray-50 border border-gray-300'
                      : 'bg-gray-800 border border-gray-700'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block mb-1 ${
                  isLight ? 'text-gray-700' : 'text-gray-300'
                }`}>Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg ${
                    isLight
                      ? 'bg-gray-50 border border-gray-300'
                      : 'bg-gray-800 border border-gray-700'
                  }`}
                  rows="3"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block mb-1 ${
                    isLight ? 'text-gray-700' : 'text-gray-300'
                  }`}>Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg ${
                      isLight
                        ? 'bg-gray-50 border border-gray-300'
                        : 'bg-gray-800 border border-gray-700'
                    }`}
                  >
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>

                <div>
                  <label className={`block mb-1 ${
                    isLight ? 'text-gray-700' : 'text-gray-300'
                  }`}>Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg ${
                      isLight
                        ? 'bg-gray-50 border border-gray-300'
                        : 'bg-gray-800 border border-gray-700'
                    }`}
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block mb-1 ${
                    isLight ? 'text-gray-700' : 'text-gray-300'
                  }`}>Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg ${
                      isLight
                        ? 'bg-gray-50 border border-gray-300'
                        : 'bg-gray-800 border border-gray-700'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className={`block mb-1 ${
                    isLight ? 'text-gray-700' : 'text-gray-300'
                  }`}>End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg ${
                      isLight
                        ? 'bg-gray-50 border border-gray-300'
                        : 'bg-gray-800 border border-gray-700'
                    }`}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className={`px-4 py-2 rounded-lg ${
                    isLight
                      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg ${
                    isLight
                      ? 'bg-violet-600 text-white hover:bg-violet-700'
                      : 'bg-violet-500 text-white hover:bg-violet-400'
                  }`}
                >
                  {currentNotification ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications; 