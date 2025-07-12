import React, { useState } from 'react';
import { Card } from '../../components/Common/Card';
import { Button } from '../../components/Common/Button';
import { Table } from '../../components/Common/Table';
import { StatusBadge } from '../../components/Common/StatusBadge';
import { 
  FileText, 
  Eye, 
  Download, 
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  DollarSign,
  Calendar,
  Search,
  Filter,
  Edit2,
  Users,
  Heart
} from 'lucide-react';

const ClaimsManagement: React.FC = () => {
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState('pending');
  const [showApprovalModal, setShowApprovalModal] = useState<any>(null);
  const [showRejectionModal, setShowRejectionModal] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const claimsData = [
    {
      id: 'CLM-2024-001',
      memberId: 'M001234',
      memberNumber: 'M001234',
      memberName: 'John Doe',
      claimFormNumber: 'CF-2024-001',
      claimType: 'Normal Retirement',
      amount: 1500000,
      status: 'Under Review',
      submittedDate: '2024-01-10',
      examiner: 'Jane Smith - Pension Officer',
      priority: 'Medium',
      documents: ['retirement_letter.pdf', 'id_copy.pdf', 'bank_statement.pdf'],
      bankDetails: {
        bankName: 'KCB Bank',
        branchName: 'Nairobi Branch',
        accountNumber: '1234567890'
      }
    },
    {
      id: 'CLM-2024-002',
      memberId: 'M001235',
      memberNumber: 'M001235',
      memberName: 'Mary Johnson',
      claimFormNumber: 'CF-2024-002',
      claimType: 'Death in Service',
      amount: 2000000,
      status: 'Pending',
      submittedDate: '2024-01-05',
      examiner: 'Robert Brown - Claims Officer',
      priority: 'High',
      documents: ['death_certificate.pdf', 'marriage_certificate.pdf', 'letters_of_administration.pdf'],
      bankDetails: {
        bankName: 'Equity Bank',
        branchName: 'Mombasa Branch',
        accountNumber: '0987654321'
      },
      deathDetails: {
        dateOfDeath: '2023-12-15',
        causeOfDeath: 'Natural causes',
        beneficiaries: ['John Johnson (Spouse)', 'Sarah Johnson (Child)', 'Michael Johnson (Child)']
      }
    },
    {
      id: 'CLM-2024-003',
      memberId: 'M001236',
      memberNumber: 'M001236',
      memberName: 'Peter Wilson',
      claimFormNumber: 'CF-2024-003',
      claimType: 'Ill Health',
      amount: 800000,
      status: 'Approved',
      submittedDate: '2024-01-08',
      examiner: 'Dr. Alice Green - Medical Officer',
      priority: 'High',
      approvedDate: '2024-01-15',
      documents: ['medical_report.pdf', 'employer_letter.pdf'],
      bankDetails: {
        bankName: 'Co-operative Bank',
        branchName: 'Kisumu Branch',
        accountNumber: '5566778899'
      }
    }
  ];

  const claimStats = [
    { name: 'Pending Review', value: claimsData.filter(c => c.status === 'Pending').length, color: 'text-orange-600' },
    { name: 'Under Review', value: claimsData.filter(c => c.status === 'Under Review').length, color: 'text-blue-600' },
    { name: 'Approved Today', value: 5, color: 'text-green-600' },
    { name: 'Total Value', value: 'KES 4.3M', color: 'text-purple-600' }
  ];

  const columns = [
    { key: 'claimFormNumber', label: 'Form No.', sortable: true },
    { key: 'memberName', label: 'Member', sortable: true },
    { key: 'claimType', label: 'Type', sortable: true },
    { 
      key: 'amount', 
      label: 'Amount', 
      sortable: true,
      render: (value: number) => `KES ${value.toLocaleString()}`
    },
    { 
      key: 'priority', 
      label: 'Priority', 
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'High' ? 'bg-red-100 text-red-800' :
          value === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (value: string) => <StatusBadge status={value} />
    },
    { key: 'submittedDate', label: 'Submitted', sortable: true },
    { key: 'examiner', label: 'Examiner', sortable: true },
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
          {(row.status === 'Pending' || row.status === 'Under Review') && (
            <>
              <Button
                variant="success"
                size="sm"
                onClick={() => setShowApprovalModal(row)}
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowRejectionModal(row)}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  const filteredClaims = claimsData.filter(claim => {
    if (selectedTab === 'all') return true;
    return claim.status.toLowerCase().replace(' ', '_') === selectedTab;
  });

  const ClaimDetailsModal = ({ claim }: any) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Admin Claim Review - {claim.claimFormNumber}</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSelectedClaim(null)}
          >
            ×
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Member Information */}
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Member Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Member Number:</span>
                  <span className="font-medium">{claim.memberNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Name:</span>
                  <span className="font-medium">{claim.memberName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Claim Type:</span>
                  <span>{claim.claimType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount Claimed:</span>
                  <span className="font-bold text-green-600">KES {claim.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <StatusBadge status={claim.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Priority:</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    claim.priority === 'High' ? 'bg-red-100 text-red-800' :
                    claim.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {claim.priority}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Submitted:</span>
                  <span>{claim.submittedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Examiner:</span>
                  <span>{claim.examiner}</span>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Bank Details</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Bank:</span>
                  <span>{claim.bankDetails.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Branch:</span>
                  <span>{claim.bankDetails.branchName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Account:</span>
                  <span className="font-mono">{claim.bankDetails.accountNumber}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Claim Processing */}
          <div className="space-y-6">
            {/* Death Details */}
            {claim.deathDetails && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-900 mb-4">Death in Service Details</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-red-700">Date of Death:</span>
                    <span>{claim.deathDetails.dateOfDeath}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-700">Cause of Death:</span>
                    <span>{claim.deathDetails.causeOfDeath}</span>
                  </div>
                  <div>
                    <span className="text-red-700">Beneficiaries:</span>
                    <ul className="mt-1 space-y-1">
                      {claim.deathDetails.beneficiaries.map((beneficiary: string, index: number) => (
                        <li key={index} className="text-sm">• {beneficiary}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Processing Actions */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-4">Processing Actions</h4>
              <div className="space-y-3">
                <Button variant="secondary" className="w-full">
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Claim Details
                </Button>
                <Button variant="secondary" className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Assign to Another Officer
                </Button>
                <Button variant="secondary" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Review Meeting
                </Button>
                <Button variant="secondary" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Request Additional Documents
                </Button>
              </div>
            </div>

            {/* Calculation Details */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-900 mb-4">Calculation Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Contributions:</span>
                  <span>KES 1,200,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Interest Earned:</span>
                  <span>KES 300,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Employer Contributions:</span>
                  <span>KES 800,000</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Total Entitlement:</span>
                  <span>KES 2,300,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="mt-8">
          <h4 className="font-medium text-gray-900 mb-4">Supporting Documents</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {claim.documents.map((doc: string, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm">{doc}</span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="secondary" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex space-x-2">
          {(claim.status === 'Pending' || claim.status === 'Under Review') && (
            <>
              <Button
                onClick={() => {
                  setSelectedClaim(null);
                  setShowApprovalModal(claim);
                }}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Claim
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setSelectedClaim(null);
                  setShowRejectionModal(claim);
                }}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Claim
              </Button>
            </>
          )}
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="secondary" onClick={() => setSelectedClaim(null)}>
            Close
          </Button>
        </div>
      </Card>
    </div>
  );

  const ApprovalModal = ({ claim }: any) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Approve Claim</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowApprovalModal(null)}
          >
            ×
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm text-green-800">
                You are about to approve this claim for KES {claim.amount.toLocaleString()}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Approved Amount
            </label>
            <input
              type="number"
              defaultValue={claim.amount}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>Bank Transfer</option>
              <option>Cheque</option>
              <option>Partial Payment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comments (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Add any comments or notes..."
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex space-x-2">
            <Button className="flex-1">
              Confirm Approval
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowApprovalModal(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const RejectionModal = ({ claim }: any) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Reject Claim</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowRejectionModal(null)}
          >
            ×
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-sm text-red-800">
                You are about to reject this claim
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Rejection *
            </label>
            <select 
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 mb-2"
              onChange={(e) => setRejectionReason(e.target.value)}
            >
              <option value="">Select reason</option>
              <option value="insufficient_documentation">Insufficient Documentation</option>
              <option value="incorrect_details">Incorrect Details Provided</option>
              <option value="eligibility_criteria">Does Not Meet Eligibility Criteria</option>
              <option value="calculation_error">Calculation Error</option>
              <option value="missing_signatures">Missing Required Signatures</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Comments *
            </label>
            <textarea
              rows={4}
              placeholder="Provide detailed reason for rejection..."
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Required Actions
            </label>
            <textarea
              rows={3}
              placeholder="What should the member do to resubmit?"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex space-x-2">
            <Button
              variant="danger"
              className="flex-1"
            >
              Confirm Rejection
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowRejectionModal(null)}
            >
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
        <h1 className="text-2xl font-bold text-gray-900">Claims Management</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>Auto-refresh every 30 seconds</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {claimStats.map((stat) => (
          <Card key={stat.name}>
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-lg">
                <FileText className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Claims Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search claims..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button variant="secondary" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          
          <div className="flex space-x-1">
            {['pending', 'under_review', 'approved', 'rejected', 'paid', 'all'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-md capitalize ${
                  selectedTab === tab
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <Table columns={columns} data={filteredClaims} />
      </Card>

      {/* Modals */}
      {selectedClaim && <ClaimDetailsModal claim={selectedClaim} />}
      {showApprovalModal && <ApprovalModal claim={showApprovalModal} />}
      {showRejectionModal && <RejectionModal claim={showRejectionModal} />}
    </div>
  );
};

export default ClaimsManagement;