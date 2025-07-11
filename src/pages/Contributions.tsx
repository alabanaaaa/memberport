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
  Filter
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const Contributions: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const contributionData = [
    {
      id: 1,
      period: '2024-01',
      employeeContribution: 12000,
      employerContribution: 13000,
      additionalVoluntary: 5000,
      totalContribution: 30000,
      paymentMethod: 'Bank Transfer',
      status: 'Confirmed',
      date: '2024-01-15'
    },
    {
      id: 2,
      period: '2023-12',
      employeeContribution: 11500,
      employerContribution: 12500,
      additionalVoluntary: 3000,
      totalContribution: 27000,
      paymentMethod: 'Cheque',
      status: 'Confirmed',
      date: '2023-12-15'
    },
    {
      id: 3,
      period: '2023-11',
      employeeContribution: 11000,
      employerContribution: 12000,
      additionalVoluntary: 2000,
      totalContribution: 25000,
      paymentMethod: 'MPESA',
      status: 'Confirmed',
      date: '2023-11-15'
    }
  ];

  const summaryData = [
    { name: 'Total Contributions', value: 2456789, icon: DollarSign, color: 'text-blue-600' },
    { name: 'Employee Contributions', value: 1245678, icon: TrendingUp, color: 'text-green-600' },
    { name: 'Employer Contributions', value: 1211111, icon: TrendingUp, color: 'text-purple-600' },
    { name: 'Voluntary Contributions', value: 145000, icon: CreditCard, color: 'text-orange-600' }
  ];

  const trendData = [
    { month: 'Jan', employee: 12000, employer: 13000, voluntary: 5000 },
    { month: 'Feb', employee: 12500, employer: 13500, voluntary: 3000 },
    { month: 'Mar', employee: 11800, employer: 12800, voluntary: 4000 },
    { month: 'Apr', employee: 12200, employer: 13200, voluntary: 2000 },
    { month: 'May', employee: 12800, employer: 13800, voluntary: 5500 },
    { month: 'Jun', employee: 12600, employer: 13600, voluntary: 3500 }
  ];

  const columns = [
    { key: 'period', label: 'Period', sortable: true },
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
      key: 'paymentMethod', 
      label: 'Payment Method', 
      sortable: true
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (value: string) => <StatusBadge status={value} />
    },
    { 
      key: 'date', 
      label: 'Date', 
      sortable: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Contributions</h1>
        <div className="flex space-x-2">
          <Button variant="secondary" className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="secondary" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowPaymentModal(true)} className="flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            Make Payment
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryData.map((item) => (
          <Card key={item.name} className="transition-transform hover:scale-105">
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-lg">
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{item.name}</p>
                <p className="text-2xl font-bold text-gray-900">
                  KES {item.value.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Contribution Trends */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Contribution Trends</h3>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `KES ${value.toLocaleString()}`} />
            <Line type="monotone" dataKey="employee" stroke="#3B82F6" strokeWidth={2} name="Employee" />
            <Line type="monotone" dataKey="employer" stroke="#10B981" strokeWidth={2} name="Employer" />
            <Line type="monotone" dataKey="voluntary" stroke="#F59E0B" strokeWidth={2} name="Voluntary" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Contribution History */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Contribution History</h3>
          <Button variant="secondary" size="sm" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Generate Statement
          </Button>
        </div>
        <Table columns={columns} data={contributionData} />
      </Card>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Make Additional Payment</h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowPaymentModal(false)}
              >
                ×
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Type
                </label>
                <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Additional Voluntary Contribution</option>
                  <option>Regular Contribution</option>
                  <option>Arrears Payment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>MPESA</option>
                  <option>Bank Transfer</option>
                  <option>Cheque</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <Button className="flex-1">
                  Proceed to Payment
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowPaymentModal(false)}
                >
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

export default Contributions;