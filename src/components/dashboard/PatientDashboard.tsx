import React, { useState } from 'react';
import { 
  Heart, 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  Plus,
  Activity,
  FileText,
  CreditCard,
  User,
  MessageSquare,
  Download,
  MapPin,
  Phone,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export function PatientDashboard() {
  const { user } = useAuth();
  const { setCurrentView, healthRecords, bloodRequests, addHealthRecord, addBloodRequest } = useApp();
  const [showTransfusionPrompt, setShowTransfusionPrompt] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBloodRequestModal, setShowBloodRequestModal] = useState(false);
  const [transfusionData, setTransfusionData] = useState({
    completed: '',
    reason: '',
    hemoglobin: '',
    weight: '',
    bloodPressure: '',
    nextDate: ''
  });
  const [bloodRequestData, setBloodRequestData] = useState({
    bloodType: '',
    unitsRequired: 1,
    urgency: 'medium',
    hospital: '',
    requiredBy: ''
  });
  
  const latestRecord = healthRecords[0];
  const patientProfile = {
    id: 'THL-2024-A1B2C3',
    name: `${user?.firstName} ${user?.lastName}`,
    age: 28,
    gender: 'Male',
    bloodType: 'B+',
    hlaType: 'A*01:01, B*08:01, C*07:01',
    contact: user?.phone || '+91-9876543210',
    state: user?.region || 'Maharashtra'
  };

  const healthMetrics = {
    hemoglobin: { value: latestRecord?.hemoglobinLevel || 8.2, status: 'low', trend: 'stable' },
    iron: { value: latestRecord?.ironLevel || 2100, status: 'high', trend: 'increasing' },
    liverFunction: { value: 45, status: 'normal', unit: 'ALT U/L' },
    lastTransfusion: latestRecord?.recordDate.toLocaleDateString() || '2024-01-15',
    weight: latestRecord?.weight || 65,
    bloodPressure: latestRecord?.vitalSigns?.bloodPressure || '120/80',
    nextTransfusion: '2024-01-25'
  };

  const isTransfusionDue = new Date().toDateString() === new Date(healthMetrics.nextTransfusion).toDateString();

  const recurringDonors = [
    { id: '1', name: 'Anonymous Donor 001', bloodType: 'B+', lastDonation: '2023-12-10', reliability: 95, location: 'Mumbai' },
    { id: '2', name: 'Anonymous Donor 002', bloodType: 'O+', lastDonation: '2023-12-05', reliability: 88, location: 'Pune' }
  ];

  const handleTransfusionSubmit = () => {
    if (transfusionData.completed === 'yes') {
      addHealthRecord({
        patientId: user?.id || '1',
        recordDate: new Date(),
        hemoglobinLevel: parseFloat(transfusionData.hemoglobin),
        ironLevel: latestRecord?.ironLevel || 2100,
        weight: parseFloat(transfusionData.weight),
        vitalSigns: {
          bloodPressure: transfusionData.bloodPressure,
          heartRate: 72,
          temperature: 36.5
        },
        notes: `Transfusion completed. Next scheduled: ${transfusionData.nextDate}`
      });
    }
    setShowTransfusionPrompt(false);
    setTransfusionData({ completed: '', reason: '', hemoglobin: '', weight: '', bloodPressure: '', nextDate: '' });
  };

  const handleBloodRequest = () => {
    // Create request that will be routed to appropriate doctor
    const requestData = {
      patientId: user?.id || '1',
      patientName: `${user?.firstName} ${user?.lastName}`,
      requestType: 'blood_request' as const,
      title: `Blood Request - ${bloodRequestData.bloodType}`,
      description: `Patient requires ${bloodRequestData.unitsRequired} units of ${bloodRequestData.bloodType} blood at ${bloodRequestData.hospital}`,
      priority: bloodRequestData.urgency === 'critical' ? 'critical' as const : 
                bloodRequestData.urgency === 'high' ? 'high' as const : 'medium' as const,
      region: user?.region || 'Maharashtra',
      healthData: {
        hemoglobinLevel: latestRecord?.hemoglobinLevel || 8.2,
        ironLevel: latestRecord?.ironLevel || 2100,
        weight: latestRecord?.weight || 65,
        bloodType: bloodRequestData.bloodType
      }
    };

    // Route to appropriate doctor
    import('../../services/requestRouting').then(({ requestRoutingService }) => {
      requestRoutingService.routePatientRequest(requestData);
    });

    addBloodRequest({
      patientId: user?.id || '1',
      bloodType: bloodRequestData.bloodType,
      urgency: bloodRequestData.urgency as any,
      unitsRequired: bloodRequestData.unitsRequired,
      status: 'pending',
      requiredBy: new Date(bloodRequestData.requiredBy),
      hospital: bloodRequestData.hospital,
      notes: 'Urgent blood requirement'
    });
    setShowBloodRequestModal(false);
    setBloodRequestData({ bloodType: '', unitsRequired: 1, urgency: 'medium', hospital: '', requiredBy: '' });
  };

  const generateHealthPassport = () => {
    const passportData = {
      patient: patientProfile,
      healthMetrics,
      transfusionHistory: healthRecords.slice(0, 5),
      lastUpdated: new Date().toLocaleDateString()
    };
    
    // Simulate PDF generation
    const dataStr = JSON.stringify(passportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `health-passport-${patientProfile.id}.json`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.firstName}!</h1>
            <p className="opacity-90">Patient ID: {patientProfile.id}</p>
            <p className="opacity-75">Managing your thalassemia care journey</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm" onClick={() => setShowProfileModal(true)} className="text-white border-white hover:bg-white hover:text-blue-600">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button variant="outline" size="sm" onClick={generateHealthPassport} className="text-white border-white hover:bg-white hover:text-blue-600">
              <Download className="h-4 w-4 mr-2" />
              Health Passport
            </Button>
          </div>
        </div>
      </div>

      {/* Transfusion Due Alert */}
      {isTransfusionDue && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-6 w-6 text-orange-600" />
                <div>
                  <p className="font-medium text-orange-800">Daily Check-in: Transfusion Due Today</p>
                  <p className="text-sm text-orange-700">Have you completed your transfusion today?</p>
                </div>
              </div>
              <Button size="sm" onClick={() => setShowTransfusionPrompt(true)} className="bg-orange-600 hover:bg-orange-700">
                Update Status
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hemoglobin Level</p>
                <p className="text-3xl font-bold text-gray-900">{healthMetrics.hemoglobin.value} g/dL</p>
                <Badge variant="warning" className="mt-2">Low</Badge>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${(healthMetrics.hemoglobin.value / 15) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <Activity className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Iron Level</p>
                <p className="text-3xl font-bold text-gray-900">{healthMetrics.iron.value} μg/L</p>
                <Badge variant="error" className="mt-2">High</Badge>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min((healthMetrics.iron.value / 2500) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Liver Function</p>
                <p className="text-3xl font-bold text-gray-900">{healthMetrics.liverFunction.value}</p>
                <p className="text-xs text-gray-500">{healthMetrics.liverFunction.unit}</p>
                <Badge variant="success" className="mt-2">Normal</Badge>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Next Transfusion</p>
                <p className="text-2xl font-semibold text-gray-900">Jan 25</p>
                <p className="text-sm text-gray-500">3 days away</p>
                <p className="text-xs text-gray-400">Weight: {healthMetrics.weight}kg</p>
                <p className="text-xs text-gray-400">BP: {healthMetrics.bloodPressure}</p>
                <div className="mt-2 flex items-center">
                  <Clock className="h-3 w-3 text-purple-600 mr-1" />
                  <span className="text-xs text-purple-600">Countdown: 72 hours</span>
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2 hover:bg-blue-50"
              onClick={() => setShowBloodRequestModal(true)}
            >
              <Heart className="h-6 w-6 text-red-600" />
              <span className="text-sm">Blood Request</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2 hover:bg-green-50"
              onClick={() => setCurrentView('/transplant')}
            >
              <Activity className="h-6 w-6 text-blue-600" />
              <span className="text-sm">Transplant Request</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2 hover:bg-yellow-50"
              onClick={() => setCurrentView('/financial')}
            >
              <CreditCard className="h-6 w-6 text-green-600" />
              <span className="text-sm">Money Donation</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2 hover:bg-purple-50"
              onClick={() => setCurrentView('/consultations')}
            >
              <Calendar className="h-6 w-6 text-purple-600" />
              <span className="text-sm">Doctor Consultation</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2 hover:bg-teal-50"
              onClick={() => setCurrentView('/community')}
            >
              <MessageSquare className="h-6 w-6 text-teal-600" />
              <span className="text-sm">Community Chat</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recurring Donors Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">AI-Matched Recurring Donors</h3>
            <Badge variant="info">AI Powered</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recurringDonors.map((donor) => (
              <div key={donor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-red-100 rounded-full">
                    <Heart className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{donor.name}</p>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <Badge variant="info">{donor.bloodType}</Badge>
                      <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" />{donor.location}</span>
                      <span className="flex items-center"><Clock className="h-3 w-3 mr-1" />Last: {donor.lastDonation}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="success">{donor.reliability}% Reliable</Badge>
                  <Button size="sm" variant="outline" className="mt-2">
                    <Phone className="h-4 w-4 mr-1" />
                    Contact
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Health Trends */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Health Trends & Reports</h3>
            <Button variant="outline" size="sm" onClick={() => setCurrentView('/records')}>
              <TrendingUp className="h-4 w-4 mr-2" />
              View Detailed Reports
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-blue-600">Stable</p>
              <p className="text-sm text-gray-600">Hemoglobin Trend</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-orange-600">Increasing</p>
              <p className="text-sm text-gray-600">Iron Level Trend</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-green-600">Normal</p>
              <p className="text-sm text-gray-600">Liver Function</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Patient Profile</h3>
                <button 
                  onClick={() => setShowProfileModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Patient ID</p>
                    <p className="text-lg font-semibold text-gray-900">{patientProfile.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Age</p>
                    <p className="text-lg font-semibold text-gray-900">{patientProfile.age} years</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Full Name</p>
                  <p className="text-lg font-semibold text-gray-900">{patientProfile.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Gender</p>
                    <p className="text-lg font-semibold text-gray-900">{patientProfile.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Blood Type</p>
                    <Badge variant="info" className="text-lg px-3 py-1">{patientProfile.bloodType}</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">HLA Type</p>
                  <p className="text-sm font-mono text-gray-900 bg-gray-100 p-2 rounded">{patientProfile.hlaType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">State</p>
                  <p className="text-lg font-semibold text-gray-900">{patientProfile.state}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Contact</p>
                  <p className="text-lg font-semibold text-gray-900">{patientProfile.contact}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blood Request Modal */}
      {showBloodRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Blood Request</h3>
                <button 
                  onClick={() => setShowBloodRequestModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Blood Type"
                    value={bloodRequestData.bloodType}
                    onChange={(e) => setBloodRequestData(prev => ({ ...prev, bloodType: e.target.value }))}
                    placeholder="B+"
                    required
                  />
                  <Input
                    label="Units Required"
                    type="number"
                    min="1"
                    value={bloodRequestData.unitsRequired}
                    onChange={(e) => setBloodRequestData(prev => ({ ...prev, unitsRequired: Number(e.target.value) }))}
                    required
                  />
                </div>
                <Input
                  label="Hospital"
                  value={bloodRequestData.hospital}
                  onChange={(e) => setBloodRequestData(prev => ({ ...prev, hospital: e.target.value }))}
                  placeholder="City Medical Center"
                  required
                />
                <Input
                  label="Required By"
                  type="date"
                  value={bloodRequestData.requiredBy}
                  onChange={(e) => setBloodRequestData(prev => ({ ...prev, requiredBy: e.target.value }))}
                  required
                />
                
                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setShowBloodRequestModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleBloodRequest}>
                    Submit Request
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transfusion Prompt Modal */}
      {showTransfusionPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Daily Check-in</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Have you completed your transfusion today?</p>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="completed"
                        value="yes"
                        checked={transfusionData.completed === 'yes'}
                        onChange={(e) => setTransfusionData(prev => ({ ...prev, completed: e.target.value }))}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="completed"
                        value="no"
                        checked={transfusionData.completed === 'no'}
                        onChange={(e) => setTransfusionData(prev => ({ ...prev, completed: e.target.value }))}
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>

                {transfusionData.completed === 'yes' && (
                  <>
                    <Input
                      label="Post-Transfusion Hemoglobin (g/dL)"
                      type="number"
                      step="0.1"
                      value={transfusionData.hemoglobin}
                      onChange={(e) => setTransfusionData(prev => ({ ...prev, hemoglobin: e.target.value }))}
                      required
                    />
                    <Input
                      label="Weight (kg)"
                      type="number"
                      value={transfusionData.weight}
                      onChange={(e) => setTransfusionData(prev => ({ ...prev, weight: e.target.value }))}
                      required
                    />
                    <Input
                      label="Blood Pressure"
                      placeholder="120/80"
                      value={transfusionData.bloodPressure}
                      onChange={(e) => setTransfusionData(prev => ({ ...prev, bloodPressure: e.target.value }))}
                      required
                    />
                    <Input
                      label="Next Transfusion Date"
                      type="date"
                      value={transfusionData.nextDate}
                      onChange={(e) => setTransfusionData(prev => ({ ...prev, nextDate: e.target.value }))}
                      required
                    />
                  </>
                )}

                {transfusionData.completed === 'no' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reason for not completing transfusion</label>
                    <textarea
                      value={transfusionData.reason}
                      onChange={(e) => setTransfusionData(prev => ({ ...prev, reason: e.target.value }))}
                      placeholder="Please state the reason..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        Nearest Hospital: City Medical Center (2.3 km away)
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setShowTransfusionPrompt(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleTransfusionSubmit}>
                    Update Status
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}