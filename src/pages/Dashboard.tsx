import React from 'react';
import { Card } from '../components/Common/Card';
import { 
  DollarSign, 
  Users, 
  FileText, 
  Heart, 
  TrendingUp, 
  Calendar,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  const stats = [
    {
      name: 'Account Balance',
      value: 'KES 2,456,789',
      icon: DollarSign,
      color: 'bg-blue-500',
      change: '+12.5%'
    },
    {
      name: 'Monthly Contribution',
      value: 'KES 25,000',
      icon: TrendingUp,
      color: 'bg-green-500',
      change: '+5.2%'
    },
    {
      name: 'Beneficiaries',
      value: '4',
      icon: Users,
      color: 'bg-purple-500',
      change: '0%'
    },
    {
      name: 'Active Claims',
      value: '2',
      icon: FileText,
      color: 'bg-orange-500',
      change: '+1'
    }
  ];

  const contributionData = [
    { month: 'Jan', employee: 12000, employer: 13000 },
    { month: 'Feb', employee: 12500, employer: 13500 },
    { month: 'Mar', employee: 12200, employer: 13200 },
    { month: 'Apr', employee: 12800, employer: 13800 },
    { month: 'May', employee: 13000, employer: 14000 },
    { month: 'Jun', employee: 12900, employer: 13900 },
  ];

  const medicalData = [
    { name: 'Inpatient', value: 85000, color: '#3B82F6' },
    { name: 'Outpatient', value: 25000, color: '#10B981' },
    { name: 'Remaining', value: 40000, color: '#E5E7EB' }
  ];

  const recentActivities = [
    { id: 1, type: 'Contribution', description: 'Monthly contribution received', date: '2024-01-15', status: 'Completed' },
    { id: 2, type: 'Medical Claim', description: 'Hospital visit claim submitted', date: '2024-01-12', status: 'Pending' },
    { id: 3, type: 'Beneficiary', description: 'Updated beneficiary information', date: '2024-01-10', status: 'Approved' },
    { id: 4, type: 'Statement', description: 'Quarterly statement generated', date: '2024-01-08', status: 'Completed' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>Last updated: January 15, 2024</span>
        </div>
      </div>

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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Contribution Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={contributionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `KES ${value.toLocaleString()}`} />
              <Bar dataKey="employee" fill="#3B82F6" name="Employee" />
              <Bar dataKey="employer" fill="#10B981" name="Employer" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Medical Limits Usage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={medicalData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {medicalData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `KES ${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {medicalData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium">KES {item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {activity.status === 'Completed' || activity.status === 'Approved' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.type} • {activity.date}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                activity.status === 'Completed' || activity.status === 'Approved' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {activity.status}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;