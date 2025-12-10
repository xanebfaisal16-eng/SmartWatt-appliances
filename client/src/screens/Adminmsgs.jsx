import React, { useState, useEffect } from 'react';
import { chatService } from '../services/chatService';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMessages: 0,
    totalSessions: 0,
    todayMessages: 0
  });
  const [selectedSession, setSelectedSession] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load all chat messages
  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      console.log('📥 Loading chat messages from Supabase...');
      
      const result = await chatService.getAllChats(100, 1);
      
      if (result.success) {
        setMessages(result.chats);
        
        // Calculate statistics
        const uniqueSessions = [...new Set(result.chats.map(msg => msg.session_id))];
        const today = new Date().toISOString().split('T')[0];
        const todayMsgs = result.chats.filter(msg => 
          msg.created_at.startsWith(today)
        ).length;
        
        setStats({
          totalMessages: result.total,
          totalSessions: uniqueSessions.length,
          todayMessages: todayMsgs
        });
        
        console.log(`✅ Loaded ${result.chats.length} chat messages from SmartWatt`);
      } else {
        console.error('❌ Failed to load messages:', result.error);
      }
    } catch (error) {
      console.error('❌ Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      const result = await chatService.deleteMessage(messageId);
      
      if (result.success) {
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
        setStats(prev => ({
          ...prev,
          totalMessages: prev.totalMessages - 1
        }));
        alert('✅ Message deleted from cloud');
      } else {
        alert('Failed to delete: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Error deleting message:', error);
      alert('Error deleting message: ' + error.message);
    }
  };

  const deleteSession = async (sessionId) => {
    if (!window.confirm('Delete ALL messages in this session?')) return;
    
    try {
      const sessionMessages = messages.filter(msg => msg.session_id === sessionId);
      let deletedCount = 0;
      
      for (const msg of sessionMessages) {
        const result = await chatService.deleteMessage(msg.id);
        if (result.success) deletedCount++;
      }
      
      setMessages(prev => prev.filter(msg => msg.session_id !== sessionId));
      setStats(prev => ({
        ...prev,
        totalMessages: prev.totalMessages - deletedCount,
        totalSessions: prev.totalSessions - 1
      }));
      
      alert(`✅ Deleted ${deletedCount} messages from session`);
    } catch (error) {
      console.error('❌ Error deleting session:', error);
      alert('Error deleting session: ' + error.message);
    }
  };

  const refreshMessages = () => {
    loadMessages();
    alert('🔄 Messages refreshed from SmartWatt!');
  };

  const exportMessages = () => {
    const csvContent = [
      ['Session ID', 'User ID', 'User Message', 'AI Response', 'Date'],
      ...messages.map(msg => [
        msg.session_id,
        msg.user_id,
        `"${msg.user_message.replace(/"/g, '""')}"`,
        `"${msg.ai_response.replace(/"/g, '""')}"`,
        new Date(msg.created_at).toLocaleString()
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat_messages_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Filter messages
  const filteredMessages = searchQuery
    ? messages.filter(msg => 
        msg.user_message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.ai_response.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.session_id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  // Get unique sessions
  const uniqueSessions = [...new Set(messages.map(msg => msg.session_id))];

  // Get messages for selected session
  const sessionMessages = selectedSession
    ? messages.filter(msg => msg.session_id === selectedSession)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-gray-900 p-8 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400 mb-4"></div>
          <p className="text-xl">Loading chat messages from SmartWatt...</p>
          <p className="text-gray-400 mt-2">Fetching AI conversations from Supabase</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-gray-900 p-8 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">💬 AI Chat Conversations</h1>
              <p className="text-gray-300">All AI chat messages stored permanently in SmartWatt</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={refreshMessages}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold flex items-center gap-2"
              >
                🔄 Refresh
              </button>
              <button
                onClick={exportMessages}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold flex items-center gap-2"
              >
                📥 Export CSV
              </button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-purple-500/20 p-4 rounded-xl border border-purple-400/30">
              <p className="text-sm text-purple-300">Total Messages</p>
              <p className="text-3xl font-bold">{stats.totalMessages}</p>
            </div>
            <div className="bg-blue-500/20 p-4 rounded-xl border border-blue-400/30">
              <p className="text-sm text-blue-300">Chat Sessions</p>
              <p className="text-3xl font-bold">{stats.totalSessions}</p>
            </div>
            <div className="bg-green-500/20 p-4 rounded-xl border border-green-400/30">
              <p className="text-sm text-green-300">Today's Messages</p>
              <p className="text-3xl font-bold">{stats.todayMessages}</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Search messages or sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Sessions List */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Chat Sessions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uniqueSessions.slice(0, 12).map(sessionId => {
              const sessionMsgCount = messages.filter(msg => msg.session_id === sessionId).length;
              const lastMessage = messages.find(msg => msg.session_id === sessionId);
              
              return (
                <div
                  key={sessionId}
                  className={`bg-white/10 p-4 rounded-xl border cursor-pointer hover:bg-white/15 transition-colors ${
                    selectedSession === sessionId ? 'border-purple-400 bg-purple-500/10' : 'border-white/20'
                  }`}
                  onClick={() => setSelectedSession(sessionId)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-mono text-sm truncate">{sessionId}</div>
                    <span className="bg-purple-500/30 text-purple-300 px-2 py-1 rounded-full text-xs">
                      {sessionMsgCount} msgs
                    </span>
                  </div>
                  {lastMessage && (
                    <div className="text-sm text-gray-300 truncate">
                      "{lastMessage.user_message.substring(0, 50)}..."
                    </div>
                  )}
                  <div className="flex justify-between items-center mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(sessionId);
                      }}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Delete Session
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(sessionId);
                        alert('Session ID copied!');
                      }}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      Copy ID
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Messages List */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold">
              {selectedSession ? `Messages in Session: ${selectedSession}` : 'All Messages'}
            </h2>
            {selectedSession && (
              <button
                onClick={() => setSelectedSession(null)}
                className="mt-2 text-sm text-purple-400 hover:text-purple-300"
              >
                ← Back to all messages
              </button>
            )}
          </div>

          {filteredMessages.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-2xl text-gray-400">No messages found</p>
              <p className="text-gray-500 mt-2">
                {searchQuery ? 'Try a different search term' : 'AI chat messages will appear here'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {(selectedSession ? sessionMessages : filteredMessages).map((msg, index) => (
                <div key={msg.id} className="p-6 hover:bg-white/5 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs bg-white/10 px-2 py-1 rounded">
                          {msg.session_id}
                        </span>
                        <span className="text-xs text-gray-400">
                          User: {msg.user_id}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date(msg.created_at).toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* User Message */}
                    <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-sm">👤</span>
                        </div>
                        <div className="font-bold text-blue-300">User</div>
                      </div>
                      <div className="text-white whitespace-pre-wrap">
                        {msg.user_message}
                      </div>
                    </div>

                    {/* AI Response */}
                    <div className="bg-purple-500/10 border border-purple-400/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-sm">🤖</span>
                        </div>
                        <div className="font-bold text-purple-300">AI Assistant</div>
                      </div>
                      <div className="text-white whitespace-pre-wrap">
                        {msg.ai_response}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination/Info */}
        <div className="mt-6 text-center text-gray-400">
          <p>
            Showing {selectedSession ? sessionMessages.length : filteredMessages.length} of {messages.length} total messages
            {searchQuery && ` (filtered by "${searchQuery}")`}
          </p>
          <p className="text-sm mt-2">
            💡 All messages are stored permanently in SmartWatt 
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;