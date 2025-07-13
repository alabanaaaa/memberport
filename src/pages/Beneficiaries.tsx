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
  FileText,
  Phone,
  MapPin,
  User,
  Calendar,
  CreditCard,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const Beneficiaries: React.FC = () => {
  const [showAddBeneficiaryModal, setShowAddBeneficiaryModal] = useState(false);
  const [editingBeneficiary, setEditingBeneficiary] = useState<any>(null);
  const [showFormDownload, setShowFormDownload] = useState(false);

  const beneficiariesData = [
    {
      id: 1,
      name: 'Jane Doe',
      relationship: 'Spouse',
      dateOfBirth: '1985-03-15',
      idNumber: '87654321',
      percentage: 60,
      status: 'Active',
      phoneNumber: '+254 722 123 456',
      address: 'P.O. Box 456, Nairobi',
      guardianName: '',
      guardianContact: '',
      documents: ['id_copy.pdf', 'marriage_certificate.pdf'],
      lastUpdated: '2024-01-01',
      approvalStatus: 'Approved'
    },
    {
      id: 2,
      name: 'John Doe Jr.',
      relationship: 'Child',
      dateOfBirth: '2010-08-22',
      idNumber: '12345678',
      percentage: 25,
      status: 'Active',
      phoneNumber: '',
      address: 'P.O. Box 456, Nairobi',
      guardianName: 'Jane Doe',
      guardianContact: '+254 722 123 456',
      documents: ['birth_certificate.pdf', 'guardian_affidavit.pdf'],
      lastUpdated: '2024-01-01',
      approvalStatus: 'Approved'
    },
    {
      id: 3,
      name: 'Mary Doe',
      relationship: 'Child',
      dateOfBirth: '2012-12-10',
      idNumber: '98765432',
      percentage: 15,
      status: 'Pending Approval',
      phoneNumber: '',
      address: 'P.O. Box 456, Nairobi',
      guardianName: 'Jane Doe',
      guardianContact: '+254 722 123 456',
      documents: ['birth_certificate.pdf'],
      lastUpdated: '2024-01-15',
      approvalStatus: 'Pending'
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
      key: 'approvalStatus', 
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
            <Eye className="h-4 w-4" />
          </Button>
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
      address: beneficiary?.address || '',
      guardianName: beneficiary?.guardianName || '',
      guardianContact: beneficiary?.guardianContact || ''
    });

    const [uploadedDocuments, setUploadedDocuments] = useState<string[]>(beneficiary?.documents || []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Submitting beneficiary:', formData);
      onClose();
    };

    const isMinor = () => {
      if (!formData.dateOfBirth) return false;
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age < 18;
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">
              {beneficiary ? 'Edit Beneficiary' : 'Add New Beneficiary'}
            </h3>
            <Button variant="secondary" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Personal Information</h4>
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
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Contact Information</h4>
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

                {/* Guardian Information for Minors */}
                {isMinor() && (
                  <>
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                        <span className="text-sm text-yellow-800">
                          Guardian information required for beneficiaries under 18 years
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Guardian Name *
                      </label>
                      <input
                        type="text"
                        name="guardianName"
                        value={formData.guardianName}
                        onChange={handleInputChange}
                        required={isMinor()}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Guardian Contact *
                      </label>
                      <input
                        type="tel"
                        name="guardianContact"
                        value={formData.guardianContact}
                        onChange={handleInputChange}
                        required={isMinor()}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Supporting Documents */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Supporting Documents</h4>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload required documents based on relationship
                  </p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>• ID copy (required for all)</p>
                    <p>• Birth certificate (for children)</p>
                    <p>• Marriage certificate (for spouse)</p>
                    <p>• Relationship affidavit (if applicable)</p>
                    <p>• Guardian affidavit (for minors)</p>
                  </div>
                  <Button variant="secondary" size="sm" className="mt-3">
                    Choose Files
                  </Button>
                </div>

                {uploadedDocuments.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Uploaded Documents</h5>
                    <div className="space-y-2">
                      {uploadedDocuments.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm">{doc}</span>
                          </div>
                          <Button variant="danger" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form Download Section */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Required Form Submission</h4>
              <p className="text-sm text-blue-800 mb-3">
                After updating beneficiary details online, you must download, sign, and upload the beneficiary form.
              </p>
              <div className="flex space-x-2">
                <Button variant="secondary" size="sm" className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Download Beneficiary Form
                </Button>
                <Button variant="secondary" size="sm" className="flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Signed Form
                </Button>
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

  const BeneficiaryDetailsModal = ({ beneficiary, onClose }: any) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Beneficiary Details</h3>
          <Button variant="secondary" size="sm" onClick={onClose}>×</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="text-center">
              <div className="mx-auto h-20 w-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">
                {beneficiary.name.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <h4 className="text-xl font-bold">{beneficiary.name}</h4>
              <p className="text-gray-600">{beneficiary.relationship}</p>
              <StatusBadge status={beneficiary.approvalStatus} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">Date of Birth:</span>
                <p>{beneficiary.dateOfBirth}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">ID Number:</span>
                <p>{beneficiary.idNumber}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Percentage:</span>
                <p className="font-bold text-blue-600">{beneficiary.percentage}%</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Phone:</span>
                <p>{beneficiary.phoneNumber || 'Not provided'}</p>
              </div>
              <div className="col-span-2">
                <span className="font-medium text-gray-500">Address:</span>
                <p>{beneficiary.address}</p>
              </div>
              {beneficiary.guardianName && (
                <>
                  <div>
                    <span className="font-medium text-gray-500">Guardian:</span>
                    <p>{beneficiary.guardianName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Guardian Contact:</span>
                    <p>{beneficiary.guardianContact}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-medium text-gray-900 mb-3">Supporting Documents</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {beneficiary.documents.map((doc: string, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm">{doc}</span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="secondary" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex space-x-2">
          <Button onClick={() => setEditingBeneficiary(beneficiary)}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Beneficiary
          </Button>
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Download Form
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </Card>
    </div>
  );

  const totalPercentage = beneficiariesData.reduce((sum, b) => sum + b.percentage, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Beneficiaries Management</h1>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              <CheckCircle className={`h-6 w-6 ${totalPercentage === 100 ? 'text-green-600' : 'text-orange-600'}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalPercentage === 100 ? 'Complete' : 'Incomplete'}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900">
                {beneficiariesData.filter(b => b.approvalStatus === 'Pending').length}
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
              <AlertTriangle className="h-5 w-5 text-orange-600" />
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
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Beneficiary Management Instructions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• All beneficiary changes must be submitted through this portal</li>
            <li>• Changes require approval from the Pension Officer</li>
            <li>• Required documents: ID copy, birth certificate, relationship affidavit</li>
            <li>• Total percentage allocation must equal 100%</li>
          </ul>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Download the beneficiary form, sign it, and upload the scanned copy</li>
            <li>• Guardian information required for beneficiaries under 18 years</li>
            <li>• Marriage certificate required for spouse beneficiaries</li>
            <li>• All changes are subject to maker-checker approval</li>
          </ul>
        </div>
      </Card>

      {/* Add/Edit Beneficiary Modal */}
      {showAddBeneficiaryModal && (
        <BeneficiaryForm onClose={() => setShowAddBeneficiaryModal(false)} />
      )}
      
      {editingBeneficiary && (
        <BeneficiaryDetailsModal 
          beneficiary={editingBeneficiary} 
          onClose={() => setEditingBeneficiary(null)} 
        />
      )}
    </div>
  );
};

export default Beneficiaries;