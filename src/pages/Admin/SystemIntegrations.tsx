import React, { useState } from 'react';
import { Card } from '../../components/Common/Card';
import { Button } from '../../components/Common/Button';
import { 
  Database, 
  DollarSign, 
  FileText, 
  CreditCard, 
  Wallet, 
  Globe, 
  Smartphone, 
  FolderOpen,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Activity,
  Settings,
  RefreshCw,
  BarChart3,
  Clock,
  Zap
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  uptime: string;
  transactions: number;
  errors: number;
  icon: React.ReactNode;
  description: string;
}

const SystemIntegrations: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);

  const integrations: Integration[] = [
    {
      id: 'financial-mgmt',
      name: 'Financial Management System',
      type: 'Core System',
      status: 'connected',
      lastSync: '2 minutes ago',
      uptime: '99.8%',
      transactions: 15420,
      errors: 2,
      icon: <DollarSign className="w-6 h-6" />,
      description: 'Core financial management and accounting system integration'
    },
    {
      id: 'general-ledger',
      name: 'General Ledger',
      type: 'Accounting',
      status: 'connected',
      lastSync: '5 minutes ago',
      uptime: '99.9%',
      transactions: 8930,
      errors: 0,
      icon: <Database className="w-6 h-6" />,
      description: 'General ledger and chart of accounts integration'
    },
    {
      id: 'accounts-receivable',
      name: 'Accounts Receivable',
      type: 'Accounting',
      status: 'connected',
      lastSync: '3 minutes ago',
      uptime: '99.7%',
      transactions: 5670,
      errors: 1,
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Accounts receivable and invoice management'
    },
    {
      id: 'accounts-payable',
      name: 'Accounts Payable',
      type: 'Accounting',
      status: 'error',
      lastSync: '2 hours ago',
      uptime: '95.2%',
      transactions: 3420,
      errors: 15,
      icon: <FileText className="w-6 h-6" />,
      description: 'Accounts payable and vendor payment processing'
    },
    {
      id: 'cash-management',
      name: 'Cash Management',
      type: 'Treasury',
      status: 'connected',
      lastSync: '1 minute ago',
      uptime: '99.9%',
      transactions: 12340,
      errors: 0,
      icon: <Wallet className="w-6 h-6" />,
      description: 'Cash flow management and treasury operations'
    },
    {
      id: 'web-portal',
      name: 'Web Portal',
      type: 'Frontend',
      status: 'connected',
      lastSync: 'Real-time',
      uptime: '99.5%',
      transactions: 45670,
      errors: 3,
      icon: <Globe className="w-6 h-6" />,
      description: 'Member web portal and self-service platform'
    },
    {
      id: 'mobile-app',
      name: 'Mobile Applications',
      type: 'Frontend',
      status: 'connected',
      lastSync: 'Real-time',
      uptime: '98.9%',
      transactions: 23450,
      errors: 8,
      icon: <Smartphone className="w-6 h-6" />,
      description: 'iOS and Android mobile applications'
    },
    {
      id: 'document-mgmt',
      name: 'Document Management System',
      type: 'Storage',
      status: 'disconnected',
      lastSync: '6 hours ago',
      uptime: '92.1%',
      transactions: 7890,
      errors: 25,
      icon: <FolderOpen className="w-6 h-6" />,
      description: 'Document storage, retrieval, and management system'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'disconnected':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'disconnected':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const errorCount = integrations.filter(i => i.status === 'error').length;
  const disconnectedCount = integrations.filter(i => i.status === 'disconnected').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Integrations</h1>
          <p className="text-gray-600 mt-2">Monitor and manage all system integrations</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh All</span>
          </Button>
          <Button className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Configure</span>
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Integrations</p>
              <p className="text-3xl font-bold text-gray-900">{integrations.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Connected</p>
              <p className="text-3xl font-bold text-green-600">{connectedCount}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Errors</p>
              <p className="text-3xl font-bold text-red-600">{errorCount}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Disconnected</p>
              <p className="text-3xl font-bold text-yellow-600">{disconnectedCount}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: BarChart3 },
            { id: 'monitoring', name: 'Monitoring', icon: Activity },
            { id: 'configuration', name: 'Configuration', icon: Settings },
            { id: 'logs', name: 'Logs', icon: FileText }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Integration Cards */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <Card key={integration.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {integration.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                    <p className="text-sm text-gray-500">{integration.type}</p>
                  </div>
                </div>
                {getStatusIcon(integration.status)}
              </div>

              <p className="text-sm text-gray-600 mb-4">{integration.description}</p>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                    {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Last Sync:</span>
                  <span className="text-sm text-gray-900">{integration.lastSync}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Uptime:</span>
                  <span className="text-sm text-gray-900">{integration.uptime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Transactions:</span>
                  <span className="text-sm text-gray-900">{integration.transactions.toLocaleString()}</span>
                </div>
                {integration.errors > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Errors:</span>
                    <span className="text-sm text-red-600">{integration.errors}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setSelectedIntegration(integration.id)}
                >
                  Configure
                </Button>
                <Button size="sm" variant="outline">
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Sync
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Monitoring Tab */}
      {activeTab === 'monitoring' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Real-time Monitoring</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">99.2%</div>
                <div className="text-sm text-gray-500">Average Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">156K</div>
                <div className="text-sm text-gray-500">Total Transactions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">54</div>
                <div className="text-sm text-gray-500">Total Errors</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              {integrations.map((integration) => (
                <div key={integration.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {integration.icon}
                    <span className="font-medium">{integration.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm">
                      <span className="text-gray-500">Response Time:</span>
                      <span className="ml-1 font-medium">120ms</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Success Rate:</span>
                      <span className="ml-1 font-medium text-green-600">99.8%</span>
                    </div>
                    {getStatusIcon(integration.status)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Configuration Tab */}
      {activeTab === 'configuration' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Integration Configuration</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sync Interval (minutes)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue="5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeout (seconds)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue="30"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Retry Attempts
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue="3"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="auto-retry"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  defaultChecked
                />
                <label htmlFor="auto-retry" className="text-sm text-gray-700">
                  Enable automatic retry on failure
                </label>
              </div>
            </div>
            <div className="mt-6">
              <Button>Save Configuration</Button>
            </div>
          </Card>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Integration Logs</h3>
              <div className="flex space-x-2">
                <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option>All Integrations</option>
                  <option>Financial Management</option>
                  <option>General Ledger</option>
                  <option>Cash Management</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option>All Levels</option>
                  <option>Info</option>
                  <option>Warning</option>
                  <option>Error</option>
                </select>
              </div>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {[
                { time: '12:30:45', level: 'INFO', integration: 'Financial Management', message: 'Sync completed successfully' },
                { time: '12:29:12', level: 'ERROR', integration: 'Accounts Payable', message: 'Connection timeout after 30 seconds' },
                { time: '12:28:33', level: 'WARNING', integration: 'Document Management', message: 'High response time detected (2.5s)' },
                { time: '12:27:01', level: 'INFO', integration: 'Cash Management', message: 'Transaction batch processed (150 items)' },
                { time: '12:25:44', level: 'INFO', integration: 'Web Portal', message: 'User session sync completed' }
              ].map((log, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg text-sm">
                  <span className="text-gray-500 font-mono">{log.time}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    log.level === 'ERROR' ? 'bg-red-100 text-red-800' :
                    log.level === 'WARNING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {log.level}
                  </span>
                  <span className="font-medium text-gray-700">{log.integration}</span>
                  <span className="text-gray-600 flex-1">{log.message}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SystemIntegrations;