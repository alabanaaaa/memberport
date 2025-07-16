import React, { useState } from 'react';
import { Card } from '../../components/Common/Card';
import { Button } from '../../components/Common/Button';
import { Table } from '../../components/Common/Table';
import { StatusBadge } from '../../components/Common/StatusBadge';
import { 
  Vote, 
  Users, 
  Clock, 
  CheckCircle, 
  BarChart3,
  Smartphone,
  Globe,
  Plus,
  Eye,
  Download,
  Settings,
  Play,
  Pause,
  Square,
  MapPin,
  Calendar,
  UserCheck,
  AlertTriangle,
  TrendingUp,
  Activity,
  Filter,
  Search
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const VotingManagement: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('active');
  const [selectedElection, setSelectedElection] = useState<any>(null);
  const [showCreateElection, setShowCreateElection] = useState(false);

  const votingStats = [
    { name: 'Active Elections', value: 2, icon: Vote, color: 'text-blue-600', change: '+1' },
    { name: 'Registered Voters', value: 2350, icon: Users, color: 'text-green-600', change: '+45' },
    { name: 'Total Votes Cast', value: 1247, icon: CheckCircle, color: 'text-purple-600', change: '+89' },
    { name: 'Turnout Rate', value: '53.1%', icon: TrendingUp, color: 'text-orange-600', change: '+2.3%' }
  ];

  const activeElections = [
    {
      id: 'ELECT-2024-001',
      title: 'Board of Trustees Election 2024',
      description: 'Election of new board members for the 2024-2026 term',
      type: 'Trustee Election',
      startDate: '2024-01-15',
      endDate: '2024-01-25',
      isActive: true,
      status: 'Active',
      totalVotes: 1247,
      eligibleVoters: 2350,
      maxSelections: 3,
      votingMethods: ['Web', 'USSD'],
      ussdShortCode: '*123#',
      realTimeResults: true,
      candidates: [
        { id: 'C001', name: 'Alice Johnson', position: 'Chairman', votes: 456, percentage: 36.6 },
        { id: 'C002', name: 'Bob Smith', position: 'Vice Chairman', votes: 423, percentage: 33.9 },
        { id: 'C003', name: 'Carol Brown', position: 'Secretary', votes: 389, percentage: 31.2 },
        { id: 'C004', name: 'David Wilson', position: 'Treasurer', votes: 345, percentage: 27.7 },
        { id: 'C005', name: 'Eve Davis', position: 'Member', votes: 312, percentage: 25.0 },
        { id: 'C006', name: 'Frank Miller', position: 'Member', votes: 298, percentage: 23.9 }
      ],
      results: {
        totalVotes: 1247,
        webVotes: 789,
        ussdVotes: 458,
        byLocation: [
          { location: 'Nairobi', votes: 567 },
          { location: 'Mombasa', votes: 234 },
          { location: 'Kisumu', votes: 189 },
          { location: 'Nakuru', votes: 145 },
          { location: 'Other', votes: 112 }
        ],
        byTime: [
          { hour: '08:00', votes: 45 },
          { hour: '10:00', votes: 123 },
          { hour: '12:00', votes: 234 },
          { hour: '14:00', votes: 189 },
          { hour: '16:00', votes: 267 },
          { hour: '18:00', votes: 389 }
        ]
      }
    },
    {
      id: 'ELECT-2024-002',
      title: 'Investment Committee Election',
      description: 'Selection of investment committee members',
      type: 'Committee Election',
      startDate: '2024-02-01',
      endDate: '2024-02-10',
      isActive: false,
      status: 'Scheduled',
      totalVotes: 0,
      eligibleVoters: 2350,
      maxSelections: 2,
      votingMethods: ['Web', 'USSD'],
      ussdShortCode: '*124#',
      realTimeResults: true,
      candidates: [
        { id: 'C007', name: 'Grace Taylor', position: 'Chairman', votes: 0, percentage: 0 },
        { id: 'C008', name: 'Henry Clark', position: 'Vice Chairman', votes: 0, percentage: 0 },
        { id: 'C009', name: 'Ivy Rodriguez', position: 'Member', votes: 0, percentage: 0 },
        { id: 'C010', name: 'Jack Anderson', position: 'Member', votes: 0, percentage: 0 }
      ]
    }
  ];

  const votingRecords = [
    {
      id: 'VR001',
      sessionId: 'ELECT-2024-001',
      memberId: 'M001234',
      memberNumber: 'M001234',
      memberName: 'John Doe',
      votedCandidates: ['C001', 'C002', 'C003'],
      timestamp: '2024-01-16 14:30:25',
      method: 'Web',
      mobileNumber: '+254712345678',
      gpsLocation: {
        latitude: -1.2921,
        longitude: 36.8219,
        address: 'Nairobi, Kenya'
      },
      ipAddress: '192.168.1.100',
      deviceInfo: 'Chrome 120.0.0.0 on Windows 10'
    },
    {
      id: 'VR002',
      sessionId: 'ELECT-2024-001',
      memberId: 'M001235',
      memberNumber: 'M001235',
      memberName: 'Jane Smith',
      votedCandidates: ['C002', 'C004', 'C005'],
      timestamp: '2024-01-16 15:45:12',
      method: 'USSD',
      mobileNumber: '+254722987654',
      gpsLocation: {
        latitude: -4.0435,
        longitude: 39.6682,
        address: 'Mombasa, Kenya'
      },
      ipAddress: 'N/A',
      deviceInfo: 'USSD Gateway'
    }
  ];

  const votingTrends = [
    { hour: '08:00', web: 25, ussd: 20, total: 45 },
    { hour: '10:00', web: 78, ussd: 45, total: 123 },
    { hour: '12:00', web: 145, ussd: 89, total: 234 },
    { hour: '14:00', web: 112, ussd: 77, total: 189 },
    { hour: '16:00', web: 167, ussd: 100, total: 267 },
    { hour: '18:00', web: 262, ussd: 127, total: 389 }
  ];

  const methodDistribution = [
    { name: 'Web Portal', value: 789, color: '#3B82F6' },
    { name: 'USSD', value: 458, color: '#10B981' }
  ];

  const electionColumns = [
    { key: 'title', label: 'Election Title', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'startDate', label: 'Start Date', sortable: true },
    { key: 'endDate', label: 'End Date', sortable: true },
    { 
      key: 'totalVotes', 
      label: 'Votes Cast', 
      sortable: true,
      render: (value: number, row: any) => `${value} / ${row.eligibleVoters}`
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
            onClick={() => setSelectedElection(row)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {row.status === 'Active' && (
            <Button variant="secondary" size="sm">
              <Pause className="h-4 w-4" />
            </Button>
          )}
          {row.status === 'Scheduled' && (
            <Button variant="secondary" size="sm">
              <Play className="h-4 w-4" />
            </Button>
          )}
        </div>
      )
    }
  ];

  const recordColumns = [
    { key: 'memberNumber', label: 'Member No.', sortable: true },
    { key: 'memberName', label: 'Member Name', sortable: true },
    { key: 'timestamp', label: 'Vote Time', sortable: true },
    { key: 'method', label: 'Method', sortable: true },
    { 
      key: 'gpsLocation', 
      label: 'Location', 
      render: (value: any) => (
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
          <span className="text-sm">{value.address}</span>
        </div>
      )
    },
    { 
      key: 'votedCandidates', 
      label: 'Candidates', 
      render: (value: string[]) => (
        <span className="text-sm">{value.length} selected</span>
      )
    },
    { 
      key: 'actions', 
      label: 'Actions',
      render: (value: any, row: any) => (
        <Button variant="secondary" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      )
    }
  ];

  const ElectionDetailsModal = ({ election }: any) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Election Management - {election.title}</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSelectedElection(null)}
          >
            ×
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Election Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Title:</span>
                  <span className="font-medium">{election.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Type:</span>
                  <span>{election.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Period:</span>
                  <span>{election.startDate} to {election.endDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <StatusBadge status={election.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Eligible Voters:</span>
                  <span>{election.eligibleVoters.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Votes Cast:</span>
                  <span className="font-medium">{election.totalVotes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Turnout:</span>
                  <span className="font-bold text-blue-600">
                    {((election.totalVotes / election.eligibleVoters) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Max Selections:</span>
                  <span>{election.maxSelections} candidates</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">USSD Code:</span>
                  <span className="font-mono">{election.ussdShortCode}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-4">Voting Methods</h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={methodDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {methodDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Real-time Results</h4>
              <div className="space-y-3">
                {election.candidates.map((candidate: any, index: number) => (
                  <div key={candidate.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{candidate.name}</p>
                        <p className="text-sm text-gray-600">{candidate.position}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">{candidate.votes}</p>
                        <p className="text-sm text-gray-500">{candidate.percentage}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${candidate.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-4">Election Controls</h4>
              <div className="space-y-3">
                {election.status === 'Active' && (
                  <>
                    <Button variant="danger" className="w-full">
                      <Pause className="h-4 w-4 mr-2" />
                      Pause Election
                    </Button>
                    <Button variant="danger" className="w-full">
                      <Square className="h-4 w-4 mr-2" />
                      End Election
                    </Button>
                  </>
                )}
                {election.status === 'Scheduled' && (
                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Start Election
                  </Button>
                )}
                <Button variant="secondary" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Election Settings
                </Button>
                <Button variant="secondary" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export Results
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Voting Management System</h1>
        <div className="flex space-x-2">
          <Button variant="secondary" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
          <Button onClick={() => setShowCreateElection(true)} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Create Election
          </Button>
        </div>
      </div>

      {/* Voting Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {votingStats.map((stat) => (
          <Card key={stat.name}>
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-lg">
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600">{stat.change}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['active', 'scheduled', 'completed', 'records'].map((tab) => (
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

      {/* Elections Table */}
      {selectedTab !== 'records' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Elections</h3>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search elections..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button variant="secondary" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
          <Table columns={electionColumns} data={activeElections} />
        </Card>
      )}

      {/* Voting Records */}
      {selectedTab === 'records' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Voting Records</h3>
            <div className="flex space-x-2">
              <Button variant="secondary" className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export Records
              </Button>
            </div>
          </div>
          <Table columns={recordColumns} data={votingRecords} />
        </Card>
      )}

      {/* Real-time Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Voting Trends (Hourly)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={votingTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="web" stroke="#3B82F6" strokeWidth={2} name="Web" />
              <Line type="monotone" dataKey="ussd" stroke="#10B981" strokeWidth={2} name="USSD" />
              <Line type="monotone" dataKey="total" stroke="#8B5CF6" strokeWidth={2} name="Total" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>
          <div className="space-y-3">
            {activeElections[0]?.results.byLocation.map((location: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{location.location}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(location.votes / 567) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{location.votes}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Modals */}
      {selectedElection && <ElectionDetailsModal election={selectedElection} />}
    </div>
  );
};

export default VotingManagement;