import React, { useState } from 'react';
import { Bell, Search, RefreshCw, Settings, Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../contexts/AdminContext';
import { Button } from '../Common/Button';
import { Card } from '../Common/Card';

export const AdminHeader: React.FC = () => {
  const { user } = useAuth();
  const { systemAlerts, pendingApprovals, refreshData } = useAdmin();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadAlerts = systemAlerts.filter(alert => !alert.isRead).length;
  const criticalAlerts = systemAlerts.filter(alert => alert.severity === 'Critical' && !alert.isRead).length;
  const pendingCount = pendingApprovals.filter(approval => approval.status === 'Pending').length;

  const NotificationPanel = () => (
    <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-2xl border z-50">
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="font-semibold text-gray-900">System Notifications</h3>
        <p className="text-sm text-gray-600">{unreadAlerts} unread alerts</p>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {systemAlerts.slice(0, 5).map((alert) => (
          <div key={alert.id} className={`p-4 border-b hover:bg-gray-50 ${!alert.isRead ? 'bg-blue-50' : ''}`}>
            <div className="flex items-start">
              <div className={`p-1 rounded-full mr-3 ${
                alert.severity === 'Critical' ? 'bg-red-100' :
                alert.severity === 'High' ? 'bg-orange-100' :
                alert.severity === 'Medium' ? 'bg-yellow-100' : 'bg-blue-100'
              }`}>
                <AlertTriangle className={`h-4 w-4 ${
                  alert.severity === 'Critical' ? 'text-red-600' :
                  alert.severity === 'High' ? 'text-orange-600' :
                  alert.severity === 'Medium' ? 'text-yellow-600' : 'text-blue-600'
                }`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{alert.type}</p>
                <p className="text-sm text-gray-600">{alert.message}</p>
                <p className="text-xs text-gray-500 mt-1">{alert.createdDate}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t bg-gray-50">
        <Button variant="secondary" size="sm" className="w-full">
          View All Alerts
        </Button>
      </div>
    </div>
  );

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search and Quick Actions */}
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search members, claims, contributions..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={refreshData}
            className="flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        
        {/* Status Indicators */}
        <div className="flex items-center space-x-4">
          {/* Quick Stats */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-lg">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">2,350 Members</span>
            </div>
            
            {pendingCount > 0 && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-orange-50 rounded-lg">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">{pendingCount} Pending</span>
              </div>
            )}
            
            {criticalAlerts > 0 && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-red-50 rounded-lg animate-pulse">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-900">{criticalAlerts} Critical</span>
              </div>
            )}
          </div>
          
          {/* Notifications */}
          <div className="relative">
            <button 
              className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              {unreadAlerts > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white animate-pulse">
                  {unreadAlerts > 9 ? '9+' : unreadAlerts}
                </span>
              )}
            </button>
            
            {showNotifications && <NotificationPanel />}
          </div>
          
          {/* Settings */}
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Settings className="h-5 w-5" />
          </button>
          
          {/* User Profile */}
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* System Status Bar */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border-t border-gray-200 px-6 py-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 font-medium">System Online</span>
            </div>
            <span className="text-gray-500">Last sync: 2 minutes ago</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Active Sessions: 23</span>
            <span className="text-gray-600">Portal Uptime: 99.9%</span>
          </div>
        </div>
      </div>
    </header>
  );
};