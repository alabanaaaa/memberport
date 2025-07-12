import React, { useState } from 'react';
import { Card } from '../../components/Common/Card';
import { Button } from '../../components/Common/Button';
import { Table } from '../../components/Common/Table';
import { StatusBadge } from '../../components/Common/StatusBadge';
import { 
  Upload, 
  Download, 
  FileText, 
  Users, 
  DollarSign, 
  AlertCircle,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';

const BulkOperations: React.FC = () => {
  const [selectedOperation, setSelectedOperation] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const bulkOperations = [
    {
      id: 1,
      type: 'Member Import',
      fileName: 'new_members_jan_2024.xlsx',
      uploadedBy: 'Admin User',
      uploadedDate: '2024-01-15 10:30',
      status: 'Completed',
      totalRecords: 150,
      processedRecords: 150,
      failedRecords: 0
    },
    {
      id: 2,
      type: 'Contribution Upload',
      fileName: 'contributions_dec_2023.csv',
      uploadedBy: 'Finance Officer',
      uploadedDate: '2024-01-14 14:20',
      status: 'Processing',
      totalRecords: 2500,
      processedRecords: 1800,
      failedRecords: 12
    },
    {
      id: 3,
      type: 'Salary Update',
      fileName: 'salary_adjustments_2024.xlsx',
      uploadedBy: 'HR Manager',
      uploadedDate: '2024-01-13 09:15',
      status: 'Failed',
      totalRecords: 500,
      processedRecords: 245,
      failedRecords: 255
    }
  ];

  const operationTypes = [
    { 
      id: 'member_import', 
      name: 'Member Import', 
      description: 'Import new member records from Excel/CSV',
      icon: Users,
      template: 'member_import_template.xlsx'
    },
    { 
      id: 'contribution_upload', 
      name: 'Contribution Upload', 
      description: 'Upload monthly contribution data',
      icon: DollarSign,
      template: 'contribution_template.csv'
    },
    { 
      id: 'salary_update', 
      name: 'Salary Update', 
      description: 'Bulk update member salaries',
      icon: FileText,
      template: 'salary_update_template.xlsx'
    },
    { 
      id: 'status_change', 
      name: 'Status Change', 
      description: 'Update member status in bulk',
      icon: Users,
      template: 'status_change_template.csv'
    }
  ];

  const columns = [
    { key: 'type', label: 'Operation Type', sortable: true },
    { key: 'fileName', label: 'File Name', sortable: true },
    { key: 'uploadedBy', label: 'Uploaded By', sortable: true },
    { key: 'uploadedDate', label: 'Date', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      render: (value: string) => <StatusBadge status={value} />
    },
    { 
      key: 'progress', 
      label: 'Progress', 
      render: (value: any, row: any) => (
        <div className="w-full">
          <div className="flex justify-between text-xs mb-1">
            <span>{row.processedRecords}/{row.totalRecords}</span>
            <span>{Math.round((row.processedRecords / row.totalRecords) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                row.status === 'Completed' ? 'bg-green-500' :
                row.status === 'Failed' ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{ width: `${(row.processedRecords / row.totalRecords) * 100}%` }}
            />
          </div>
          {row.failedRecords > 0 && (
            <p className="text-xs text-red-600 mt-1">{row.failedRecords} failed</p>
          )}
        </div>
      )
    },
    { 
      key: 'actions', 
      label: 'Actions',
      render: (value: any, row: any) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" />
          </Button>
          {row.status === 'Failed' && (
            <Button variant="secondary" size="sm">
              Retry
            </Button>
          )}
        </div>
      )
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleStartOperation = () => {
    if (!selectedOperation || !uploadedFile) {
      alert('Please select an operation type and upload a file');
      return;
    }
    
    // Simulate starting bulk operation
    console.log('Starting bulk operation:', selectedOperation, uploadedFile.name);
    setShowUploadModal(false);
    setSelectedOperation('');
    setUploadedFile(null);
  };

  const UploadModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Start Bulk Operation</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowUploadModal(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Operation Type
            </label>
            <select
              value={selectedOperation}
              onChange={(e) => setSelectedOperation(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select operation type</option>
              {operationTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            {selectedOperation && (
              <p className="text-sm text-gray-600 mt-1">
                {operationTypes.find(t => t.id === selectedOperation)?.description}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                Drop your file here or click to browse
              </p>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-blue-600 hover:text-blue-500"
              >
                Choose File
              </label>
              {uploadedFile && (
                <p className="text-sm text-green-600 mt-2">
                  Selected: {uploadedFile.name}
                </p>
              )}
            </div>
          </div>

          {selectedOperation && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Template Download</h4>
              <p className="text-sm text-blue-800 mb-3">
                Download the template file to ensure your data is in the correct format
              </p>
              <Button variant="secondary" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </div>
          )}

          <div className="flex space-x-2">
            <Button
              onClick={handleStartOperation}
              disabled={!selectedOperation || !uploadedFile}
              className="flex-1"
            >
              Start Operation
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowUploadModal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Bulk Operations</h1>
        <Button onClick={() => setShowUploadModal(true)} className="flex items-center">
          <Upload className="h-4 w-4 mr-2" />
          New Operation
        </Button>
      </div>

      {/* Operation Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {operationTypes.map((type) => (
          <Card key={type.id} className="transition-transform hover:scale-105 cursor-pointer">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <type.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">{type.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{type.description}</p>
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => {
                  setSelectedOperation(type.id);
                  setShowUploadModal(true);
                }}
              >
                Start Operation
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Operations */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Operations</h3>
          <div className="flex space-x-2">
            <Button variant="secondary" size="sm">
              Filter
            </Button>
            <Button variant="secondary" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Log
            </Button>
          </div>
        </div>

        <Table columns={columns} data={bulkOperations} />
      </Card>

      {/* Guidelines */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 mb-2">Bulk Operation Guidelines</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Always download and use the provided templates</li>
              <li>• Ensure data is validated before uploading</li>
              <li>• Large files ({'>'}10MB) may take longer to process</li>
              <li>• Operations can be paused or cancelled during processing</li>
              <li>• Failed records can be downloaded for correction and re-upload</li>
              <li>• All operations are logged and auditable</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Upload Modal */}
      {showUploadModal && <UploadModal />}
    </div>
  );
};

export default BulkOperations;