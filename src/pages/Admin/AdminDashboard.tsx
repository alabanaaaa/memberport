import React, { useState } from 'react';
import { Card } from '../../components/Common/Card';
import { Button } from '../../components/Common/Button';
import { 
  Users, 
  DollarSign, 
  FileText, 
  Heart, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Smartphone,
  Eye,
  Download,
  BarChart3,
  Activity,
  Shield,
  Bell,
  Calendar,
  Database
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { financialSummary, pendingApprovals, systemAlerts } = useAdmin();
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');

  const adminStats = [
    {
      name: 'Total Members',
      value: financialSummary.totalMembers.toLocaleString(),
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      change: '+2.5%',
      trend: 'up'
    },
    {
      name: 'Monthly Contributions',
      value: `KES ${(financialSummary.monthlyContributions / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      change: '+8.2%',
      trend: 'up'
    },
    {
      name: 'Pending Approvals',
      value: pendingApprovals.filter(a => a.status === 'Pending').length.toString(),
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      change: '-5.1%',
      trend: 'down'
    },
    {
      name: 'System Alerts',
      value: systemAlerts.filter(a => !a.isRead).length.toString(),
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
      change: '+12.3%',
      trend: 'up'
    },
    {
      name: 'Portal Sessions',
      value: '1,247',
      icon: Activity,
      color: 'from-purple-500 to-purple-600',
      change: '+15.7%',
      trend: 'up'
    },
    {
      name: 'Account Balance',
      value: `KES ${(financialSummary.accountBalance / 1000000000).toFixed(1)}B`,
      icon: TrendingUp,
      color: 'from-indigo-500 to-indigo-600',
      change: '+4.8%',
      trend: 'up'
    }
  ];

  const memberTrends = [
    { month: 'Jan', active: 2280, inactive: 120, new: 45, retired: 15 },
    { month: 'Feb', active: 2295, inactive: 115, new: 38, retired: 23 },
    { month: 'Mar', active: 2310, inactive: 110, new: 42, retired: 27 },
    { month: 'Apr', active: 2325, inactive: 105, new: 35, retired: 20 },
    { month: 'May', active: 2340, inactive: 100, new: 40, retired: 25 },
    { month: 'Jun', active: 2350, inactive: 95, new: 38, retired: 28 }
  ];

  const contributionTrends = [
    { month: 'Jan', employee: 2400000, employer: 2600000, avc: 450000, total: 5450000 },
    { month: 'Feb', employee: 2450000, employer: 2650000, avc: 480000, total: 5580000 },
    { month: 'Mar', employee: 2480000, employer: 2680000, avc: 520000, total: 5680000 },
    { month: 'Apr', employee: 2520000, employer: 2720000, avc: 560000, total: 5800000 },
    { month: 'May', employee: 2550000, employer: 2750000, avc: 580000, total: 5880000 },
    { month: 'Jun', employee: 2600000, employer: 2800000, avc: 600000, total: 6000000 }
  ];

  const claimStatus = [
    { name: 'Approved', value: 28, color: '#10B981' },
    { name: 'Pending', value: 12, color: '#F59E0B' },
    { name: 'Under Review', value: 8, color: '#3B82F6' },
    { name: 'Rejected', value: 3, color: '#EF4444' }
  ];

  const systemIntegrations = [
    { name: 'Financial Management', status: 'Connected', lastSync: '2 min ago', color: 'green' },
    { name: 'General Ledger', status: 'Connected', lastSync: '5 min ago', color: 'green' },
    { name: 'Accounts Receivable', status: 'Connected', lastSync: '1 min ago', color: 'green' },
    { name: 'Document Management', status: 'Error', lastSync: '2 hours ago', color: 'red' },
    { name: 'Mobile App', status: 'Connected', lastSync: '30 sec ago', color: 'green' },
    { name: 'USSD Gateway', status: 'Connected', lastSync: '1 min ago', color: 'green' }
  ];

  const recentActivities = [
    { 
      id: 1, 
      type: 'Member Registration', 
      description: 'New member John Smith registered by HR Officer', 
      time: '2 hours ago', 
      status: 'success',
      user: 'HR Officer',
      module: 'Member Management'
    },
    { 
      id: 2, 
      type: 'Claim Approved', 
      description: 'Medical claim for Jane Doe approved (KES 25,000)', 
      time: '4 hours ago', 
      status: 'success',
      user: 'Medical Officer',
      module: 'Claims Management'
    },
    { 
      id: 3, 
      type: 'Contribution Upload', 
      description: 'ABC Company uploaded monthly contributions (145 members)', 
      time: '6 hours ago', 
      status: 'info',
      user: 'System',
      module: 'Contribution Management'
    },
    { 
      id: 4, 
      type: 'System Alert', 
      description: 'Overdue medical bills detected for Kenyatta Hospital', 
      time: '8 hours ago', 
      status: 'warning',
      user: 'System',
      module: 'Medical Management'
    },
    { 
      id: 5, 
      type: 'Bulk Processing', 
      description: 'Quarterly statements generated for 2,350 members', 
      time: '1 day ago', 
      status: 'success',
      user: 'Finance Officer',
      module: 'Bulk Operations'
    }
  ];

  const portalUsage = [
    { hour: '00:00', logins: 12, active: 45 },
    { hour: '04:00', logins: 8, active: 23 },
    { hour: '08:00', logins: 156, active: 234 },
    { hour: '12:00', logins: 89, active: 178 },
    { hour: '16:00', logins: 134, active: 267 },
    { hour: '20:00', logins: 67, active: 123 }
  ];

  const StatCard = ({ stat }: any) => (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105">
      <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-5`}></div>
      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`flex items-center text-sm font-medium ${
              stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className={`h-4 w-4 mr-1 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
              {stat.change}
            </div>
            <p className="text-xs text-gray-500">vs last month</p>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive pension scheme management overview</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <Button className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      {systemAlerts.filter(alert => alert.severity === 'Critical' && !alert.isRead).length > 0 && (
        <Card className="border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-3 animate-pulse" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900">Critical System Alerts</h3>
              <p className="text-red-700">
                {systemAlerts.filter(alert => alert.severity === 'Critical' && !alert.isRead).length} critical alert(s) require immediate attention
              </p>
            </div>
            <Button variant="danger" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              View Alerts
            </Button>
          </div>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminStats.map((stat) => (
          <StatCard key={stat.name} stat={stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg transition-all duration-300">
          <div className="p-6 text-center">
            <div className="mx-auto h-12 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Member Management</h3>
            <p className="text-sm text-blue-700 mb-4">Register, update, and manage member records</p>
            <Button variant="secondary" size="sm" className="w-full">
              Manage Members
            </Button>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-all duration-300">
          <div className="p-6 text-center">
            <div className="mx-auto h-12 w-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-green-900 mb-2">Pending Approvals</h3>
            <p className="text-sm text-green-700 mb-4">{pendingApprovals.filter(a => a.status === 'Pending').length} items awaiting approval</p>
            <Button variant="secondary" size="sm" className="w-full">
              Review Queue
            </Button>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 hover:shadow-lg transition-all duration-300">
          <div className="p-6 text-center">
            <div className="mx-auto h-12 w-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-purple-900 mb-2">Generate Reports</h3>
            <p className="text-sm text-purple-700 mb-4">Quarterly board reports and analytics</p>
            <Button variant="secondary" size="sm" className="w-full">
              Create Report
            </Button>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:shadow-lg transition-all duration-300">
          <div className="p-6 text-center">
            <div className="mx-auto h-12 w-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
              <Database className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-orange-900 mb-2">Bulk Operations</h3>
            <p className="text-sm text-orange-700 mb-4">Import data and process bulk transactions</p>
            <Button variant="secondary" size="sm" className="w-full">
              Start Bulk Op
            </Button>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Member Trends</h3>
            <Button variant="secondary" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Details
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={memberTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="active" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              <Area type="monotone" dataKey="new" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="inactive" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Contribution Analysis</h3>
            <Button variant="secondary" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={contributionTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `KES ${(value / 1000000).toFixed(1)}M`} />
              <Bar dataKey="employee" fill="#3B82F6" name="Employee" />
              <Bar dataKey="employer" fill="#10B981" name="Employer" />
              <Bar dataKey="avc" fill="#8B5CF6" name="AVC" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Claims Status</h3>
          <div className="flex items-center justify-center mb-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={claimStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {claimStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {claimStatus.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">System Integrations</h3>
          <div className="space-y-3">
            {systemIntegrations.map((integration, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    integration.color === 'green' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{integration.name}</p>
                    <p className="text-xs text-gray-500">{integration.lastSync}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  integration.status === 'Connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {integration.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activities</h3>
          <div className="space-y-3">
            {recentActivities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                  <p className="text-sm text-gray-600 truncate">{activity.description}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500">{activity.time}</p>
                    <span className="text-xs text-blue-600">{activity.module}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Portal Usage Analytics */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Member Portal Usage (24h)</h3>
          <div className="flex items-center space-x-2">
            <Smartphone className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">1,247 active sessions</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={portalUsage}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="logins" stroke="#3B82F6" strokeWidth={2} name="Logins" />
            <Line type="monotone" dataKey="active" stroke="#10B981" strokeWidth={2} name="Active Users" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default AdminDashboard;