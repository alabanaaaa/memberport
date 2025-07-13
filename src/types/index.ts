export interface Member {
  id: string;
  memberNumber: string;
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
  dateOfJoining: string;
  dateOfDeath?: string;
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
  lastContribution: string;
  expectedRetirement: string;
  profilePicture?: string;
  postalAddress?: string;
  withdrawalHistory: WithdrawalRecord[];
  familyMembers: FamilyMember[];
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
}

export interface WithdrawalRecord {
  id: string;
  memberId: string;
  amount: number;
  type: 'Partial Withdrawal' | 'Emergency Withdrawal' | 'Loan' | 'Advance';
  reason: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Paid';
  approvedBy?: string;
  paymentMethod: string;
  bankReference?: string;
}

export interface FamilyMember {
  id: string;
  memberId: string;
  name: string;
  relationship: string;
  dateOfBirth: string;
  idNumber?: string;
  medicalLimitInpatient: number;
  medicalLimitOutpatient: number;
  medicalExpenditure: number;
  isActive: boolean;
}

export interface FamilyExpenditure {
  id: string;
  memberId: string;
  familyMemberId?: string;
  type: 'Medical' | 'Education' | 'Welfare' | 'Emergency';
  description: string;
  amount: number;
  date: string;
  provider: string;
  receiptNumber: string;
  status: 'Pending' | 'Approved' | 'Paid';
}

export interface HospitalAccount {
  id: string;
  hospitalName: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  address: string;
  accountBalance: number;
  totalClaims: number;
  pendingBills: number;
  overdueAmount: number;
  lastPaymentDate: string;
  paymentTerms: number; // days
  isActive: boolean;
}

export interface HospitalBill {
  id: string;
  hospitalId: string;
  memberId: string;
  familyMemberId?: string;
  billNumber: string;
  amount: number;
  billDate: string;
  dueDate: string;
  status: 'Pending' | 'Approved' | 'Paid' | 'Overdue';
  daysPending: number;
  treatmentType: 'Inpatient' | 'Outpatient';
  diagnosis: string;
}

export interface ContributionPayment {
  id: string;
  memberId: string;
  amount: number;
  type: 'Monthly' | 'Lump Sum' | 'AVC';
  paymentMethod: 'MPESA' | 'Bank Transfer' | 'Cheque' | 'Cash';
  paymentReference: string;
  date: string;
  status: 'Pending' | 'Confirmed' | 'Failed';
  mpesaCode?: string;
  bankReference?: string;
}

export interface Beneficiary {
  id: string;
  memberId: string;
  name: string;
  relationship: string;
  dateOfBirth: string;
  idNumber: string;
  percentage: number;
  isActive: boolean;
  phoneNumber?: string;
  address?: string;
  guardianName?: string;
  guardianContact?: string;
  documents: string[];
  createdAt: string;
}

export interface Contribution {
  id: string;
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
  receiptDate?: string;
  reconciliationStatus: 'Pending' | 'Matched' | 'Discrepancy' | 'Resolved';
  discrepancyReason?: string;
  previousMonthAmount?: number;
  difference?: number;
  isAllocated: boolean;
  createdAt: string;
  processedBy?: string;
  approvedBy?: string;
}

export interface Sponsor {
  id: string;
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
  lastContributionDate: string;
  totalContributions: number;
  createdAt: string;
}

export interface ContributionSchedule {
  id: string;
  sponsorId: string;
  sponsorCode: string;
  period: string;
  totalEmployees: number;
  totalEmployeeContribution: number;
  totalEmployerContribution: number;
  totalAVC: number;
  grandTotal: number;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Posted';
  submittedDate: string;
  submittedBy: string;
  reviewedBy?: string;
  reviewedDate?: string;
  contributions: Contribution[];
  reconciliationNotes?: string;
  discrepancies: {
    type: 'New Employee' | 'Salary Change' | 'Retirement' | 'Termination' | 'Rate Change';
    memberId: string;
    memberName: string;
    description: string;
    previousValue: any;
    currentValue: any;
  }[];
}

export interface Claim {
  id: string;
  memberId: string;
  memberNumber: string;
  memberName: string;
  gender: 'Male' | 'Female';
  previousNames?: string;
  nationalId: string;
  kraPin: string;
  dateOfBirth: string;
  permanentAddress: string;
  claimFormNumber: string;
  claimType: 'Normal Retirement' | 'Early Retirement' | 'Death in Service' | 'Leaving Service' | 'Ill Health';
  amount: number;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Paid';
  submittedDate: string;
  processedDate?: string;
  reason?: string;
  documents: string[];
  bankDetails: {
    bankName: string;
    branchName: string;
    accountNumber: string;
  };
  dateOfClaim: string;
  dateOfLeaving?: string;
  causeOfLeaving: string;
  settlementDate?: string;
  chequeNumber?: string;
  dateOfCheque?: string;
  examiner?: string;
  rejectionReason?: string;
  partialPayments: {
    id: string;
    amount: number;
    date: string;
    reference: string;
    status: string;
  }[];
  deathDetails?: {
    dateOfDeath: string;
    causeOfDeath: string;
    beneficiaries: string[];
    spouse?: string;
  };
  drawDowns: {
    id: string;
    amount: number;
    date: string;
    purpose: string;
    beneficiary: string;
  }[];
}

export interface MedicalClaim {
  id: string;
  memberId: string;
  claimType: 'Inpatient' | 'Outpatient';
  amount: number;
  hospital: string;
  treatmentDate: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Paid';
  balance: number;
  createdAt: string;
}

export interface VotingSession {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  candidates: Candidate[];
  isActive: boolean;
  totalVotes: number;
}

export interface Candidate {
  id: string;
  name: string;
  position: string;
  votes: number;
  percentage: number;
}

export interface AuditLog {
  id: string;
  memberId: string;
  action: string;
  beforeValue: any;
  afterValue: any;
  timestamp: string;
  userId: string;
  userRole: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Member' | 'Admin' | 'Pension Officer' | 'Approver';
  memberId?: string;
}