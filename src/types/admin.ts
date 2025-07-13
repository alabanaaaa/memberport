export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Pension Officer' | 'Finance Officer' | 'Medical Officer' | 'Approver' | 'Customer Care';
  permissions: string[];
  lastLogin: string;
  isActive: boolean;
  department: string;
  employeeId: string;
}

export interface MemberRecord {
  id: string;
  memberNumber: string;
  computerGeneratedCode: string;
  firstName: string;
  lastName: string;
  otherNames?: string;
  gender: 'Male' | 'Female';
  dateOfBirth: string;
  nationality: string;
  phoneNumber: string;
  email: string;
  nationalId: string;
  kraPin: string;
  dateOfFirstAppointment: string;
  firstSponsorName: string;
  designation: string;
  dateOfJoining: string;
  nextOfKin: {
    name: string;
    relationship: string;
    phoneNumber: string;
    photograph?: string;
  };
  maritalStatus: 'Single' | 'Married' | 'Separated' | 'Divorced' | 'Widow';
  spouseName?: string;
  childrenUnder21: {
    name: string;
    dateOfBirth: string;
    relationship: string;
  }[];
  payrollNumber: string;
  personalFileNumber: string;
  scannedPhotograph?: string;
  fingerprints?: string;
  expectedRetirementDate: string;
  currentAge: number;
  membershipStatus: 'Active' | 'Inactive' | 'Suspended' | 'Deferred' | 'Retired';
  currentSponsor: string;
  basicSalary: number;
  membershipCardIssueDate?: string;
  membershipCardStatus: 'Issued' | 'Not Issued' | 'Returned' | 'Lost' | 'Damaged';
  previousSponsors: {
    name: string;
    startDate: string;
    endDate: string;
    reason: string;
  }[];
  lastContribution: string;
  accountBalance: number;
  cessationDate?: string;
  cessationReason?: string;
  transferDetails?: string;
  department: string;
  house?: string;
  contributionCategory: string;
  taxExemption?: {
    isExempt: boolean;
    reason: string;
    cutoffDate: string;
    attachments: string[];
  };
  biometrics?: {
    fingerprint: string;
    photograph: string;
    signature: string;
  };
  portalAccess: {
    isEnabled: boolean;
    lastLogin?: string;
    loginCount: number;
    isBlocked: boolean;
    ipAddress?: string;
  };
}

export interface PendingApproval {
  id: string;
  type: 'Profile Update' | 'Beneficiary Change' | 'Claim Submission' | 'Member Registration' | 'Password Reset' | 'Document Upload';
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
  auditTrail: {
    timestamp: string;
    userId: string;
    action: string;
    beforeValue: any;
    afterValue: any;
  }[];
}

export interface SystemIntegration {
  id: string;
  name: string;
  type: 'Financial Management' | 'General Ledger' | 'Accounts Receivable' | 'Accounts Payable' | 'Cash Management' | 'Document Management' | 'Mobile App' | 'Social Media';
  status: 'Connected' | 'Disconnected' | 'Error';
  lastSync: string;
  apiEndpoint: string;
  configuration: any;
}

export interface QuarterlyReport {
  id: string;
  quarter: string;
  year: number;
  generatedDate: string;
  generatedBy: string;
  sections: {
    membershipSummary: any;
    contributionAnalysis: any;
    claimsProcessed: any;
    financialPosition: any;
    investmentPerformance: any;
    complianceStatus: any;
  };
  boardPresentationDate?: string;
  status: 'Draft' | 'Final' | 'Presented';
}

export interface VotingSession {
  id: string;
  title: string;
  description: string;
  type: 'Trustee Election' | 'AGM' | 'Scheme Agenda';
  startDate: string;
  endDate: string;
  isActive: boolean;
  candidates: {
    id: string;
    name: string;
    position: string;
    votes: number;
    percentage: number;
  }[];
  eligibleVoters: string[];
  votingMethods: ('Web' | 'USSD')[];
  ussdShortCode?: string;
  maxSelections: number;
  results: {
    totalVotes: number;
    webVotes: number;
    ussdVotes: number;
    byLocation: any[];
    byTime: any[];
  };
  realTimeResults: boolean;
}

export interface VotingRecord {
  id: string;
  sessionId: string;
  memberId: string;
  memberNumber: string;
  votedCandidates: string[];
  timestamp: string;
  method: 'Web' | 'USSD';
  mobileNumber: string;
  gpsLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  ipAddress: string;
  deviceInfo: string;
}

export interface BulkOperation {
  id: string;
  type: 'Member Import' | 'Contribution Upload' | 'Salary Update' | 'Status Change' | 'Statement Generation' | 'Retirement Processing';
  fileName: string;
  uploadedBy: string;
  uploadedDate: string;
  status: 'Processing' | 'Completed' | 'Failed' | 'Pending Review' | 'Validation Error';
  totalRecords: number;
  processedRecords: number;
  failedRecords: number;
  validationErrors: string[];
  processingLog: string[];
  requiresApproval: boolean;
  approvedBy?: string;
  approvedDate?: string;
}

export interface SystemAlert {
  id: string;
  type: 'Medical Overdue' | 'Contribution Missing' | 'Document Expiry' | 'System Error' | 'Tax Exemption Renewal' | 'Member Portal Access' | 'Voting Reminder';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  message: string;
  memberId?: string;
  createdDate: string;
  isRead: boolean;
  actionRequired: boolean;
  assignedTo?: string;
  resolvedDate?: string;
  resolution?: string;
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
  registeredContributions: number;
  unregisteredContributions: number;
  avcContributions: number;
}

export interface MemberPortalUsage {
  memberId: string;
  memberName: string;
  loginCount: number;
  lastLogin: string;
  activeSession: boolean;
  ipAddress: string;
  deviceType: string;
  location: string;
  features: {
    statementsViewed: number;
    beneficiariesUpdated: number;
    paymentsInitiated: number;
    documentsDownloaded: number;
  };
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: {
    id: string;
    type: 'multiple_choice' | 'text' | 'rating' | 'yes_no';
    question: string;
    options?: string[];
    required: boolean;
  }[];
  targetMembers: string[];
  startDate: string;
  endDate: string;
  status: 'Draft' | 'Active' | 'Completed';
  responses: {
    memberId: string;
    answers: any[];
    submittedDate: string;
  }[];
  analytics: {
    responseRate: number;
    completionRate: number;
    results: any[];
  };
}

export interface SchemeConfiguration {
  id: string;
  schemeName: string;
  schemeType: 'DB' | 'DC';
  isLocked: boolean;
  settings: {
    retirementAge: number;
    taxExemptionAge: number;
    contributionRates: {
      employee: number;
      employer: number;
    };
    medicalLimits: {
      inpatient: number;
      outpatient: number;
    };
    votingSettings: {
      maxCandidates: number;
      votingMethods: string[];
      ussdCode?: string;
    };
  };
  integrations: SystemIntegration[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  recordId: string;
  beforeValue: any;
  afterValue: any;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
}