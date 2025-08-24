import React, { useState } from 'react';
import { Heart, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useApp } from '../../context/AppContext';
import { BLOOD_TYPES, URGENCY_LEVELS } from '../../utils/constants';

export function BloodRequestForm() {
  const { addBloodRequest, setCurrentView } = useApp();
  const [formData, setFormData] = useState({
    bloodType: '',
    unitsRequired: 1,
    urgency: 'medium',
    hospital: '',
    requiredBy: '',
    notes: ''
  });

  const urgencyOptions = Object.entries(URGENCY_LEVELS).map(([key, value]) => ({
    value: key,
    label: value.label
  }));

  const bloodTypeOptions = BLOOD_TYPES.map(type => ({
    value: type,
    label: type
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addBloodRequest({
      patientId: '1', // Current user ID
      bloodType: formData.bloodType,
      urgency: formData.urgency as any,
      unitsRequired: formData.unitsRequired,
      status: 'pending',
      requiredBy: new Date(formData.requiredBy),
      hospital: formData.hospital,
      notes: formData.notes
    });

    // Reset form
    setFormData({
      bloodType: '',
      unitsRequired: 1,
      urgency: 'medium',
      hospital: '',
      requiredBy: '',
      notes: ''
    });

    // Navigate back to dashboard
    setCurrentView('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Request Blood Transfusion</h2>
              <p className="text-gray-600">Submit a request for blood transfusion</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Blood Type"
                value={formData.bloodType}
                onChange={(e) => setFormData(prev => ({ ...prev, bloodType: e.target.value }))}
                options={[{ value: '', label: 'Select blood type' }, ...bloodTypeOptions]}
                required
              />

              <Input
                label="Units Required"
                type="number"
                min="1"
                max="10"
                value={formData.unitsRequired}
                onChange={(e) => setFormData(prev => ({ ...prev, unitsRequired: Number(e.target.value) }))}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Urgency Level"
                value={formData.urgency}
                onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value }))}
                options={urgencyOptions}
                required
              />

              <Input
                label="Required By"
                type="date"
                value={formData.requiredBy}
                onChange={(e) => setFormData(prev => ({ ...prev, requiredBy: e.target.value }))}
                required
              />
            </div>

            <Input
              label="Hospital/Medical Center"
              value={formData.hospital}
              onChange={(e) => setFormData(prev => ({ ...prev, hospital: e.target.value }))}
              placeholder="Enter hospital name"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional information about your request"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Warning Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Important Notice</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Blood requests are processed automatically. We'll first check blood center availability, 
                    then use AI to match you with the most suitable donors in your region.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button variant="outline" className="flex-1">
                Save as Draft
              </Button>
              <Button type="submit" className="flex-1">
                <Heart className="h-4 w-4 mr-2" />
                Submit Request
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}