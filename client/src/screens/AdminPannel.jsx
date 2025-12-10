// src/components/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { getAuthHeaders, isAdmin } from '../utils/auth';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!isAdmin()) {
      window.location.href = '/dashboard';
      return;
    }
    
    fetchAdminData();
  }, []);
  
  const fetchAdminData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/admin/users', {
        headers: getAuthHeaders()
      });
      
      if (response.status === 403) {
        alert('You are not authorized to access this page');
        window.location.href = '/dashboard';
        return;
      }
      
      const data = await response.json();
      if (data.success) {
        setUsers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <div className="p-8">Loading admin panel...</div>;
  }
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-900/30 p-6 rounded-lg border border-blue-800">
          <h3 className="text-xl font-bold mb-2">Total Users</h3>
          <p className="text-3xl">{users.length}</p>
        </div>
        
        <div className="bg-purple-900/30 p-6 rounded-lg border border-purple-800">
          <h3 className="text-xl font-bold mb-2">Admin Users</h3>
          <p className="text-3xl">
            {users.filter(u => u.role === 'admin').length}
          </p>
        </div>
        
        <div className="bg-green-900/30 p-6 rounded-lg border border-green-800">
          <h3 className="text-xl font-bold mb-2">Sellers</h3>
          <p className="text-3xl">
            {users.filter(u => u.role === 'seller').length}
          </p>
        </div>
      </div>
      
      <div className="bg-gray-900/50 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">User Management</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 text-left">Email</th>
                <th className="py-3 text-left">Role</th>
                <th className="py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-gray-800">
                  <td className="py-3">{user.email}</td>
                  <td className="py-3">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      user.role === 'admin' ? 'bg-red-900/30 text-red-300' :
                      user.role === 'seller' ? 'bg-blue-900/30 text-blue-300' :
                      'bg-green-900/30 text-green-300'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3">
                    <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded mr-2">
                      Edit
                    </button>
                    <button className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded">
                      Block
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-yellow-900/20 border border-yellow-800 rounded">
        <p className="text-yellow-300">
          ⚠️ <strong>Note:</strong> This is a demo admin panel. Real admin features would include:
          user blocking, role management, order management, and analytics.
        </p>
      </div>
    </div>
  );
};

export default AdminPanel;