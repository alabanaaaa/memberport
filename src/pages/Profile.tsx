import React, { useState } from 'react';
import { Card } from '../components/Common/Card';
import { Button } from '../components/Common/Button';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  Edit2, 
  Save, 
  X,
  Upload,
  Eye,
  Download,
  DollarSign,
  Heart,
  Users,
  FileText,
  CreditCard,
  Smartphone,
  Building2
} from 'lucide-react';

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('personal');
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    otherNames: 'Michael',
    email: 'john.doe@example.com',
    phoneNumber: '+254 712 345 678',
    nationalId: '12345678',
    kraPin: 'A123456789A',
    designation: 'Senior Software Engineer',
    basicSalary: 150000,
    postalAddress: 'P.O. Box 123, Nairobi',
    nextOfKin: 'Jane Doe',
    nextOfKinPhone: '+254 722 123 456',
    maritalStatus: 'Married',
    spouseName: 'Jane Doe',
    dateOfJoining: '2020-01-15',
    contributionRate: 8.0,
    sponsorContributionRate: 8.67,
    medicalLimitInpatient: 150000,
    medicalLimitOutpatient: 50000,
    exGratia: 500000
  });

  const [pendingChanges, setPendingChanges] = useState([
    {
      id: 1,
      field: 'Phone Number',
      currentValue: '+254 712 345 678',
      newValue: '+254 712 345 679',
      status: 'Pending Approval',
      submittedDate: '2024-01-10',
      reason: 'Phone number change request'
    }
  ]);

  const withdrawalHistory = [
    {
      id: 'WD-001',
      amount: 50000,
      type: 'Emergency Withdrawal',
      reason: 'Medical emergency',
      date: '2024-01-10',
      status: 'Approved',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 'WD-002',
      amount: 25000,
      type: 'Partial Withdrawal',
      reason: 'School fees',
      date: '2023-12-15',
      status: 'Paid',
      paymentMethod: 'MPESA'
    }
  ];

  const familyMembers = [
    {
      id: 'F001',
      name: 'Jane Doe',
      relationship: 'Spouse',
      dateOfBirth: '1985-03-15',
      medicalLimitInpatient: 150000,
      medicalLimitOutpatient: 50000,
      medicalExpenditure: 25000
    },
    {
      id: 'F002',
      name: 'John Doe Jr.',
      relationship: 'Child',
      dateOfBirth: '2010-08-22',
      medicalLimitInpatient: 100000,
      medicalLimitOutpatient: 30000,
      medicalExpenditure: 15000
    }
  ];

  const familyExpenditure = [
    {
      id: 'EXP-001',
      familyMember: 'Jane Doe',
      type: 'Medical',
      description: 'Hospital visit - Nairobi Hospital',
      amount: 15000,
      date: '2024-01-15',
      status: 'Approved'
    },
    {
      id: 'EXP-002',
      familyMember: 'John Doe Jr.',
      type: 'Education',
      description: 'School fees payment',
      amount: 45000,
      date: '2024-01-10',
      status: 'Paid'
    }
  ];

  const accountSummary = {
    totalBalance: 2456789,
    employeeContributions: 1200000,
    employerContributions: 1256789,
    interestEarned: 156789,
    totalWithdrawals: 75000,
    availableForWithdrawal: 2381789
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving changes:', formData);
    setIsEditing(false);
    setPendingChanges(prev => [...prev, {
      id: prev.length + 1,
      field: 'Profile Update',
      currentValue: 'Current profile data',
      newValue: 'Updated profile data',
      status: 'Pending Approval',
      submittedDate: new Date().toISOString().split('T')[0],
      reason: 'Profile information update'
    }]);
  };

  const WithdrawalModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Request Withdrawal</h3>
          <Button variant="secondary" size="sm" onClick={() => setShowWithdrawalModal(false)}>×</Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Withdrawal Type</label>
            <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Emergency Withdrawal</option>
              <option>Partial Withdrawal</option>
              <option>Loan Against Contributions</option>
              <option>Advance Payment</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (KES)</label>
            <input type="number" placeholder="Enter amount" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
            <textarea rows={3} placeholder="Explain the reason for withdrawal" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Supporting Documents</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Upload supporting documents</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button className="flex-1">Submit Request</Button>
            <Button variant="secondary" onClick={() => setShowWithdrawalModal(false)}>Cancel</Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const PaymentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Make Contribution Payment</h3>
          <Button variant="secondary" size="sm" onClick={() => setShowPaymentModal(false)}>×</Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
            <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Monthly Contribution</option>
              <option>Lump Sum Payment</option>
              <option>Additional Voluntary Contribution (AVC)</option>
              <option>Catch-up Payment</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (KES)</label>
            <input type="number" placeholder="Enter amount" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="radio" name="paymentMethod" value="mpesa" className="mr-2" />
                <Smartphone className="h-4 w-4 mr-2" />
                MPESA
              </label>
              <label className="flex items-center">
                <input type="radio" name="paymentMethod" value="bank" className="mr-2" />
                <Building2 className="h-4 w-4 mr-2" />
                Bank Transfer
              </label>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button className="flex-1">Proceed to Payment</Button>
            <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>Cancel</Button>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Member Profile</h1>
        <div className="flex space-x-2">
          <Button onClick={() => setShowPaymentModal(true)} className="flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            Make Payment
          </Button>
          <Button onClick={() => setShowWithdrawalModal(true)} variant="secondary" className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />
            Request Withdrawal
          </Button>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="flex items-center">
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button onClick={handleSave} variant="success" className="flex items-center">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="secondary" className="flex items-center">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['personal', 'account', 'family', 'withdrawals', 'statements'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                selectedTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Personal Information Tab */}
      {selectedTab === 'personal' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <div className="text-center">
              <div className="mx-auto h-32 w-32 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4">
                {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{formData.firstName} {formData.lastName}</h2>
              <p className="text-gray-600">{formData.designation}</p>
              <p className="text-sm text-gray-500">Member ID: M001234</p>
              {isEditing && (
                <Button variant="secondary" size="sm" className="mt-4">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                </Button>
              )}
            </div>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} disabled={!isEditing} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} disabled={!isEditing} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Other Names</label>
                  <input type="text" name="otherNames" value={formData.otherNames} onChange={handleInputChange} disabled={!isEditing} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} disabled={!isEditing} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} disabled={!isEditing} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Joining</label>
                  <input type="date" name="dateOfJoining" value={formData.dateOfJoining} onChange={handleInputChange} disabled={!isEditing} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Address (Optional)</label>
                  <textarea name="postalAddress" value={formData.postalAddress} onChange={handleInputChange} disabled={!isEditing} rows={2} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Contribution & Medical Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Member Contribution Rate (%)</label>
                  <input type="number" name="contributionRate" value={formData.contributionRate} onChange={handleInputChange} disabled={!isEditing} step="0.1" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sponsor Contribution Rate (%)</label>
                  <input type="number" name="sponsorContributionRate" value={formData.sponsorContributionRate} onChange={handleInputChange} disabled={!isEditing} step="0.1" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medical Limit - Inpatient (KES)</label>
                  <input type="number" name="medicalLimitInpatient" value={formData.medicalLimitInpatient} onChange={handleInputChange} disabled={!isEditing} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medical Limit - Outpatient (KES)</label>
                  <input type="number" name="medicalLimitOutpatient" value={formData.medicalLimitOutpatient} onChange={handleInputChange} disabled={!isEditing} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ex-gratia Amount (KES)</label>
                  <input type="number" name="exGratia" value={formData.exGratia} onChange={handleInputChange} disabled={!isEditing} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Account Summary Tab */}
      {selectedTab === 'account' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Balance</p>
                  <p className="text-2xl font-bold text-gray-900">KES {accountSummary.totalBalance.toLocaleString()}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Employee Contributions</p>
                  <p className="text-2xl font-bold text-gray-900">KES {accountSummary.employeeContributions.toLocaleString()}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Employer Contributions</p>
                  <p className="text-2xl font-bold text-gray-900">KES {accountSummary.employerContributions.toLocaleString()}</p>
                </div>
              </div>
            </Card>
          </div>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Account Statement Options</h3>
              <div className="flex space-x-2">
                <Button variant="secondary" className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Quarterly Statement
                </Button>
                <Button variant="secondary" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Annual Statement
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statement Period</label>
                <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Q4 2023 (Oct-Dec)</option>
                  <option>Q3 2023 (Jul-Sep)</option>
                  <option>Q2 2023 (Apr-Jun)</option>
                  <option>Q1 2023 (Jan-Mar)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statement Type</label>
                <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Member & Dependants</option>
                  <option>Member Only</option>
                  <option>Family Summary</option>
                  <option>Medical Expenditure</option>
                </select>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Family & Expenditure Tab */}
      {selectedTab === 'family' && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Family Members</h3>
              <Button className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Add Family Member
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Relationship</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medical Limit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expenditure</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {familyMembers.map((member) => (
                    <tr key={member.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.relationship}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        KES {(member.medicalLimitInpatient + member.medicalLimitOutpatient).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        KES {member.medicalExpenditure.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        KES {((member.medicalLimitInpatient + member.medicalLimitOutpatient) - member.medicalExpenditure).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Family Expenditure</h3>
              <div className="flex space-x-2">
                <Button variant="secondary" className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Export Excel
                </Button>
                <Button className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Add Expenditure
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Family Member</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {familyExpenditure.map((expense) => (
                    <tr key={expense.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expense.familyMember}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        KES {expense.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          expense.status === 'Paid' ? 'bg-green-100 text-green-800' :
                          expense.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {expense.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Withdrawals Tab */}
      {selectedTab === 'withdrawals' && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Withdrawal History</h3>
              <Button onClick={() => setShowWithdrawalModal(true)} className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Request Withdrawal
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {withdrawalHistory.map((withdrawal) => (
                    <tr key={withdrawal.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{withdrawal.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{withdrawal.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        KES {withdrawal.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{withdrawal.reason}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{withdrawal.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          withdrawal.status === 'Paid' ? 'bg-green-100 text-green-800' :
                          withdrawal.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {withdrawal.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Button variant="secondary" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Statements Tab */}
      {selectedTab === 'statements' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Quarterly Statement', description: 'Complete quarterly contribution and balance statement' },
              { name: 'Annual Statement', description: 'Comprehensive annual account summary' },
              { name: 'Family Medical Statement', description: 'Medical expenditure and balance per family member' },
              { name: 'Contribution History', description: 'Detailed contribution payment history' },
              { name: 'Withdrawal Statement', description: 'All withdrawal transactions and approvals' },
              { name: 'Tax Certificate', description: 'Annual tax relief certificate for contributions' }
            ].map((statement, index) => (
              <Card key={index} className="transition-transform hover:scale-105 cursor-pointer">
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">{statement.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{statement.description}</p>
                  <div className="flex space-x-2">
                    <Button variant="secondary" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Pending Changes */}
      {pendingChanges.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Pending Approval Changes</h3>
          <div className="space-y-3">
            {pendingChanges.map((change) => (
              <div key={change.id} className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{change.field}</p>
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                      {change.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{change.reason}</p>
                  <p className="text-xs text-gray-500 mt-1">Submitted: {change.submittedDate}</p>
                </div>
                <Button variant="secondary" size="sm" className="ml-4">
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Modals */}
      {showWithdrawalModal && <WithdrawalModal />}
      {showPaymentModal && <PaymentModal />}
    </div>
  );
};

export default Profile;