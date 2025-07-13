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
  AlertTriangle,
  Globe,
  Smartphone,
  MessageSquare,
  Lock,
  Eye,
  FileSpreadsheet,
  Calendar,
  Zap,
  Activity
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../contexts/AdminContext';

const adminNavigation = [
  { 
    name: 'Admin Dashboard', 
    href: '/admin/dashboard', 
    icon: LayoutDashboard,
    description: 'Overview & KPIs'
  },
  { 
    name: 'Member Management', 
    href: '/admin/members', 
    icon: Users,
    description: 'Complete member records'
  },
  { 
    name: 'Approvals Queue', 
    href: '/admin/approvals', 
    icon: UserCheck,
    description: 'Maker-checker workflow'
  },
  { 
    name: 'Contribution Management', 
    href: '/admin/contributions', 
    icon: DollarSign,
    description: 'Sponsor schedules & reconciliation'
  },
  { 
    name: 'Claims Processing', 
    href: '/admin/claims', 
    icon: FileText,
    description: 'All claim types & withdrawals'
  },
  { 
    name: 'Medical Administration', 
    href: '/admin/medical', 
    icon: Heart,
    description: 'Hospital accounts & limits'
  },
  { 
    name: 'Voting Management', 
    href: '/admin/voting', 
    icon: Vote,
    description: 'Elections & real-time results'
  },
  { 
    name: 'Bulk Operations', 
    href: '/admin/bulk', 
    icon: Upload,
    description: 'Mass processing & imports'
  },
  { 
    name: 'Reports & Analytics', 
    href: '/admin/reports', 
    icon: BarChart3,
    description: 'Quarterly board reports'
  },
  { 
    name: 'System Integrations', 
    href: '/admin/integrations', 
    icon: Globe,
    description: 'ERP & external systems'
  },
  { 
    name: 'Portal Management', 
    href: '/admin/portal', 
    icon: Smartphone,
    description: 'Member portal administration'
  },
  { 
    name: 'Surveys & Feedback', 
    href: '/admin/surveys', 
    icon: MessageSquare,
    description: 'Member surveys & analytics'
  },
  { 
    name: 'System Alerts', 
    href: '/admin/alerts', 
    icon: AlertTriangle,
    description: 'Notifications & reminders'
  },
  { 
    name: 'Audit Trail', 
    href: '/admin/audit', 
    icon: Eye,
    description: 'Complete system audit log'
  },
  { 
    name: 'System Configuration', 
    href: '/admin/config', 
    icon: Settings,
    description: 'Scheme settings & parameters'
  }
];

export const AdminSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { systemAlerts, pendingApprovals } = useAdmin();

  const unreadAlerts = systemAlerts.filter(alert => !alert.isRead).length;
  const pendingCount = pendingApprovals.filter(approval => approval.status === 'Pending').length;

  return (
    <div className="flex flex-col w-80 bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-center h-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
        <Shield className="h-10 w-10 text-blue-200 mr-3" />
        <div className="text-center">
          <h1 className="text-xl font-bold text-white">Pension Admin</h1>
          <p className="text-xs text-blue-200">Management Portal</p>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {adminNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white hover:shadow-md'
                }`
              }
            >
              <item.icon className="mr-4 h-5 w-5 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-xs opacity-75">{item.description}</div>
              </div>
              {item.name === 'Approvals Queue' && pendingCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 animate-pulse">
                  {pendingCount}
                </span>
              )}
              {item.name === 'System Alerts' && unreadAlerts > 0 && (
                <span className="ml-2 bg-orange-500 text-white text-xs rounded-full px-2 py-1 animate-pulse">
                  {unreadAlerts}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        
        {/* User Profile */}
        <div className="p-4 border-t border-slate-700 bg-slate-800">
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.role}</p>
              <div className="flex items-center mt-1">
                <Activity className="h-3 w-3 text-green-400 mr-1" />
                <span className="text-xs text-green-400">Online</span>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-slate-700 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-blue-400">{pendingCount}</div>
              <div className="text-xs text-slate-400">Pending</div>
            </div>
            <div className="bg-slate-700 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-orange-400">{unreadAlerts}</div>
              <div className="text-xs text-slate-400">Alerts</div>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-900 hover:text-red-300 rounded-lg transition-colors"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};