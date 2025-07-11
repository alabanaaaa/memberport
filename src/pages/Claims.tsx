import React, { useState } from 'react';
import { Card } from '../components/Common/Card';
import { Button } from '../components/Common/Button';
import { Table } from '../components/Common/Table';
import { StatusBadge } from '../components/Common/StatusBadge';
import { 
  FileText, 
  Plus, 
  Eye, 
  Download, 
  Upload,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Claims: React.FC = () => {
  const [showNewClaimModal, setShowNewClaimModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);

  const claimsData = [
    {
      id: 1,
      claimNumber: 'CLM-2024-001',
      claimType: 'Medical Claim',
      amount: 25000,
      status: 'Under Review',
      submittedDate: '2024-01-10',
      hospital: 'Nairobi Hospital',
      description: 'Routine checkup and medication'
    },
    {
      id: 2,
      claimNumber: 'CLM-2024-002',
      claimType: 'Retirement Benefit',
      amount: 1500000,
      status: 'Approved',
      submittedDate: '2024-01-05',
      hospital: '-',
      description: 'Normal retirement claim'
    },
    {
      id: 3,
      claimNumber: 'CLM-2023-087',
      claimType: 'Medical Claim',
      amount: 15000,
      status: 'Paid',
      submittedDate: '2023-12-20',
      hospital: 'Aga Khan Hospital',
      description: 'Emergency treatment'
    }
  ];

  const claimTypes = [
    'Medical Claim',
    'Retirement Benefit',
    'Death Benefit',
    'Withdrawal',
    'Loan'
  ];

  const columns = [
    { key: 'claimNumber', label: 'Claim Number', sortable: true },
    { key: 'claimType', label: 'Type', sortable: true },
    { 
      key: 'amount', 
      label: 'Amount', 
      sortable: true,
      render: (value: number) => `KES ${value.toLocaleString()}`
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (value: string) => <StatusBadge status={value} />
    },
    { key: 'submittedDate', label: 'Submitted', sortable: true },
    { key: 'hospital', label: 'Hospital/Provider', sortable: true },
    { 
      key: 'actions', 
      label: 'Actions',
      render: (value: any, row: any) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSelectedClaim(row)}
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

  const ClaimStatusCard = ({ title, count, icon: Icon, color }: any) => (
    <Card className="transition-transform hover:scale-105">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{count}</p>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Claims Management</h1>
        <Button onClick={() => setShowNewClaimModal(true)} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          New Claim
        </Button>
      </div>

      {/* Claims Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ClaimStatusCard
          title="Pending Claims"
          count={2}
          icon={Clock}
          color="bg-orange-500"
        />
        <ClaimStatusCard
          title="Approved Claims"
          count={5}
          icon={CheckCircle}
          color="bg-green-500"
        />
        <ClaimStatusCard
          title="Under Review"
          count={3}
          icon={AlertCircle}
          color="bg-blue-500"
        />
      </div>

      {/* Claims Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">My Claims</h3>
          <div className="flex space-x-2">
            <Button variant="secondary" size="sm">
              Filter
            </Button>
            <Button variant="secondary" size="sm">
              Export
            </Button>
          </div>
        </div>
        <Table columns={columns} data={claimsData} />
      </Card>

      {/* New Claim Modal */}
      {showNewClaimModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Submit New Claim</h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowNewClaimModal(false)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Claim Type
                  </label>
                  <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select claim type</option>
                    {claimTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hospital/Provider (for medical claims)
                </label>
                <input
                  type="text"
                  placeholder="Enter hospital or provider name"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the claim details"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Details
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Bank Name"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Branch"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Account Number"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supporting Documents
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600">
                    Drop files here or click to upload
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, JPG, PNG files up to 10MB each
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button className="flex-1">
                  Submit Claim
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowNewClaimModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Claim Details Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Claim Details</h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedClaim(null)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Claim Number:</span>
                <span className="text-sm font-bold">{selectedClaim.claimNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Type:</span>
                <span className="text-sm">{selectedClaim.claimType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Amount:</span>
                <span className="text-sm font-bold">KES {selectedClaim.amount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Status:</span>
                <StatusBadge status={selectedClaim.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Submitted:</span>
                <span className="text-sm">{selectedClaim.submittedDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Description:</span>
                <span className="text-sm">{selectedClaim.description}</span>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Documents</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">Medical Report.pdf</span>
                    <Button variant="secondary" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">Receipt.jpg</span>
                    <Button variant="secondary" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Claims;