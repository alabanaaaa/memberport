import React, { useState } from 'react';
import { Card } from '../../components/Common/Card';
import { Button } from '../../components/Common/Button';
import { Table } from '../../components/Common/Table';
import { StatusBadge } from '../../components/Common/StatusBadge';
import { 
  DollarSign, 
  Download, 
  Upload, 
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
  BarChart3,
  Search,
  Filter,
  TrendingUp,
  XCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const ContributionManagement: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');
  const [showReconciliationModal, setShowReconciliationModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [showSponsorModal, setShowSponsorModal] = useState(false);

  const adminStats = [
    { name: 'Total Monthly Contributions', value: 'KES 7.3M', icon: DollarSign, color: 'text-blue-600', change: '+8.2%' },
    { name: 'Active Sponsors', value: 25, icon: Building2, color: 'text-green-600', change: '+2' },
    { name: 'Pending Schedules', value: 8, icon: Clock, color: 'text-orange-600', change: '+3' },
    { name: 'Reconciliation Issues', value: 12, icon: AlertTriangle, color: 'text-red-600', change: '-5' }
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
      status: 'Under Review',
      submittedDate: '2024-01-10',
      submittedBy: 'John Manager',
      discrepancies: [
        {
          type: 'New Employee',
          memberId: 'M001250',
          memberName: 'New Employee',
          description: 'New hire in January',
          previousValue: null,
          currentValue: 25000
        },
        {
          type: 'Salary Change',
          memberId: 'M001235',
          memberName: 'Jane Smith',
          description: 'Salary increase from 110,000 to 120,000',
          previousValue: 110000,
          currentValue: 120000
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
      status: 'Approved',
      submittedDate: '2024-01-12',
      submittedBy: 'Mary Director',
      reviewedBy: 'Finance Officer',
      reviewedDate: '2024-01-15',
      discrepancies: []
    }
  ];

  const reconciliationData = [
    { status: 'Matched', count: 2180, color: '#10B981' },
    { status: 'Discrepancy', count: 85, color: '#F59E0B' },
    { status: 'Pending Review', count: 45, color: '#3B82F6' },
    { status: 'Resolved', count: 40, color: '#6B7280' }
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
      status: 'Active',
      lastContributionDate: '2024-01-15',
      totalContributions: 4500000,
      outstandingAmount: 0
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
      status: 'Active',
      lastContributionDate: '2024-01-14',
      totalContributions: 2800000,
      outstandingAmount: 125000
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
            <>
              <Button
                variant="success"
                size="sm"
                onClick={() => handleApproveSchedule(row.id)}
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleRejectSchedule(row.id)}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  const sponsorColumns = [
    { key: 'sponsorCode', label: 'Code', sortable: true },
    { key: 'sponsorName', label: 'Sponsor Name', sortable: true },
    { key: 'contactPerson', label: 'Contact Person', sortable: true },
    { key: 'totalEmployees', label: 'Employees', sortable: true },
    { key: 'activeMembers', label: 'Active Members', sortable: true },
    { 
      key: 'totalContributions', 
      label: 'Total Contributions', 
      sortable: true,
      render: (value: number) => `KES ${value.toLocaleString()}`
    },
    { 
      key: 'outstandingAmount', 
      label: 'Outstanding', 
      sortable: true,
      render: (value: number) => (
        <span className={value > 0 ? 'text-red-600 font-semibold' : 'text-green-600'}>
          KES {value.toLocaleString()}
        </span>
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
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm">
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const handleApproveSchedule = (scheduleId: string) => {
    console.log('Approving schedule:', scheduleId);
    // Implementation for approving schedule
  };

  const handleRejectSchedule = (scheduleId: string) => {
    console.log('Rejecting schedule:', scheduleId);
    // Implementation for rejecting schedule
  };

  const ScheduleDetailsModal = ({ schedule }: any) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Admin Review - {schedule.id}</h3>
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

            <div>
              <h4 className="font-medium text-gray-900 mb-4">Previous Month Comparison</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Previous Total:</span>
                  <span>KES 3,950,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Current Total:</span>
                  <span>KES {schedule.grandTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Difference:</span>
                  <span className="text-green-600">+KES 125,000 (+3.2%)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {schedule.discrepancies && schedule.discrepancies.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Discrepancies Found ({schedule.discrepancies.length})</h4>
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
                          Previous: KES {discrepancy.previousValue.toLocaleString()} → Current: KES {discrepancy.currentValue.toLocaleString()}
                        </div>
                      )}
                      <div className="mt-3 flex space-x-2">
                        <Button variant="success" size="sm">Accept</Button>
                        <Button variant="danger" size="sm">Reject</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-medium text-gray-900 mb-4">Admin Actions</h4>
              <div className="space-y-3">
                {schedule.status === 'Under Review' && (
                  <>
                    <Button 
                      className="w-full"
                      onClick={() => handleApproveSchedule(schedule.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Schedule
                    </Button>
                    <Button 
                      variant="danger" 
                      className="w-full"
                      onClick={() => handleRejectSchedule(schedule.id)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Schedule
                    </Button>
                  </>
                )}
                <Button variant="secondary" className="w-full">
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Schedule
                </Button>
                <Button variant="secondary" className="w-full">
                  <Calculator className="h-4 w-4 mr-2" />
                  Recalculate Totals
                </Button>
                <Button variant="secondary" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Schedule
                </Button>
                <Button variant="secondary" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Review Notes</h4>
              <textarea
                rows={3}
                placeholder="Add review notes or comments..."
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const ReconciliationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Admin Contribution Reconciliation</h3>
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
              <h4 className="font-medium text-gray-900 mb-3">Bulk Upload Processing</h4>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload contribution files from multiple sponsors
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Supports Excel, CSV, and EDI formats
                </p>
                <Button variant="secondary" size="sm">
                  Choose Files
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Reconciliation Summary</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Records Processed:</span>
                  <span className="font-medium">2,350</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Automatically Matched:</span>
                  <span className="text-green-600 font-medium">2,180</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Discrepancies Found:</span>
                  <span className="text-orange-600 font-medium">85</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">New Members:</span>
                  <span className="text-blue-600 font-medium">45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Terminated Members:</span>
                  <span className="text-red-600 font-medium">40</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="text-gray-500 font-medium">Success Rate:</span>
                  <span className="text-green-600 font-bold">92.8%</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Detailed Discrepancy Analysis</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sponsor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Previous</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Difference</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">ABC Company</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Jane Smith</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Salary Change</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">KES 110,000</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">KES 120,000</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+KES 10,000</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-1">
                        <Button variant="success" size="sm">Accept</Button>
                        <Button variant="danger" size="sm">Reject</Button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">XYZ Corp</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">John Doe</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Missing AVC</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">KES 5,000</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">KES 0</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-KES 5,000</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-1">
                        <Button variant="success" size="sm">Accept</Button>
                        <Button variant="danger" size="sm">Reject</Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="flex items-center justify-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Accept All Matches
            </Button>
            <Button variant="secondary" className="flex items-center justify-center">
              <Calculator className="h-4 w-4 mr-2" />
              Recalculate Totals
            </Button>
            <Button variant="secondary" className="flex items-center justify-center">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin Contribution Management</h1>
        <div className="flex space-x-2">
          <Button variant="secondary" className="flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button variant="secondary" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
          <Button onClick={() => setShowReconciliationModal(true)} className="flex items-center">
            <Calculator className="h-4 w-4 mr-2" />
            Start Reconciliation
          </Button>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {adminStats.map((stat) => (
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
          {['overview', 'schedules', 'sponsors', 'reconciliation', 'reports'].map((tab) => (
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

            <Card>
              <h3 className="text-lg font-semibold mb-4">Monthly Processing Summary</h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-900">Schedules Processed</p>
                      <p className="text-2xl font-bold text-green-600">23/25</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-900">Pending Review</p>
                      <p className="text-2xl font-bold text-orange-600">2</p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-500" />
                  </div>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-900">Overdue Submissions</p>
                      <p className="text-2xl font-bold text-red-600">0</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Schedules Tab */}
      {selectedTab === 'schedules' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Contribution Schedules</h3>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search schedules..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button variant="secondary" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
          <Table columns={scheduleColumns} data={contributionSchedules} />
        </Card>
      )}

      {/* Sponsors Tab */}
      {selectedTab === 'sponsors' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Sponsor Management</h3>
            <Button onClick={() => setShowSponsorModal(true)} className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add Sponsor
            </Button>
          </div>
          <Table columns={sponsorColumns} data={sponsorData} />
        </Card>
      )}

      {/* Reconciliation Tab */}
      {selectedTab === 'reconciliation' && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Automated Reconciliation</h3>
              <Button onClick={() => setShowReconciliationModal(true)} className="flex items-center">
                <Calculator className="h-4 w-4 mr-2" />
                Start New Reconciliation
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
              <h4 className="font-medium text-blue-900 mb-2">Automated Reconciliation Features</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Automatic comparison with previous month data</li>
                <li>• EDI file processing and validation</li>
                <li>• Real-time discrepancy detection</li>
                <li>• Bulk approval/rejection workflows</li>
                <li>• Comprehensive audit trail</li>
                <li>• Integration with sponsor systems</li>
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
              { name: 'Monthly Contribution Summary', description: 'Complete monthly contribution breakdown by sponsor' },
              { name: 'Reconciliation Report', description: 'Detailed reconciliation analysis with discrepancies' },
              { name: 'Sponsor Performance', description: 'Sponsor submission timeliness and accuracy' },
              { name: 'Outstanding Contributions', description: 'Overdue and pending contributions by sponsor' },
              { name: 'Registered vs Unregistered', description: 'Contribution registration status analysis' },
              { name: 'AVC Analysis', description: 'Additional voluntary contribution trends' },
              { name: 'Compliance Report', description: 'Regulatory compliance and submission status' },
              { name: 'Financial Reconciliation', description: 'Bank reconciliation and payment tracking' },
              { name: 'Audit Trail Report', description: 'Complete audit trail of all changes and approvals' }
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

export default ContributionManagement;