import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  FileText, 
  DollarSign, 
  Heart, 
  Vote, 
  BarChart3,
  Settings,
  Bell,
  Upload,
  Download,
  Shield,
  LogOut,
  Database,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../contexts/AdminContext';

const adminNavigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Member Management', href: '/admin/members', icon: Users },
  { name: 'Approvals', href: '/admin/approvals', icon: UserCheck },
  { name: 'Contributions', href: '/admin/contributions', icon: DollarSign },
  { name: 'Claims Management', href: '/admin/claims', icon: FileText },
  { name: 'Medical', href: '/admin/medical', icon: Heart },
  { name: 'Voting', href: '/admin/voting', icon: Vote },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { name: 'Bulk Operations', href: '/admin/bulk', icon: Upload },
  { name: 'System Alerts', href: '/admin/alerts', icon: AlertTriangle },
  { name: 'Data Management', href: '/admin/data', icon: Database },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export const AdminSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { systemAlerts, pendingApprovals } = useAdmin();

  const unreadAlerts = systemAlerts.filter(alert => !alert.isRead).length;
  const pendingCount = pendingApprovals.filter(approval => approval.status === 'Pending').length;

  return (
    <div className="flex flex-col w-64 bg-slate-900 text-white shadow-lg">
      <div className="flex items-center justify-center h-16 px-4 bg-slate-800">
        <Shield className="h-8 w-8 text-blue-400 mr-2" />
        <h1 className="text-xl font-bold">Admin Portal</h1>
      </div>
      
      <div className="flex-1 flex flex-col">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {adminNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-blue-400 border-r-2 border-blue-400'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
              {item.name === 'Approvals' && pendingCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {pendingCount}
                </span>
              )}
              {item.name === 'System Alerts' && unreadAlerts > 0 && (
                <span className="ml-auto bg-orange-500 text-white text-xs rounded-full px-2 py-1">
                  {unreadAlerts}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user?.name?.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="mt-4 w-full flex items-center px-2 py-2 text-sm font-medium text-red-400 hover:bg-slate-800 rounded-md transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};