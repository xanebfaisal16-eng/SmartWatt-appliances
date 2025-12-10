import React, { createContext, useContext, useState, useEffect } from 'react';

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [allUserMessages, setAllUserMessages] = useState([]);

  // Load messages from localStorage on startup
  useEffect(() => {
    const saved = localStorage.getItem('allUserMessages');
    if (saved) setAllUserMessages(JSON.parse(saved));
  }, []);

  // Save a new message from any user
  const saveUserMessage = (message, user = 'Website Visitor') => {
    const newMessage = {
      id: Date.now(),
      text: message,
      timestamp: new Date().toLocaleString(),
      user: user,
      status: 'unread'
    };
    
    const updatedMessages = [newMessage, ...allUserMessages];
    setAllUserMessages(updatedMessages);
    localStorage.setItem('allUserMessages', JSON.stringify(updatedMessages));
  };

  // Mark message as read
  const markAsRead = (messageId) => {
    const updatedMessages = allUserMessages.map(msg =>
      msg.id === messageId ? { ...msg, status: 'read' } : msg
    );
    setAllUserMessages(updatedMessages);
    localStorage.setItem('allUserMessages', JSON.stringify(updatedMessages));
  };

  // Clear all messages
  const clearAllMessages = () => {
    setAllUserMessages([]);
    localStorage.removeItem('allUserMessages');
  };

  const value = {
    allUserMessages,
    saveUserMessage,
    markAsRead,
    clearAllMessages
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};