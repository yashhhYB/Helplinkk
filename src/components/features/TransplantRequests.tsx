import React, { useState } from 'react';
import { Activity, Plus, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export function TransplantRequests() {
  const { user } = useAuth();
  const { transplantRequests, addTransplantRequest, updateTransplantRequestStatus } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    hlaType: '',
    medicalJustification: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addTransplantRequest({
      patientId: user?.id || '1',
      hlaType: formData.hlaType,
      status: 'pending',
      medicalJustification: formData.medicalJustification
    });

    setFormData({ hlaType: '', medicalJustification: '' });
    setShowAddForm(false);
  };

  const handleApprove = (id: string) => {
    updateTransplantRequestStatus(id, 'approved', 'HLA compatibility confirmed. Approved for transplant list.');
  };

  const handleReject = (id: string) => {
    updateTransplantRequestStatus(id, 'rejected', 'Medical criteria not met at this time.');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transplant Requests</h1>
          <p className="text-gray-600">Manage bone marrow transplant requests</p>
        </div>
        {user?.role === 'patient' && (
          <Button size="sm" onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        )}
      </div>

      {/* Add Request Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">New Transplant Request</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="HLA Type"
                value={formData.hlaType}
                onChange={(e) => setFormData(prev => ({ ...prev, hlaType: e.target.value }))}
                placeholder="e.g., A*01:01, B*08:01, C*07:01"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Justification
                </label>
                <textarea
                  value={formData.medicalJustification}
                  onChange={(e) => setFormData(prev => ({ ...prev, medicalJustification: e.target.value }))}
                  placeholder="Provide detailed medical justification for transplant request"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex space-x-4">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Activity className="h-4 w-4 mr-2" />
                  Submit Request
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Requests List */}
      <div className="space-y-4">
        {transplantRequests.map((request) => (
          <Card key={request.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h4 className="font-semibold text-gray-900">Transplant Request #{request.id}</h4>
                    <Badge 
                      variant={request.status === 'approved' ? 'success' : 
                              request.status === 'rejected' ? 'error' : 'warning'}
                    >
                      {request.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">HLA Type</p>
                      <p className="font-mono text-sm text-gray-900">{request.hlaType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Request Date</p>
                      <p className="text-sm text-gray-900">{request.requestDate.toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Medical Justification</p>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {request.medicalJustification}
                    </p>
                  </div>

                  {request.adminNotes && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">Admin Notes</p>
                      <p className="text-sm text-blue-700">{request.adminNotes}</p>
                    </div>
                  )}
                </div>

                {user?.role === 'admin' && request.status === 'pending' && (
                  <div className="flex space-x-2 ml-4">
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
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}