import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { 
  Member, 
  Beneficiary, 
  Contribution, 
  Sponsor, 
  Claim, 
  MedicalClaim, 
  User, 
  VotingSession, 
  AuditLog, 
  PendingApproval, 
  BulkOperation, 
  SystemAlert 
} from '../types';

// Member Schema
const memberSchema = new Schema<Member>({
  memberNumber: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  otherNames: { type: String },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  dateOfBirth: { type: Date, required: true },
  nationality: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  nationalId: { type: String, required: true, unique: true },
  kraPin: { type: String, required: true },
  dateOfJoining: { type: Date, required: true },
  designation: { type: String, required: true },
  maritalStatus: { 
    type: String, 
    enum: ['Single', 'Married', 'Separated', 'Divorced', 'Widow'], 
    required: true 
  },
  spouseName: { type: String },
  basicSalary: { type: Number, required: true },
  membershipStatus: { 
    type: String, 
    enum: ['Active', 'Inactive', 'Suspended'], 
    default: 'Active' 
  },
  contributionRate: { type: Number, required: true, default: 8.0 },
  sponsorContributionRate: { type: Number, required: true, default: 8.67 },
  medicalLimitInpatient: { type: Number, required: true, default: 100000 },
  medicalLimitOutpatient: { type: Number, required: true, default: 50000 },
  exGratia: { type: Number, default: 0 },
  accountBalance: { type: Number, default: 0 },
  lastContribution: { type: Date },
  expectedRetirement: { type: Date },
  profilePicture: { type: String },
  updatedBy: { type: String, required: true }
}, {
  timestamps: true
});

// Beneficiary Schema
const beneficiarySchema = new Schema<Beneficiary>({
  memberId: { type: String, required: true, ref: 'Member' },
  name: { type: String, required: true },
  relationship: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  idNumber: { type: String, required: true },
  percentage: { type: Number, required: true, min: 0, max: 100 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Contribution Schema
const contributionSchema = new Schema<Contribution>({
  memberId: { type: String, required: true, ref: 'Member' },
  memberNumber: { type: String, required: true },
  sponsorId: { type: String, required: true, ref: 'Sponsor' },
  sponsorCode: { type: String, required: true },
  sponsorName: { type: String, required: true },
  period: { type: String, required: true },
  department: { type: String, required: true },
  basicSalary: { type: Number, required: true },
  employeeContribution: { type: Number, required: true },
  employeeContributionRate: { type: Number, required: true },
  employerContribution: { type: Number, required: true },
  employerContributionRate: { type: Number, required: true },
  additionalVoluntary: { type: Number, default: 0 },
  totalContribution: { type: Number, required: true },
  cumulativeEmployeeContribution: { type: Number, required: true },
  cumulativeEmployerContribution: { type: Number, required: true },
  cumulativeTotal: { type: Number, required: true },
  contributionType: { 
    type: String, 
    enum: ['Registered', 'Unregistered'], 
    required: true 
  },
  paymentMethod: { 
    type: String, 
    enum: ['Cheque', 'Bank Transfer', 'MPESA', 'Standing Order', 'Cash', 'EDI'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Rejected', 'On Hold', 'Reconciled'], 
    default: 'Pending' 
  },
  receiptNumber: { type: String },
  chequeNumber: { type: String },
  bankDetails: { type: String },
  custodianBank: { type: String },
  receiptDate: { type: Date },
  reconciliationStatus: { 
    type: String, 
    enum: ['Pending', 'Matched', 'Discrepancy', 'Resolved'], 
    default: 'Pending' 
  },
  discrepancyReason: { type: String },
  previousMonthAmount: { type: Number },
  difference: { type: Number },
  isAllocated: { type: Boolean, default: false },
  processedBy: { type: String },
  approvedBy: { type: String }
}, {
  timestamps: true
});

// Sponsor Schema
const sponsorSchema = new Schema<Sponsor>({
  sponsorCode: { type: String, required: true, unique: true },
  sponsorName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  totalEmployees: { type: Number, required: true },
  activeMembers: { type: Number, required: true },
  standardEmployeeRate: { type: Number, required: true, default: 8.0 },
  standardEmployerRate: { type: Number, required: true, default: 8.67 },
  paymentMethod: { type: String, required: true },
  bankDetails: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Active', 'Inactive', 'Suspended'], 
    default: 'Active' 
  },
  lastContributionDate: { type: Date },
  totalContributions: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Claim Schema
const claimSchema = new Schema<Claim>({
  memberId: { type: String, required: true, ref: 'Member' },
  memberNumber: { type: String, required: true },
  memberName: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  previousNames: { type: String },
  nationalId: { type: String, required: true },
  kraPin: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  permanentAddress: { type: String, required: true },
  claimFormNumber: { type: String, required: true, unique: true },
  claimType: { 
    type: String, 
    enum: ['Normal Retirement', 'Early Retirement', 'Death in Service', 'Leaving Service', 'Ill Health'], 
    required: true 
  },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Submitted', 'Under Review', 'Approved', 'Rejected', 'Paid'], 
    default: 'Submitted' 
  },
  submittedDate: { type: Date, required: true },
  processedDate: { type: Date },
  reason: { type: String },
  documents: [{ type: String }],
  bankDetails: {
    bankName: { type: String, required: true },
    branchName: { type: String, required: true },
    accountNumber: { type: String, required: true }
  },
  dateOfClaim: { type: Date, required: true },
  dateOfLeaving: { type: Date },
  causeOfLeaving: { type: String, required: true },
  settlementDate: { type: Date },
  chequeNumber: { type: String },
  dateOfCheque: { type: Date },
  examiner: { type: String },
  rejectionReason: { type: String },
  partialPayments: [{
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    reference: { type: String, required: true },
    status: { type: String, required: true }
  }],
  deathDetails: {
    dateOfDeath: { type: Date },
    causeOfDeath: { type: String },
    beneficiaries: [{ type: String }],
    spouse: { type: String }
  },
  drawDowns: [{
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    purpose: { type: String, required: true },
    beneficiary: { type: String, required: true }
  }]
}, {
  timestamps: true
});

// Medical Claim Schema
const medicalClaimSchema = new Schema<MedicalClaim>({
  memberId: { type: String, required: true, ref: 'Member' },
  claimType: { type: String, enum: ['Inpatient', 'Outpatient'], required: true },
  amount: { type: Number, required: true },
  hospital: { type: String, required: true },
  treatmentDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected', 'Paid'], 
    default: 'Pending' 
  },
  balance: { type: Number, required: true }
}, {
  timestamps: true
});

// User Schema
const userSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Member', 'Admin', 'Pension Officer', 'Approver'], 
    required: true 
  },
  memberId: { type: String, ref: 'Member' },
  permissions: [{ type: String }],
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date }
}, {
  timestamps: true
});

