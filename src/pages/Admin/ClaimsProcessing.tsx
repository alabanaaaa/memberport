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
  Heart,
  Upload,
  Camera,
  Fingerprint,
  Building2,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Plus,
  Minus
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const ClaimsProcessing: React.FC = () => {
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState('pending');
  const [showApprovalModal, setShowApprovalModal] = useState<any>(null);
  const [showRejectionModal, setShowRejectionModal] = useState<any>(null);
  const [showDrawDownModal, setShowDrawDownModal] = useState<any>(null);
  const [showPartialPaymentModal, setShowPartialPaymentModal] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const claimsData = [
    {
      id: 'CLM-2024-001',
      membershipNumber: 'M001234',
      memberName: 'John Doe',
      gender: 'Male',
      previousNames: '',
      nationalId: '12345678',
      kraPin: 'A123456789A',
      dateOfBirth: '1960-05-15',
      permanentAddress: 'P.O. Box 123, Nairobi, Kenya. Detailed address with sufficient space for complete information including street, building, floor, and any other relevant location details.',
      dateOfClaim: '2024-01-10',
      claimFormNumber: 'CF-2024-001',
      bankName: 'KCB Bank',
      bankBranch: 'Nairobi Branch',
      bankAccountNumber: '1234567890',
      dateOfLeaving: '2024-01-31',
      causeOfLeaving: 'Normal Retirement',
      claimType: 'Normal Retirement',
      amount: 1500000,
      status: 'Under Review',
      submittedDate: '2024-01-10',
      examiner: 'Jane Smith - Pension Officer',
      priority: 'Medium',
      documents: ['retirement_letter.pdf', 'id_copy.pdf', 'bank_statement.pdf'],
      scannedPhotograph: 'member_photo.jpg',
      scannedSignature: 'member_signature.jpg',
      settlementDate: null,
      chequeNumber: null,
      chequeDate: null,
      partialPayments: [],
      drawDowns: [],
      statusReason: 'Under review by pension officer'
    },
    {
      id: 'CLM-2024-002',
      membershipNumber: 'M001235',
      memberName: 'Mary Johnson',
      gender: 'Female',
      previousNames: 'Mary Williams',
      nationalId: '87654321',
      kraPin: 'B987654321B',
      dateOfBirth: '1975-08-20',
      permanentAddress: 'P.O. Box 456, Mombasa, Kenya. Complete residential address with all necessary details for correspondence and verification purposes.',
      dateOfClaim: '2024-01-05',
      claimFormNumber: 'CF-2024-002',
      bankName: 'Equity Bank',
      bankBranch: 'Mombasa Branch',
      bankAccountNumber: '0987654321',
      dateOfLeaving: null,
      causeOfLeaving: 'Death in Service',
      claimType: 'Death in Service',
      amount: 2000000,
      status: 'Approved',
      submittedDate: '2024-01-05',
      examiner: 'Robert Brown - Claims Officer',
      priority: 'High',
      documents: ['death_certificate.pdf', 'marriage_certificate.pdf', 'letters_of_administration.pdf', 'relationship_affidavit.pdf'],
      scannedPhotograph: 'member_photo.jpg',
      scannedSignature: 'member_signature.jpg',
      settlementDate: '2024-01-20',
      chequeNumber: 'CHQ-001',
      chequeDate: '2024-01-20',
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
          status: 'Paid',
          chequeNumber: 'CHQ-001A',
          bankReference: 'BNK-REF-001'
        }
      ],
      drawDowns: [
        {
          id: 'DD-001',
          amount: 50000,
          date: '2024-01-20',
          purpose: 'School fees for Sarah Johnson',
          beneficiary: 'Sarah Johnson',
          endUser: 'Nairobi Primary School',
          trusteeApproval: true,
          interestAllocated: 2500
        }
      ],
      statusReason: 'Approved and partial payment processed'
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
      <Card className="w-full max-w-7xl mx-4 max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Claims Processing - {claim.claimFormNumber}</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSelectedClaim(null)}
          >
            ×
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Member Information */}
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Member Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Membership Number:</span>
                  <span className="font-medium">{claim.membershipNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Name:</span>
                  <span className="font-medium">{claim.memberName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Gender:</span>
                  <span>{claim.gender}</span>
                </div>
                {claim.previousNames && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Previous Names:</span>
                    <span>{claim.previousNames}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">National ID:</span>
                  <span>{claim.nationalId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">KRA PIN:</span>
                  <span>{claim.kraPin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date of Birth:</span>
                  <span>{claim.dateOfBirth}</span>
                </div>
                <div>
                  <span className="text-gray-500">Permanent Address:</span>
                  <p className="text-sm mt-1">{claim.permanentAddress}</p>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Bank Details</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Bank Name:</span>
                  <span>{claim.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Branch:</span>
                  <span>{claim.bankBranch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Account Number:</span>
                  <span className="font-mono">{claim.bankAccountNumber}</span>
                </div>
              </div>
            </div>

            {/* Biometric Data */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Biometric Data</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Camera className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm">Scanned Photograph</span>
                  </div>
                  <Button variant="secondary" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Edit2 className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm">Scanned Signature</span>
                  </div>
                  <Button variant="secondary" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Fingerprint className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm">Fingerprints</span>
                  </div>
                  <Button variant="secondary" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
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
                  <span className="text-gray-500">Claim Type:</span>
                  <span>{claim.claimType}</span>
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
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount:</span>
                  <span className="font-bold text-green-600">KES {claim.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <StatusBadge status={claim.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Examiner:</span>
                  <span>{claim.examiner}</span>
                </div>
                <div>
                  <span className="text-gray-500">Status Reason:</span>
                  <p className="text-sm mt-1">{claim.statusReason}</p>
                </div>
              </div>
            </div>

            {/* Settlement Details */}
            {claim.settlementDate && (
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Settlement Details</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Settlement Date:</span>
                    <span>{claim.settlementDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Cheque Number:</span>
                    <span className="font-mono">{claim.chequeNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Cheque Date:</span>
                    <span>{claim.chequeDate}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Death in Service Details */}
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

          {/* Processing & Actions */}
          <div className="space-y-6">
            {/* Partial Payments */}
            {claim.partialPayments && claim.partialPayments.length > 0 && (
              <div>
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
                <div className="space-y-2">
                  {claim.partialPayments.map((payment: any) => (
                    <div key={payment.id} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-green-900">KES {payment.amount.toLocaleString()}</p>
                          <p className="text-sm text-green-700">Ref: {payment.reference}</p>
                          <p className="text-xs text-green-600">{payment.date}</p>
                        </div>
                        <StatusBadge status={payment.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Draw Down Functionality */}
            {claim.drawDowns && claim.drawDowns.length > 0 && (
              <div>
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
                <div className="space-y-2">
                  {claim.drawDowns.map((drawDown: any) => (
                    <div key={drawDown.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">KES {drawDown.amount.toLocaleString()}</span>
                          <span className="text-xs text-gray-500">{drawDown.date}</span>
                        </div>
                        <p className="text-blue-700">{drawDown.purpose}</p>
                        <p className="text-blue-600">Beneficiary: {drawDown.beneficiary}</p>
                        <p className="text-blue-600">End User: {drawDown.endUser}</p>
                        {drawDown.interestAllocated && (
                          <p className="text-green-600">Interest: KES {drawDown.interestAllocated.toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Processing Actions */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Processing Actions</h4>
              <div className="space-y-3">
                {(claim.status === 'Pending' || claim.status === 'Under Review') && (
                  <>
                    <Button
                      onClick={() => setShowApprovalModal(claim)}
                      className="w-full"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Claim
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => setShowRejectionModal(claim)}
                      className="w-full"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Claim
                    </Button>
                  </>
                )}
                <Button variant="secondary" className="w-full">
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Claim Details
                </Button>
                <Button variant="secondary" className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Assign to Officer
                </Button>
                <Button variant="secondary" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>

            {/* Documents */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Supporting Documents</h4>
              <div className="space-y-2">
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
          </div>
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
              Settlement Date
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cheque/Reference Number
            </label>
            <input
              type="text"
              placeholder="Enter cheque or bank reference number"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
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
              <option value="awaiting_documents">Awaiting Additional Documents</option>
              <option value="wrong_details">Wrong Details Provided</option>
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
              Cheque/Bank Reference
            </label>
            <input
              type="text"
              placeholder="Enter cheque or bank reference"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interest Allocation
            </label>
            <input
              type="number"
              placeholder="Interest amount (if applicable)"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <label className="text-sm text-gray-700">Trustee Approval Required</label>
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
        <h1 className="text-2xl font-bold text-gray-900">Claims Processing & Management</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>Auto-refresh every 30 seconds</span>
        </div>
      </div>

      {/* Claims Status Overview */}
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
      {showPartialPaymentModal && <PartialPaymentModal claim={showPartialPaymentModal} />}
      {showDrawDownModal && <DrawDownModal claim={showDrawDownModal} />}
    </div>
  );
};

export default ClaimsProcessing;