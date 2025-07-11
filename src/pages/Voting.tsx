import React, { useState } from 'react';
import { Card } from '../components/Common/Card';
import { Button } from '../components/Common/Button';
import { StatusBadge } from '../components/Common/StatusBadge';
import { 
  Vote, 
  Users, 
  Clock, 
  CheckCircle, 
  BarChart3,
  Smartphone,
  Globe
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Voting: React.FC = () => {
  const [selectedElection, setSelectedElection] = useState<any>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);

  const activeElections = [
    {
      id: 1,
      title: 'Board of Trustees Election 2024',
      description: 'Election of new board members for the 2024-2026 term',
      startDate: '2024-01-15',
      endDate: '2024-01-25',
      isActive: true,
      totalVotes: 1247,
      eligibleVoters: 2500,
      maxSelections: 3,
      candidates: [
        { id: 1, name: 'Alice Johnson', position: 'Chairman', votes: 456, percentage: 36.6 },
        { id: 2, name: 'Bob Smith', position: 'Vice Chairman', votes: 423, percentage: 33.9 },
        { id: 3, name: 'Carol Brown', position: 'Secretary', votes: 389, percentage: 31.2 },
        { id: 4, name: 'David Wilson', position: 'Treasurer', votes: 345, percentage: 27.7 },
        { id: 5, name: 'Eve Davis', position: 'Member', votes: 312, percentage: 25.0 },
        { id: 6, name: 'Frank Miller', position: 'Member', votes: 298, percentage: 23.9 }
      ]
    },
    {
      id: 2,
      title: 'Investment Committee Election',
      description: 'Selection of investment committee members',
      startDate: '2024-02-01',
      endDate: '2024-02-10',
      isActive: false,
      totalVotes: 0,
      eligibleVoters: 2500,
      maxSelections: 2,
      candidates: [
        { id: 1, name: 'Grace Taylor', position: 'Chairman', votes: 0, percentage: 0 },
        { id: 2, name: 'Henry Clark', position: 'Vice Chairman', votes: 0, percentage: 0 },
        { id: 3, name: 'Ivy Rodriguez', position: 'Member', votes: 0, percentage: 0 },
        { id: 4, name: 'Jack Anderson', position: 'Member', votes: 0, percentage: 0 }
      ]
    }
  ];

  const votingStats = [
    { name: 'Web Portal', value: 789, color: '#3B82F6' },
    { name: 'USSD', value: 458, color: '#10B981' },
    { name: 'Not Voted', value: 1253, color: '#E5E7EB' }
  ];

  const handleVote = () => {
    if (selectedCandidates.length === 0) {
      alert('Please select at least one candidate');
      return;
    }
    
    if (selectedCandidates.length > selectedElection.maxSelections) {
      alert(`You can only select up to ${selectedElection.maxSelections} candidates`);
      return;
    }

    // Simulate voting process
    setHasVoted(true);
    alert('Your vote has been recorded successfully!');
  };

  const handleCandidateSelection = (candidateId: string) => {
    if (selectedCandidates.includes(candidateId)) {
      setSelectedCandidates(prev => prev.filter(id => id !== candidateId));
    } else {
      if (selectedCandidates.length < selectedElection.maxSelections) {
        setSelectedCandidates(prev => [...prev, candidateId]);
      } else {
        alert(`You can only select up to ${selectedElection.maxSelections} candidates`);
      }
    }
  };

  const VotingModal = ({ election, onClose }: any) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">{election.title}</h3>
          <Button variant="secondary" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
        
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Voting Instructions</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• You can select up to {election.maxSelections} candidates</li>
              <li>• You can only vote once per election</li>
              <li>• Your vote is confidential and secure</li>
              <li>• Voting closes on {election.endDate}</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Select Candidates ({selectedCandidates.length}/{election.maxSelections})</h4>
            <div className="space-y-3">
              {election.candidates.map((candidate: any) => (
                <div
                  key={candidate.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedCandidates.includes(candidate.id.toString())
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => handleCandidateSelection(candidate.id.toString())}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900">{candidate.name}</h5>
                      <p className="text-sm text-gray-600">{candidate.position}</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCandidates.includes(candidate.id.toString())}
                        onChange={() => handleCandidateSelection(candidate.id.toString())}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={handleVote}
              disabled={selectedCandidates.length === 0}
              className="flex-1"
            >
              Cast Vote
            </Button>
            <Button variant="secondary" onClick={onClose}>
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
        <h1 className="text-2xl font-bold text-gray-900">Voting System</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Vote className="h-4 w-4" />
          <span>Secure Electronic Voting</span>
        </div>
      </div>

      {/* Voting Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Eligible Voters</p>
              <p className="text-2xl font-bold text-gray-900">2,500</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Votes Cast</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Turnout</p>
              <p className="text-2xl font-bold text-gray-900">49.9%</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Elections</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Elections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeElections.map((election) => (
          <Card key={election.id} className="transition-transform hover:scale-105">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{election.title}</h3>
                <p className="text-sm text-gray-600">{election.description}</p>
              </div>
              <StatusBadge status={election.isActive ? 'Active' : 'Upcoming'} />
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Period:</span>
                <span>{election.startDate} to {election.endDate}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Votes Cast:</span>
                <span>{election.totalVotes} / {election.eligibleVoters}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Max Selections:</span>
                <span>{election.maxSelections} candidates</span>
              </div>
            </div>

            <div className="flex space-x-2">
              {election.isActive ? (
                <>
                  <Button 
                    onClick={() => setSelectedElection(election)}
                    disabled={hasVoted}
                    className="flex-1"
                  >
                    {hasVoted ? 'Already Voted' : 'Vote Now'}
                  </Button>
                  <Button variant="secondary">
                    View Results
                  </Button>
                </>
              ) : (
                <Button variant="secondary" className="flex-1" disabled>
                  Starts {election.startDate}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Voting Methods */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Voting Methods</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">Web Portal</h4>
                <p className="text-sm text-gray-600">Vote through this portal using your login credentials</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Smartphone className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">USSD Voting</h4>
                <p className="text-sm text-gray-600">Dial *123# and follow the prompts to vote</p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3">Voting Method Distribution</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={votingStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {votingStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Real-time Results */}
      {activeElections.some(e => e.isActive) && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Real-time Results</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activeElections[0].candidates}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="votes" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Voting Modal */}
      {selectedElection && (
        <VotingModal 
          election={selectedElection} 
          onClose={() => setSelectedElection(null)} 
        />
      )}
    </div>
  );
};

export default Voting;