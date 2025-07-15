import React, { useState } from 'react';
import { Card } from '../../components/Common/Card';
import { Button } from '../../components/Common/Button';
import { Table } from '../../components/Common/Table';
import { StatusBadge } from '../../components/Common/StatusBadge';
import { 
  AlertTriangle, 
  Bell, 
  Clock, 
  CheckCircle,
  XCircle,
  Eye,
  Settings,
  Plus,
  Search,
  Filter,
  Download,
  Users,
  Heart,
  DollarSign,
  FileText,
  Calendar,
  Activity,
  Smartphone,
  Mail
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const SystemAlerts: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('active');
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [showCreateAlert, setShowCreateAlert] = useState(false);

  const alertStats = [
    { name: 'Active Alerts', value: 23, icon: AlertTriangle, color: 'text-red-600', change: '+5' },
    { name: 'Resolved Today', value: 12, icon: CheckCircle, color: 'text-green-600', change: '+8' },
    { name: 'Critical Alerts', value: 3, icon: Bell, color: 'text-orange-600', change: '-2' },
    { name: 'Automated Alerts', value: 156, icon: Activity, color: 'text-blue-600', change: '+23' }
  ];

  const systemAlerts = [
    {
      id: 'SA001',
      type: 'Medical Overdue',
      severity: 'Critical',
      title: 'Overdue Medical Bills Alert',
      message: 'Kenyatta Hospital has 3 bills overdue by more than 45 days totaling KES 125,000',
      memberId: 'M001240',
      memberName: 'Robert Wilson',
      createdDate: '2024-01-15 10:30',
      isRead: false,
      actionRequired: true,
      assignedTo: 'Medical Officer',
      category: 'Medical',
      priority: 'High',
      source: 'Automated',
      affectedCount: 3,
      estimatedImpact: 'High'
    },
    {
      id: 'SA002',
      type: 'Contribution Missing',
      severity: 'High',
      title: 'Missing Monthly Contribution',
      message: 'ABC Company Ltd has not submitted December 2023 contributions for 145 members',
      createdDate: '2024-01-14 09:15',
      isRead: false,
      actionRequired: true,
      assignedTo: 'Finance Officer',
      category: 'Contributions',
      priority: 'High',
      source: 'Automated',
      affectedCount: 145,
      estimatedImpact: 'Critical'
    },
    {
      id: 'SA003',
      type: 'Document Expiry',
      severity: 'Medium',
      title: 'KRA PIN Certificates Expiring',
      message: '15 members have KRA PIN certificates expiring within 30 days',
      createdDate: '2024-01-13 14:20',
      isRead: true,
      actionRequired: true,
      assignedTo: 'Customer Care',
      category: 'Compliance',
      priority: 'Medium',
      source: 'Automated',
      affectedCount: 15,
      estimatedImpact: 'Medium'
    },
    {
      id: 'SA004',
      type: 'Tax Exemption Renewal',
      severity: 'Medium',
      title: 'Tax Exemption Certificates Due for Renewal',
      message: '8 members have tax exemption certificates expiring in 60 days',
      createdDate: '2024-01-12 11:45',
      isRead: false,
      actionRequired: true,
      assignedTo: 'Pension Officer',
      category: 'Tax',
      priority: 'Medium',
      source: 'Automated',
      affectedCount: 8,
      estimatedImpact: 'Medium'
    },
    {
      id: 'SA005',
      type: 'Member Portal Access',
      severity: 'Low',
      title: 'Multiple Failed Login Attempts',
      message: 'Member M001234 has 5 consecutive failed login attempts from IP 192.168.1.100',
      memberId: 'M001234',
      memberName: 'John Doe',
      createdDate: '2024-01-11 16:30',
      isRead: true,
      actionRequired: false,
      assignedTo: 'IT Support',
      category: 'Security',
      priority: 'Low',
      source: 'System',
      affectedCount: 1,
      estimatedImpact: 'Low'
    }
  ];

  const alertTrends = [
    { month: 'Aug', critical: 5, high: 12, medium: 25, low: 8 },
    { month: 'Sep', critical: 3, high: 15, medium: 22, low: 12 },
    { month: 'Oct', critical: 7, high: 18, medium: 28, low: 15 },
    { month: 'Nov', critical: 4, high: 14, medium: 24, low: 10 },
    { month: 'Dec', critical: 6, high: 16, medium: 30, low: 18 },
    { month: 'Jan', critical: 3, high: 11, medium: 19, low: 9 }
  ];

  const alertCategories = [
    { name: 'Medical', value: 35, color: '#EF4444' },
    { name: 'Contributions', value: 28, color: '#3B82F6' },
    { name: 'Compliance', value: 20, color: '#F59E0B' },
    { name: 'Security', value: 12, color: '#8B5CF6' },
    { name: 'System', value: 5, color: '#10B981' }
  ];

  const alertColumns = [
    { 
      key: 'severity', 
      label: 'Severity', 
      render: (value: string) => (
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${
            value === 'Critical' ? 'bg-red-500' :
            value === 'High' ? 'bg-orange-500' :
            value === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
          }`}></div>
          <span className={`font-medium ${
            value === 'Critical' ? 'text-red-600' :
            value === 'High' ? 'text-orange-600' :
            value === 'Medium' ? 'text-yellow-600' : 'text-blue-600'
          }`}>
            {value}
          </span>
        </div>
      )
    },
    { key: 'title', label: 'Alert Title', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'assignedTo', label: 'Assigned To', sortable: true },
    { 
      key: 'affectedCount', 
      label: 'Affected', 
      sortable: true,
      render: (value: number) => (
        <span className="font-medium">{value} {value === 1 ? 'member' : 'members'}</span>
      )
    },
    { key: 'createdDate', label: 'Created', sortable: true },
    { 
      key: 'isRead', 
      label: 'Status', 
      render: (value: boolean) => (
        <div className="flex items-center">
          {value ? (
            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <Bell className="h-4 w-4 text-orange-500 mr-1" />
          )}
          <span className={value ? 'text-green-600' : 'text-orange-600'}>
            {value ? 'Read' : 'Unread'}
          </span>
        </div>
      )
    },
    { 
      key: 'actions', 
      label: 'Actions',
      render: (value: any, row: any) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSelectedAlert(row)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {row.actionRequired && (
            <Button variant="secondary" size="sm">
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      )
    }
  ];

  const filteredAlerts = systemAlerts.filter(alert => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'active') return !alert.isRead;
    if (selectedTab === 'critical') return alert.severity === 'Critical';
    if (selectedTab === 'resolved') return alert.isRead;
    return true;
  });

  const AlertDetailsModal = ({ alert }: any) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Alert Details - {alert.id}</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSelectedAlert(null)}
          >
            ×
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Alert Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Alert ID:</span>
                  <span className="font-medium">{alert.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Type:</span>
                  <span>{alert.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Severity:</span>
                  <span className={`font-medium ${
                    alert.severity === 'Critical' ? 'text-red-600' :
                    alert.severity === 'High' ? 'text-orange-600' :
                    alert.severity === 'Medium' ? 'text-yellow-600' : 'text-blue-600'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Category:</span>
                  <span>{alert.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Priority:</span>
                  <span>{alert.priority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Source:</span>
                  <span>{alert.source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Created:</span>
                  <span>{alert.createdDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Assigned To:</span>
                  <span>{alert.assignedTo}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-4">Impact Assessment</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Affected Members:</span>
                  <span className="font-medium">{alert.affectedCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Estimated Impact:</span>
                  <span className={`font-medium ${
                    alert.estimatedImpact === 'Critical' ? 'text-red-600' :
                    alert.estimatedImpact === 'High' ? 'text-orange-600' :
                    alert.estimatedImpact === 'Medium' ? 'text-yellow-600' : 'text-blue-600'
                  }`}>
                    {alert.estimatedImpact}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Action Required:</span>
                  <span className={alert.actionRequired ? 'text-red-600' : 'text-green-600'}>
                    {alert.actionRequired ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Alert Message</h4>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{alert.message}</p>
              </div>
            </div>

            {alert.memberId && (
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Affected Member</h4>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <p className="font-medium text-blue-900">{alert.memberName}</p>
                      <p className="text-sm text-blue-700">ID: {alert.memberId}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h4 className="font-medium text-gray-900 mb-4">Actions</h4>
              <div className="space-y-3">
                <Button className="w-full">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Resolved
                </Button>
                <Button variant="secondary" className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Reassign Alert
                </Button>
                <Button variant="secondary" className="w-full">
                  <Bell className="h-4 w-4 mr-2" />
                  Send Notification
                </Button>
                <Button variant="secondary" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Follow-up
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-4">Resolution Notes</h4>
              <textarea
                rows={4}
                placeholder="Add resolution notes or comments..."
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button variant="secondary" size="sm" className="mt-2">
                Save Notes
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const CreateAlertModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Create System Alert</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowCreateAlert(false)}
          >
            ×
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alert Type</label>
              <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Medical Overdue</option>
                <option>Contribution Missing</option>
                <option>Document Expiry</option>
                <option>Tax Exemption Renewal</option>
                <option>Member Portal Access</option>
                <option>System Error</option>
                <option>Custom Alert</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
              <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Critical</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Medical</option>
                <option>Contributions</option>
                <option>Compliance</option>
                <option>Security</option>
                <option>System</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
              <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Medical Officer</option>
                <option>Finance Officer</option>
                <option>Pension Officer</option>
                <option>Customer Care</option>
                <option>IT Support</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alert Title</label>
            <input
              type="text"
              placeholder="Enter alert title"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alert Message</label>
            <textarea
              rows={4}
              placeholder="Enter detailed alert message"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Member ID (Optional)</label>
              <input
                type="text"
                placeholder="M001234"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Affected Count</label>
              <input
                type="number"
                placeholder="1"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Action Required
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Send Email Notification
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Send SMS Alert
            </label>
          </div>
          
          <div className="flex space-x-2">
            <Button className="flex-1">Create Alert</Button>
            <Button variant="secondary" onClick={() => setShowCreateAlert(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">System Alerts & Notifications</h1>
        <div className="flex space-x-2">
          <Button variant="secondary" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Alert Settings
          </Button>
          <Button onClick={() => setShowCreateAlert(true)} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Create Alert
          </Button>
        </div>
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {alertStats.map((stat) => (
          <Card key={stat.name}>
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-lg">
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Alert Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={alertTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="critical" fill="#EF4444" name="Critical" />
              <Bar dataKey="high" fill="#F59E0B" name="High" />
              <Bar dataKey="medium" fill="#10B981" name="Medium" />
              <Bar dataKey="low" fill="#3B82F6" name="Low" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Alert Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={alertCategories}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {alertCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {alertCategories.map((item, index) => (
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
      </div>

      {/* Alerts Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search alerts..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button variant="secondary" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          
          <div className="flex space-x-1">
            {['active', 'critical', 'resolved', 'all'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-md capitalize ${
                  selectedTab === tab
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <Table columns={alertColumns} data={filteredAlerts} />
      </Card>

      {/* Modals */}
      {selectedAlert && <AlertDetailsModal alert={selectedAlert} />}
      {showCreateAlert && <CreateAlertModal />}
    </div>
  );
};

export default SystemAlerts;