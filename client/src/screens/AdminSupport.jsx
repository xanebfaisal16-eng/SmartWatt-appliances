import React, { useState, useEffect } from 'react';
import { 
  FiMail, 
  FiUser, 
  FiMessageSquare, 
  FiClock, 
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiFilter,
  FiSearch,
  FiAlertCircle
} from 'react-icons/fi';

const AdminSupport = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    search: ''
  });

  // Mock data - Replace with real API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockMessages = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Cannot login to account',
          message: 'I have been trying to login for 2 days but it keeps saying invalid credentials.',
          category: 'account',
          status: 'pending',
          createdAt: '2024-01-15T10:30:00Z',
          priority: 'high'
        },
        {
          id: '2',
          name: 'Sarah Smith',
          email: 'sarah@proposal.com',
          subject: 'Order not delivered',
          message: 'My order #ORD-12345 was supposed to arrive yesterday but still shows as pending.',
          category: 'orders',
          status: 'in_progress',
          createdAt: '2024-01-14T14:20:00Z',
          priority: 'medium',
          assignedTo: 'Admin 1'
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike@business.com',
          subject: 'Website bug report',
          message: 'The checkout page is not loading properly on mobile Safari browser.',
          category: 'technical',
          status: 'resolved',
          createdAt: '2024-01-13T09:15:00Z',
          resolvedAt: '2024-01-14T11:30:00Z',
          resolvedBy: 'Admin 2'
        },
        {
          id: '4',
          name: 'Emma Wilson',
          email: 'emma@design.com',
          subject: 'Partnership inquiry',
          message: 'I would like to discuss partnership opportunities for our design agency.',
          category: 'general',
          status: 'pending',
          createdAt: '2024-01-12T16:45:00Z',
          priority: 'low'
        },
      ];
      setMessages(mockMessages);
      setLoading(false);
    }, 1000);
  }, []);

  const handleStatusChange = (messageId, newStatus) => {
    setMessages(messages.map(msg => 
      msg.id === messageId 
        ? { 
            ...msg, 
            status: newStatus,
            ...(newStatus === 'resolved' && { 
              resolvedAt: new Date().toISOString(),
              resolvedBy: 'Current Admin' 
            })
          }
        : msg
    ));
    
    if (selectedMessage && selectedMessage.id === messageId) {
      setSelectedMessage(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleAssign = (messageId) => {
    const adminName = prompt('Assign to (enter admin name):', 'Admin 1');
    if (adminName) {
      setMessages(messages.map(msg => 
        msg.id === messageId 
          ? { ...msg, assignedTo: adminName, status: 'in_progress' }
          : msg
      ));
    }
  };

  const handleReply = (message) => {
    const reply = prompt(`Reply to ${message.email}:`);
    if (reply) {
      alert(`Reply sent to ${message.email}:\n\n${reply}`);
      // Here you would send email via your backend
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (filters.status !== 'all' && msg.status !== filters.status) return false;
    if (filters.category !== 'all' && msg.category !== filters.category) return false;
    if (filters.search && !msg.subject.toLowerCase().includes(filters.search.toLowerCase()) && 
        !msg.message.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'in_progress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'resolved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Support Messages</h1>
        <p className="text-gray-400">Manage customer support requests and inquiries</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
          <p className="text-gray-400 text-sm mb-2">Total Messages</p>
          <p className="text-3xl font-bold">{messages.length}</p>
        </div>
        <div className="bg-gradient-to-br from-red-900/20 to-red-950/20 backdrop-blur-xl rounded-2xl p-6 border border-red-700/50">
          <p className="text-gray-400 text-sm mb-2">Pending</p>
          <p className="text-3xl font-bold">{messages.filter(m => m.status === 'pending').length}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-950/20 backdrop-blur-xl rounded-2xl p-6 border border-yellow-700/50">
          <p className="text-gray-400 text-sm mb-2">In Progress</p>
          <p className="text-3xl font-bold">{messages.filter(m => m.status === 'in_progress').length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-900/20 to-green-950/20 backdrop-blur-xl rounded-2xl p-6 border border-green-700/50">
          <p className="text-gray-400 text-sm mb-2">Resolved</p>
          <p className="text-3xl font-bold">{messages.filter(m => m.status === 'resolved').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                placeholder="Search messages..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="account">Account</option>
              <option value="orders">Orders</option>
              <option value="technical">Technical</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="text-left p-4 text-gray-400 font-medium">Customer</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Subject</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Date</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMessages.map((msg) => (
                    <tr 
                      key={msg.id} 
                      className={`border-b border-gray-700/30 hover:bg-gray-800/20 cursor-pointer ${selectedMessage?.id === msg.id ? 'bg-gray-800/30' : ''}`}
                      onClick={() => setSelectedMessage(msg)}
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{msg.name}</p>
                          <p className="text-gray-400 text-sm">{msg.email}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium">{msg.subject}</p>
                        <p className="text-gray-400 text-sm truncate max-w-xs">{msg.message.substring(0, 50)}...</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(msg.status)}`}>
                          {msg.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReply(msg);
                            }}
                            className="p-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg text-blue-400"
                            title="Reply"
                          >
                            <FiMail size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAssign(msg.id);
                            }}
                            className="p-2 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg text-purple-400"
                            title="Assign"
                          >
                            <FiUser size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-1">
          {selectedMessage ? (
            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 sticky top-6">
              <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">Message Details</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedMessage.status)}`}>
                    {selectedMessage.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm">From</label>
                    <p className="font-medium">{selectedMessage.name}</p>
                    <p className="text-blue-400 text-sm">{selectedMessage.email}</p>
                  </div>
                  
                  <div>
                    <label className="text-gray-400 text-sm">Subject</label>
                    <p className="font-medium">{selectedMessage.subject}</p>
                  </div>
                  
                  <div>
                    <label className="text-gray-400 text-sm">Category</label>
                    <p className="font-medium capitalize">{selectedMessage.category}</p>
                  </div>
                  
                  <div>
                    <label className="text-gray-400 text-sm">Priority</label>
                    <p className={`font-medium ${getPriorityColor(selectedMessage.priority)}`}>
                      {selectedMessage.priority}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-gray-400 text-sm">Message</label>
                    <div className="mt-2 p-4 bg-gray-800/30 rounded-xl">
                      <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-gray-400 text-sm">Received</label>
                    <p>{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                  </div>
                  
                  {selectedMessage.assignedTo && (
                    <div>
                      <label className="text-gray-400 text-sm">Assigned To</label>
                      <p className="text-blue-400">{selectedMessage.assignedTo}</p>
                    </div>
                  )}
                  
                  {selectedMessage.resolvedAt && (
                    <div>
                      <label className="text-gray-400 text-sm">Resolved On</label>
                      <p>{new Date(selectedMessage.resolvedAt).toLocaleString()}</p>
                      <p className="text-sm text-gray-400">by {selectedMessage.resolvedBy}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-3">
                  {selectedMessage.status !== 'in_progress' && (
                    <button
                      onClick={() => handleStatusChange(selectedMessage.id, 'in_progress')}
                      className="py-2 px-4 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 rounded-xl border border-yellow-500/30"
                    >
                      Start Progress
                    </button>
                  )}
                  
                  {selectedMessage.status !== 'resolved' && (
                    <button
                      onClick={() => handleStatusChange(selectedMessage.id, 'resolved')}
                      className="py-2 px-4 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-xl border border-green-500/30"
                    >
                      Mark Resolved
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleReply(selectedMessage)}
                    className="py-2 px-4 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-xl border border-blue-500/30 col-span-2"
                  >
                    <FiMail className="inline mr-2" />
                    Send Reply
                  </button>
                  
                  <button
                    onClick={() => handleAssign(selectedMessage.id)}
                    className="py-2 px-4 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded-xl border border-purple-500/30 col-span-2"
                  >
                    <FiUser className="inline mr-2" />
                    Assign to Admin
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 text-center">
              <FiMessageSquare className="text-4xl text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSupport;