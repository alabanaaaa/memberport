import React, { useState } from 'react';
import { Card } from '../../components/Common/Card';
import { Button } from '../../components/Common/Button';
import { Table } from '../../components/Common/Table';
import { StatusBadge } from '../../components/Common/StatusBadge';
import { useAdmin } from '../../contexts/AdminContext';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Clock, 
  User, 
  FileText,
  AlertTriangle,
  Download
} from 'lucide-react';

const ApprovalsManagement: React.FC = () => {
  const { pendingApprovals, approveRequest, rejectRequest } = useAdmin();
  const [selectedApproval, setSelectedApproval] = useState<any>(null);
  const [showRejectModal, setShowRejectModal] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedTab, setSelectedTab] = useState('pending');

  const approvalStats = [
    { name: 'Pending', value: pendingApprovals.filter(a => a.status === 'Pending').length, color: 'text-orange-600' },
    { name: 'Under Review', value: pendingApprovals.filter(a => a.status === 'Under Review').length, color: 'text-blue-600' },
    { name: 'Approved Today', value: 8, color: 'text-green-600' },
    { name: 'Rejected Today', value: 2, color: 'text-red-600' }
  ];

  const columns = [
    { key: 'type', label: 'Type', sortable: true },
    { key: 'memberName', label: 'Member', sortable: true },
    { key: 'submittedDate', label: 'Submitted', sortable: true },
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
    { 
      key: 'actions', 
      label: 'Actions',
      render: (value: any, row: any) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSelectedApproval(row)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {row.status === 'Pending' && (
            <>
              <Button
                variant="success"
                size="sm"
                onClick={() => handleApprove(row.id)}
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowRejectModal(row)}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  const filteredApprovals = pendingApprovals.filter(approval => {
    if (selectedTab === 'all') return true;
    return approval.status.toLowerCase().replace(' ', '_') === selectedTab;
  });

  const handleApprove = async (id: string) => {
    await approveRequest(id);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    await rejectRequest(showRejectModal.id, rejectionReason);
    setShowRejectModal(null);
    setRejectionReason('');
  };

  const ApprovalDetailsModal = ({ approval }: any) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Approval Details</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSelectedApproval(null)}
          >
            ×
          </Button>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Request Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Type:</span>
                  <span>{approval.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Member:</span>
                  <span>{approval.memberName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Submitted:</span>
                  <span>{approval.submittedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Priority:</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    approval.priority === 'High' ? 'bg-red-100 text-red-800' :
                    approval.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {approval.priority}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <StatusBadge status={approval.status} />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Member Details</h4>
              <div className="text-center">
                <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mb-2">
                  {approval.memberName.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <p className="font-medium">{approval.memberName}</p>
                <p className="text-sm text-gray-500">ID: {approval.memberId}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Changes Requested</h4>
            <div className="space-y-3">
              {approval.changes.map((change: any, index: number) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{change.field}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Current Value:</span>
                      <p className="font-medium text-red-600">{change.oldValue || 'None'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">New Value:</span>
                      <p className="font-medium text-green-600">{change.newValue}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {approval.documents && approval.documents.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Supporting Documents</h4>
              <div className="space-y-2">
                {approval.documents.map((doc: string, index: number) => (
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
          )}

          {approval.status === 'Pending' && (
            <div className="flex space-x-2">
              <Button
                onClick={() => handleApprove(approval.id)}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setSelectedApproval(null);
                  setShowRejectModal(approval);
                }}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );

  const RejectModal = ({ approval }: any) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Reject Request</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowRejectModal(null)}
          >
            ×
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-sm text-red-800">
                You are about to reject this request
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Rejection *
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              placeholder="Please provide a detailed reason for rejection..."
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex space-x-2">
            <Button
              variant="danger"
              onClick={handleReject}
              className="flex-1"
            >
              Confirm Rejection
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowRejectModal(null)}
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
        <h1 className="text-2xl font-bold text-gray-900">Approvals Management</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>Auto-refresh every 30 seconds</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {approvalStats.map((stat) => (
          <Card key={stat.name}>
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-lg">
                <User className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Approvals Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Pending Approvals</h3>
          
          <div className="flex space-x-1">
            {['pending', 'under_review', 'approved', 'rejected', 'all'].map((tab) => (
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

        <Table columns={columns} data={filteredApprovals} />
      </Card>

      {/* Modals */}
      {selectedApproval && <ApprovalDetailsModal approval={selectedApproval} />}
      {showRejectModal && <RejectModal approval={showRejectModal} />}
    </div>
  );
};

export default ApprovalsManagement;