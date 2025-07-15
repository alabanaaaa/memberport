import React, { useState } from 'react';
import { Card } from '../../components/Common/Card';
import { Button } from '../../components/Common/Button';
import { Table } from '../../components/Common/Table';
import { StatusBadge } from '../../components/Common/StatusBadge';
import { 
  Eye, 
  Shield, 
  User, 
  Clock, 
  Search,
  Filter,
  Download,
  Calendar,
  Activity,
  FileText,
  Edit2,
  Trash2,
  Plus,
  Settings,
  Database,
  Lock,
  Unlock,
  AlertTriangle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const AuditTrail: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('recent');
  const [selectedAudit, setSelectedAudit] = useState<any>(null);
  const [dateRange, setDateRange] = useState('today');

  const auditStats = [
    { name: 'Total Audit Logs', value: 15420, icon: FileText, color: 'text-blue-600', change: '+234' },
    { name: 'User Actions', value: 1247, icon: User, color: 'text-green-600', change: '+89' },
    { name: 'System Changes', value: 156, icon: Settings, color: 'text-orange-600', change: '+12' },
    { name: 'Security Events', value: 23, icon: Shield, color: 'text-red-600', change: '+3' }
  ];

  const auditLogs = [
    {
      id: 'AL001',
      timestamp: '2024-01-15 14:30:25',
      userId: 'U001',
      userName: 'John Admin',
      userRole: 'Super Admin',
      action: 'Member Profile Update',
      module: 'Member Management',
      recordId: 'M001234',
      recordType: 'Member',
      beforeValue: { phoneNumber: '+254 712 345 678', email: 'john.old@email.com' },
      afterValue: { phoneNumber: '+254 712 345 679', email: 'john.new@email.com' },
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'SES-2024-001',
      severity: 'Medium',
      category: 'Data Modification',
      success: true,
      description: 'Updated member contact information'
    },
    {
      id: 'AL002',
      timestamp: '2024-01-15 14:25:12',
      userId: 'U002',
      userName: 'Jane Officer',
      userRole: 'Pension Officer',
      action: 'Claim Approval',
      module: 'Claims Management',
      recordId: 'CLM-2024-001',
      recordType: 'Claim',
      beforeValue: { status: 'Under Review', amount: 1500000 },
      afterValue: { status: 'Approved', amount: 1500000, approvedBy: 'Jane Officer' },
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'SES-2024-002',
      severity: 'High',
      category: 'Approval',
      success: true,
      description: 'Approved retirement claim for John Doe'
    },
    {
      id: 'AL003',
      timestamp: '2024-01-15 14:20:45',
      userId: 'U003',
      userName: 'Bob Finance',
      userRole: 'Finance Officer',
      action: 'Contribution Schedule Upload',
      module: 'Contribution Management',
      recordId: 'CS-2024-001',
      recordType: 'Contribution Schedule',
      beforeValue: null,
      afterValue: { totalEmployees: 145, totalAmount: 4075000, status: 'Uploaded' },
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'SES-2024-003',
      severity: 'Medium',
      category: 'Data Import',
      success: true,
      description: 'Uploaded monthly contribution schedule for ABC Company'
    },
    {
      id: 'AL004',
      timestamp: '2024-01-15 14:15:30',
      userId: 'U001',
      userName: 'John Admin',
      userRole: 'Super Admin',
      action: 'User Account Creation',
      module: 'User Management',
      recordId: 'U004',
      recordType: 'User',
      beforeValue: null,
      afterValue: { username: 'mary.medical', role: 'Medical Officer', status: 'Active' },
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'SES-2024-001',
      severity: 'High',
      category: 'User Management',
      success: true,
      description: 'Created new user account for Medical Officer'
    },
    {
      id: 'AL005',
      timestamp: '2024-01-15 14:10:15',
      userId: 'SYSTEM',
      userName: 'System Process',
      userRole: 'System',
      action: 'Failed Login Attempt',
      module: 'Authentication',
      recordId: 'M001234',
      recordType: 'Member',
      beforeValue: { loginAttempts: 4 },
      afterValue: { loginAttempts: 5, accountLocked: true },
      ipAddress: '203.0.113.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: null,
      severity: 'High',
      category: 'Security',
      success: false,
      description: 'Account locked due to multiple failed login attempts'
    }
  ];

  const activityTrends = [
    { hour: '00:00', logins: 5, updates: 2, approvals: 0, errors: 1 },
    { hour: '04:00', logins: 3, updates: 1, approvals: 0, errors: 0 },
    { hour: '08:00', logins: 45, updates: 23, approvals: 8, errors: 2 },
    { hour: '12:00', logins: 67, updates: 34, approvals: 12, errors: 1 },
    { hour: '16:00', logins: 52, updates: 28, approvals: 15, errors: 3 },
    { hour: '20:00', logins: 23, updates: 12, approvals: 5, errors: 1 }
  ];

  const actionCategories = [
    { name: 'Data Modification', value: 45, color: '#3B82F6' },
    { name: 'Approval', value: 28, color: '#10B981' },
    { name: 'User Management', value: 15, color: '#8B5CF6' },
    { name: 'Security', value: 8, color: '#EF4444' },
    { name: 'System', value: 4, color: '#F59E0B' }
  ];

  const auditColumns = [
    { key: 'timestamp', label: 'Timestamp', sortable: true },
    { key: 'userName', label: 'User', sortable: true },
    { key: 'userRole', label: 'Role', sortable: true },
    { key: 'action', label: 'Action', sortable: true },
    { key: 'module', label: 'Module', sortable: true },
    { key: 'recordId', label: 'Record ID', sortable: true },
    { 
      key: 'severity', 
      label: 'Severity', 
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'High' ? 'bg-red-100 text-red-800' :
          value === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {value}
        </span>
      )
    },
    { 
      key: 'success', 
      label: 'Status', 
      render: (value: boolean) => (
        <div className="flex items-center">
          {value ? (
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          ) : (
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
          )}
          <span className={value ? 'text-green-600' : 'text-red-600'}>
            {value ? 'Success' : 'Failed'}
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
            onClick={() => setSelectedAudit(row)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const filteredAudits = auditLogs.filter(audit => {
    if (selectedTab === 'recent') return true;
    if (selectedTab === 'security') return audit.category === 'Security';
    if (selectedTab === 'approvals') return audit.category === 'Approval';
    if (selectedTab === 'errors') return !audit.success;
    return true;
  });

  const AuditDetailsModal = ({ audit }: any) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Audit Log Details - {audit.id}</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSelectedAudit(null)}
          >
            ×
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Action Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Audit ID:</span>
                  <span className="font-medium">{audit.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Timestamp:</span>
                  <span>{audit.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Action:</span>
                  <span className="font-medium">{audit.action}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Module:</span>
                  <span>{audit.module}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Record Type:</span>
                  <span>{audit.recordType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Record ID:</span>
                  <span className="font-mono">{audit.recordId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Category:</span>
                  <span>{audit.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Severity:</span>
                  <span className={`font-medium ${
                    audit.severity === 'High' ? 'text-red-600' :
                    audit.severity === 'Medium' ? 'text-yellow-600' : 'text-blue-600'
                  }`}>
                    {audit.severity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className={audit.success ? 'text-green-600' : 'text-red-600'}>
                    {audit.success ? 'Success' : 'Failed'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-4">User Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">User ID:</span>
                  <span className="font-mono">{audit.userId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">User Name:</span>
                  <span className="font-medium">{audit.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Role:</span>
                  <span>{audit.userRole}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">IP Address:</span>
                  <span className="font-mono">{audit.ipAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Session ID:</span>
                  <span className="font-mono">{audit.sessionId || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Description</h4>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{audit.description}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-4">Data Changes</h4>
              <div className="space-y-4">
                {audit.beforeValue && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Before:</h5>
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <pre className="text-xs text-red-800 whitespace-pre-wrap">
                        {JSON.stringify(audit.beforeValue, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
                
                {audit.afterValue && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">After:</h5>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <pre className="text-xs text-green-800 whitespace-pre-wrap">
                        {JSON.stringify(audit.afterValue, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-4">Technical Details</h4>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-gray-500">User Agent:</span>
                  <p className="font-mono text-gray-700 break-all">{audit.userAgent}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex space-x-2">
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Export Details
          </Button>
          <Button variant="secondary">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="secondary" onClick={() => setSelectedAudit(null)}>
            Close
          </Button>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Audit Trail & System Logs</h1>
        <div className="flex space-x-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <Button variant="secondary" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Audit Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {auditStats.map((stat) => (
          <Card key={stat.name}>
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-lg">
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                <p className="text-sm text-green-600">{stat.change}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Activity Trends (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="logins" stroke="#3B82F6" strokeWidth={2} name="Logins" />
              <Line type="monotone" dataKey="updates" stroke="#10B981" strokeWidth={2} name="Updates" />
              <Line type="monotone" dataKey="approvals" stroke="#8B5CF6" strokeWidth={2} name="Approvals" />
              <Line type="monotone" dataKey="errors" stroke="#EF4444" strokeWidth={2} name="Errors" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Action Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={actionCategories}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {actionCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {actionCategories.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Audit Logs Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search audit logs..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button variant="secondary" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filter
            </Button>
          </div>
          
          <div className="flex space-x-1">
            {['recent', 'security', 'approvals', 'errors'].map((tab) => (
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

        <Table columns={auditColumns} data={filteredAudits} />
      </Card>

      {/* Compliance Information */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-start">
          <Shield className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 mb-2">Audit Trail Compliance</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• All user actions are automatically logged with complete audit trail</li>
              <li>• Before and after values are captured for all data modifications</li>
              <li>• Logs are tamper-proof and stored with cryptographic integrity</li>
              <li>• Retention period: 7 years for regulatory compliance</li>
              <li>• Real-time monitoring and alerting for suspicious activities</li>
              <li>• Complete session tracking with IP address and device information</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Modals */}
      {selectedAudit && <AuditDetailsModal audit={selectedAudit} />}
    </div>
  );
};

export default AuditTrail;