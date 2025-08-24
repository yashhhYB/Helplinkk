import React, { useState } from 'react';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  MapPin,
  Clock,
  Heart,
  Phone,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useApp } from '../../context/AppContext';

interface DonorMatch {
  id: string;
  name: string;
  bloodType: string;
  location: string;
  donorType: 'emergency' | 'bridge';
  availabilityScore: number;
  lastDonation: string;
  totalDonations: number;
  responseRate: number;
  distance: string;
  status: 'available' | 'contacted' | 'responded';
}

export function DonorMatching() {
  const { bloodRequests } = useApp();
  const [selectedDonors, setSelectedDonors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);

  const currentRequest = bloodRequests.find(r => r.status === 'pending') || bloodRequests[0];

  const aiMatches: DonorMatch[] = [
    {
      id: '1',
      name: 'Anonymous Donor 001',
      bloodType: 'O+',
      location: 'North District',
      donorType: 'emergency',
      availabilityScore: 0.92,
      lastDonation: '2023-11-15',
      totalDonations: 15,
      responseRate: 90,
      distance: '2.3 km',
      status: 'available'
    },
    {
      id: '2',
      name: 'Anonymous Donor 002',
      bloodType: 'O+',
      location: 'North District',
      donorType: 'bridge',
      availabilityScore: 0.87,
      lastDonation: '2023-12-01',
      totalDonations: 8,
      responseRate: 85,
      distance: '4.7 km',
      status: 'available'
    },
    {
      id: '3',
      name: 'Anonymous Donor 003',
      bloodType: 'O-',
      location: 'Central District',
      donorType: 'emergency',
      availabilityScore: 0.78,
      lastDonation: '2023-10-20',
      totalDonations: 22,
      responseRate: 75,
      distance: '8.1 km',
      status: 'contacted'
    }
  ];

  const handleSelectDonor = (donorId: string) => {
    setSelectedDonors(prev => 
      prev.includes(donorId) 
        ? prev.filter(id => id !== donorId)
        : [...prev, donorId]
    );
  };

  const handleNotifyDonors = async () => {
    setIsProcessing(true);
    // Simulate notification sending
    setTimeout(() => {
      setIsProcessing(false);
      setNotificationSent(true);
      // Update donor statuses to 'contacted'
      setSelectedDonors([]);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Donor Matching</h1>
          <p className="text-gray-600">Machine learning powered donor selection</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 rounded-full">
            <Brain className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">AI Active</span>
          </div>
        </div>
      </div>

      {/* Request Details */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Current Blood Request</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Blood Type</p>
              <Badge variant="error" className="text-lg px-3 py-1">
                {currentRequest?.bloodType || 'O+'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Units Required</p>
              <p className="text-lg font-semibold text-gray-900">
                {currentRequest?.unitsRequired || 2} units
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Urgency</p>
              <Badge variant="error">{currentRequest?.urgency || 'Critical'}</Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Required By</p>
              <p className="text-lg font-semibold text-gray-900">
                {currentRequest?.requiredBy.toLocaleDateString() || 'Jan 22, 2024'}
              </p>
            </div>
          </div>
          
          {notificationSent && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ Notifications sent successfully to selected donors. Awaiting responses...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Matching Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Target className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">AI-Ranked Donor Matches</h3>
            </div>
            <Button 
              onClick={handleNotifyDonors}
              disabled={selectedDonors.length === 0 || isProcessing}
              size="sm"
            >
              {isProcessing ? 'Notifying...' : `Notify Selected (${selectedDonors.length})`}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiMatches.map((donor) => (
              <div 
                key={donor.id} 
                className={`border rounded-lg p-4 transition-all duration-200 ${
                  selectedDonors.includes(donor.id) 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {/* Donor Header */}
                    <div className="flex items-center space-x-3 mb-3">
                      <h4 className="font-medium text-gray-900">{donor.name}</h4>
                      <Badge variant="info">{donor.bloodType}</Badge>
                      <Badge 
                        variant={donor.donorType === 'emergency' ? 'error' : 'warning'}
                      >
                        {donor.donorType === 'emergency' ? 'Emergency' : 'Bridge'} Donor
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Brain className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">
                          {Math.round(donor.availabilityScore * 100)}% match
                        </span>
                      </div>
                    </div>

                    {/* Donor Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{donor.location} ({donor.distance})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Last: {donor.lastDonation}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{donor.totalDonations} donations</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{donor.responseRate}% response rate</span>
                      </div>
                    </div>

                    {/* Status Indicator */}
                    <div className="mt-3">
                      {donor.status === 'available' && (
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">Available for contact</span>
                        </div>
                      )}
                      {donor.status === 'contacted' && (
                        <div className="flex items-center space-x-2 text-blue-600">
                          <Phone className="h-4 w-4" />
                          <span className="text-sm">Contacted - awaiting response</span>
                        </div>
                      )}
                      {donor.status === 'responded' && (
                        <div className="flex items-center space-x-2 text-purple-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">Responded - processing</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Selection Checkbox */}
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={selectedDonors.includes(donor.id)}
                      onChange={() => handleSelectDonor(donor.id)}
                      className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      disabled={donor.status !== 'available'}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Brain className="h-6 w-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Prediction Factors</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Response History</span>
                  <span className="font-medium">High Impact</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Donation Date</span>
                  <span className="font-medium">Medium Impact</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Geographic Distance</span>
                  <span className="font-medium">Medium Impact</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Donor Type</span>
                  <span className="font-medium">High Impact</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Recommendation</h4>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Priority contact: <strong>Anonymous Donor 001</strong> (92% availability score).
                  Emergency donor with excellent response history and recent availability.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}