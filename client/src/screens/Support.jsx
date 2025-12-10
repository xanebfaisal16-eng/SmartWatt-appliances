import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  FiHelpCircle, 
  FiMail, 
  FiMessageSquare, 
  FiPhone, 
  FiClock,
  FiUser,
  FiFileText,
  FiCheckCircle,
  FiAlertTriangle,
  FiChevronRight,
  FiCalendar,
  FiEye,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiTrash2,
  FiMoreVertical,
  FiDownload,
  FiStar,
  FiArchive,
  FiAlertCircle
} from 'react-icons/fi';

const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general',
    priority: 'medium'
  });

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [newMessage, setNewMessage] = useState(null);
  const [selectedMessages, setSelectedMessages] = useState([]);

  // Fetch messages from MongoDB
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/support/messages');
      setMessages(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load messages');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      const response = await axios.post('/api/support/submit', formData);
      
      // Add new message to local state
      const newMsg = response.data;
      setMessages([newMsg, ...messages]);
      setNewMessage(newMsg);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general',
        priority: 'medium'
      });

      // Clear notification after 5 seconds
      setTimeout(() => {
        setNewMessage(null);
      }, 5000);

    } catch (err) {
      setError('Failed to submit message');
      console.error('Error submitting message:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const updateMessageStatus = async (id, status) => {
    try {
      await axios.put(`/api/support/messages/${id}`, { status });
      
      // Update local state
      setMessages(messages.map(msg => 
        msg._id === id ? { ...msg, status } : msg
      ));
      
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage({ ...selectedMessage, status });
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await axios.delete(`/api/support/messages/${id}`);
      
      // Update local state
      setMessages(messages.filter(msg => msg._id !== id));
      
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage(null);
      }
      
      // Remove from selected messages
      setSelectedMessages(selectedMessages.filter(msgId => msgId !== id));
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  const archiveMessages = async () => {
    if (!selectedMessages.length) return;
    
    try {
      await axios.post('/api/support/archive', { ids: selectedMessages });
      
      // Update local state
      setMessages(messages.map(msg => 
        selectedMessages.includes(msg._id) 
          ? { ...msg, archived: true } 
          : msg
      ));
      
      setSelectedMessages([]);
    } catch (err) {
      console.error('Error archiving messages:', err);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'in progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'resolved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'closed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-orange-500/20 text-orange-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'account': return <FiUser className="text-blue-400" />;
      case 'orders': return <FiFileText className="text-green-400" />;
      case 'technical': return <FiHelpCircle className="text-red-400" />;
      case 'general': return <FiMessageSquare className="text-purple-400" />;
      default: return <FiMessageSquare className="text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-400">Pending</span>;
      case 'in progress': return <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">In Progress</span>;
      case 'resolved': return <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">Resolved</span>;
      case 'closed': return <span className="px-2 py-1 rounded-full text-xs bg-gray-500/20 text-gray-400">Closed</span>;
      default: return <span className="px-2 py-1 rounded-full text-xs bg-gray-500/20 text-gray-400">{status}</span>;
    }
  };

  // Filter and search messages
  const filteredMessages = messages.filter(msg => {
    // Filter by status
    if (filter !== 'all' && msg.status !== filter && filter !== 'archived') return false;
    if (filter === 'archived' && !msg.archived) return false;
    if (filter !== 'archived' && msg.archived) return false;
    
    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        msg.name.toLowerCase().includes(term) ||
        msg.email.toLowerCase().includes(term) ||
        msg.subject.toLowerCase().includes(term) ||
        msg.message.toLowerCase().includes(term)
      );
    }
    
    return true;
  });

  const supportCategories = [
    {
      id: 'account',
      title: 'Account Issues',
      description: 'Login, signup, password, profile',
      icon: <FiUser />,
      color: 'from-blue-600/20 to-cyan-500/20'
    },
    {
      id: 'orders',
      title: 'Orders & Payments',
      description: 'Order status, refunds, payments',
      icon: <FiFileText />,
      color: 'from-green-600/20 to-emerald-500/20'
    },
    {
      id: 'technical',
      title: 'Technical Support',
      description: 'Website errors, bugs, features',
      icon: <FiHelpCircle />,
      color: 'from-red-600/20 to-pink-500/20'
    },
    {
      id: 'general',
      title: 'General Inquiries',
      description: 'Questions, feedback, suggestions',
      icon: <FiMessageSquare />,
      color: 'from-purple-600/20 to-indigo-500/20'
    }
  ];

  const contactMethods = [
    {
      icon: <FiMail />,
      title: 'Email Support',
      details: 'support@proposalwebsite.com',
      response: '24-48 hours',
      description: 'For detailed issues and attachments'
    },
    {
      icon: <FiMessageSquare />,
      title: 'Live Chat',
      details: 'Available on website',
      response: 'Instant',
      description: 'Quick questions and immediate help'
    },
    {
      icon: <FiPhone />,
      title: 'Phone Support',
      details: '+1 (555) 123-4567',
      response: 'Business hours',
      description: 'Mon-Fri: 9AM-6PM EST'
    }
  ];

  const MessageDetail = ({ message, onClose, onUpdate }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {getCategoryIcon(message.category)}
              <h3 className="text-2xl font-bold">{message.subject}</h3>
              {getStatusBadge(message.status)}
            </div>
            <p className="text-gray-400">
              From: <span className="text-white">{message.name}</span> 
              (<span className="text-blue-300">{message.email}</span>)
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl p-2 hover:bg-gray-800 rounded-lg"
          >
            ×
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="text-gray-400 text-sm mb-1">Submitted</div>
            <div className="flex items-center gap-2">
              <FiCalendar className="text-gray-500" />
              <span className="text-white">{new Date(message.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="text-gray-400 text-sm mb-1">Priority</div>
            <div className={`px-3 py-1 rounded-full text-sm inline-block ${getPriorityColor(message.priority)}`}>
              {message.priority.toUpperCase()}
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="text-gray-400 text-sm mb-1">Category</div>
            <div className="text-white capitalize">{message.category}</div>
          </div>
        </div>

        <div className="mb-8">
          <h4 className="font-bold text-lg mb-3 text-gray-300">Customer Message:</h4>
          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
            <p className="text-gray-200 whitespace-pre-line">{message.message}</p>
          </div>
        </div>

        {message.response && (
          <div className="mb-8">
            <h4 className="font-bold text-lg mb-3 text-gray-300 flex items-center gap-2">
              <FiCheckCircle className="text-green-400" />
              Support Response:
            </h4>
            <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-xl p-6 border border-blue-700/30">
              <p className="text-gray-200 whitespace-pre-line">{message.response}</p>
              {message.responseTime && (
                <div className="mt-4 pt-4 border-t border-blue-700/30 text-sm text-gray-400">
                  Responded: {new Date(message.responseTime).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="border-t border-gray-800 pt-6">
          <div className="flex justify-between items-center">
            <div className="space-x-2">
              {message.status !== 'resolved' && (
                <button
                  onClick={() => {
                    updateMessageStatus(message._id, 'resolved');
                    onClose();
                  }}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                >
                  Mark as Resolved
                </button>
              )}
              {message.status === 'pending' && (
                <button
                  onClick={() => updateMessageStatus(message._id, 'in progress')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Start Progress
                </button>
              )}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => deleteMessage(message._id)}
                className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-lg font-medium"
              >
                Delete
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <FiHelpCircle className="text-3xl text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Support Center</h1>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
          Real support messages from MongoDB database. Submit new requests and manage existing ones.
        </p>
      </div>

      {/* New Message Notification */}
      {newMessage && (
        <div className="mb-6 animate-slideDown">
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-500/20 border border-green-700/50 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiCheckCircle className="text-2xl text-green-400" />
              <div>
                <h3 className="font-bold">Support Request Submitted!</h3>
                <p className="text-gray-300 text-sm">
                  Ticket #{newMessage._id?.slice(-6) || newMessage.id} has been created
                </p>
              </div>
            </div>
            <button 
              onClick={() => setNewMessage(null)}
              className="text-gray-400 hover:text-white p-1"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {supportCategories.map((category) => (
          <div 
            key={category.id}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all cursor-pointer"
            onClick={() => setFormData({...formData, category: category.id})}
          >
            <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center mb-4`}>
              <span className="text-2xl text-white">{category.icon}</span>
            </div>
            <h3 className="text-xl font-bold mb-2">{category.title}</h3>
            <p className="text-gray-400 text-sm mb-2">{category.description}</p>
            <div className="text-3xl font-bold">
              {messages.filter(m => m.category === category.id).length}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
          <h2 className="text-2xl font-bold mb-6">Submit New Request</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {supportCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Please describe your issue in detail..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Support Request'}
              </button>
            </div>
          </form>
        </div>

        {/* Messages Table */}
        <div className="space-y-8">
          {/* Messages Table */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Support Messages</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchMessages}
                  className="p-2 bg-gray-800/50 border border-gray-700 rounded-xl hover:bg-gray-700/50"
                  title="Refresh"
                >
                  <FiRefreshCw className={`text-gray-400 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Messages</option>
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-red-400 flex items-center gap-2">
                  <FiAlertCircle /> {error}
                </p>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-400 mt-4">Loading messages...</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="text-center py-12">
                <FiMessageSquare className="text-4xl text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No messages found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700/50">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Customer</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Subject</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMessages.map((message) => (
                      <tr 
                        key={message._id || message.id}
                        className="border-b border-gray-800/30 hover:bg-gray-800/20 cursor-pointer"
                        onClick={() => setSelectedMessage(message)}
                      >
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium">{message.name}</div>
                            <div className="text-sm text-gray-400">{message.email}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-medium">{message.subject}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {message.message.substring(0, 60)}...
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(message.status)}`}>
                            {message.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-400">
                          {message.createdAt ? new Date(message.createdAt).toLocaleDateString() : message.date}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMessage(message);
                              }}
                              className="p-2 hover:bg-gray-700/50 rounded-lg"
                              title="View Details"
                            >
                              <FiEye className="text-gray-400" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteMessage(message._id || message.id);
                              }}
                              className="p-2 hover:bg-red-500/10 rounded-lg"
                              title="Delete"
                            >
                              <FiTrash2 className="text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && filteredMessages.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-700/50">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="bg-gray-800/30 rounded-xl p-4">
                    <div className="text-2xl font-bold text-yellow-400">
                      {messages.filter(m => m.status === 'pending').length}
                    </div>
                    <div className="text-sm text-gray-400">Pending</div>
                  </div>
                  <div className="bg-gray-800/30 rounded-xl p-4">
                    <div className="text-2xl font-bold text-blue-400">
                      {messages.filter(m => m.status === 'in progress').length}
                    </div>
                    <div className="text-sm text-gray-400">In Progress</div>
                  </div>
                  <div className="bg-gray-800/30 rounded-xl p-4">
                    <div className="text-2xl font-bold text-green-400">
                      {messages.filter(m => m.status === 'resolved').length}
                    </div>
                    <div className="text-sm text-gray-400">Resolved</div>
                  </div>
                  <div className="bg-gray-800/30 rounded-xl p-4">
                    <div className="text-2xl font-bold">
                      {messages.length}
                    </div>
                    <div className="text-sm text-gray-400">Total</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contact Methods */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
            <h2 className="text-2xl font-bold mb-6">Contact Methods</h2>
            <div className="space-y-4">
              {contactMethods.map((method, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-800/30 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 rounded-xl flex items-center justify-center">
                    <span className="text-xl text-blue-400">{method.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{method.title}</h3>
                    <p className="text-blue-300 font-medium">{method.details}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <FiClock className="text-gray-500" />
                      <span className="text-gray-400 text-sm">Response: {method.response}</span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">{method.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-12 text-center">
        <p className="text-gray-500 text-sm">
          All messages are stored in MongoDB database. Real-time updates are supported.
        </p>
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <MessageDetail 
          message={selectedMessage} 
          onClose={() => setSelectedMessage(null)}
          onUpdate={fetchMessages}
        />
      )}
    </div>
  );
};

export default Support;