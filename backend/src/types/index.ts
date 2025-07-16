export interface Member {
  _id: string;
  memberNumber: string;
  firstName: string;
  lastName: string;
  otherNames?: string;
  gender: 'Male' | 'Female';
  dateOfBirth: Date;
  nationality: string;
  phoneNumber: string;
  email: string;
  nationalId: string;
  kraPin: string;
  dateOfJoining: Date;
  designation: string;
  maritalStatus: 'Single' | 'Married' | 'Separated' | 'Divorced' | 'Widow';
  spouseName?: string;
  basicSalary: number;
  membershipStatus: 'Active' | 'Inactive' | 'Suspended';
  contributionRate: number;
  sponsorContributionRate: number;
  medicalLimitInpatient: number;
  medicalLimitOutpatient: number;
  exGratia: number;
  accountBalance: number;
  lastContribution: Date;
  expectedRetirement: Date;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string;
}

export interface Beneficiary {
  _id: string;
  memberId: string;
  name: string;
  relationship: string;
  dateOfBirth: Date;
  idNumber: string;
  percentage: number;
  isActive: boolean;
  createdAt: Date;
}

export interface Contribution {
  _id: string;
  memberId: string;
  memberNumber: string;
  sponsorId: string;
  sponsorCode: string;
  sponsorName: string;
  period: string;
  department: string;
  basicSalary: number;
  employeeContribution: number;
  employeeContributionRate: number;
  employerContribution: number;
  employerContributionRate: number;
  additionalVoluntary: number;
  totalContribution: number;
  cumulativeEmployeeContribution: number;
  cumulativeEmployerContribution: number;
  cumulativeTotal: number;
  contributionType: 'Registered' | 'Unregistered';
  paymentMethod: 'Cheque' | 'Bank Transfer' | 'MPESA' | 'Standing Order' | 'Cash' | 'EDI';
  status: 'Pending' | 'Confirmed' | 'Rejected' | 'On Hold' | 'Reconciled';
  receiptNumber?: string;
  chequeNumber?: string;
  bankDetails?: string;
  custodianBank?: string;
  receiptDate?: Date;
  reconciliationStatus: 'Pending' | 'Matched' | 'Discrepancy' | 'Resolved';
  discrepancyReason?: string;
  previousMonthAmount?: number;
  difference?: number;
  isAllocated: boolean;
  createdAt: Date;
  processedBy?: string;
  approvedBy?: string;
}

export interface Sponsor {
  _id: string;
  sponsorCode: string;
  sponsorName: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  address: string;
  totalEmployees: number;
  activeMembers: number;
  standardEmployeeRate: number;
  standardEmployerRate: number;
  paymentMethod: string;
  bankDetails: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  lastContributionDate: Date;
  totalContributions: number;
  createdAt: Date;
}

export interface Claim {
  _id: string;
  memberId: string;
  memberNumber: string;
  memberName: string;
  gender: 'Male' | 'Female';
  previousNames?: string;
  nationalId: string;
  kraPin: string;
  dateOfBirth: Date;
  permanentAddress: string;
  claimFormNumber: string;
  claimType: 'Normal Retirement' | 'Early Retirement' | 'Death in Service' | 'Leaving Service' | 'Ill Health';
  amount: number;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Paid';
  submittedDate: Date;
  processedDate?: Date;
  reason?: string;
  documents: string[];
  bankDetails: {
    bankName: string;
    branchName: string;
    accountNumber: string;
  };
  dateOfClaim: Date;
  dateOfLeaving?: Date;
  causeOfLeaving: string;
  settlementDate?: Date;
  chequeNumber?: string;
  dateOfCheque?: Date;
  examiner?: string;
  rejectionReason?: string;
  partialPayments: {
    _id: string;
    amount: number;
    date: Date;
    reference: string;
    status: string;
  }[];
  deathDetails?: {
    dateOfDeath: Date;
    causeOfDeath: string;
    beneficiaries: string[];
    spouse?: string;
  };
  drawDowns: {
    _id: string;
    amount: number;
    date: Date;
    purpose: string;
    beneficiary: string;
  }[];
}

export interface MedicalClaim {
  _id: string;
  memberId: string;
  claimType: 'Inpatient' | 'Outpatient';
  amount: number;
  hospital: string;
  treatmentDate: Date;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Paid';
  balance: number;
  createdAt: Date;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'Member' | 'Admin' | 'Pension Officer' | 'Approver';
  memberId?: string;
  permissions?: string[];
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

export interface VotingSession {
  _id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  candidates: {
    _id: string;
    name: string;
    position: string;
    votes: number;
    percentage: number;
  }[];
  isActive: boolean;
  totalVotes: number;
  createdAt: Date;
}

export interface AuditLog {
  _id: string;
  memberId: string;
  action: string;
  beforeValue: any;
  afterValue: any;
  timestamp: Date;
  userId: string;
  userRole: string;
  ipAddress: string;
  userAgent: string;
}

export interface PendingApproval {
  _id: string;
  type: 'Profile Update' | 'Beneficiary Change' | 'Claim Submission' | 'Member Registration';
  memberId: string;
  memberName: string;
  submittedBy: string;
  submittedDate: Date;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected';
  priority: 'High' | 'Medium' | 'Low';
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  documents?: string[];
  reviewedBy?: string;
  reviewedDate?: Date;
  rejectionReason?: string;
}

export interface BulkOperation {
  _id: string;
  type: 'Member Import' | 'Contribution Upload' | 'Salary Update' | 'Status Change';
  fileName: string;
  uploadedBy: string;
  uploadedDate: Date;
  status: 'Processing' | 'Completed' | 'Failed' | 'Pending Review';
  totalRecords: number;
  processedRecords: number;
  failedRecords: number;
  errors?: string[];
}

export interface SystemAlert {
  _id: string;
  type: 'Medical Overdue' | 'Contribution Missing' | 'Document Expiry' | 'System Error';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  message: string;
  memberId?: string;
  createdDate: Date;
  isRead: boolean;
  actionRequired: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  memberId?: string | undefined;
  permissions?: string[] | undefined;
}

export interface EmailTemplate {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}
