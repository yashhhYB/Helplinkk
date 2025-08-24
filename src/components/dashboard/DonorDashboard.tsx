import React from 'react';
import { 
  Heart, 
  MapPin, 
  Clock, 
  Award,
  Bell,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useApp } from '../../context/AppContext';

export function DonorDashboard() {
  const { bloodRequests, updateBloodRequestStatus } = useApp();
  
  const donorStats = {
    totalDonations: 12,
    lastDonation: '2023-12-10',
    nextEligible: '2024-02-10',
    compatibleRequests: 3
  };

  const recentRequests = bloodRequests.map(request => ({
    ...request,
    patient: 'Anonymous Patient',
    location: request.hospital,
    requestedAt: request.requestDate.toLocaleDateString()
  }));

  const handleAcceptRequest = (id: string) => {
    updateBloodRequestStatus(id, 'approved');
  };

  const handleDeclineRequest = (id: string) => {
    updateBloodRequestStatus(id, 'rejected');
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donor Dashboard</h1>
          <p className="text-gray-600">Thank you for being a life-saver</p>
        </div>
        <Button size="sm">
          <Bell className="h-4 w-4 mr-2" />
          Notification Settings
        </Button>
      </div>

      {/* Donor Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Donations</p>
                <p className="text-2xl font-bold text-blue-600">{donorStats.totalDonations}</p>
              </div>
              <Award className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Last Donation</p>
                <p className="text-lg font-semibold text-gray-900">Dec 10, 2023</p>
                <p className="text-xs text-gray-500">42 days ago</p>
              </div>
              <Heart className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Next Eligible</p>
                <p className="text-lg font-semibold text-green-600">Feb 10, 2024</p>
                <p className="text-xs text-gray-500">20 days</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Requests</p>
                <p className="text-2xl font-bold text-orange-600">{donorStats.compatibleRequests}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Availability Status */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Availability Status</h3>
            <Badge variant="success">Available</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">You are currently available for donations</p>
              <p className="text-sm text-gray-600">Next eligible donation: February 10, 2024</p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto">
              Update Status
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Recent Blood Requests</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge variant="info">{request.bloodType}</Badge>
                      <Badge 
                        variant={request.urgency === 'critical' ? 'error' : request.urgency === 'high' ? 'warning' : 'default'}
                      >
                        {request.urgency} priority
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{request.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Requested {request.requestedAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {request.status === 'pending' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeclineRequest(request.id)}
                        >
                          Decline
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleAcceptRequest(request.id)}
                        >
                          Accept
                        </Button>
                      </>
                    )}
                    {request.status === 'approved' && (
                      <Badge variant="success">Accepted</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}