import React, { useState } from 'react';
import { Card } from '../components/Common/Card';
import { Button } from '../components/Common/Button';
import { Table } from '../components/Common/Table';
import { StatusBadge } from '../components/Common/StatusBadge';
import { 
  DollarSign, 
  Download, 
  Upload, 
  CreditCard, 
  Calendar,
  TrendingUp,
  Filter,
  Search,
  Building2,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Eye,
  Edit2,
  Plus,
  RefreshCw,
  Calculator,
  BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const Contributions: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReconciliationModal, setShowReconciliationModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);

  const contributionData = [
    {
      id: 1,
      memberId: 'M001234',
      memberNumber: 'M001234',
      memberName: 'John Doe',
      sponsorId: 'S001',
      sponsorCode: 'ABC001',
      sponsorName: 'ABC Company Ltd',
      period: '2024-01',
      department: 'IT Department',
      basicSalary: 150000,
      employeeContribution: 12000,
      employeeContributionRate: 8.0,
      employerContribution: 13000,
      employerContributionRate: 8.67,
      additionalVoluntary: 5000,
      totalContribution: 30000,
      cumulativeEmployeeContribution: 240000,
      cumulativeEmployerContribution: 260000,
      cumulativeTotal: 500000,
      contributionType: 'Registered' as const,
      paymentMethod: 'Bank Transfer' as const,
      status: 'Confirmed' as const,
      receiptNumber: 'RCP-2024-001',
      reconciliationStatus: 'Matched' as const,
      previousMonthAmount: 28000,
      difference: 2000,
      isAllocated: true,
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      memberId: 'M001235',
      memberNumber: 'M001235',
      memberName: 'Jane Smith',
      sponsorId: 'S002',
      sponsorCode: 'XYZ002',
      sponsorName: 'XYZ Corporation',
      period: '2024-01',
      department: 'Finance',
      basicSalary: 120000,
      employeeContribution: 9600,
      employeeContributionRate: 8.0,
      employerContribution: 10400,
      employerContributionRate: 8.67,
      additionalVoluntary: 3000,
      totalContribution: 23000,
      cumulativeEmployeeContribution: 192000,
      cumulativeEmployerContribution: 208000,
      cumulativeTotal: 400000,
      contributionType: 'Registered' as const,
      paymentMethod: 'MPESA' as const,
      status: 'Pending' as const,
      reconciliationStatus: 'Discrepancy' as const,
      discrepancyReason: 'Salary increase not reflected',
      previousMonthAmount: 22000,
      difference: 1000,
      isAllocated: false,
      createdAt: '2024-01-15'
    }
  ];

  const sponsorData = [
    {
      id: 'S001',
      sponsorCode: 'ABC001',
      sponsorName: 'ABC Company Ltd',
      contactPerson: 'John Manager',
      email: 'hr@abccompany.com',
      phoneNumber: '+254 712 345 678',
      totalEmployees: 150,
      activeMembers: 145,
      standardEmployeeRate: 8.0,
      standardEmployerRate: 8.67,
      paymentMethod: 'Bank Transfer',
      status: 'Active' as const,
      lastContributionDate: '2024-01-15',
      totalContributions: 4500000
    },
    {
      id: 'S002',
      sponsorCode: 'XYZ002',
      sponsorName: 'XYZ Corporation',
      contactPerson: 'Mary Director',
      email: 'payroll@xyzcorp.com',
      phoneNumber: '+254 722 987 654',
      totalEmployees: 85,
      activeMembers: 82,
      standardEmployeeRate: 8.0,
      standardEmployerRate: 8.67,
      paymentMethod: 'MPESA',
      status: 'Active' as const,
      lastContributionDate: '2024-01-14',
      totalContributions: 2800000
    }
  ];

  const contributionSchedules = [
    {
      id: 'CS-2024-001',
      sponsorCode: 'ABC001',
      sponsorName: 'ABC Company Ltd',
      period: '2024-01',
      totalEmployees: 145,
      totalEmployeeContribution: 1740000,
      totalEmployerContribution: 1885000,
      totalAVC: 450000,
      grandTotal: 4075000,
      status: 'Approved' as const,
      submittedDate: '2024-01-10',
      submittedBy: 'John Manager',
      reviewedBy: 'Pension Officer',
      reviewedDate: '2024-01-12',
      discrepancies: [
        {
          type: 'New Employee' as const,
          memberId: 'M001250',
          memberName: 'New Employee',
          description: 'New hire in January',
          previousValue: null,
          currentValue: 25000
        }
      ]
    },
    {
      id: 'CS-2024-002',
      sponsorCode: 'XYZ002',
      sponsorName: 'XYZ Corporation',
      period: '2024-01',
      totalEmployees: 82,
      totalEmployeeContribution: 984000,
      totalEmployerContribution: 1066000,
      totalAVC: 180000,
      grandTotal: 2230000,
      status: 'Under Review' as const,
      submittedDate: '2024-01-12',
      submittedBy: 'Mary Director',
      discrepancies: [
        {
          type: 'Salary Change' as const,
          memberId: 'M001235',
          memberName: 'Jane Smith',
          description: 'Salary increase from 110,000 to 120,000',
          previousValue: 110000,
          currentValue: 120000
        }
      ]
    }
  ];

  const summaryData = [
    { name: 'Total Contributions', value: 7305000, icon: DollarSign, color: 'text-blue-600', change: '+8.2%' },
    { name: 'Employee Contributions', value: 2724000, icon: TrendingUp, color: 'text-green-600', change: '+5.1%' },
    { name: 'Employer Contributions', value: 2951000, icon: Building2, color: 'text-purple-600', change: '+6.8%' },
    { name: 'AVC Contributions', value: 630000, icon: CreditCard, color: 'text-orange-600', change: '+12.3%' },
    { name: 'Active Sponsors', value: 25, icon: Building2, color: 'text-indigo-600', change: '+2' },
    { name: 'Total Members', value: 2350, icon: Users, color: 'text-teal-600', change: '+45' }
  ];

  const reconciliationData = [
    { status: 'Matched', count: 2180, color: '#10B981' },
    { status: 'Discrepancy', count: 85, color: '#F59E0B' },
    { status: 'Pending Review', count: 45, color: '#3B82F6' },
    { status: 'Resolved', count: 40, color: '#6B7280' }
  ];

  const trendData = [
    { month: 'Aug', employee: 2650000, employer: 2850000, avc: 580000, registered: 5800000, unregistered: 280000 },
    { month: 'Sep', employee: 2680000, employer: 2880000, avc: 590000, registered: 5900000, unregistered: 250000 },
    { month: 'Oct', employee: 2700000, employer: 2900000, avc: 600000, registered: 6000000, unregistered: 200000 },
    { month: 'Nov', employee: 2720000, employer: 2920000, avc: 610000, registered: 6100000, unregistered: 150000 },
    { month: 'Dec', employee: 2724000, employer: 2951000, avc: 630000, registered: 6200000, unregistered: 105000 },
    { month: 'Jan', employee: 2724000, employer: 2951000, avc: 630000, registered: 6305000, unregistered: 0 }
  ];

  const contributionColumns = [
    { key: 'memberNumber', label: 'Member No.', sortable: true },
    { key: 'memberName', label: 'Member Name', sortable: true },
    { key: 'sponsorName', label: 'Sponsor', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { 
      key: 'basicSalary', 
      label: 'Basic Salary', 
      sortable: true,
      render: (value: number) => `KES ${value.toLocaleString()}`
    },
    { 
      key: 'employeeContribution', 
      label: 'Employee', 
      sortable: true,
      render: (value: number) => `KES ${value.toLocaleString()}`
    },
    { 
      key: 'employerContribution', 
      label: 'Employer', 
      sortable: true,
      render: (value: number) => `KES ${value.toLocaleString()}`
    },
    { 
      key: 'additionalVoluntary', 
      label: 'AVC', 
      sortable: true,
      render: (value: number) => `KES ${value.toLocaleString()}`
    },
    { 
      key: 'totalContribution', 
      label: 'Total', 
      sortable: true,
      render: (value: number) => `KES ${value.toLocaleString()}`
    },
    { 
      key: 'contributionType', 
      label: 'Type', 
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'Registered' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
        }`}>
          {value}
        </span>
      )
    },
    { 
      key: 'reconciliationStatus', 
      label: 'Reconciliation', 
      render: (value: string) => <StatusBadge status={value} />
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (value: string) => <StatusBadge status={value} />
    }
  ];

  const sponsorColumns = [
    { key: 'sponsorCode', label: 'Code', sortable: true },
    { key: 'sponsorName', label: 'Sponsor Name', sortable: true },
    { key: 'contactPerson', label: 'Contact Person', sortable: true },
    { key: 'totalEmployees', label: 'Employees', sortable: true },
    { key: 'activeMembers', label: 'Active Members', sortable: true },
    { 
      key: 'standardEmployeeRate', 
      label: 'Employee Rate', 
      sortable: true,
      render: (value: number) => `${value}%`
    },
    { 
      key: 'standardEmployerRate', 
      label: 'Employer Rate', 
      sortable: true,
      render: (value: number) => `${value}%`
    },
    { key: 'paymentMethod', label: 'Payment Method', sortable: true },
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
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm">
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const scheduleColumns = [
    { key: 'sponsorCode', label: 'Sponsor Code', sortable: true },
    { key: 'sponsorName', label: 'Sponsor Name', sortable: true },
    { key: 'period', label: 'Period', sortable: true },
    { key: 'totalEmployees', label: 'Employees', sortable: true },
    { 
      key: 'grandTotal', 
      label: 'Total Amount', 
      sortable: true,
      render: (value: number) => `KES ${value.toLocaleString()}`
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (value: string) => <StatusBadge status={value} />
    },
    { key: 'submittedDate', label: 'Submitted', sortable: true },
    { 
      key: 'actions', 
      label: 'Actions',
      render: (value: any, row: any) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSelectedSchedule(row)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {row.status === 'Under Review' && (
            <Button variant="secondary" size="sm">
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      )
    }
  ];

  const ReconciliationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Contribution Reconciliation</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowReconciliationModal(false)}
          >
            ×
          </Button>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Upload Contribution File</h4>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600">
                  Upload Excel/CSV file with contribution data
                </p>
                <Button variant="secondary" size="sm" className="mt-2">
                  Choose File
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Reconciliation Summary</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Records:</span>
                  <span>2,350</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Matched:</span>
                  <span className="text-green-600">2,180</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Discrepancies:</span>
                  <span className="text-orange-600">85</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">New Members:</span>
                  <span className="text-blue-600">45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Terminated:</span>
                  <span className="text-red-600">40</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Discrepancy Details</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Previous</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Difference</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Jane Smith</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Salary Change</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">KES 110,000</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">KES 120,000</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+KES 10,000</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button variant="secondary" size="sm">Accept</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button className="flex-1">Process Reconciliation</Button>
            <Button variant="secondary" onClick={() => setShowReconciliationModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const ScheduleDetailsModal = ({ schedule }: any) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Contribution Schedule - {schedule.id}</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSelectedSchedule(null)}
          >
            ×
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Schedule Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Sponsor:</span>
                  <span className="font-medium">{schedule.sponsorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Period:</span>
                  <span>{schedule.period}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Employees:</span>
                  <span>{schedule.totalEmployees}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <StatusBadge status={schedule.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Submitted:</span>
                  <span>{schedule.submittedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Submitted By:</span>
                  <span>{schedule.submittedBy}</span>
                </div>
                {schedule.reviewedBy && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Reviewed By:</span>
                    <span>{schedule.reviewedBy}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-4">Financial Summary</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Employee Contributions:</span>
                  <span className="font-medium">KES {schedule.totalEmployeeContribution.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Employer Contributions:</span>
                  <span className="font-medium">KES {schedule.totalEmployerContribution.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">AVC Contributions:</span>
                  <span className="font-medium">KES {schedule.totalAVC.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="text-gray-500 font-medium">Grand Total:</span>
                  <span className="font-bold text-green-600">KES {schedule.grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {schedule.discrepancies && schedule.discrepancies.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Discrepancies Found</h4>
                <div className="space-y-3">
                  {schedule.discrepancies.map((discrepancy: any, index: number) => (
                    <div key={index} className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-orange-900">{discrepancy.type}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          discrepancy.type === 'New Employee' ? 'bg-blue-100 text-blue-800' :
                          discrepancy.type === 'Salary Change' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {discrepancy.type}
                        </span>
                      </div>
                      <p className="text-sm text-orange-800 mb-2">{discrepancy.memberName}</p>
                      <p className="text-sm text-orange-700">{discrepancy.description}</p>
                      {discrepancy.previousValue && (
                        <div className="mt-2 text-xs text-orange-600">
                          Previous: {discrepancy.previousValue} → Current: {discrepancy.currentValue}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-medium text-gray-900 mb-4">Actions</h4>
              <div className="space-y-3">
                {schedule.status === 'Under Review' && (
                  <>
                    <Button className="w-full">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Schedule
                    </Button>
                    <Button variant="danger" className="w-full">
                      Reject Schedule
                    </Button>
                  </>
                )}
                <Button variant="secondary" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Schedule
                </Button>
                <Button variant="secondary" className="w-full">
                  <Calculator className="h-4 w-4 mr-2" />
                  Recalculate Totals
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
        <h1 className="text-2xl font-bold text-gray-900">Contribution Management</h1>
        <div className="flex space-x-2">
          <Button variant="secondary" className="flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reconcile
          </Button>
          <Button variant="secondary" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowPaymentModal(true)} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            New Schedule
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'contributions', 'sponsors', 'schedules', 'reconciliation', 'reports'].map((tab) => (
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
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {summaryData.map((item) => (
              <Card key={item.name} className="transition-transform hover:scale-105">
                <div className="flex items-center">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">{item.name}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {typeof item.value === 'number' ? 
                        (item.name.includes('Contributions') ? `KES ${item.value.toLocaleString()}` : item.value.toLocaleString())
                        : item.value
                      }
                    </p>
                    <p className="text-sm text-green-600">{item.change}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Contribution Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `KES ${value.toLocaleString()}`} />
                  <Line type="monotone" dataKey="employee" stroke="#3B82F6" strokeWidth={2} name="Employee" />
                  <Line type="monotone" dataKey="employer" stroke="#10B981" strokeWidth={2} name="Employer" />
                  <Line type="monotone" dataKey="avc" stroke="#F59E0B" strokeWidth={2} name="AVC" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Reconciliation Status</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={reconciliationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {reconciliationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {reconciliationData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-600">{item.status}</span>
                    </div>
                    <span className="text-sm font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Registered vs Unregistered Contributions */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Registered vs Unregistered Contributions</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `KES ${value.toLocaleString()}`} />
                <Bar dataKey="registered" fill="#10B981" name="Registered" />
                <Bar dataKey="unregistered" fill="#F59E0B" name="Unregistered" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Contributions Tab */}
      {selectedTab === 'contributions' && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Individual Contributions</h3>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search contributions..."
                    className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="2024-01">January 2024</option>
                  <option value="2023-12">December 2023</option>
                  <option value="2023-11">November 2023</option>
                </select>
                <Button variant="secondary" className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
            <Table columns={contributionColumns} data={contributionData} />
          </Card>
        </div>
      )}

      {/* Sponsors Tab */}
      {selectedTab === 'sponsors' && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Sponsor Management</h3>
              <Button className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Sponsor
              </Button>
            </div>
            <Table columns={sponsorColumns} data={sponsorData} />
          </Card>
        </div>
      )}

      {/* Schedules Tab */}
      {selectedTab === 'schedules' && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Contribution Schedules</h3>
              <div className="flex space-x-2">
                <Button variant="secondary" className="flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Schedule
                </Button>
                <Button onClick={() => setShowScheduleModal(true)} className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  New Schedule
                </Button>
              </div>
            </div>
            <Table columns={scheduleColumns} data={contributionSchedules} />
          </Card>
        </div>
      )}

      {/* Reconciliation Tab */}
      {selectedTab === 'reconciliation' && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Contribution Reconciliation</h3>
              <Button onClick={() => setShowReconciliationModal(true)} className="flex items-center">
                <Calculator className="h-4 w-4 mr-2" />
                Start Reconciliation
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {reconciliationData.map((item, index) => (
                <Card key={index}>
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: item.color }}>
                      {item.count}
                    </div>
                    <div className="text-sm text-gray-600">{item.status}</div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Reconciliation Process</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Upload contribution files from sponsors</li>
                <li>• System automatically compares with previous month data</li>
                <li>• Identifies discrepancies and new/terminated members</li>
                <li>• Generates reconciliation reports with detailed analysis</li>
                <li>• Allows manual review and approval of discrepancies</li>
              </ul>
            </div>
          </Card>
        </div>
      )}

      {/* Reports Tab */}
      {selectedTab === 'reports' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Member Contribution Report', description: 'Employee and employer contributions combined' },
              { name: 'Separate Contribution Report', description: 'Employee and employer shown separately' },
              { name: 'Cumulative Contribution Report', description: 'Total contributions to date' },
              { name: 'Registered vs Unregistered', description: 'Breakdown by registration status' },
              { name: 'AVC Report', description: 'Additional voluntary contributions' },
              { name: 'Contribution Trends', description: 'Historical contribution analysis' },
              { name: 'Sponsor Summary', description: 'Contributions by sponsor organization' },
              { name: 'Reconciliation Report', description: 'Monthly reconciliation summary' },
              { name: 'Outstanding Contributions', description: 'Pending and overdue contributions' }
            ].map((report, index) => (
              <Card key={index} className="transition-transform hover:scale-105 cursor-pointer">
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
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
      {showReconciliationModal && <ReconciliationModal />}
      {selectedSchedule && <ScheduleDetailsModal schedule={selectedSchedule} />}
    </div>
  );
};

export default Contributions;