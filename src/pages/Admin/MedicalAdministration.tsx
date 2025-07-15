import React, { useState } from 'react';
import { Card } from '../../components/Common/Card';
import { Button } from '../../components/Common/Button';
import { Table } from '../../components/Common/Table';
import { StatusBadge } from '../../components/Common/StatusBadge';
import { 
  Heart, 
  Building2, 
  Users, 
  DollarSign, 
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit2,
  Bell,
  Calendar,
  FileText,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const MedicalAdministration: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedHospital, setSelectedHospital] = useState<any>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);

  const medicalStats = [
    { name: 'Total Medical Expenditure', value: 'KES 2.8M', icon: Heart, color: 'text-red-600', change: '+12.5%' },
    { name: 'Active Hospital Accounts', value: 45, icon: Building2, color: 'text-blue-600', change: '+3' },
    { name: 'Members with Medical Cover', value: 2350, icon: Users, color: 'text-green-600', change: '+45' },
    { name: 'Overdue Bills (45+ days)', value: 8, icon: AlertTriangle, color: 'text-orange-600', change: '-2' }
  ];

  const hospitalAccounts = [
    {
      id: 'H001',
      hospitalName: 'Nairobi Hospital',
      contactPerson: 'Dr. Sarah Johnson',
      phoneNumber: '+254 712 345 678',
      email: 'billing@nairobihospital.org',
      address: 'Argwings Kodhek Road, Nairobi',
      accountBalance: 125000,
      totalClaims: 450000,
      pendingBills: 25000,
      overdueAmount: 0,
      lastPaymentDate: '2024-01-15',
      paymentTerms: 30,
      isActive: true,
      overdueAlerts: 0,
      monthlyLimit: 200000,
      utilizationRate: 62.5
    },
    {
      id: 'H002',
      hospitalName: 'Aga Khan Hospital',
      contactPerson: 'Dr. Ahmed Hassan',
      phoneNumber: '+254 722 987 654',
      email: 'finance@agakhan.org',
      address: 'Third Parklands Avenue, Nairobi',
      accountBalance: 85000,
      totalClaims: 320000,
      pendingBills: 15000,
      overdueAmount: 0,
      lastPaymentDate: '2024-01-10',
      paymentTerms: 45,
      isActive: true,
      overdueAlerts: 0,
      monthlyLimit: 150000,
      utilizationRate: 56.7
    },
    {
      id: 'H003',
      hospitalName: 'Kenyatta Hospital',
      contactPerson: 'Dr. Mary Wanjiku',
      phoneNumber: '+254 733 456 789',
      email: 'accounts@knh.or.ke',
      address: 'Hospital Road, Nairobi',
      accountBalance: 165000,
      totalClaims: 580000,
      pendingBills: 45000,
      overdueAmount: 10000,
      lastPaymentDate: '2024-01-05',
      paymentTerms: 30,
      isActive: true,
      overdueAlerts: 1,
      monthlyLimit: 300000,
      utilizationRate: 75.3
    }
  ];

  const medicalLimits = [
    {
      id: 'ML001',
      memberNumber: 'M001234',
      memberName: 'John Doe',
      inpatientLimit: 150000,
      outpatientLimit: 50000,
      inpatientUsed: 85000,
      outpatientUsed: 25000,
      familyMembers: 3,
      totalFamilyLimit: 400000,
      totalFamilyUsed: 143000,
      lastClaimDate: '2024-01-15',
      status: 'Active'
    },
    {
      id: 'ML002',
      memberNumber: 'M001235',
      memberName: 'Jane Smith',
      inpatientLimit: 150000,
      outpatientLimit: 50000,
      inpatientUsed: 120000,
      outpatientUsed: 45000,
      familyMembers: 2,
      totalFamilyLimit: 350000,
      totalFamilyUsed: 245000,
      lastClaimDate: '2024-01-12',
      status: 'Near Limit'
    }
  ];

  const overdueAlerts = [
    {
      id: 'OA001',
      hospitalName: 'Kenyatta Hospital',
      billNumber: 'KH-2023-1245',
      amount: 10000,
      memberName: 'Robert Wilson',
      billDate: '2023-11-15',
      dueDate: '2023-12-15',
      daysPending: 47,
      status: 'Overdue',
      priority: 'High'
    },
    {
      id: 'OA002',
      hospitalName: 'Metropolitan Hospital',
      billNumber: 'MH-2023-0987',
      amount: 15000,
      memberName: 'Alice Brown',
      billDate: '2023-11-20',
      dueDate: '2023-12-20',
      daysPending: 42,
      status: 'Overdue',
      priority: 'Medium'
    }
  ];

  const medicalTrends = [
    { month: 'Aug', inpatient: 180000, outpatient: 85000, family: 120000 },
    { month: 'Sep', inpatient: 195000, outpatient: 92000, family: 135000 },
    { month: 'Oct', inpatient: 210000, outpatient: 88000, family: 145000 },
    { month: 'Nov', inpatient: 225000, outpatient: 95000, family: 158000 },
    { month: 'Dec', inpatient: 240000, outpatient: 102000, family: 165000 },
    { month: 'Jan', inpatient: 255000, outpatient: 108000, family: 172000 }
  ];

  const utilizationData = [
    { name: 'Inpatient', value: 65, color: '#EF4444' },
    { name: 'Outpatient', value: 45, color: '#3B82F6' },
    { name: 'Family', value: 55, color: '#10B981' },
    { name: 'Available', value: 35, color: '#E5E7EB' }
  ];

  const hospitalColumns = [
    { key: 'hospitalName', label: 'Hospital Name', sortable: true },
    { key: 'contactPerson', label: 'Contact Person', sortable: true },
    { 
      key: 'accountBalance', 
      label: 'Account Balance', 
      sortable: true,
      render: (value: number) => `KES ${value.toLocaleString()}`
    },
    { 
      key: 'pendingBills', 
      label: 'Pending Bills', 
      sortable: true,
      render: (value: number) => `KES ${value.toLocaleString()}`
    },
    { 
      key: 'overdueAmount', 
      label: 'Overdue', 
      sortable: true,
      render: (value: number) => (
        <span className={value > 0 ? 'text-red-600 font-semibold' : 'text-green-600'}>
          KES {value.toLocaleString()}
        </span>
      )
    },
    { 
      key: 'utilizationRate', 
      label: 'Utilization', 
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center">
          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
            <div 
              className={`h-2 rounded-full ${
                value > 80 ? 'bg-red-500' : value > 60 ? 'bg-orange-500' : 'bg-green-500'
              }`}
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-sm">{value}%</span>
        </div>
      )
    },
    { 
      key: 'overdueAlerts', 
      label: 'Alerts', 
      render: (value: number) => (
        value > 0 ? (
          <div className="flex items-center text-red-600">
            <Bell className="h-4 w-4 mr-1" />
            {value}
          </div>
        ) : (
          <span className="text-green-600">None</span>
        )
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
            onClick={() => setSelectedHospital(row)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm">
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const limitsColumns = [
    { key: 'memberNumber', label: 'Member No.', sortable: true },
    { key: 'memberName', label: 'Member Name', sortable: true },
    { 
      key: 'inpatientLimit', 
      label: 'Inpatient Limit', 
      sortable: true,
      render: (value: number) => `KES ${value.toLocaleString()}`
    },
    { 
      key: 'inpatientUsed', 
      label: 'Inpatient Used', 
      sortable: true,
      render: (value: number, row: any) => (
        <div>
          <span className="font-medium">KES {value.toLocaleString()}</span>
          <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
            <div 
              className={`h-1 rounded-full ${
                (value / row.inpatientLimit) > 0.8 ? 'bg-red-500' : 
                (value / row.inpatientLimit) > 0.6 ? 'bg-orange-500' : 'bg-green-500'
              }`}
              style={{ width: `${(value / row.inpatientLimit) * 100}%` }}
            />
          </div>
        </div>
      )
    },
    { 
      key: 'outpatientUsed', 
      label: 'Outpatient Used', 
      sortable: true,
      render: (value: number, row: any) => (
        <div>
          <span className="font-medium">KES {value.toLocaleString()}</span>
          <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
            <div 
              className={`h-1 rounded-full ${
                (value / row.outpatientLimit) > 0.8 ? 'bg-red-500' : 
                (value / row.outpatientLimit) > 0.6 ? 'bg-orange-500' : 'bg-green-500'
              }`}
              style={{ width: `${(value / row.outpatientLimit) * 100}%` }}
            />
          </div>
        </div>
      )
    },
    { 
      key: 'totalFamilyUsed', 
      label: 'Family Used', 
      sortable: true,
      render: (value: number, row: any) => (
        <div>
          <span className="font-medium">KES {value.toLocaleString()}</span>
          <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
            <div 
              className={`h-1 rounded-full ${
                (value / row.totalFamilyLimit) > 0.8 ? 'bg-red-500' : 
                (value / row.totalFamilyLimit) > 0.6 ? 'bg-orange-500' : 'bg-green-500'
              }`}
              style={{ width: `${(value / row.totalFamilyLimit) * 100}%` }}
            />
          </div>
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (value: string) => <StatusBadge status={value} />
    },
    { 
      key: 'actions', 
      label: 'Actions',
      render: (value: any, row: any) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm">
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm">
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const alertsColumns = [
    { key: 'hospitalName', label: 'Hospital', sortable: true },
    { key: 'billNumber', label: 'Bill Number', sortable: true },
    { key: 'memberName', label: 'Member', sortable: true },
    { 
      key: 'amount', 
      label: 'Amount', 
      sortable: true,
      render: (value: number) => `KES ${value.toLocaleString()}`
    },
    { key: 'billDate', label: 'Bill Date', sortable: true },
    { key: 'dueDate', label: 'Due Date', sortable: true },
    { 
      key: 'daysPending', 
      label: 'Days Pending', 
      sortable: true,
      render: (value: number) => (
        <span className={`font-medium ${
          value > 60 ? 'text-red-600' : value > 45 ? 'text-orange-600' : 'text-yellow-600'
        }`}>
          {value} days
        </span>
      )
    },
    { 
      key: 'priority', 
      label: 'Priority', 
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'High' ? 'bg-red-100 text-red-800' :
          value === 'Medium' ? 'bg-orange-100 text-orange-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {value}
        </span>
      )
    },
    { 
      key: 'actions', 
      label: 'Actions',
      render: (value: any, row: any) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm">
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const HospitalDetailsModal = ({ hospital }: any) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Hospital Account Management - {hospital.hospitalName}</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSelectedHospital(null)}
          >
            ×
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Hospital Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Hospital Name:</span>
                  <span className="font-medium">{hospital.hospitalName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Contact Person:</span>
                  <span>{hospital.contactPerson}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone:</span>
                  <span>{hospital.phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span>{hospital.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Address:</span>
                  <span className="text-right">{hospital.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Terms:</span>
                  <span>{hospital.paymentTerms} days</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-4">Financial Summary</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Account Balance:</span>
                  <span className="font-medium text-green-600">KES {hospital.accountBalance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Claims:</span>
                  <span className="font-medium">KES {hospital.totalClaims.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Pending Bills:</span>
                  <span className="font-medium text-orange-600">KES {hospital.pendingBills.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Overdue Amount:</span>
                  <span className={`font-medium ${hospital.overdueAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    KES {hospital.overdueAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Monthly Limit:</span>
                  <span className="font-medium">KES {hospital.monthlyLimit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Utilization Rate:</span>
                  <span className={`font-medium ${
                    hospital.utilizationRate > 80 ? 'text-red-600' : 
                    hospital.utilizationRate > 60 ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    {hospital.utilizationRate}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Account Management Actions</h4>
              <div className="space-y-3">
                <Button className="w-full">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Process Payment
                </Button>
                <Button variant="secondary" className="w-full">
                  <Edit2 className="h-4 w-4 mr-2" />
                  Update Account Details
                </Button>
                <Button variant="secondary" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Statement
                </Button>
                <Button variant="secondary" className="w-full">
                  <Bell className="h-4 w-4 mr-2" />
                  Send Payment Reminder
                </Button>
                <Button variant="secondary" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Review
                </Button>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Account Notes</h4>
              <textarea
                rows={4}
                placeholder="Add notes about this hospital account..."
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button variant="secondary" size="sm" className="mt-2">
                Save Notes
              </Button>
            </div>

            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-medium text-orange-900 mb-2">Alert Settings</h4>
              <div className="space-y-2 text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  Alert when bills exceed 45 days
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  Alert when utilization exceeds 80%
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Weekly account summary
                </label>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Medical Administration</h1>
        <div className="flex space-x-2">
          <Button variant="secondary" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Button onClick={() => setShowLimitModal(true)} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Hospital
          </Button>
        </div>
      </div>

      {/* Medical Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {medicalStats.map((stat) => (
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

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'hospitals', 'limits', 'alerts', 'reports'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                selectedTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Medical Expenditure Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={medicalTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `KES ${value.toLocaleString()}`} />
                  <Line type="monotone" dataKey="inpatient" stroke="#EF4444" strokeWidth={2} name="Inpatient" />
                  <Line type="monotone" dataKey="outpatient" stroke="#3B82F6" strokeWidth={2} name="Outpatient" />
                  <Line type="monotone" dataKey="family" stroke="#10B981" strokeWidth={2} name="Family" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Medical Limit Utilization</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={utilizationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {utilizationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {utilizationData.map((item, index) => (
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
        </div>
      )}

      {/* Hospitals Tab */}
      {selectedTab === 'hospitals' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Hospital Account Management</h3>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search hospitals..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button variant="secondary" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
          <Table columns={hospitalColumns} data={hospitalAccounts} />
        </Card>
      )}

      {/* Medical Limits Tab */}
      {selectedTab === 'limits' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Medical Limits Management</h3>
            <div className="flex space-x-2">
              <Button variant="secondary" className="flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Update
              </Button>
              <Button variant="secondary" className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </div>
          <Table columns={limitsColumns} data={medicalLimits} />
        </Card>
      )}

      {/* Alerts Tab */}
      {selectedTab === 'alerts' && (
        <div className="space-y-6">
          <Card className="border-red-200 bg-red-50">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Overdue Bills Alert</h3>
                <p className="text-sm text-red-700">
                  {overdueAlerts.length} bills are overdue by more than 45 days
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Overdue Bills Management</h3>
              <Button onClick={() => setShowAlertModal(true)} className="flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                Send Bulk Alerts
              </Button>
            </div>
            <Table columns={alertsColumns} data={overdueAlerts} />
          </Card>
        </div>
      )}

      {/* Reports Tab */}
      {selectedTab === 'reports' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Hospital Expenditure Report', description: 'Detailed expenditure by hospital with Excel export' },
              { name: 'Medical Balance Report', description: 'Member medical balances and utilization rates' },
              { name: 'Family Medical Statement', description: 'Medical expenditure per family member' },
              { name: 'Overdue Bills Report', description: 'Bills pending beyond 45 days with aging analysis' },
              { name: 'Hospital Account Summary', description: 'Complete hospital account balances and transactions' },
              { name: 'Medical Trends Analysis', description: 'Monthly and yearly medical expenditure trends' },
              { name: 'Utilization Rate Report', description: 'Medical limit utilization by member and category' },
              { name: 'Claims Processing Report', description: 'Medical claims processing time and efficiency' },
              { name: 'Provider Performance', description: 'Hospital service quality and payment compliance' }
            ].map((report, index) => (
              <Card key={index} className="transition-transform hover:scale-105 cursor-pointer">
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">{report.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                  <div className="flex space-x-2">
                    <Button variant="secondary" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedHospital && <HospitalDetailsModal hospital={selectedHospital} />}
    </div>
  );
};

export default MedicalAdministration;