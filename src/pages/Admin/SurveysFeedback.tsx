import React from 'react';
import { Card } from '../../components/Common/Card';
import { Button } from '../../components/Common/Button';
import { 
  MessageSquare, 
  Plus, 
  BarChart3, 
  Users, 
  Calendar,
  Eye,
  Download,
  Settings
} from 'lucide-react';

const SurveysFeedback: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Surveys & Feedback</h1>
          <p className="text-gray-600 mt-1">Manage member surveys and collect feedback</p>
        </div>
        <Button className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Create Survey
        </Button>
      </div>

      {/* Coming Soon Message */}
      <Card className="text-center py-12">
        <div className="mx-auto h-24 w-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mb-6">
          <MessageSquare className="h-12 w-12 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Surveys & Feedback Module</h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          This comprehensive survey management system is coming soon. You'll be able to create, 
          distribute, and analyze member surveys and feedback.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="p-4 bg-blue-50 rounded-lg">
            <BarChart3 className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <h3 className="font-medium text-blue-900">Analytics</h3>
            <p className="text-sm text-blue-700">Real-time survey analytics</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <h3 className="font-medium text-green-900">Distribution</h3>
            <p className="text-sm text-green-700">Multi-channel survey distribution</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <Calendar className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <h3 className="font-medium text-purple-900">Scheduling</h3>
            <p className="text-sm text-purple-700">Automated survey scheduling</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SurveysFeedback;