// Define interface for User document methods
interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Voting Session Schema
const votingSessionSchema = new Schema<VotingSession>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  candidates: [{
    name: { type: String, required: true },
    position: { type: String, required: true },
    votes: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 }
  }],
  isActive: { type: Boolean, default: true },
  totalVotes: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Audit Log Schema
const auditLogSchema = new Schema<AuditLog>({
  memberId: { type: String, required: true, ref: 'Member' },
  action: { type: String, required: true },
  beforeValue: { type: Schema.Types.Mixed },
  afterValue: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now },
  userId: { type: String, required: true, ref: 'User' },
  userRole: { type: String, required: true },
  ipAddress: { type: String, required: true },
  userAgent: { type: String, required: true }
}, {
  timestamps: true
});

// Pending Approval Schema
const pendingApprovalSchema = new Schema<PendingApproval>({
  type: { 
    type: String, 
    enum: ['Profile Update', 'Beneficiary Change', 'Claim Submission', 'Member Registration'], 
    required: true 
  },
  memberId: { type: String, required: true, ref: 'Member' },
  memberName: { type: String, required: true },
  submittedBy: { type: String, required: true },
  submittedDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Under Review', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  priority: { 
    type: String, 
    enum: ['High', 'Medium', 'Low'], 
    default: 'Medium' 
  },
  changes: [{
    field: { type: String, required: true },
    oldValue: { type: Schema.Types.Mixed },
    newValue: { type: Schema.Types.Mixed }
  }],
  documents: [{ type: String }],
  reviewedBy: { type: String },
  reviewedDate: { type: Date },
  rejectionReason: { type: String }
}, {
  timestamps: true
});

// Bulk Operation Schema
const bulkOperationSchema = new Schema<BulkOperation>({
  type: { 
    type: String, 
    enum: ['Member Import', 'Contribution Upload', 'Salary Update', 'Status Change'], 
    required: true 
  },
  fileName: { type: String, required: true },
  uploadedBy: { type: String, required: true },
  uploadedDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['Processing', 'Completed', 'Failed', 'Pending Review'], 
    default: 'Processing' 
  },
  totalRecords: { type: Number, required: true },
  processedRecords: { type: Number, default: 0 },
  failedRecords: { type: Number, default: 0 },
  errors: [{ type: String }]
}, {
  timestamps: true
});

// System Alert Schema
const systemAlertSchema = new Schema<SystemAlert>({
  type: { 
    type: String, 
    enum: ['Medical Overdue', 'Contribution Missing', 'Document Expiry', 'System Error'], 
    required: true 
  },
  severity: { 
    type: String, 
    enum: ['Critical', 'High', 'Medium', 'Low'], 
    required: true 
  },
  message: { type: String, required: true },
  memberId: { type: String, ref: 'Member' },
  createdDate: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  actionRequired: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Create indexes for better performance
memberSchema.index({ memberNumber: 1 });
memberSchema.index({ email: 1 });
memberSchema.index({ nationalId: 1 });
memberSchema.index({ membershipStatus: 1 });

contributionSchema.index({ memberId: 1 });
contributionSchema.index({ sponsorId: 1 });
contributionSchema.index({ period: 1 });
contributionSchema.index({ status: 1 });

claimSchema.index({ memberId: 1 });
claimSchema.index({ status: 1 });
claimSchema.index({ claimType: 1 });

auditLogSchema.index({ memberId: 1 });
auditLogSchema.index({ timestamp: -1 });

// Export models
export const MemberModel = mongoose.model<Member>('Member', memberSchema);
export const BeneficiaryModel = mongoose.model<Beneficiary>('Beneficiary', beneficiarySchema);
export const ContributionModel = mongoose.model<Contribution>('Contribution', contributionSchema);
export const SponsorModel = mongoose.model<Sponsor>('Sponsor', sponsorSchema);
export const ClaimModel = mongoose.model<Claim>('Claim', claimSchema);
export const MedicalClaimModel = mongoose.model<MedicalClaim>('MedicalClaim', medicalClaimSchema);
export const UserModel = mongoose.model<User & IUserMethods>('User', userSchema);
export const VotingSessionModel = mongoose.model<VotingSession>('VotingSession', votingSessionSchema);
export const AuditLogModel = mongoose.model<AuditLog>('AuditLog', auditLogSchema);
export const PendingApprovalModel = mongoose.model<PendingApproval>('PendingApproval', pendingApprovalSchema);
export const BulkOperationModel = mongoose.model<BulkOperation>('BulkOperation', bulkOperationSchema);
export const SystemAlertModel = mongoose.model<SystemAlert>('SystemAlert', systemAlertSchema);
