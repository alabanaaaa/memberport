import React, { useState } from 'react';
import { Card } from '../components/Common/Card';
import { Button } from '../components/Common/Button';
import { Table } from '../components/Common/Table';
import { StatusBadge } from '../components/Common/StatusBadge';
import { 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  Download,
  Upload,
  Eye,
  FileText
} from 'lucide-react';

const Beneficiaries: React.FC = () => {
  const [showAddBeneficiaryModal, setShowAddBeneficiaryModal] = useState(false);
  const [editingBeneficiary, setEditingBeneficiary] = useState<any>(null);

  const beneficiariesData = [
    {
      id: 1,
      name: 'Jane Doe',
      relationship: 'Spouse',
      dateOfBirth: '1985-03-15',
      idNumber: '87654321',
      percentage: 60,
      status: 'Active',
      lastUpdated: '2024-01-01'
    },
    {
      id: 2,
      name: 'John Doe Jr.',
      relationship: 'Child',
      dateOfBirth: '2010-08-22',
      idNumber: '12345678',
      percentage: 25,
      status: 'Active',
      lastUpdated: '2024-01-01'
    },
    {
      id: 3,
      name: 'Mary Doe',
      relationship: 'Child',
      dateOfBirth: '2012-12-10',
      idNumber: '98765432',
      percentage: 15,
      status: 'Active',
      lastUpdated: '2024-01-01'
    }
  ];

  const relationships = [
    'Spouse',
    'Child',
    'Parent',
    'Sibling',
    'Guardian',
    'Other'
  ];

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'relationship', label: 'Relationship', sortable: true },
    { key: 'dateOfBirth', label: 'Date of Birth', sortable: true },
    { key: 'idNumber', label: 'ID Number', sortable: true },
    { 
      key: 'percentage', 
      label: 'Percentage', 
      sortable: true,
      render: (value: number) => `${value}%`
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
            onClick={() => setEditingBeneficiary(row)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="danger" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const BeneficiaryForm = ({ beneficiary, onClose }: any) => {
    const [formData, setFormData] = useState({
      name: beneficiary?.name || '',
      relationship: beneficiary?.relationship || '',
      dateOfBirth: beneficiary?.dateOfBirth || '',
      idNumber: beneficiary?.idNumber || '',
      percentage: beneficiary?.percentage || 0,
      phoneNumber: beneficiary?.phoneNumber || '',
      address: beneficiary?.address || ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Handle form submission
      console.log('Submitting beneficiary:', formData);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">
              {beneficiary ? 'Edit Beneficiary' : 'Add New Beneficiary'}
            </h3>
            <Button variant="secondary" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relationship *
                </label>
                <select
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select relationship</option>
                  {relationships.map(rel => (
                    <option key={rel} value={rel}>{rel}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Number *
                </label>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Percentage Allocation *
                </label>
                <input
                  type="number"
                  name="percentage"
                  value={formData.percentage}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supporting Documents
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600">
                  Upload ID copy, birth certificate, or relationship affidavit
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, JPG, PNG files up to 10MB each
                </p>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button type="submit" className="flex-1">
                {beneficiary ? 'Update Beneficiary' : 'Add Beneficiary'}
              </Button>
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  };

  const totalPercentage = beneficiariesData.reduce((sum, b) => sum + b.percentage, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Beneficiaries</h1>
        <div className="flex space-x-2">
          <Button variant="secondary" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Download Form
          </Button>
          <Button onClick={() => setShowAddBeneficiaryModal(true)} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Beneficiary
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Beneficiaries</p>
              <p className="text-2xl font-bold text-gray-900">{beneficiariesData.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Allocation Total</p>
              <p className="text-2xl font-bold text-gray-900">{totalPercentage}%</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${totalPercentage === 100 ? 'bg-green-100' : 'bg-orange-100'}`}>
              <Eye className={`h-6 w-6 ${totalPercentage === 100 ? 'text-green-600' : 'text-orange-600'}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalPercentage === 100 ? 'Complete' : 'Incomplete'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Allocation Warning */}
      {totalPercentage !== 100 && (
        <Card className="border-orange-200 bg-orange-50">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FileText className="h-5 w-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-orange-800">
                Allocation Warning
              </p>
              <p className="text-sm text-orange-700">
                Total beneficiary allocation is {totalPercentage}%. It should equal 100% for complete coverage.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Beneficiaries Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Beneficiary Details</h3>
          <Button variant="secondary" size="sm" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
        <Table columns={columns} data={beneficiariesData} />
      </Card>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Important Instructions</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• All beneficiary changes must be submitted through this portal</li>
          <li>• Changes require approval from the Pension Officer</li>
          <li>• Required documents: ID copy, birth certificate, relationship affidavit</li>
          <li>• Total percentage allocation must equal 100%</li>
          <li>• Download the beneficiary form, sign it, and upload the scanned copy</li>
        </ul>
      </Card>

      {/* Add/Edit Beneficiary Modal */}
      {showAddBeneficiaryModal && (
        <BeneficiaryForm onClose={() => setShowAddBeneficiaryModal(false)} />
      )}
      
      {editingBeneficiary && (
        <BeneficiaryForm 
          beneficiary={editingBeneficiary} 
          onClose={() => setEditingBeneficiary(null)} 
        />
      )}
    </div>
  );
};

export default Beneficiaries;