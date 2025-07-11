import React from 'react';
import { Card } from '../../components/Common/Card';
import { 
  Users, 
  DollarSign, 
  FileText, 
  Heart, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { financialSummary, pendingApprovals, systemAlerts } = useAdmin();

  const stats = [
    {
      name: 'Total Members',
      value: financialSummary.totalMembers.toLocaleString(),
      icon: Users,
      color: 'bg-blue-500',
      change: '+2.5%'
    },
    {
      name: 'Monthly Contributions',
      value: `KES ${(financialSummary.monthlyContributions / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+8.2%'
    },
    {
      name: 'Pending Claims',
      value: financialSummary.pendingClaims.toString(),
      icon: FileText,
      color: 'bg-orange-500',
      change: '-5.1%'
    },
    {
      name: 'Medical Expenditure',
      value: `KES ${(financialSummary.medicalExpenditure / 1000000).toFixed(1)}M`,
      icon: Heart,
      color: 'bg-purple-500',
      change: '+12.3%'
    }
  ];

  const memberTrends = [
    { month: 'Jan', active: 2280, inactive: 120, new: 45 },
    { month: 'Feb', active: 2295, inactive: 115, new: 38 },
    { month: 'Mar', active: 2310, inactive: 110, new: 42 },
    { month: 'Apr', active: 2325, inactive: 105, new: 35 },
    { month: 'May', active: 2340, inactive: 100, new: 40 },
    { month: 'Jun', active: 2350, inactive: 95, new: 38 }
  ];

  const contributionTrends = [
    { month: 'Jan', employee: 2400000, employer: 2600000 },
    { month: 'Feb', employee: 2450000, employer: 2650000 },
    { month: 'Mar', employee: 2480000, employer: 2680000 },
    { month: 'Apr', employee: 2520000, employer: 2720000 },
    { month: 'May', employee: 2550000, employer: 2750000 },
    { month: 'Jun', employee: 2600000, employer: 2800000 }
  ];

  const claimStatus = [
    { name: 'Approved', value: 28, color: '#10B981' },
    { name: 'Pending', value: 12, color: '#F59E0B' },
    { name: 'Under Review', value: 5, color: '#3B82F6' }
  ];

  const recentActivities = [
    { id: 1, type: 'Member Registration', description: 'New member John Smith registered', time: '2 hours ago', status: 'success' },
    { id: 2, type: 'Claim Approved', description: 'Medical claim for Jane Doe approved (KES 25,000)', time: '4 hours ago', status: 'success' },
    { id: 3, type: 'Contribution Upload', description: 'ABC Company uploaded monthly contributions', time: '6 hours ago', status: 'info' },
    { id: 4, type: 'Alert Generated', description: 'Overdue medical bills detected', time: '8 hours ago', status: 'warning' }
  ];

  const pendingCount = pendingApprovals.filter(approval => approval.status === 'Pending').length;
  const criticalAlerts = systemAlerts.filter(alert => alert.severity === 'Critical' && !alert.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleString()}</span>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalAlerts > 0 && (
        <Card className="border-red-200 bg-red-50">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Critical Alerts</h3>
              <p className="text-sm text-red-700">
                {criticalAlerts} critical alert{criticalAlerts > 1 ? 's' : ''} require immediate attention
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="transition-transform hover:scale-105">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600">{stat.change}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Pending Approvals</h3>
              <p className="text-3xl font-bold text-blue-600">{pendingCount}</p>
              <p className="text-sm text-blue-700">Require your attention</p>
            </div>
            <CheckCircle className="h-12 w-12 text-blue-400" />
          </div>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-900">Active Members</h3>
              <p className="text-3xl font-bold text-green-600">{financialSummary.activeMembers.toLocaleString()}</p>
              <p className="text-sm text-green-700">Contributing members</p>
            </div>
            <Users className="h-12 w-12 text-green-400" />
          </div>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-purple-900">Account Balance</h3>
              <p className="text-3xl font-bold text-purple-600">
                KES {(financialSummary.accountBalance / 1000000).toFixed(0)}M
              </p>
              <p className="text-sm text-purple-700">Total fund value</p>
            </div>
            <TrendingUp className="h-12 w-12 text-purple-400" />
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Member Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={memberTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="active" stroke="#10B981" strokeWidth={2} name="Active" />
              <Line type="monotone" dataKey="new" stroke="#3B82F6" strokeWidth={2} name="New" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Contribution Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={contributionTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `KES ${(value / 1000000).toFixed(1)}M`} />
              <Bar dataKey="employee" fill="#3B82F6" name="Employee" />
              <Bar dataKey="employer" fill="#10B981" name="Employer" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Claims Status</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={claimStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
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
          <div className="mt-4 space-y-2">
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
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;