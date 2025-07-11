export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Pension Officer' | 'Finance Officer' | 'Medical Officer' | 'Approver';
  permissions: string[];
  lastLogin: string;
  isActive: boolean;
}

export interface PendingApproval {
  id: string;
  type: 'Profile Update' | 'Beneficiary Change' | 'Claim Submission' | 'Member Registration';
  memberId: string;
  memberName: string;
  submittedBy: string;
  submittedDate: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected';
  priority: 'High' | 'Medium' | 'Low';
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  documents?: string[];
  reviewedBy?: string;
  reviewedDate?: string;
  rejectionReason?: string;
}

export interface BulkOperation {
  id: string;
  type: 'Member Import' | 'Contribution Upload' | 'Salary Update' | 'Status Change';
  fileName: string;
  uploadedBy: string;
  uploadedDate: string;
  status: 'Processing' | 'Completed' | 'Failed' | 'Pending Review';
  totalRecords: number;
  processedRecords: number;
  failedRecords: number;
  errors?: string[];
}

export interface SystemAlert {
  id: string;
  type: 'Medical Overdue' | 'Contribution Missing' | 'Document Expiry' | 'System Error';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  message: string;
  memberId?: string;
  createdDate: string;
  isRead: boolean;
  actionRequired: boolean;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'Member' | 'Financial' | 'Medical' | 'Compliance';
  parameters: {
    name: string;
    type: 'date' | 'select' | 'text' | 'number';
    required: boolean;
    options?: string[];
  }[];
  schedule?: {
    frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly';
    recipients: string[];
  };
}

export interface MemberActivity {
  id: string;
  memberId: string;
  memberName: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

export interface FinancialSummary {
  totalMembers: number;
  activeMembers: number;
  totalContributions: number;
  monthlyContributions: number;
  totalClaims: number;
  pendingClaims: number;
  medicalExpenditure: number;
  accountBalance: number;
}