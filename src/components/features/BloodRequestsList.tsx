import React from 'react';
import { Heart, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useApp } from '../../context/AppContext';
import { URGENCY_LEVELS, REQUEST_STATUS } from '../../utils/constants';

export function BloodRequestsList() {
  const { bloodRequests, updateBloodRequestStatus } = useApp();

  const handleApprove = (id: string) => {
    updateBloodRequestStatus(id, 'approved');
  };

  const handleReject = (id: string) => {
    updateBloodRequestStatus(id, 'rejected');
  };

  const handleFulfill = (id: string) => {
    updateBloodRequestStatus(id, 'fulfilled');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blood Requests Management</h1>
          <p className="text-gray-600">Review and manage all blood transfusion requests</p>
        </div>
        <Badge variant="warning">{bloodRequests.filter(r => r.status === 'pending').length} pending</Badge>
      </div>

      <div className="space-y-4">
        {bloodRequests.map((request) => {
          const urgencyConfig = URGENCY_LEVELS[request.urgency];
          const statusConfig = REQUEST_STATUS[request.status];

          return (
            <Card key={request.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <Badge variant="info" className="text-lg px-3 py-1">
                        {request.bloodType}
                      </Badge>
                      <Badge 
                        variant={request.urgency === 'critical' ? 'error' : 
                                request.urgency === 'high' ? 'warning' : 'default'}
                      >
                        {urgencyConfig.label}
                      </Badge>
                      <Badge 
                        variant={request.status === 'fulfilled' ? 'success' : 
                                request.status === 'approved' ? 'info' :
                                request.status === 'rejected' ? 'error' : 'warning'}
                      >
                        {statusConfig.label}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Units Required</p>
                        <p className="font-semibold text-gray-900">{request.unitsRequired}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Hospital</p>
                        <p className="font-semibold text-gray-900">{request.hospital}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Required By</p>
                        <p className="font-semibold text-gray-900">
                          {request.requiredBy.toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Requested</p>
                        <p className="font-semibold text-gray-900">
                          {request.requestDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {request.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{request.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                    {request.status === 'pending' && (
                      <>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => handleReject(request.id)}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleApprove(request.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                      </>
                    )}
                    {request.status === 'approved' && (
                      <Button 
                        variant="secondary"
                        size="sm"
                        onClick={() => handleFulfill(request.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Fulfilled
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}