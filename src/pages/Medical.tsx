import React, { useState } from 'react';
import { Card } from '../components/Common/Card';
import { Button } from '../components/Common/Button';
import { Table } from '../components/Common/Table';
import { StatusBadge } from '../components/Common/StatusBadge';
import { 
  Heart, 
  Plus, 
  Download, 
  Building2, 
  Calendar,
  AlertCircle,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  FileText,
  Eye,
  Upload,
  Search,
  Filter,
  Bell
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';

const Medical: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showNewClaimModal, setShowNewClaimModal] = useState(false);
  const [showHospitalModal, setShowHospitalModal] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<any>(null);

  const medicalLimits = {
    member: {
      inpatient: { limit: 150000, used: 85000, remaining: 65000 },
      outpatient: { limit: 50000, used: 25000, remaining: 25000 }
    },
    family: {
      spouse: { inpatient: 150000, outpatient: 50000, used: 35000 },
      children: [
        { name: 'John Jr.', inpatient: 100000, outpatient: 30000, used: 15000 },
        { name: 'Mary', inpatient: 100000, outpatient: 30000, used: 8000 }
      ]
    }
  };

  const medicalClaimsData = [
    {
      id: 1,
      date: '2024-01-15',
      hospital: 'Nairobi Hospital',
      type: 'Inpatient',
      amount: 45000,
      balance: 105000,
      status: 'Approved',
      description: 'Emergency surgery',
      familyMember: 'Self',
      receiptNumber: 'NH-2024-001',
      diagnosis: 'Appendectomy'
    },
    {
      id: 2,
      date: '2024-01-10',
      hospital: 'Aga Khan Hospital',
      type: 'Outpatient',
      amount: 15000,
      balance: 25000,
      status: 'Pending',
      description: 'Routine checkup',
      familyMember: 'Jane Doe (Spouse)',
      receiptNumber: 'AK-2024-002',
      diagnosis: 'General consultation'
    },
    {
      id: 3,
      date: '2024-01-05',
      hospital: 'Kenyatta Hospital',
      type: 'Inpatient',
      amount: 40000,
      balance: 150000,
      status: 'Paid',
      description: 'Medical tests',
      familyMember: 'John Jr. (Child)',
      receiptNumber: 'KH-2024-003',
      diagnosis: 'Diagnostic tests'
    }
  ];

  const hospitalAccountsData = [
    {
      id: 1,
      hospital: 'Nairobi Hospital',
      contactPerson: 'Dr. Smith',
      phoneNumber: '+254 712 345 678',
      email: 'billing@nairobihospital.org',
      totalClaims: 125000,
      pendingBills: 25000,
      overdue: 0,
      lastPaymentDate: '2024-01-15',
      paymentTerms: 30,
      overdueAlerts: 0
    },
    {
      id: 2,
      hospital: 'Aga Khan Hospital',
      contactPerson: 'Dr. Johnson',
      phoneNumber: '+254 722 987 654',
      email: 'finance@agakhan.org',
      totalClaims: 85000,
      pendingBills: 15000,
      overdue: 0,
      lastPaymentDate: '2024-01-10',
      paymentTerms: 45,
      overdueAlerts: 0
    },
    {
      id: 3,
      hospital: 'Kenyatta Hospital',
      contactPerson: 'Dr. Brown',
      phoneNumber: '+254 733 456 789',
      email: 'accounts@knh.or.ke',
      totalClaims: 165000,
      pendingBills: 45000,
      overdue: 10000,
      lastPaymentDate: '2024-01-05',
      paymentTerms: 30,
      overdueAlerts: 1
    }
  ];

  const familyExpenditure = [
    { member: 'Self', amount: 85000, limit: 200000, percentage: 42.5 },
    { member: 'Jane Doe (Spouse)', amount: 35000, limit: 200000, percentage: 17.5 },
    { member: 'John Jr. (Child)', amount: 15000, limit: 130000, percentage: 11.5 },
    { member: 'Mary (Child)', amount: 8000, limit: 130000, percentage: 6.2 }
  ];

  const usageData = [
    { name: 'Inpatient Used', value: 85000, color: '#3B82F6' },
    { name: 'Outpatient Used', value: 25000, color: '#10B981' },
    { name: 'Remaining', value: 90000, color: '#E5E7EB' }
  ];

  const monthlyTrends = [
    { month: 'Jan', inpatient: 45000, outpatient: 15000, family: 23000 },
    { month: 'Feb', inpatient: 30000, outpatient: 8000, family: 12000 },
    { month: 'Mar', inpatient: 10000, outpatient: 2000, family: 5000 },
    { month: 'Apr', inpatient: 0, outpatient: 0, family: 0 },
    { month: 'May', inpatient: 0, outpatient: 0, family: 0 },
    { month: 'Jun', inpatient: 0, outpatient: 0, family: 0 }
  ];

  const hospitalBills = [
    {
      id: 'BILL-001',
      hospital: 'Kenyatta Hospital',
      amount: 10000,
      billDate: '2023-11-15',
      dueDate: '2023-12-15',
      daysPending: 47,
      status: 'Overdue',
      patient: 'John Doe'
    },
    {
      id: 'BILL-002',
      hospital: 'Nairobi Hospital',
      amount: 25000,
      billDate: '2024-01-01',
      dueDate: '2024-01-31',
      daysPending: 15,
      status: 'Pending',
      patient: 'Jane Doe'
    }
  ];

  const claimsColumns = [
    { key: 'date', label: 'Date', sortable: true },
    { key: 'hospital', label: 'Hospital', sortable: true },
    { key: 'familyMember', label: 'Patient', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { 
      key: 'amount', 
      label: 'Amount', 
      sortable: true,
      render: (value: number) => `KES ${value.toLocaleString()}`
    },
    { 
      key: 'balance', 
      label: 'Remaining Balance', 
      sortable: true,
      render: (value: number) => `KES ${value.toLocaleString()}`
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (value: string) => <StatusBadge status={value} />
    },
    { key: 'description', label: 'Description' },
    { 
      key: 'actions', 
      label: 'Actions',
      render: (value: any, row: any) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const hospitalColumns = [
    { key: 'hospital', label: 'Hospital', sortable: true },
    { key: 'contactPerson', label: 'Contact Person', sortable: true },
    { 
      key: 'totalClaims', 
      label: 'Total Claims', 
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
      key: 'overdue', 
      label: 'Overdue', 
      sortable: true,
      render: (value: number) => (
        <span className={value > 0 ? 'text-red-600 font-semibold' : 'text-green-600'}>
          KES {value.toLocaleString()}
        </span>
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
    { key: 'lastPaymentDate', label: 'Last Payment', sortable: true },
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
            <Download className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const LimitCard = ({ title, limit, used, remaining, color, member }: any) => (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className={`p-2 rounded-lg ${color}`}>
          <Heart className="h-5 w-5 text-white" />
        </div>
      </div>
      {member && (
        <p className="text-sm text-gray-600 mb-3">{member}</p>
      )}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Limit:</span>
          <span className="font-medium">KES {limit.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Used:</span>
          <span className="font-medium text-red-600">KES {used.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Remaining:</span>
          <span className="font-medium text-green-600">KES {remaining.toLocaleString()}</span>
        </div>
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(used / limit) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{Math.round((used / limit) * 100)}% utilized</p>
        </div>
      </div>
    </Card>
  );

  const HospitalDetailsModal = ({ hospital, onClose }: any) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Hospital Account - {hospital.hospital}</h3>
          <Button variant="secondary" size="sm" onClick={onClose}>×</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Hospital Information</h4>
              <div className="space-y-2 text-sm">
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
                  <span className="text-gray-500">Payment Terms:</span>
                  <span>{hospital.paymentTerms} days</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Account Summary</h4>
              <div className="space-y-2 text-sm">
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
                  <span className={`font-medium ${hospital.overdue > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    KES {hospital.overdue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Payment:</span>
                  <span>{hospital.lastPaymentDate}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Recent Bills</h4>
              <div className="space-y-2">
                {hospitalBills
                  .filter(bill => bill.hospital === hospital.hospital)
                  .map((bill) => (
                    <div key={bill.id} className={`p-3 rounded-lg border ${
                      bill.status === 'Overdue' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{bill.id}</p>
                          <p className="text-xs text-gray-600">Patient: {bill.patient}</p>
                          <p className="text-xs text-gray-600">Due: {bill.dueDate}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">KES {bill.amount.toLocaleString()}</p>
                          <p className={`text-xs ${bill.status === 'Overdue' ? 'text-red-600' : 'text-orange-600'}`}>
                            {bill.daysPending} days pending
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Actions</h4>
              <div className="space-y-2">
                <Button variant="secondary" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Account Statement
                </Button>
                <Button variant="secondary" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Payment Report
                </Button>
                <Button variant="secondary" className="w-full">
                  <Bell className="h-4 w-4 mr-2" />
                  Send Payment Reminder
                </Button>
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
        <h1 className="text-2xl font-bold text-gray-900">Medical Management</h1>
        <div className="flex space-x-2">
          <Button variant="secondary" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Button onClick={() => setShowNewClaimModal(true)} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            New Claim
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'claims', 'family', 'hospitals', 'statements', 'alerts'].map((tab) => (
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
          {/* Medical Limits */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LimitCard
              title="Member Inpatient"
              limit={medicalLimits.member.inpatient.limit}
              used={medicalLimits.member.inpatient.used}
              remaining={medicalLimits.member.inpatient.remaining}
              color="bg-blue-500"
              member="John Doe"
            />
            <LimitCard
              title="Member Outpatient"
              limit={medicalLimits.member.outpatient.limit}
              used={medicalLimits.member.outpatient.used}
              remaining={medicalLimits.member.outpatient.remaining}
              color="bg-green-500"
              member="John Doe"
            />
            <LimitCard
              title="Family Total"
              limit={400000}
              used={143000}
              remaining={257000}
              color="bg-purple-500"
              member="All Family Members"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Usage Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={usageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {usageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `KES ${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {usageData.map((item, index) => (
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

            <Card>
              <h3 className="text-lg font-semibold mb-4">Monthly Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `KES ${value.toLocaleString()}`} />
                  <Line type="monotone" dataKey="inpatient" stroke="#3B82F6" strokeWidth={2} name="Inpatient" />
                  <Line type="monotone" dataKey="outpatient" stroke="#10B981" strokeWidth={2} name="Outpatient" />
                  <Line type="monotone" dataKey="family" stroke="#8B5CF6" strokeWidth={2} name="Family" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      )}

      {/* Claims Tab */}
      {selectedTab === 'claims' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Medical Claims</h3>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search claims..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button variant="secondary" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="secondary" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          <Table columns={claimsColumns} data={medicalClaimsData} />
        </Card>
      )}

      {/* Family Tab */}
      {selectedTab === 'family' && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold mb-4">Family Medical Expenditure & Balance</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Family Member</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medical Limit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expenditure</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilization</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {familyExpenditure.map((member, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.member}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        KES {member.limit.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                        KES {member.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        KES {(member.limit - member.amount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${member.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{member.percentage}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Button variant="secondary" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          Statement
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Family Medical Balance (Excel Export)</h3>
              <Button className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Download Excel Report
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900">Total Family Limit</h4>
                <p className="text-2xl font-bold text-blue-600">KES 660,000</p>
              </div>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-900">Total Expenditure</h4>
                <p className="text-2xl font-bold text-red-600">KES 143,000</p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-900">Total Balance</h4>
                <p className="text-2xl font-bold text-green-600">KES 517,000</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Hospitals Tab */}
      {selectedTab === 'hospitals' && (
        <div className="space-y-6">
          {/* Overdue Alerts */}
          <Card className="border-red-200 bg-red-50">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Overdue Bills Alert</h3>
                <p className="text-sm text-red-700">
                  1 hospital has overdue bills exceeding 45 days. Total overdue: KES 10,000
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Hospital Accounts</h3>
              <div className="flex space-x-2">
                <Button variant="secondary" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Excel
                </Button>
                <Button variant="secondary" size="sm">
                  <Building2 className="h-4 w-4 mr-2" />
                  Add Hospital
                </Button>
              </div>
            </div>
            <Table columns={hospitalColumns} data={hospitalAccountsData} />
          </Card>
        </div>
      )}

      {/* Statements Tab */}
      {selectedTab === 'statements' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Medical Statements</h3>
            <Button className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Generate Statement
            </Button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statement Type
                </label>
                <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Medical Balance Statement</option>
                  <option>Claims History</option>
                  <option>Hospital Expenditure</option>
                  <option>Family Medical Report</option>
                  <option>Member & Dependants Statement</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Period
                </label>
                <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Current Year</option>
                  <option>Last 6 Months</option>
                  <option>Last Year</option>
                  <option>Custom Range</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button>Generate PDF</Button>
              <Button variant="secondary">Generate Excel</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Alerts Tab */}
      {selectedTab === 'alerts' && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold mb-4">Pending Bills Alert (Above 45 Days)</h3>
            <div className="space-y-3">
              {hospitalBills
                .filter(bill => bill.daysPending > 45)
                .map((bill) => (
                  <div key={bill.id} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-red-900">{bill.hospital}</h4>
                        <p className="text-sm text-red-700">Bill: {bill.id} - Patient: {bill.patient}</p>
                        <p className="text-sm text-red-600">
                          {bill.daysPending} days overdue (Due: {bill.dueDate})
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-600">KES {bill.amount.toLocaleString()}</p>
                        <Button variant="danger" size="sm">
                          <Bell className="h-4 w-4 mr-1" />
                          Send Alert
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Alert Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Overdue Bill Alerts</h4>
                  <p className="text-sm text-gray-600">Send alerts for bills overdue by more than 45 days</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Medical Limit Alerts</h4>
                  <p className="text-sm text-gray-600">Alert when medical limits are 80% utilized</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* New Claim Modal */}
      {showNewClaimModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Submit Medical Claim</h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowNewClaimModal(false)}
              >
                ×
              </Button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient
                  </label>
                  <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Self</option>
                    <option>Jane Doe (Spouse)</option>
                    <option>John Jr. (Child)</option>
                    <option>Mary (Child)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Claim Type
                  </label>
                  <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Inpatient</option>
                    <option>Outpatient</option>
                    <option>Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hospital
                  </label>
                  <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Nairobi Hospital</option>
                    <option>Aga Khan Hospital</option>
                    <option>Kenyatta Hospital</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount Claimed
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Treatment Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Receipt Number
                  </label>
                  <input
                    type="text"
                    placeholder="Hospital receipt number"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diagnosis/Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the medical treatment"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supporting Documents
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Upload medical receipts and reports</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button className="flex-1">Submit Claim</Button>
                <Button variant="secondary" onClick={() => setShowNewClaimModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Hospital Details Modal */}
      {selectedHospital && (
        <HospitalDetailsModal 
          hospital={selectedHospital} 
          onClose={() => setSelectedHospital(null)} 
        />
      )}
    </div>
  );
};

export default Medical;