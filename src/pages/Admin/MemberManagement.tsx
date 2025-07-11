import React, { useState } from 'react';
import { Card } from '../../components/Common/Card';
import { Button } from '../../components/Common/Button';
import { Table } from '../../components/Common/Table';
import { StatusBadge } from '../../components/Common/StatusBadge';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Edit2,
  Eye,
  UserX,
  UserCheck,
  Mail,
  Phone
} from 'lucide-react';

const MemberManagement: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const membersData = [
    {
      id: 'M001234',
      memberNumber: 'M001234',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '+254 712 345 678',
      dateOfJoining: '2020-01-15',
      designation: 'Senior Software Engineer',
      basicSalary: 150000,
      membershipStatus: 'Active',
      accountBalance: 2456789,
      lastContribution: '2024-01-15',
      sponsor: 'ABC Company Ltd'
    },
    {
      id: 'M001235',
      memberNumber: 'M001235',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phoneNumber: '+254 722 123 456',
      dateOfJoining: '2019-03-20',
      designation: 'Marketing Manager',
      basicSalary: 120000,
      membershipStatus: 'Active',
      accountBalance: 3245678,
      lastContribution: '2024-01-15',
      sponsor: 'XYZ Corporation'
    },
    {
      id: 'M001236',
      memberNumber: 'M001236',
      firstName: 'Robert',
      lastName: 'Johnson',
      email: 'robert.johnson@example.com',
      phoneNumber: '+254 733 987 654',
      dateOfJoining: '2021-06-10',
      designation: 'Financial Analyst',
      basicSalary: 95000,
      membershipStatus: 'Inactive',
      accountBalance: 1234567,
      lastContribution: '2023-12-15',
      sponsor: 'DEF Industries'
    }
  ];

  const memberStats = [
    { name: 'Total Members', value: 2500, color: 'text-blue-600' },
    { name: 'Active Members', value: 2350, color: 'text-green-600' },
    { name: 'Inactive Members', value: 120, color: 'text-orange-600' },
    { name: 'Suspended Members', value: 30, color: 'text-red-600' }
  ];

  const columns = [
    { key: 'memberNumber', label: 'Member No.', sortable: true },
    { 
      key: 'name', 
      label: 'Name', 
      sortable: true,
      render: (value: any, row: any) => `${row.firstName} ${row.lastName}`
    },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phoneNumber', label: 'Phone', sortable: true },
    { key: 'designation', label: 'Designation', sortable: true },
    { 
      key: 'basicSalary', 
      label: 'Salary', 
      sortable: true,
      render: (value: number) => `KES ${value.toLocaleString()}`
    },
    { 
      key: 'membershipStatus', 
      label: 'Status', 
      render: (value: string) => <StatusBadge status={value} />
    },
    { 
      key: 'accountBalance', 
      label: 'Balance', 
      sortable: true,
      render: (value: number) => `KES ${value.toLocaleString()}`
    },
    { 
      key: 'actions', 
      label: 'Actions',
      render: (value: any, row: any) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSelectedMember(row)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm">
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm">
            <Mail className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const filteredMembers = membersData.filter(member => {
    if (selectedTab === 'all') return true;
    return member.membershipStatus.toLowerCase() === selectedTab;
  });

  const AddMemberModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Add New Member</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowAddMemberModal(false)}
          >
            ×
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Personal Information</h4>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="First Name"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Other Names"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input
                type="date"
                placeholder="Date of Birth"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="National ID"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="KRA PIN"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Contact & Employment</h4>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Designation"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Basic Salary"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                placeholder="Date of Joining"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Sponsor</option>
                <option value="ABC Company Ltd">ABC Company Ltd</option>
                <option value="XYZ Corporation">XYZ Corporation</option>
                <option value="DEF Industries">DEF Industries</option>
              </select>
              <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Marital Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Separated">Separated</option>
                <option value="Divorced">Divorced</option>
                <option value="Widow">Widow</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 flex space-x-2">
          <Button className="flex-1">Add Member</Button>
          <Button variant="secondary" onClick={() => setShowAddMemberModal(false)}>
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );

  const MemberDetailsModal = ({ member }: any) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Member Details</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSelectedMember(null)}
          >
            ×
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="text-center">
              <div className="mx-auto h-24 w-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                {member.firstName.charAt(0)}{member.lastName.charAt(0)}
              </div>
              <h4 className="text-xl font-bold">{member.firstName} {member.lastName}</h4>
              <p className="text-gray-600">{member.designation}</p>
              <StatusBadge status={member.membershipStatus} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">Member No:</span>
                <p>{member.memberNumber}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Email:</span>
                <p>{member.email}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Phone:</span>
                <p>{member.phoneNumber}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Joining Date:</span>
                <p>{member.dateOfJoining}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Basic Salary:</span>
                <p>KES {member.basicSalary.toLocaleString()}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Account Balance:</span>
                <p>KES {member.accountBalance.toLocaleString()}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Sponsor:</span>
                <p>{member.sponsor}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Last Contribution:</span>
                <p>{member.lastContribution}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex space-x-2">
          <Button>Edit Member</Button>
          <Button variant="secondary">Send Message</Button>
          <Button variant="secondary">Generate Statement</Button>
          <Button variant="secondary" onClick={() => setSelectedMember(null)}>
            Close
          </Button>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Member Management</h1>
        <div className="flex space-x-2">
          <Button variant="secondary" className="flex items-center">
            <Upload className="h-4 w-4 mr-2" />
            Import Members
          </Button>
          <Button variant="secondary" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddMemberModal(true)} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {memberStats.map((stat) => (
          <Card key={stat.name}>
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Users className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search members..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button variant="secondary" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          
          <div className="flex space-x-1">
            {['all', 'active', 'inactive', 'suspended'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-md capitalize ${
                  selectedTab === tab
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <Table columns={columns} data={filteredMembers} />
      </Card>

      {/* Modals */}
      {showAddMemberModal && <AddMemberModal />}
      {selectedMember && <MemberDetailsModal member={selectedMember} />}
    </div>
  );
};

export default MemberManagement;