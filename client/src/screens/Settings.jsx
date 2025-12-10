// screens/Settings.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Settings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    newsletter: true,
    orderUpdates: true,
    promotionalOffers: false
  });

  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleToggleChange = (key) => {
    setSettings({
      ...settings,
      [key]: !settings[key]
    });
    // Save preference to backend
    savePreference(key, !settings[key]);
  };

  const savePreference = async (key, value) => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:8080/api/v1/users/update-profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          preferences: { [key]: value }
        })
      });
      toast.success('Preference updated');
    } catch (error) {
      console.error('Error saving preference:', error);
    }
  };

  // REAL delete account function
  const handleDeleteAccount = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      toast.warning('Type "DELETE" to confirm account deletion');
      return;
    }

    if (confirmText !== 'DELETE') {
      toast.error('Please type "DELETE" exactly as shown');
      return;
    }

    if (!window.confirm('⚠️ FINAL WARNING: This will permanently delete your account and all data. This cannot be undone!')) {
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/v1/users/delete-account', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          confirmation: 'DELETE',
          reason: 'User requested account deletion'
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Account deleted successfully');
        
        // Clear local storage
        localStorage.clear();
        
        // Redirect to home page after 2 seconds
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        toast.error(data.error || 'Failed to delete account');
        setDeleteConfirm(false);
        setConfirmText('');
      }
    } catch (error) {
      console.error('Delete account error:', error);
      toast.error('Connection error. Please try again.');
      setDeleteConfirm(false);
      setConfirmText('');
    } finally {
      setLoading(false);
    }
  };

  // REAL export data function
  const handleExportData = async () => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/v1/users/export-data', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Get the blob (JSON file)
        const blob = await response.blob();
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `user-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast.success('Data exported successfully!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to export data');
      }
    } catch (error) {
      console.error('Export data error:', error);
      toast.error('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Cancel delete confirmation
  const cancelDelete = () => {
    setDeleteConfirm(false);
    setConfirmText('');
    toast.info('Account deletion cancelled');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Account Settings</h1>
        <p className="text-gray-300">Manage your preferences and security</p>
      </div>

      <div className="space-y-8">
        {/* Notification Settings */}
        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
          <h2 className="text-xl font-bold mb-6">Notification Preferences</h2>
          <div className="space-y-4">
            {Object.entries(settings).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <div>
                  <p className="font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </p>
                  <p className="text-sm text-gray-400">
                    {key === 'emailNotifications' && 'Receive updates via email'}
                    {key === 'smsNotifications' && 'Receive SMS alerts'}
                    {key === 'newsletter' && 'Weekly smartwatch tips & offers'}
                    {key === 'orderUpdates' && 'Order status and shipping updates'}
                    {key === 'promotionalOffers' && 'Special discounts and promotions'}
                  </p>
                </div>
                <button
                  onClick={() => handleToggleChange(key)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                    value ? 'bg-gradient-to-r from-blue-600 to-blue-500 justify-end' : 'bg-gray-700 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-gradient-to-br from-gray-900/40 to-red-900/20 backdrop-blur-xl rounded-2xl p-8 border border-red-700/30 shadow-lg">
          <h2 className="text-xl font-bold mb-6 text-red-400 flex items-center gap-2">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Danger Zone
          </h2>
          
          <div className="space-y-6">
            {/* Export Data */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-gray-800/30 rounded-xl">
              <div className="flex-1">
                <p className="font-medium">Export Your Data</p>
                <p className="text-sm text-gray-400 mt-1">
                  Download a complete copy of your personal data, orders, and preferences in JSON format
                </p>
              </div>
              <button
                onClick={handleExportData}
                disabled={loading}
                className="px-6 py-2.5 border border-gray-600 hover:bg-gray-700 rounded-lg font-medium transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export Data
                  </>
                )}
              </button>
            </div>

            {/* Delete Account */}
            <div className="p-4 bg-gradient-to-r from-red-900/20 to-red-800/10 rounded-xl border border-red-700/30">
              {deleteConfirm ? (
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-red-300 mb-2">⚠️ Confirm Account Deletion</p>
                    <p className="text-sm text-gray-300 mb-3">
                      This action <span className="font-bold text-red-400">CANNOT</span> be undone. All your data including orders, preferences, and profile will be permanently deleted.
                    </p>
                    <p className="text-sm text-gray-400 mb-3">
                      Type <span className="font-mono font-bold text-red-300">DELETE</span> exactly as shown to confirm:
                    </p>
                    <input
                      type="text"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      placeholder="Type DELETE here"
                      className="w-full px-4 py-2.5 bg-gray-900 border border-red-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={loading || confirmText !== 'DELETE'}
                      className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg font-medium transition flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                          Deleting...
                        </div>
                      ) : (
                        'Permanently Delete Account'
                      )}
                    </button>
                    <button
                      onClick={cancelDelete}
                      disabled={loading}
                      className="px-6 py-2.5 border border-gray-600 hover:bg-gray-700 rounded-lg font-medium transition disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <p className="font-medium">Delete Account</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                  </div>
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg font-medium transition"
                  >
                    Delete Account
                  </button>
                </div>
              )}
            </div>

            {/* Warning Note */}
            <div className="text-xs text-gray-500 p-3 bg-gray-900/30 rounded-lg">
              <p className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>
                  <strong>Note:</strong> Export your data before deleting your account. Once deleted, you cannot recover any information.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl shadow-2xl">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
              <p className="text-white">Processing your request...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;