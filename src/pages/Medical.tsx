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
  TrendingUp
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const Medical: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showNewClaimModal, setShowNewClaimModal] = useState(false);

  const medicalLimits = {
    inpatient: { limit: 150000, used: 85000, remaining: 65000 },
    outpatient: { limit: 50000, used: 25000, remaining: 25000 },
    family: { limit: 200000, used: 110000, remaining: 90000 }
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
      description: 'Emergency surgery'
    },
    {
      id: 2,
      date: '2024-01-10',
      hospital: 'Aga Khan Hospital',
      type: 'Outpatient',
      amount: 15000,
      balance: 25000,
      status: 'Pending',
      description: 'Routine checkup'
    },
    {
      id: 3,
      date: '2024-01-05',
      hospital: 'Kenyatta Hospital',
      type: 'Inpatient',
      amount: 40000,
      balance: 150000,
      status: 'Paid',
      description: 'Medical tests'
    }
  ];

  const hospitalAccountsData = [
    {
      id: 1,
      hospital: 'Nairobi Hospital',
      totalClaims: 125000,
      pendingBills: 25000,
      overdue: 0,
      lastPayment: '2024-01-15'
    },
    {
      id: 2,
      hospital: 'Aga Khan Hospital',
      totalClaims: 85000,
      pendingBills: 15000,
      overdue: 0,
      lastPayment: '2024-01-10'
    },
    {
      id: 3,
      hospital: 'Kenyatta Hospital',
      totalClaims: 165000,
      pendingBills: 45000,
      overdue: 10000,
      lastPayment: '2024-01-05'
    }
  ];

  const usageData = [
    { name: 'Inpatient Used', value: 85000, color: '#3B82F6' },
    { name: 'Outpatient Used', value: 25000, color: '#10B981' },
    { name: 'Remaining', value: 90000, color: '#E5E7EB' }
  ];

  const monthlyTrends = [
    { month: 'Jan', inpatient: 45000, outpatient: 15000 },
    { month: 'Feb', inpatient: 30000, outpatient: 8000 },
    { month: 'Mar', inpatient: 10000, outpatient: 2000 },
    { month: 'Apr', inpatient: 0, outpatient: 0 },
    { month: 'May', inpatient: 0, outpatient: 0 },
    { month: 'Jun', inpatient: 0, outpatient: 0 }
  ];

  const claimsColumns = [
    { key: 'date', label: 'Date', sortable: true },
    { key: 'hospital', label: 'Hospital', sortable: true },
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
    { key: 'description', label: 'Description' }
  ];

  const hospitalColumns = [
    { key: 'hospital', label: 'Hospital', sortable: true },
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
    { key: 'lastPayment', label: 'Last Payment', sortable: true }
  ];

  const LimitCard = ({ title, limit, used, remaining, color }: any) => (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className={`p-2 rounded-lg ${color}`}>
          <Heart className="h-5 w-5 text-white" />
        </div>
      </div>
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Medical Management</h1>
        <div className="flex space-x-2">
          <Button variant="secondary" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export Report
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
          {['overview', 'claims', 'hospitals', 'statements'].map((tab) => (
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LimitCard
              title="Inpatient Limit"
              limit={medicalLimits.inpatient.limit}
              used={medicalLimits.inpatient.used}
              remaining={medicalLimits.inpatient.remaining}
              color="bg-blue-500"
            />
            <LimitCard
              title="Outpatient Limit"
              limit={medicalLimits.outpatient.limit}
              used={medicalLimits.outpatient.used}
              remaining={medicalLimits.outpatient.remaining}
              color="bg-green-500"
            />
            <LimitCard
              title="Family Limit"
              limit={medicalLimits.family.limit}
              used={medicalLimits.family.used}
              remaining={medicalLimits.family.remaining}
              color="bg-purple-500"
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
                <BarChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `KES ${value.toLocaleString()}`} />
                  <Bar dataKey="inpatient" fill="#3B82F6" name="Inpatient" />
                  <Bar dataKey="outpatient" fill="#10B981" name="Outpatient" />
                </BarChart>
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
              <Button variant="secondary" size="sm">Filter</Button>
              <Button variant="secondary" size="sm">Export</Button>
            </div>
          </div>
          <Table columns={claimsColumns} data={medicalClaimsData} />
        </Card>
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
              <Button variant="secondary" size="sm">
                <Building2 className="h-4 w-4 mr-2" />
                Add Hospital
              </Button>
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
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the medical treatment"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
    </div>
  );
};

export default Medical;