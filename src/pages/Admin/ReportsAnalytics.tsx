import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Common/Card';
import { Button } from '../../components/Common/Button';
import { Table } from '../../components/Common/Table';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  Users, 
  DollarSign, 
  FileText, 
  Heart, 
  Vote, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  Eye,
  Filter,
  RefreshCw,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  Bell,
  Shield,
  Database,
  PieChart,
  LineChart,
  Globe,
  Smartphone,
  FileSpreadsheet,
  Archive,
  Settings,
  Search,
  Plus,
  Minus,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  Info
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart as RechartsLineChart, 
  Line, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area,
  ComposedChart,
  Legend
} from 'recharts';
import { format } from 'date-fns';

const ReportsAnalytics: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [selectedReport, setSelectedReport] = useState('dashboard');
  const [dateRange, setDateRange] = useState({
    start: format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });
  const [filters, setFilters] = useState({
    employer: '',
    region: '',
    claimStatus: '',
    contributionType: ''
  });
  const [isExporting, setIsExporting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Sample data for demonstration
  const dashboardMetrics = [
    {
      title: 'Total Active Members',
      value: '2,350',
      change: '+2.5%',
      trend: 'up',
      color: 'from-blue-500 to-blue-600',
      icon: Users
    },
    {
      title: 'Total Employers',
      value: '45',
      change: '+1',
      trend: 'up',
      color: 'from-green-500 to-green-600',
      icon: Globe
    },
    {
      title: 'Monthly Contributions',
      value: 'KES 6.2M',
      change: '+8.2%',
      trend: 'up',
      color: 'from-purple-500 to-purple-600',
      icon: DollarSign
    },
    {
      title: 'Total Claims Paid',
      value: 'KES 1.8M',
      change: '+12.3%',
      trend: 'up',
      color: 'from-yellow-500 to-yellow-600',
      icon: FileText
    },
    {
      title: 'Pending Claims',
      value: '23',
      change: '-5%',
      trend: 'down',
      color: 'from-orange-500 to-orange-600',
      icon: Clock
    },
    {
      title: 'New Registrations',
      value: '42',
      change: '+15%',
      trend: 'up',
      color: 'from-indigo-500 to-indigo-600',
      icon: Plus
    },
    {
      title: 'Missed Contributions',
      value: '8',
      change: '-2',
      trend: 'down',
      color: 'from-red-500 to-red-600',
      icon: AlertTriangle
    }
  ];

  const contributionData = [
    { month: 'Jan', employee: 2400000, employer: 2600000, avc: 450000, expected: 5600000, received: 5450000 },
    { month: 'Feb', employee: 2450000, employer: 2650000, avc: 480000, expected: 5700000, received: 5580000 },
    { month: 'Mar', employee: 2480000, employer: 2680000, avc: 520000, expected: 5800000, received: 5680000 },
    { month: 'Apr', employee: 2520000, employer: 2720000, avc: 560000, expected: 5900000, received: 5800000 },
    { month: 'May', employee: 2550000, employer: 2750000, avc: 580000, expected: 6000000, received: 5880000 },
    { month: 'Jun', employee: 2600000, employer: 2800000, avc: 600000, expected: 6100000, received: 6000000 }
  ];

  const memberActivityData = [
    { date: '2024-01-01', logins: 156, selfService: 89, active: 234, inactive: 45 },
    { date: '2024-01-02', logins: 143, selfService: 76, active: 267, inactive: 38 },
    { date: '2024-01-03', logins: 178, selfService: 92, active: 298, inactive: 42 },
    { date: '2024-01-04', logins: 134, selfService: 67, active: 245, inactive: 56 },
    { date: '2024-01-05', logins: 189, selfService: 103, active: 312, inactive: 33 },
    { date: '2024-01-06', logins: 167, selfService: 85, active: 278, inactive: 47 },
    { date: '2024-01-07', logins: 145, selfService: 72, active: 256, inactive: 51 }
  ];

  const claimsData = [
    { type: 'Retirement', approved: 12, rejected: 1, pending: 3, avgProcessTime: 14, totalPayout: 1200000 },
    { type: 'Death-in-service', approved: 8, rejected: 0, pending: 2, avgProcessTime: 21, totalPayout: 800000 },
    { type: 'Withdrawal', approved: 15, rejected: 3, pending: 5, avgProcessTime: 7, totalPayout: 450000 },
    { type: 'Medical', approved: 34, rejected: 2, pending: 8, avgProcessTime: 5, totalPayout: 680000 }
  ];

  const votingData = [
    { session: 'Annual Elections 2024', status: 'Completed', turnout: 78.5, method: 'USSD/Web', results: 'Finalized' },
    { session: 'Budget Approval', status: 'Active', turnout: 45.2, method: 'Web', results: 'Pending' },
    { session: 'Policy Changes', status: 'Scheduled', turnout: 0, method: 'USSD', results: 'Not Started' }
  ];

  const benefitStatements = [
    { member: 'John Doe', employer: 'ABC Corp', balance: 450000, projection: 1200000, lastGenerated: '2024-01-15' },
    { member: 'Jane Smith', employer: 'XYZ Ltd', balance: 680000, projection: 1800000, lastGenerated: '2024-01-14' },
    { member: 'Bob Johnson', employer: 'DEF Inc', balance: 320000, projection: 850000, lastGenerated: '2024-01-13' },
    { member: 'Alice Brown', employer: 'GHI Co', balance: 780000, projection: 2100000, lastGenerated: '2024-01-12' }
  ];

  const systemAlerts = [
    { type: 'Missed Contributions', count: 8, severity: 'High', description: 'ABC Corp - 45 days overdue' },
    { type: 'Medical Bills', count: 3, severity: 'Medium', description: 'Kenyatta Hospital - 60 days overdue' },
    { type: 'Invalid Data', count: 12, severity: 'Low', description: 'Duplicate beneficiary records' },
    { type: 'Incomplete Claims', count: 5, severity: 'Medium', description: 'Missing supporting documents' }
  ];

  const auditTrail = [
    { timestamp: '2024-01-15 10:30:00', user: 'admin@pension.gov', action: 'Member Registration', details: 'New member John Doe registered', ipAddress: '192.168.1.100' },
    { timestamp: '2024-01-15 09:45:00', user: 'finance@pension.gov', action: 'Contribution Update', details: 'Monthly contributions updated for ABC Corp', ipAddress: '192.168.1.101' },
    { timestamp: '2024-01-15 08:20:00', user: 'medical@pension.gov', action: 'Claim Approval', details: 'Medical claim approved for Jane Smith', ipAddress: '192.168.1.102' },
    { timestamp: '2024-01-14 16:15:00', user: 'admin@pension.gov', action: 'System Configuration', details: 'Interest rate updated to 12.5%', ipAddress: '192.168.1.100' }
  ];

  const refreshData = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const exportData = async (type: string) => {
    setIsExporting(true);
    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsExporting(false);
    
    // In real implementation, trigger download
    console.log(`Exporting ${type} data...`);
  };

  const reportTabs = [
    { id: 'dashboard', label: 'Real-Time Dashboard', icon: BarChart3 },
    { id: 'contributions', label: 'Contribution Reports', icon: DollarSign },
    { id: 'members', label: 'Member Activity', icon: Users },
    { id: 'claims', label: 'Claims Reports', icon: FileText },
    { id: 'voting', label: 'Voting Reports', icon: Vote },
    { id: 'benefits', label: 'Benefit Statements', icon: Eye },
    { id: 'trends', label: 'Trends & Analytics', icon: TrendingUp },
    { id: 'alerts', label: 'System Alerts', icon: AlertTriangle },
    { id: 'export', label: 'Data Export', icon: Download },
    { id: 'audit', label: 'Audit & Compliance', icon: Shield }
  ];

  const MetricCard = ({ metric }: { metric: any }) => (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className={`absolute inset-0 bg-gradient-to-r ${metric.color} opacity-5`}></div>
      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${metric.color} shadow-lg`}>
              <metric.icon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{metric.title}</p>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`flex items-center text-sm font-medium ${
              metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {metric.trend === 'up' ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              {metric.change}
            </div>
            <p className="text-xs text-gray-500">vs last month</p>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardMetrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>

      {/* Quick Filters */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Quick Filters</h3>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Filter by:</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select 
            value={selectedTimeframe} 
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <select 
            value={filters.employer} 
            onChange={(e) => setFilters({...filters, employer: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Employers</option>
            <option value="abc">ABC Corp</option>
            <option value="xyz">XYZ Ltd</option>
            <option value="def">DEF Inc</option>
          </select>
          <select 
            value={filters.region} 
            onChange={(e) => setFilters({...filters, region: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Regions</option>
            <option value="nairobi">Nairobi</option>
            <option value="mombasa">Mombasa</option>
            <option value="kisumu">Kisumu</option>
          </select>
          <Button onClick={refreshData} disabled={refreshing} className="flex items-center">
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Monthly Contributions Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={contributionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `KES ${(value / 1000000).toFixed(1)}M`} />
              <Area type="monotone" dataKey="employee" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="employer" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              <Area type="monotone" dataKey="avc" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Claims Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={claimsData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="approved"
              >
                {claimsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${index * 90}, 70%, 60%)`} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );

  const renderContributions = () => (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Contribution Analysis</h3>
          <Button onClick={() => exportData('contributions')} disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={contributionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `KES ${(value / 1000000).toFixed(1)}M`} />
            <Legend />
            <Bar dataKey="employee" fill="#3B82F6" name="Employee" />
            <Bar dataKey="employer" fill="#10B981" name="Employer" />
            <Bar dataKey="avc" fill="#8B5CF6" name="AVC" />
            <Line type="monotone" dataKey="expected" stroke="#EF4444" strokeWidth={2} name="Expected" />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Contribution Status Breakdown</h3>
        <Table
          columns={[
            { key: 'month', label: 'Month' },
            { key: 'expected', label: 'Expected', render: (value) => `KES ${(value / 1000000).toFixed(1)}M` },
            { key: 'received', label: 'Received', render: (value) => `KES ${(value / 1000000).toFixed(1)}M` },
            { key: 'variance', label: 'Variance', render: (_, row) => {
              const variance = ((row.received - row.expected) / row.expected * 100).toFixed(1);
              return (
                <span className={`font-medium ${parseFloat(variance) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {variance}%
                </span>
              );
            }},
            { key: 'status', label: 'Status', render: (_, row) => {
              const status = row.received >= row.expected ? 'Complete' : 'Partial';
              return (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  status === 'Complete' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {status}
                </span>
              );
            }}
          ]}
          data={contributionData}
        />
      </Card>
    </div>
  );

  const renderMemberActivity = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold mb-4">Member Portal Usage</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsLineChart data={memberActivityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="logins" stroke="#3B82F6" strokeWidth={2} name="Daily Logins" />
            <Line type="monotone" dataKey="selfService" stroke="#10B981" strokeWidth={2} name="Self-Service Actions" />
            <Line type="monotone" dataKey="active" stroke="#8B5CF6" strokeWidth={2} name="Active Users" />
          </RechartsLineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Most Active Users</h3>
          <div className="space-y-3">
            {[
              { name: 'John Doe', logins: 45, lastLogin: '2024-01-15' },
              { name: 'Jane Smith', logins: 38, lastLogin: '2024-01-14' },
              { name: 'Bob Johnson', logins: 32, lastLogin: '2024-01-15' },
              { name: 'Alice Brown', logins: 29, lastLogin: '2024-01-13' }
            ].map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-600">Last login: {user.lastLogin}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">{user.logins}</p>
                  <p className="text-xs text-gray-500">logins</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Membership Status</h3>
          <div className="space-y-3">
            {[
              { status: 'Active', count: 2156, color: 'bg-green-500' },
              { status: 'Inactive', count: 94, color: 'bg-yellow-500' },
              { status: 'Retired', count: 78, color: 'bg-blue-500' },
              { status: 'Deceased', count: 22, color: 'bg-gray-500' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${item.color}`}></div>
                  <span className="text-sm font-medium">{item.status}</span>
                </div>
                <span className="text-sm font-bold">{item.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderClaims = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold mb-4">Claims Processing Statistics</h3>
        <Table
          columns={[
            { key: 'type', label: 'Claim Type' },
            { key: 'approved', label: 'Approved' },
            { key: 'rejected', label: 'Rejected' },
            { key: 'pending', label: 'Pending' },
            { key: 'avgProcessTime', label: 'Avg. Processing Time', render: (value) => `${value} days` },
            { key: 'totalPayout', label: 'Total Payout', render: (value) => `KES ${(value / 1000000).toFixed(1)}M` }
          ]}
          data={claimsData}
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Claims by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={claimsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="approved" fill="#10B981" name="Approved" />
              <Bar dataKey="pending" fill="#F59E0B" name="Pending" />
              <Bar dataKey="rejected" fill="#EF4444" name="Rejected" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Processing Time Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={claimsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="avgProcessTime" stroke="#3B82F6" strokeWidth={2} name="Avg. Days" />
            </RechartsLineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );

  const renderVoting = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold mb-4">Voting Sessions</h3>
        <Table
          columns={[
            { key: 'session', label: 'Session Name' },
            { key: 'status', label: 'Status', render: (value) => (
              <span className={`px-2 py-1 text-xs rounded-full ${
                value === 'Completed' ? 'bg-green-100 text-green-800' :
                value === 'Active' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {value}
              </span>
            )},
            { key: 'turnout', label: 'Turnout %', render: (value) => `${value}%` },
            { key: 'method', label: 'Method' },
            { key: 'results', label: 'Results' }
          ]}
          data={votingData}
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Voter Turnout by Method</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { method: 'USSD', turnout: 65 },
              { method: 'Web', turnout: 45 },
              { method: 'Admin', turnout: 12 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="method" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="turnout" fill="#8B5CF6" name="Turnout %" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Real-time Results</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">Annual Elections 2024</h4>
              <p className="text-sm text-blue-700">Candidate A: 45% | Candidate B: 55%</p>
              <div className="mt-2 bg-blue-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '55%' }}></div>
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900">Budget Approval</h4>
              <p className="text-sm text-green-700">Yes: 78% | No: 22%</p>
              <div className="mt-2 bg-green-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderBenefits = () => (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Benefit Statements & Projections</h3>
          <div className="flex space-x-2">
            <Button onClick={() => exportData('statements')} disabled={isExporting}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button onClick={() => exportData('bulk-statements')} disabled={isExporting}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Bulk Export
            </Button>
          </div>
        </div>
        <Table
          columns={[
            { key: 'member', label: 'Member' },
            { key: 'employer', label: 'Employer' },
            { key: 'balance', label: 'Current Balance', render: (value) => `KES ${(value / 1000).toFixed(0)}K` },
            { key: 'projection', label: 'Retirement Projection', render: (value) => `KES ${(value / 1000).toFixed(0)}K` },
            { key: 'lastGenerated', label: 'Last Generated' },
            { key: 'actions', label: 'Actions', render: () => (
              <div className="flex space-x-2">
                <Button size="sm" variant="secondary">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="secondary">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            )}
          ]}
          data={benefitStatements}
        />
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Auto-Generation Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Schedule Settings</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Monthly Statements</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Quarterly Statements</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3">Email Settings</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Auto-email statements</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <Button className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Send Bulk Statements
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderTrends = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold mb-4">Contribution Trends</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={contributionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `KES ${(value / 1000000).toFixed(1)}M`} />
            <Legend />
            <Bar dataKey="employee" fill="#3B82F6" name="Employee" />
            <Bar dataKey="employer" fill="#10B981" name="Employer" />
            <Line type="monotone" dataKey="expected" stroke="#EF4444" strokeWidth={2} name="Expected" />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Member Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={memberActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="active" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Active" />
              <Area type="monotone" dataKey="inactive" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} name="Inactive" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Employer Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { employer: 'ABC Corp', amount: 2800000 },
              { employer: 'XYZ Ltd', amount: 1900000 },
              { employer: 'DEF Inc', amount: 1200000 },
              { employer: 'GHI Co', amount: 800000 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="employer" />
              <YAxis />
              <Tooltip formatter={(value) => `KES ${(value / 1000000).toFixed(1)}M`} />
              <Bar dataKey="amount" fill="#8B5CF6" name="Monthly Contribution" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold mb-4">System Alerts & Exceptions</h3>
        <div className="space-y-4">
          {systemAlerts.map((alert, index) => (
            <div key={index} className={`p-4 rounded-lg border-l-4 ${
              alert.severity === 'High' ? 'border-red-500 bg-red-50' :
              alert.severity === 'Medium' ? 'border-yellow-500 bg-yellow-50' :
              'border-blue-500 bg-blue-50'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{alert.type}</h4>
                  <p className="text-sm text-gray-600">{alert.description}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    alert.severity === 'High' ? 'bg-red-100 text-red-800' :
                    alert.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {alert.severity}
                  </span>
                  <span className="text-lg font-bold">{alert.count}</span>
                  <Button size="sm" variant="secondary">
                    <Bell className="h-4 w-4 mr-1" />
                    Acknowledge
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderExport = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold mb-4">Data Export Center</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Quick Exports</h4>
            <div className="space-y-3">
              {[
                { label: 'Contributions', icon: DollarSign },
                { label: 'Claims', icon: FileText },
                { label: 'Memberships', icon: Users },
                { label: 'Statements', icon: Eye }
              ].map((item, index) => (
                <Button
                  key={index}
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={() => exportData(item.label.toLowerCase())}
                  disabled={isExporting}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  Export {item.label}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3">Scheduled Reports</h4>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Weekly Summary</span>
                  <span className="text-xs text-gray-500">Every Monday</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Monthly Reports</span>
                  <span className="text-xs text-gray-500">1st of month</span>
                </div>
              </div>
              <Button className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule New Report
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderAudit = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold mb-4">Audit Trail</h3>
        <Table
          columns={[
            { key: 'timestamp', label: 'Timestamp' },
            { key: 'user', label: 'User' },
            { key: 'action', label: 'Action' },
            { key: 'details', label: 'Details' },
            { key: 'ipAddress', label: 'IP Address' }
          ]}
          data={auditTrail}
        />
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Compliance Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="flex items-center justify-center p-6">
            <Shield className="h-6 w-6 mr-2" />
            RBA Compliance
          </Button>
          <Button className="flex items-center justify-center p-6">
            <FileText className="h-6 w-6 mr-2" />
            KRA Submissions
          </Button>
          <Button className="flex items-center justify-center p-6">
            <Database className="h-6 w-6 mr-2" />
            System Backup
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (selectedReport) {
      case 'dashboard': return renderDashboard();
      case 'contributions': return renderContributions();
      case 'members': return renderMemberActivity();
      case 'claims': return renderClaims();
      case 'voting': return renderVoting();
      case 'benefits': return renderBenefits();
      case 'trends': return renderTrends();
      case 'alerts': return renderAlerts();
      case 'export': return renderExport();
      case 'audit': return renderAudit();
      default: return renderDashboard();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive reporting and analytics dashboard</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button onClick={() => exportData('current-view')} disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </div>

      {/* Report Navigation Tabs */}
      <Card className="p-0">
        <div className="flex overflow-x-auto">
          {reportTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedReport(tab.id)}
              className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                selectedReport === tab.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Report Content */}
      <div className="min-h-96">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ReportsAnalytics;
