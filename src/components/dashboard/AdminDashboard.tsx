import React, { useState } from 'react';
import { 
  Brain,
  Users, 
  Heart, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Activity,
  Calendar,
  Search,
  Filter,
  Stethoscope
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { AIBloodBankOptimizer, FraudDetectionSystem } from '../../services/aiModels';
import { GoogleMapsService } from '../../services/aiModels';
import { useApp } from '../../context/AppContext';
import { mockPatients } from '../../services/supabase';

export function AdminDashboard() {
  const { 
    bloodRequests, 
    transplantRequests, 
    financialRequests, 
    updateTransplantRequestStatus, 
    updateFinancialRequestStatus,
    setCurrentView 
  } = useApp();
  
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedBloodType, setSelectedBloodType] = useState('all');
  const [showEventModal, setShowEventModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [showPatientsModal, setShowPatientsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterBloodType, setFilterBloodType] = useState('all');
  const [aiPredictions, setAIPredictions] = useState<any[]>([]);
  const [eventData, setEventData] = useState({
    title: '',
    type: 'blood_camp',
    date: '',
    location: '',
    targetGroup: 'all'
  });
  const [stockData, setStockData] = useState({
    region: 'Maharashtra',
    bloodType: 'O+',
    currentStock: '',
    capacity: '',
    expiryDate: ''
  });
  
  // Load AI predictions on component mount
  React.useEffect(() => {
    const predictions = AIBloodBankOptimizer.predictSupplyDemandMismatch('Maharashtra', 14);
    setAIPredictions(predictions);
  }, []);

  // Filter patients based on search and filters
  const filteredPatients = mockPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = filterRegion === 'all' || patient.state === filterRegion;
    const matchesBloodType = filterBloodType === 'all' || patient.bloodType === filterBloodType;
    
    return matchesSearch && matchesRegion && matchesBloodType;
  });
  // Enhanced system stats with real calculations
  const systemStats = {
    totalPatients: mockPatients.length,
    activeUsers: 30,
    traineesDoctors: 8,
    pendingRequests: 8,
    todayFulfilled: 3,
    totalConsultations: 156,
    bloodInventory: 89,
    criticalRequests: 2,
    patientsByAge: {
      '0-18': 12,
      '19-35': 18,
      '36-50': 11,
      '50+': 4
    },
    patientsByRegion: {
      'Maharashtra': 15,
      'Gujarat': 12,
      'Karnataka': 8,
      'Tamil Nadu': 6,
      'Others': 4
    },
    bloodRequirementByType: {
      'O+': 18,
      'A+': 15,
      'B+': 12,
      'AB+': 8,
      'O-': 6,
      'A-': 4,
      'B-': 3,
      'AB-': 2
    }
  };

  // Real blood availability data by region
  const bloodAvailabilityByRegion = {
    'Maharashtra': { 'O+': 45, 'A+': 32, 'B+': 28, 'AB+': 15, 'O-': 12, 'A-': 8, 'B-': 6, 'AB-': 3 },
    'Gujarat': { 'O+': 38, 'A+': 25, 'B+': 22, 'AB+': 12, 'O-': 8, 'A-': 6, 'B-': 4, 'AB-': 2 },
    'Karnataka': { 'O+': 42, 'A+': 28, 'B+': 25, 'AB+': 14, 'O-': 10, 'A-': 7, 'B-': 5, 'AB-': 2 }
  };

  const recurringDonorPredictions = [
    { region: 'Maharashtra', bloodType: 'O+', predictedUnits: 85, confidence: 0.92 },
    { region: 'Maharashtra', bloodType: 'A+', predictedUnits: 67, confidence: 0.88 },
    { region: 'Gujarat', bloodType: 'O+', predictedUnits: 72, confidence: 0.85 },
    { region: 'Karnataka', bloodType: 'B+', predictedUnits: 54, confidence: 0.90 }
  ];

  // Blood demand calculation using the formula
  const calculateBloodDemand = (patients: number, avgWeight: number = 65, avgCurrentHb: number = 7.5, targetHb: number = 10) => {
    // Blood Volume Required (mL) = Weight (kg) × (Hb_target - Hb_current) × 5
    const bloodVolumePerPatient = avgWeight * (targetHb - avgCurrentHb) * 5;
    const totalBloodVolume = patients * bloodVolumePerPatient;
    const unitsRequired = Math.ceil(totalBloodVolume / 450); // 450ml per unit
    return { totalBloodVolume: Math.round(totalBloodVolume), unitsRequired };
  };

  const handleCreateEvent = () => {
    console.log('Creating event:', eventData);
    setShowEventModal(false);
    setEventData({ title: '', type: 'blood_camp', date: '', location: '', targetGroup: 'all' });
  };

  const handleStockUpdate = () => {
    console.log('Updating stock:', stockData);
    setShowStockModal(false);
    setStockData({ region: 'Maharashtra', bloodType: 'O+', currentStock: '', capacity: '', expiryDate: '' });
  };

  const handleShowAIInsights = () => {
    setShowAIInsights(true);
    // Load additional AI data
  };

  const pendingApprovals = [
    ...transplantRequests.filter(r => r.status === 'pending').map(r => ({
      id: r.id,
      type: 'Transplant Request',
      patient: 'John Smith',
      hlaType: r.hlaType,
      submittedAt: r.requestDate.toLocaleDateString(),
      urgency: 'high',
      requestType: 'transplant'
    })),
    ...financialRequests.filter(r => r.status === 'pending').map(r => ({
      id: r.id,
      type: 'Financial Help',
      patient: 'Patient',
      amount: `$${r.amount.toLocaleString()}`,
      submittedAt: r.requestDate.toLocaleDateString(),
      urgency: 'medium',
      requestType: 'financial'
    }))
  ];

  const handleApprove = (id: string, type: string) => {
    if (type === 'transplant') {
      updateTransplantRequestStatus(id, 'approved', 'HLA compatibility confirmed. Approved for transplant list.');
    } else if (type === 'financial') {
      updateFinancialRequestStatus(id, 'approved', 'Financial assistance approved. Funds will be disbursed within 3-5 business days.');
    }
  };

  const handleReject = (id: string, type: string) => {
    if (type === 'transplant') {
      updateTransplantRequestStatus(id, 'rejected', 'Medical criteria not met at this time.');
    } else if (type === 'financial') {
      updateFinancialRequestStatus(id, 'rejected', 'Request does not meet current assistance criteria.');
    }
  };
  const recentActivity = [
    { id: '1', action: 'Blood request fulfilled', details: 'O+ blood delivered to City Hospital', time: '10 min ago' },
    { id: '2', action: 'New donor registered', details: 'Emergency donor in North region', time: '25 min ago' },
    { id: '3', action: 'Financial help approved', details: '$3,000 approved for treatment costs', time: '1 hour ago' }
  ];

  const bloodDemand = calculateBloodDemand(systemStats.totalPatients);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Control Center</h1>
          <p className="text-gray-600">AI-powered analytics and system management</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm" onClick={() => setShowStockModal(true)}>
            <Brain className="h-4 w-4 mr-2" />
            AI Insights
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowStockModal(true)}>
            <Activity className="h-4 w-4 mr-2" />
            Stock Management
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            ML Analytics
          </Button>
          <Button size="sm" onClick={() => setCurrentView('/donors')}>
            <Activity className="h-4 w-4 mr-2" />
            Donor Management
          </Button>
        </div>
      </div>

      {/* Enhanced System Stats - All Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 cursor-pointer hover:bg-blue-50 hover:shadow-md transition-all duration-200" onClick={() => setShowPatientsModal(true)}>
            <div className="text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{systemStats.totalPatients}</p>
              <p className="text-sm text-gray-600">Total Patients</p>
              <p className="text-xs text-blue-600 mt-1">Click to view all</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => console.log('Show all users')}>
            <div className="text-center">
              <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{systemStats.activeUsers}</p>
              <p className="text-sm text-gray-600">Active Users</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => console.log('Show trainee doctors')}>
            <div className="text-center">
              <Stethoscope className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{systemStats.traineesDoctors}</p>
              <p className="text-sm text-gray-600">Trainee Doctors</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => console.log('Show pending requests')}>
            <div className="text-center">
              <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{systemStats.pendingRequests}</p>
              <p className="text-sm text-gray-600">Pending Requests</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => console.log('Show fulfilled requests')}>
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{systemStats.todayFulfilled}</p>
              <p className="text-sm text-gray-600">Total Consultations</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => console.log('Show blood inventory')}>
            <div className="text-center">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{systemStats.totalConsultations}</p>
              <p className="text-sm text-gray-600">Blood Units</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patients Modal */}
      {showPatientsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">All Registered Patients</h3>
                  <p className="text-gray-600">Total: {filteredPatients.length} patients</p>
                </div>
                <button 
                  onClick={() => setShowPatientsModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>
              
              {/* Search and Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Search by name, ID, or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Regions' },
                    { value: 'Maharashtra', label: 'Maharashtra' },
                    { value: 'Gujarat', label: 'Gujarat' },
                    { value: 'Karnataka', label: 'Karnataka' }
                  ]}
                />
                <Select
                  value={filterBloodType}
                  onChange={(e) => setFilterBloodType(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Blood Types' },
                    { value: 'O+', label: 'O+' },
                    { value: 'A+', label: 'A+' },
                    { value: 'B+', label: 'B+' },
                    { value: 'AB+', label: 'AB+' },
                    { value: 'O-', label: 'O-' },
                    { value: 'A-', label: 'A-' },
                    { value: 'B-', label: 'B-' },
                    { value: 'AB-', label: 'AB-' }
                  ]}
                />
              </div>
            </div>
            
            {/* Patients List */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPatients.map((patient) => (
                  <Card key={patient.id} className="hover:shadow-lg transition-all duration-200 border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-lg">{patient.name}</h4>
                          <p className="text-sm text-gray-600">ID: {patient.id}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="info">{patient.bloodType}</Badge>
                            <Badge variant={patient.gender === 'Male' ? 'default' : 'success'}>
                              {patient.gender}
                            </Badge>
                            <Badge variant="warning">{patient.age}y</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium text-gray-900">{patient.city}, {patient.state}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Area:</span>
                          <span className="font-medium text-gray-900">{patient.area}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Hemoglobin:</span>
                          <Badge variant={patient.hbLevel < 7 ? 'error' : patient.hbLevel < 9 ? 'warning' : 'success'}>
                            {patient.hbLevel} g/dL
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Iron Level:</span>
                          <Badge variant={patient.ironLevel > 2000 ? 'error' : patient.ironLevel > 1500 ? 'warning' : 'success'}>
                            {patient.ironLevel} μg/L
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Weight:</span>
                          <span className="font-medium text-gray-900">{patient.weight} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Transfusion:</span>
                          <span className="font-medium text-gray-900">{patient.lastTransfusion}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium text-gray-900">{patient.phone}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">HLA Type:</p>
                        <p className="text-xs font-mono text-gray-800">{patient.hlaType}</p>
                      </div>
                      
                      <div className="mt-4 flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          View Dashboard
                        </Button>
                        <Button size="sm" variant="outline">
                          Contact
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {filteredPatients.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-600 mb-2">No patients found</h4>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
            
            {/* Summary Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-blue-600">{filteredPatients.filter(p => p.state === 'Maharashtra').length}</p>
                  <p className="text-xs text-gray-600">Maharashtra</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-green-600">{filteredPatients.filter(p => p.state === 'Gujarat').length}</p>
                  <p className="text-xs text-gray-600">Gujarat</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-purple-600">{filteredPatients.filter(p => p.state === 'Karnataka').length}</p>
                  <p className="text-xs text-gray-600">Karnataka</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-red-600">{filteredPatients.filter(p => p.hbLevel < 7).length}</p>
                  <p className="text-xs text-gray-600">Critical Hb</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Blood Demand Forecasting */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Brain className="h-6 w-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">AI Blood Demand Forecasting</h3>
              <Badge variant="success">Live Predictions</Badge>
            </div>
            <Button size="sm" onClick={handleShowAIInsights}>
              View Detailed Analysis
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentView('/donor-management')}>
              <Users className="h-4 w-4 mr-2" />
              View All Donors
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <Heart className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-blue-700">{bloodDemand.unitsRequired}</p>
              <p className="text-sm text-blue-600 font-medium">Units Required (Next 2 Weeks)</p>
              <p className="text-xs text-blue-500 mt-1">Based on current patient data</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
              <TrendingUp className="h-8 w-8 text-red-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-red-700">{Math.round(bloodDemand.totalBloodVolume / 1000)}L</p>
              <p className="text-sm text-red-600 font-medium">Total Blood Volume</p>
              <p className="text-xs text-red-500 mt-1">Calculated using AI formula</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <Activity className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-green-700">85%</p>
              <p className="text-sm text-green-600 font-medium">Prediction Accuracy</p>
              <p className="text-xs text-green-500 mt-1">Based on historical data</p>
            </div>
          </div>

          {/* AI Predictions Table */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-medium text-gray-900 mb-4">Supply-Demand Mismatch Predictions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {aiPredictions.slice(0, 4).map((prediction, index) => (
                <div key={index} className="bg-white p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="info">{prediction.bloodType}</Badge>
                    <Badge variant={prediction.status === 'critical' ? 'error' : prediction.status === 'low' ? 'warning' : 'success'}>
                      {prediction.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{prediction.recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Dashboard */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">AI-Powered Blood Demand Forecasting</h3>
            <div className="flex space-x-3">
              <Select
                label=""
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                options={[
                  { value: 'week', label: 'This Week' },
                  { value: 'month', label: 'This Month' },
                  { value: 'quarter', label: 'This Quarter' },
                  { value: 'year', label: 'This Year' }
                ]}
              />
              <Button size="sm" onClick={() => setShowEventModal(true)}>
                <Calendar className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>
          </div>
        </CardHeader> 
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patient Demographics */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Patients by Age Group</h4>
              <div className="space-y-2">
                {Object.entries(systemStats.patientsByAge).map(([age, count]) => (
                  <div key={age} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{age} years</span>
                    <Badge variant="info">{count}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Regional Distribution */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Patients by Region</h4>
              <div className="space-y-2">
                {Object.entries(systemStats.patientsByRegion).map(([region, count]) => (
                  <div key={region} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{region}</span>
                    <Badge variant="success">{count}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Blood Type Requirements */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Blood Requirement by Type</h4>
              <div className="space-y-2">
                {Object.entries(systemStats.bloodRequirementByType).map(([type, count]) => (
                  <div key={type} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{type}</span>
                    <Badge variant="warning">{count} units</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blood Availability vs Demand */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Regional Blood Stock Management</h3>
            <Badge variant="info">Real-time Data</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Region</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">O+</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">A+</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">B+</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">AB+</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(bloodAvailabilityByRegion).map(([region, availability]) => (
                  <tr key={region} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">{region}</td>
                    <td className="py-3 px-4">{availability['O+']} units</td>
                    <td className="py-3 px-4">{availability['A+']} units</td>
                    <td className="py-3 px-4">{availability['B+']} units</td>
                    <td className="py-3 px-4">{availability['AB+']} units</td>
                    <td className="py-3 px-4">
                      <Badge variant={availability['O+'] > 40 ? 'success' : availability['O+'] > 20 ? 'warning' : 'error'}>
                        {availability['O+'] > 40 ? 'Adequate' : availability['O+'] > 20 ? 'Low' : 'Critical'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recurring Donor Predictions */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900">AI Recurring Donor Predictions</h3>
            <Badge variant="success">Azure ML Powered</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recurringDonorPredictions.map((prediction, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{prediction.region} - {prediction.bloodType}</p>
                  <p className="text-sm text-gray-600">Predicted units: {prediction.predictedUnits}</p>
                </div>
                <Badge variant="info">{Math.round(prediction.confidence * 100)}% confidence</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Pending Approvals</h3>
            <Badge variant="warning">{pendingApprovals.length} pending</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingApprovals.map((request) => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-gray-900">{request.type}</h4>
                      <Badge 
                        variant={request.urgency === 'critical' ? 'error' : request.urgency === 'high' ? 'warning' : 'default'}
                      >
                        {request.urgency}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Patient: {request.patient}</p>
                    {request.hlaType && (
                      <p className="text-sm text-gray-600">HLA Type: {request.hlaType}</p>
                    )}
                    {request.amount && (
                      <p className="text-sm text-gray-600">Amount: {request.amount}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">Submitted: {request.submittedAt}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleReject(request.id, request.requestType)}
                    >
                      Reject
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleApprove(request.id, request.requestType)}
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Recent System Activity</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-1 bg-blue-100 rounded-full">
                  <Activity className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.details}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Create Event</h3>
                <button 
                  onClick={() => setShowEventModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <Input
                  label="Event Title"
                  value={eventData.title}
                  onChange={(e) => setEventData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Blood Donation Camp"
                  required
                />
                
                <Select
                  label="Event Type"
                  value={eventData.type}
                  onChange={(e) => setEventData(prev => ({ ...prev, type: e.target.value }))}
                  options={[
                    { value: 'blood_camp', label: 'Blood Donation Camp' },
                    { value: 'virtual_meeting', label: 'Virtual Meeting' },
                    { value: 'awareness', label: 'Awareness Program' }
                  ]}
                />
                
                <Input
                  label="Date"
                  type="date"
                  value={eventData.date}
                  onChange={(e) => setEventData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
                
                <Input
                  label="Location"
                  value={eventData.location}
                  onChange={(e) => setEventData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Mumbai, Maharashtra"
                  required
                />
                
                <Select
                  label="Target Group"
                  value={eventData.targetGroup}
                  onChange={(e) => setEventData(prev => ({ ...prev, targetGroup: e.target.value }))}
                  options={[
                    { value: 'all', label: 'All Users' },
                    { value: 'patients', label: 'Patients Only' },
                    { value: 'users', label: 'Users Only' },
                    { value: 'doctors', label: 'Doctors Only' }
                  ]}
                />
                
                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setShowEventModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateEvent}>
                    Create Event
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stock Management Modal */}
      {showStockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Update Blood Stock</h3>
                <button 
                  onClick={() => setShowStockModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <Select
                  label="Region"
                  value={stockData.region}
                  onChange={(e) => setStockData(prev => ({ ...prev, region: e.target.value }))}
                  options={[
                    { value: 'Maharashtra', label: 'Maharashtra' },
                    { value: 'Gujarat', label: 'Gujarat' },
                    { value: 'Karnataka', label: 'Karnataka' },
                    { value: 'Tamil Nadu', label: 'Tamil Nadu' }
                  ]}
                />
                
                <Select
                  label="Blood Type"
                  value={stockData.bloodType}
                  onChange={(e) => setStockData(prev => ({ ...prev, bloodType: e.target.value }))}
                  options={[
                    { value: 'O+', label: 'O+' },
                    { value: 'A+', label: 'A+' },
                    { value: 'B+', label: 'B+' },
                    { value: 'AB+', label: 'AB+' },
                    { value: 'O-', label: 'O-' },
                    { value: 'A-', label: 'A-' },
                    { value: 'B-', label: 'B-' },
                    { value: 'AB-', label: 'AB-' }
                  ]}
                />
                
                <Input
                  label="Current Stock (Units)"
                  type="number"
                  value={stockData.currentStock}
                  onChange={(e) => setStockData(prev => ({ ...prev, currentStock: e.target.value }))}
                  required
                />
                
                <Input
                  label="Storage Capacity (Units)"
                  type="number"
                  value={stockData.capacity}
                  onChange={(e) => setStockData(prev => ({ ...prev, capacity: e.target.value }))}
                  required
                />
                
                <Input
                  label="Expiry Date"
                  type="date"
                  value={stockData.expiryDate}
                  onChange={(e) => setStockData(prev => ({ ...prev, expiryDate: e.target.value }))}
                  required
                />
                
                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setShowStockModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleStockUpdate}>
                    Update Stock
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