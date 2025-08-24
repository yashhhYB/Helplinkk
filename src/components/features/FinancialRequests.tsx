import React, { useState } from 'react';
import { CreditCard, Plus, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export function FinancialRequests() {
  const { user } = useAuth();
  const { financialRequests, addFinancialRequest, updateFinancialRequestStatus } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    purpose: '',
    documentation: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addFinancialRequest({
      patientId: user?.id || '1',
      amount: parseFloat(formData.amount),
      purpose: formData.purpose,
      status: 'pending',
      documentation: formData.documentation.split(',').map(doc => doc.trim())
    });

    setFormData({ amount: '', purpose: '', documentation: '' });
    setShowAddForm(false);
  };

  const handleApprove = (id: string) => {
    updateFinancialRequestStatus(id, 'approved', 'Financial assistance approved. Funds will be disbursed within 3-5 business days.');
  };

  const handleReject = (id: string) => {
    updateFinancialRequestStatus(id, 'rejected', 'Request does not meet current assistance criteria.');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Assistance</h1>
          <p className="text-gray-600">Request financial help for treatment costs</p>
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
              <h3 className="text-lg font-semibold text-gray-900">New Financial Assistance Request</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Amount Requested ($)"
                  type="number"
                  min="1"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="5000"
                  required
                />
                <Input
                  label="Purpose"
                  value={formData.purpose}
                  onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                  placeholder="e.g., Iron chelation therapy"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supporting Documentation
                </label>
                <textarea
                  value={formData.documentation}
                  onChange={(e) => setFormData(prev => ({ ...prev, documentation: e.target.value }))}
                  placeholder="List supporting documents (comma-separated): medical_report.pdf, prescription.pdf"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex space-x-4">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Submit Request
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Requests List */}
      <div className="space-y-4">
        {financialRequests.map((request) => (
          <Card key={request.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h4 className="font-semibold text-gray-900">Financial Request #{request.id}</h4>
                    <Badge 
                      variant={request.status === 'approved' ? 'success' : 
                              request.status === 'rejected' ? 'error' : 'warning'}
                    >
                      {request.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="text-lg font-bold text-green-600">${request.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Purpose</p>
                      <p className="text-sm text-gray-900">{request.purpose}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Request Date</p>
                      <p className="text-sm text-gray-900">{request.requestDate.toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Documentation</p>
                    <div className="flex flex-wrap gap-2">
                      {request.documentation.map((doc, index) => (
                        <Badge key={index} variant="info">{doc}</Badge>
                      ))}
                    </div>
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