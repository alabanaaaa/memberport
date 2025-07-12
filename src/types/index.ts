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
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
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
  createdAt: string;
}

export interface Contribution {
  id: string;
  memberId: string;
  period: string;
  employeeContribution: number;
  employerContribution: number;
  additionalVoluntary: number;
  totalContribution: number;
  paymentMethod: 'Cheque' | 'Bank Transfer' | 'MPESA' | 'Standing Order';
  status: 'Pending' | 'Confirmed' | 'Rejected';
  createdAt: string;
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