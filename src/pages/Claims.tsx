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
  AlertCircle,
  User,
  DollarSign,
  Calendar,
  Building2,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Users,
  Heart,
  Skull,
  Edit2,
  Trash2,
  Filter,
  Search
} from 'lucide-react';

const Claims: React.FC = () => {
  const [showNewClaimModal, setShowNewClaimModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState('all');
  const [showPartialPaymentModal, setShowPartialPaymentModal] = useState<any>(null);
  const [showDrawDownModal, setShowDrawDownModal] = useState<any>(null);

  const claimsData = [
    {
      id: 'CLM-2024-001',
      memberId: 'M001234',
      memberNumber: 'M001234',
      memberName: 'John Doe',
      gender: 'Male',
      nationalId: '12345678',
      kraPin: 'A123456789A',
      dateOfBirth: '1960-05-15',
      permanentAddress: 'P.O. Box 123, Nairobi, Kenya',
      claimFormNumber: 'CF-2024-001',
      claimType: 'Normal Retirement',
      amount: 1500000,
      status: 'Under Review',
      submittedDate: '2024-01-10',
      dateOfClaim: '2024-01-10',
      dateOfLeaving: '2024-01-31',
      causeOfLeaving: 'Normal Retirement at 65',
      bankDetails: {
        bankName: 'KCB Bank',
        branchName: 'Nairobi Branch',
        accountNumber: '1234567890'
      },
      documents: ['retirement_letter.pdf', 'id_copy.pdf', 'bank_statement.pdf'],
      examiner: 'Jane Smith - Pension Officer',
      partialPayments: [],
      drawDowns: []
    },
    {
      id: 'CLM-2024-002',
      memberId: 'M001235',
      memberNumber: 'M001235',
      memberName: 'Mary Johnson',
      gender: 'Female',
      previousNames: 'Mary Williams',
      nationalId: '87654321',
      kraPin: 'B987654321B',
      dateOfBirth: '1975-08-20',
      permanentAddress: 'P.O. Box 456, Mombasa, Kenya',
      claimFormNumber: 'CF-2024-002',
      claimType: 'Death in Service',
      amount: 2000000,
      status: 'Approved',
      submittedDate: '2024-01-05',
      dateOfClaim: '2024-01-05',
      causeOfLeaving: 'Death in Service',
      bankDetails: {
        bankName: 'Equity Bank',
        branchName: 'Mombasa Branch',
        accountNumber: '0987654321'
      },
      documents: ['death_certificate.pdf', 'marriage_certificate.pdf', 'letters_of_administration.pdf'],
      examiner: 'Robert Brown - Claims Officer',
      deathDetails: {
        dateOfDeath: '2023-12-15',
        causeOfDeath: 'Natural causes',
        beneficiaries: ['John Johnson (Spouse)', 'Sarah Johnson (Child)', 'Michael Johnson (Child)'],
        spouse: 'John Johnson'
      },
      partialPayments: [
        {
          id: 'PP-001',
          amount: 500000,
          date: '2024-01-15',
          reference: 'TXN-001',
          status: 'Paid'
        }
      ],
      drawDowns: [
        {
          id: 'DD-001',
          amount: 50000,
          date: '2024-01-20',
          purpose: 'School fees for Sarah Johnson',
          beneficiary: 'Sarah Johnson'
        }
      ]
    },
    {
      id: 'CLM-2024-003',
      memberId: 'M001236',
      memberNumber: 'M001236',
      memberName: 'Peter Wilson',
      gender: 'Male',
      nationalId: '11223344',
      kraPin: 'C112233445C',
      dateOfBirth: '1980-03-10',
      permanentAddress: 'P.O. Box 789, Kisumu, Kenya',
      claimFormNumber: 'CF-2024-003',
      claimType: 'Ill Health',
      amount: 800000,
      status: 'Rejected',
      submittedDate: '2024-01-08',
      dateOfClaim: '2024-01-08',
      causeOfLeaving: 'Medical incapacity',
      rejectionReason: 'Insufficient medical documentation provided',
      bankDetails: {
        bankName: 'Co-operative Bank',
        branchName: 'Kisumu Branch',
        accountNumber: '5566778899'
      },
      documents: ['medical_report.pdf', 'employer_letter.pdf'],
      examiner: 'Dr. Alice Green - Medical Officer',
      partialPayments: [],
      drawDowns: []
    }
  ];

  const claimTypes = [
    'Normal Retirement',
    'Early Retirement',
    'Early Retirement from Deferred Status',
    'Late Retirement',
    'Death in Service',
    'Leaving Service',
    'Ill Health Retirement'
  ];

  const leavingReasons = [
    'Normal Retirement at 65',
    'Early Retirement',
    'Death in Service',
    'Resignation',
    'Termination',
    'Medical incapacity',
    'Transfer to another scheme'
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
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" />
          </Button>
          {row.status === 'Approved' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowPartialPaymentModal(row)}
            >
              <DollarSign className="h-4 w-4" />
            </Button>
          )}
        </div>
      )
    }
  ];

  const filteredClaims = claimsData.filter(claim => {
    if (selectedTab === 'all') return true;
    return claim.status.toLowerCase().replace(' ', '_') === selectedTab;
  });

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

  const NewClaimModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Member Information */}
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Member Information</h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Member Number
                  </label>
                  <input
                    type="text"
                    value="M001234"
                    disabled
                    className="w-full px-3 py-2 border rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value="John Doe"
                    disabled
                    className="w-full px-3 py-2 border rounded-md bg-gray-50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <input
                      type="text"
                      value="Male"
                      disabled
                      className="w-full px-3 py-2 border rounded-md bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value="1960-05-15"
                      disabled
                      className="w-full px-3 py-2 border rounded-md bg-gray-50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Previous/Maiden Names (if applicable)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter previous names"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      National ID
                    </label>
                    <input
                      type="text"
                      value="12345678"
                      disabled
                      className="w-full px-3 py-2 border rounded-md bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      KRA PIN
                    </label>
                    <input
                      type="text"
                      value="A123456789A"
                      disabled
                      className="w-full px-3 py-2 border rounded-md bg-gray-50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Permanent Address
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter full permanent address"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Claim Details */}
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Claim Details</h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Claim Type *
                  </label>
                  <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select claim type</option>
                    {claimTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Claim *
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Leaving Scheme
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cause of Leaving Scheme *
                  </label>
                  <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select reason</option>
                    {leavingReasons.map(reason => (
                      <option key={reason} value={reason}>{reason}</option>
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
            </div>

            {/* Bank Details */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Bank Details</h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter bank name"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter branch name"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter account number"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Death in Service Details */}
        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-medium text-red-900 mb-4">Death in Service Details (if applicable)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-red-700 mb-1">
                Date of Death
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-red-700 mb-1">
                Cause of Death
              </label>
              <input
                type="text"
                placeholder="Enter cause of death"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-red-700 mb-1">
                Spouse Name
              </label>
              <input
                type="text"
                placeholder="Enter spouse name"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-red-700 mb-1">
                Beneficiaries
              </label>
              <textarea
                rows={2}
                placeholder="List all beneficiaries"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        </div>

        {/* Supporting Documents */}
        <div className="mt-8">
          <h4 className="font-medium text-gray-900 mb-4">Supporting Documents</h4>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-600">
              Upload required documents based on claim type
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Required: ID copy, Bank statement, Clearance letter, etc.
            </p>
            <p className="text-xs text-gray-500">
              For Death Claims: Death certificate, Marriage certificate, Letters of administration
            </p>
          </div>
        </div>

        <div className="mt-8 flex space-x-2">
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
      </Card>
    </div>
  );

  const ClaimDetailsModal = ({ claim }: any) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Claim Details - {claim.claimFormNumber}</h3>
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
                {claim.previousNames && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Previous Names:</span>
                    <span className="font-medium">{claim.previousNames}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Gender:</span>
                  <span>{claim.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date of Birth:</span>
                  <span>{claim.dateOfBirth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">National ID:</span>
                  <span>{claim.nationalId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">KRA PIN:</span>
                  <span>{claim.kraPin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Address:</span>
                  <span className="text-right">{claim.permanentAddress}</span>
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

          {/* Claim Information */}
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Claim Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Form Number:</span>
                  <span className="font-medium">{claim.claimFormNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Type:</span>
                  <span>{claim.claimType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount:</span>
                  <span className="font-bold text-green-600">KES {claim.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <StatusBadge status={claim.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date of Claim:</span>
                  <span>{claim.dateOfClaim}</span>
                </div>
                {claim.dateOfLeaving && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date of Leaving:</span>
                    <span>{claim.dateOfLeaving}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Cause of Leaving:</span>
                  <span>{claim.causeOfLeaving}</span>
                </div>
                {claim.examiner && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Examiner:</span>
                    <span>{claim.examiner}</span>
                  </div>
                )}
                {claim.rejectionReason && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded">
                    <span className="text-red-700 font-medium">Rejection Reason:</span>
                    <p className="text-red-600 text-sm mt-1">{claim.rejectionReason}</p>
                  </div>
                )}
              </div>
            </div>

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
                  {claim.deathDetails.spouse && (
                    <div className="flex justify-between">
                      <span className="text-red-700">Spouse:</span>
                      <span>{claim.deathDetails.spouse}</span>
                    </div>
                  )}
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
          </div>
        </div>

        {/* Partial Payments */}
        {claim.partialPayments && claim.partialPayments.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">Partial Payments</h4>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowPartialPaymentModal(claim)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Payment
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {claim.partialPayments.map((payment: any) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        KES {payment.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.reference}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={payment.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Draw Downs */}
        {claim.drawDowns && claim.drawDowns.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">Draw Downs</h4>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowDrawDownModal(claim)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Draw Down
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Beneficiary</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {claim.drawDowns.map((drawDown: any) => (
                    <tr key={drawDown.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        KES {drawDown.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{drawDown.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{drawDown.purpose}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{drawDown.beneficiary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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
                <Button variant="secondary" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex space-x-2">
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Download Claim Form
          </Button>
          <Button variant="secondary">
            <FileText className="h-4 w-4 mr-2" />
            Generate Statement
          </Button>
          <Button variant="secondary" onClick={() => setSelectedClaim(null)}>
            Close
          </Button>
        </div>
      </Card>
    </div>
  );

  const PartialPaymentModal = ({ claim }: any) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Add Partial Payment</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowPartialPaymentModal(null)}
          >
            ×
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Amount
            </label>
            <input
              type="number"
              placeholder="Enter amount"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Date
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reference Number
            </label>
            <input
              type="text"
              placeholder="Enter reference number"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Bank Transfer</option>
              <option>Cheque</option>
              <option>MPESA</option>
              <option>Cash</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <Button className="flex-1">Add Payment</Button>
            <Button variant="secondary" onClick={() => setShowPartialPaymentModal(null)}>
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const DrawDownModal = ({ claim }: any) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Add Draw Down</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowDrawDownModal(null)}
          >
            ×
          </Button>
        </div>
        
        <div className="space-y-4">
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
              Date
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purpose
            </label>
            <input
              type="text"
              placeholder="e.g., School fees, Medical expenses"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Beneficiary
            </label>
            <input
              type="text"
              placeholder="Enter beneficiary name"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End User/Institution
            </label>
            <input
              type="text"
              placeholder="e.g., School name, Hospital"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex space-x-2">
            <Button className="flex-1">Add Draw Down</Button>
            <Button variant="secondary" onClick={() => setShowDrawDownModal(null)}>
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
        <h1 className="text-2xl font-bold text-gray-900">Claims & Withdrawals Management</h1>
        <div className="flex space-x-2">
          <Button variant="secondary" className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="secondary" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowNewClaimModal(true)} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            New Claim
          </Button>
        </div>
      </div>

      {/* Claims Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ClaimStatusCard
          title="Submitted Claims"
          count={claimsData.filter(c => c.status === 'Submitted').length}
          icon={FileText}
          color="bg-blue-500"
        />
        <ClaimStatusCard
          title="Under Review"
          count={claimsData.filter(c => c.status === 'Under Review').length}
          icon={Clock}
          color="bg-orange-500"
        />
        <ClaimStatusCard
          title="Approved Claims"
          count={claimsData.filter(c => c.status === 'Approved').length}
          icon={CheckCircle}
          color="bg-green-500"
        />
        <ClaimStatusCard
          title="Rejected Claims"
          count={claimsData.filter(c => c.status === 'Rejected').length}
          icon={AlertCircle}
          color="bg-red-500"
        />
      </div>

      {/* Search and Filter */}
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
          </div>
          
          <div className="flex space-x-1">
            {['all', 'submitted', 'under_review', 'approved', 'rejected', 'paid'].map((tab) => (
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
      {showNewClaimModal && <NewClaimModal />}
      {selectedClaim && <ClaimDetailsModal claim={selectedClaim} />}
      {showPartialPaymentModal && <PartialPaymentModal claim={showPartialPaymentModal} />}
      {showDrawDownModal && <DrawDownModal claim={showDrawDownModal} />}
    </div>
  );
};

export default Claims;