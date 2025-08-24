import React, { useState } from 'react';
import { Video, Plus, Calendar, Clock, CheckCircle, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export function ConsultationRequests() {
  const { user } = useAuth();
  const { consultationRequests, addConsultationRequest, updateConsultationStatus } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'doctor_consultation',
    description: '',
    preferredDate: ''
  });

  const consultationTypes = [
    { value: 'doctor_consultation', label: 'Doctor Consultation' },
    { value: 'counseling', label: 'Counseling Session' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addConsultationRequest({
      patientId: user?.id || '1',
      type: formData.type as any,
      status: 'pending',
      description: formData.description
    });

    setFormData({ type: 'doctor_consultation', description: '', preferredDate: '' });
    setShowAddForm(false);
  };

  const handleSchedule = (id: string) => {
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + 3); // Schedule 3 days from now
    
    updateConsultationStatus(
      id, 
      'scheduled', 
      scheduledDate, 
      `https://teams.microsoft.com/join/consultation-${id}`
    );
  };

  const handleComplete = (id: string) => {
    updateConsultationStatus(id, 'completed');
  };

  const handleWhatsAppContact = (phoneNumber: string) => {
    const message = encodeURIComponent('Hello, I would like to discuss my consultation request.');
    window.open(`https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consultations</h1>
          <p className="text-gray-600">Manage doctor consultations and counseling sessions</p>
        </div>
        {(user?.role === 'patient' || user?.role === 'trainee_doctor') && (
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
              <h3 className="text-lg font-semibold text-gray-900">New Consultation Request</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select
                label="Consultation Type"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                options={consultationTypes}
              />

              <Input
                label="Preferred Date"
                type="date"
                value={formData.preferredDate}
                onChange={(e) => setFormData(prev => ({ ...prev, preferredDate: e.target.value }))}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your consultation needs"
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
                  <Calendar className="h-4 w-4 mr-2" />
                  Submit Request
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Consultations List */}
      <div className="space-y-4">
        {consultationRequests.map((consultation) => (
          <Card key={consultation.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h4 className="font-semibold text-gray-900">
                      {consultation.type === 'doctor_consultation' ? 'Doctor Consultation' : 'Counseling Session'}
                    </h4>
                    <Badge 
                      variant={consultation.status === 'completed' ? 'success' : 
                              consultation.status === 'scheduled' ? 'info' : 'warning'}
                    >
                      {consultation.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Request Date</p>
                      <p className="text-sm text-gray-900">{consultation.requestDate.toLocaleDateString()}</p>
                    </div>
                    {consultation.scheduledDate && (
                      <div>
                        <p className="text-sm text-gray-600">Scheduled Date</p>
                        <p className="text-sm text-gray-900">{consultation.scheduledDate.toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Description</p>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {consultation.description}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-2 ml-4">
                  {consultation.status === 'scheduled' && consultation.meetingLink && (
                    <Button size="sm">
                      <Video className="h-4 w-4 mr-2" />
                      Join Meeting
                    </Button>
                  )}
                  {consultation.status === 'scheduled' && consultation.meetingLink && (
                    <Button variant="outline" size="sm" onClick={() => handleWhatsAppContact('+91-9876543210')}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                  )}
                  
                  {user?.role?.includes('doctor') && consultation.status === 'pending' && (
                    <Button 
                      size="sm"
                      onClick={() => handleSchedule(consultation.id)}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule
                    </Button>
                  )}

                  {user?.role?.includes('doctor') && consultation.status === 'scheduled' && (
                    <Button 
                      variant="secondary"
                      size="sm"
                      onClick={() => handleComplete(consultation.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}