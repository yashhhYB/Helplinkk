import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  VideoIcon,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  MessageSquare,
  Activity,
  Heart,
  Phone,
  MapPin,
  Stethoscope,
  TrendingUp,
  Eye,
  Edit,
  Filter,
  Download,
  Plus,
  Star,
  Award,
  Brain
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { requestRoutingService, PatientRequest } from '../../services/requestRouting';
import { mockPatients, mockTrainerDoctors, mockTraineeDoctors } from '../../services/supabase';

export function DoctorDashboard() {
  const { user } = useAuth();
  const { consultationRequests, updateConsultationStatus, setCurrentView } = useApp();
  const isTrainer = user?.role === 'trainer_doctor';
  
  // State management
  const [searchPatientId, setSearchPatientId] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showAllPatients, setShowAllPatients] = useState(false);
  const [showTrainees, setShowTrainees] = useState(false);
  const [showConsultations, setShowConsultations] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showTraineeModal, setShowTraineeModal] = useState(false);
  const [patientRequests, setPatientRequests] = useState<PatientRequest[]>([]);
  const [doctorWorkload, setDoctorWorkload] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    completedToday: 0,
    averageResponseTime: 0
  });
  
  // Filters
  const [patientFilter, setPatientFilter] = useState({
    region: 'all',
    bloodType: 'all',
    status: 'all',
    searchTerm: ''
  });

  // Get current doctor's data
  const currentDoctor = isTrainer 
    ? mockTrainerDoctors.find(d => d.id === user?.id) || mockTrainerDoctors[0]
    : mockTraineeDoctors.find(d => d.id === user?.id) || mockTraineeDoctors[0];

  // Get patients assigned to this doctor (filtered by region)
  const assignedPatients = mockPatients.filter(patient => 
    patient.state === (user?.region || currentDoctor.region)
  );

  // Get trainee doctors under this trainer
  const traineeUnderTrainer = isTrainer 
    ? mockTraineeDoctors.filter(trainee => trainee.trainer === currentDoctor.id)
    : [];

  // Filter patients based on search criteria
  const filteredPatients = assignedPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(patientFilter.searchTerm.toLowerCase()) ||
                         patient.id.toLowerCase().includes(patientFilter.searchTerm.toLowerCase());
    const matchesRegion = patientFilter.region === 'all' || patient.state === patientFilter.region;
    const matchesBloodType = patientFilter.bloodType === 'all' || patient.bloodType === patientFilter.bloodType;
    const matchesStatus = patientFilter.status === 'all' || 
                         (patientFilter.status === 'critical' && patient.hbLevel < 7) ||
                         (patientFilter.status === 'stable' && patient.hbLevel >= 9) ||
                         (patientFilter.status === 'monitoring' && patient.hbLevel >= 7 && patient.hbLevel < 9);
    
    return matchesSearch && matchesRegion && matchesBloodType && matchesStatus;
  });

  // Load doctor's patient requests on component mount
  useEffect(() => {
    if (user?.id) {
      loadDoctorRequests();
      loadDoctorWorkload();
    }
  }, [user?.id]);

  const loadDoctorRequests = async () => {
    try {
      const requests = await requestRoutingService.getDoctorRequests(user?.id || '');
      setPatientRequests(requests);
    } catch (error) {
      console.error('Error loading doctor requests:', error);
    }
  };

  const loadDoctorWorkload = async () => {
    try {
      const workload = await requestRoutingService.getDoctorWorkload(user?.id || '');
      setDoctorWorkload(workload);
    } catch (error) {
      console.error('Error loading doctor workload:', error);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await requestRoutingService.updateRequestStatus(requestId, 'in_progress', 'Request accepted by doctor');
      await loadDoctorRequests();
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleCompleteRequest = async (requestId: string) => {
    try {
      await requestRoutingService.updateRequestStatus(requestId, 'completed', 'Request completed successfully');
      await loadDoctorRequests();
    } catch (error) {
      console.error('Error completing request:', error);
    }
  };

  const handleSearchPatient = () => {
    if (!searchPatientId.trim()) {
      setSearchResults([]);
      return;
    }

    const results = assignedPatients.filter(patient => 
      patient.id.toLowerCase().includes(searchPatientId.toLowerCase()) ||
      patient.name.toLowerCase().includes(searchPatientId.toLowerCase())
    );
    
    setSearchResults(results);
    
    if (results.length === 1) {
      setSelectedPatient(results[0]);
      setShowPatientModal(true);
    }
  };

  const handleScheduleConsultation = (id: string) => {
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + 1);
    scheduledDate.setHours(10, 0, 0, 0);
    
    updateConsultationStatus(
      id, 
      'scheduled', 
      scheduledDate, 
      `https://teams.microsoft.com/join/consultation-${id}`
    );
  };

  const handleJoinMeeting = (meetingLink: string) => {
    window.open(meetingLink, '_blank');
  };

  const generatePatientReport = (patient: any) => {
    const reportData = {
      patient,
      healthMetrics: {
        hemoglobin: patient.hbLevel,
        iron: patient.ironLevel,
        weight: patient.weight
      },
      lastTransfusion: patient.lastTransfusion,
      generatedBy: currentDoctor.name,
      generatedAt: new Date().toLocaleDateString()
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `patient-report-${patient.id}.json`;
    link.click();
  };

  // Enhanced stats with real data
  const todayStats = {
    totalPatients: assignedPatients.length,
    totalTrainees: traineeUnderTrainer.length,
    pendingRequests: patientRequests.filter(r => r.status === 'pending').length,
    totalConsultations: consultationRequests.length,
    criticalPatients: assignedPatients.filter(p => p.hbLevel < 7).length,
    averageResponseTime: doctorWorkload.averageResponseTime
  };

  const upcomingConsultations = consultationRequests
    .filter(c => c.status === 'scheduled')
    .map(consultation => ({
      id: consultation.id,
      patient: 'Patient',
      time: consultation.scheduledDate?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'TBD',
      type: consultation.type === 'doctor_consultation' ? 'Doctor Consultation' : 'Counseling',
      status: consultation.status,
      meetingLink: consultation.meetingLink
    }));

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              {isTrainer ? 'Trainer Doctor' : 'Trainee Doctor'} Dashboard
            </h1>
            <p className="opacity-90 text-lg">Dr. {currentDoctor.name}</p>
            <p className="opacity-75">{currentDoctor.specialization} • {currentDoctor.hospital}</p>
            <p className="opacity-75">{currentDoctor.experience} years experience • {user?.region} region</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              {isTrainer && <Award className="h-5 w-5 text-yellow-300" />}
              <Badge variant="success" className="bg-white text-blue-600">
                {isTrainer ? 'Senior Consultant' : 'Resident Doctor'}
              </Badge>
            </div>
            <p className="text-sm opacity-90">{assignedPatients.length} patients under care</p>
          </div>
        </div>
      </div>

      {/* Enhanced Search Patient */}
      <Card className="border-blue-200 shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Search className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Patient Search & Management</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Input
              placeholder="Search by Patient ID or Name"
              value={searchPatientId}
              onChange={(e) => setSearchPatientId(e.target.value)}
              className="md:col-span-2"
            />
            <Button onClick={handleSearchPatient} className="flex items-center justify-center">
              <Search className="h-4 w-4 mr-2" />
              Search Patient
            </Button>
            <Button variant="outline" onClick={() => setShowAllPatients(!showAllPatients)}>
              <Users className="h-4 w-4 mr-2" />
              {showAllPatients ? 'Hide' : 'View'} All Patients
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-3">Search Results ({searchResults.length})</h4>
              <div className="space-y-2">
                {searchResults.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                    <div>
                      <p className="font-medium text-gray-900">{patient.name}</p>
                      <p className="text-sm text-gray-600">ID: {patient.id} • {patient.bloodType} • {patient.city}</p>
                    </div>
                    <Button size="sm" onClick={() => {
                      setSelectedPatient(patient);
                      setShowPatientModal(true);
                    }}>
                      View Dashboard
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Stats Overview - All Interactive */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-blue-200" 
              onClick={() => setShowAllPatients(true)}>
          <CardContent className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Patients</p>
                <p className="text-3xl font-bold text-blue-800">{todayStats.totalPatients}</p>
                <p className="text-xs text-blue-600 mt-1">Click to view all</p>
              </div>
              <div className="p-3 bg-blue-200 rounded-full">
                <Users className="h-8 w-8 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        {isTrainer && (
          <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-green-200" 
                onClick={() => setShowTrainees(true)}>
            <CardContent className="p-6 bg-gradient-to-br from-green-50 to-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Trainee Doctors</p>
                  <p className="text-3xl font-bold text-green-800">{todayStats.totalTrainees}</p>
                  <p className="text-xs text-green-600 mt-1">Under supervision</p>
                </div>
                <div className="p-3 bg-green-200 rounded-full">
                  <Stethoscope className="h-8 w-8 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-orange-200" 
              onClick={() => setShowConsultations(true)}>
          <CardContent className="p-6 bg-gradient-to-br from-orange-50 to-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Pending Requests</p>
                <p className="text-3xl font-bold text-orange-800">{todayStats.pendingRequests}</p>
                <p className="text-xs text-orange-600 mt-1">Awaiting response</p>
              </div>
              <div className="p-3 bg-orange-200 rounded-full">
                <Clock className="h-8 w-8 text-orange-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-purple-200">
          <CardContent className="p-6 bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Total Consultations</p>
                <p className="text-3xl font-bold text-purple-800">{todayStats.totalConsultations}</p>
                <p className="text-xs text-purple-600 mt-1">This month</p>
              </div>
              <div className="p-3 bg-purple-200 rounded-full">
                <VideoIcon className="h-8 w-8 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Patients Modal */}
      {showAllPatients && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">All Patients - {user?.region} Region</h3>
                  <p className="text-gray-600">Total: {filteredPatients.length} patients under your care</p>
                </div>
                <button 
                  onClick={() => setShowAllPatients(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>
              
              {/* Enhanced Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Search by name or ID..."
                  value={patientFilter.searchTerm}
                  onChange={(e) => setPatientFilter(prev => ({ ...prev, searchTerm: e.target.value }))}
                />
                <Select
                  value={patientFilter.bloodType}
                  onChange={(e) => setPatientFilter(prev => ({ ...prev, bloodType: e.target.value }))}
                  options={[
                    { value: 'all', label: 'All Blood Types' },
                    { value: 'O+', label: 'O+' }, { value: 'A+', label: 'A+' },
                    { value: 'B+', label: 'B+' }, { value: 'AB+', label: 'AB+' },
                    { value: 'O-', label: 'O-' }, { value: 'A-', label: 'A-' },
                    { value: 'B-', label: 'B-' }, { value: 'AB-', label: 'AB-' }
                  ]}
                />
                <Select
                  value={patientFilter.status}
                  onChange={(e) => setPatientFilter(prev => ({ ...prev, status: e.target.value }))}
                  options={[
                    { value: 'all', label: 'All Status' },
                    { value: 'critical', label: 'Critical (Hb < 7)' },
                    { value: 'monitoring', label: 'Monitoring (Hb 7-9)' },
                    { value: 'stable', label: 'Stable (Hb > 9)' }
                  ]}
                />
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export List
                </Button>
              </div>
            </div>
            
            {/* Patients Grid */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPatients.map((patient) => (
                  <Card key={patient.id} className="hover:shadow-lg transition-all duration-200 border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
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
                        <div className="text-right">
                          <Badge variant={patient.hbLevel < 7 ? 'error' : patient.hbLevel < 9 ? 'warning' : 'success'}>
                            {patient.hbLevel < 7 ? 'Critical' : patient.hbLevel < 9 ? 'Monitor' : 'Stable'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-3 text-sm">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-gray-600">Location:</span>
                            <p className="font-medium text-gray-900">{patient.city}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Area:</span>
                            <p className="font-medium text-gray-900">{patient.area}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-gray-600">Hemoglobin:</span>
                            <Badge variant={patient.hbLevel < 7 ? 'error' : patient.hbLevel < 9 ? 'warning' : 'success'}>
                              {patient.hbLevel} g/dL
                            </Badge>
                          </div>
                          <div>
                            <span className="text-gray-600">Iron Level:</span>
                            <Badge variant={patient.ironLevel > 2000 ? 'error' : patient.ironLevel > 1500 ? 'warning' : 'success'}>
                              {patient.ironLevel} μg/L
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-gray-600">Weight:</span>
                            <p className="font-medium text-gray-900">{patient.weight} kg</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Last Transfusion:</span>
                            <p className="font-medium text-gray-900">{patient.lastTransfusion}</p>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-gray-600">Phone:</span>
                          <p className="font-medium text-gray-900">{patient.phone}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">HLA Type:</p>
                        <p className="text-xs font-mono text-gray-800">{patient.hlaType}</p>
                      </div>
                      
                      <div className="mt-4 flex space-x-2">
                        <Button size="sm" className="flex-1" onClick={() => {
                          setSelectedPatient(patient);
                          setShowPatientModal(true);
                        }}>
                          <Eye className="h-4 w-4 mr-1" />
                          View Dashboard
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => generatePatientReport(patient)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4" />
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
                  <p className="text-lg font-bold text-red-600">{assignedPatients.filter(p => p.hbLevel < 7).length}</p>
                  <p className="text-xs text-gray-600">Critical (Hb &lt; 7)</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-orange-600">{assignedPatients.filter(p => p.hbLevel >= 7 && p.hbLevel < 9).length}</p>
                  <p className="text-xs text-gray-600">Monitoring (Hb 7-9)</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-green-600">{assignedPatients.filter(p => p.hbLevel >= 9).length}</p>
                  <p className="text-xs text-gray-600">Stable (Hb &gt; 9)</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-purple-600">{assignedPatients.filter(p => p.ironLevel > 2000).length}</p>
                  <p className="text-xs text-gray-600">High Iron</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Individual Patient Dashboard Modal */}
      {showPatientModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedPatient.name} - Patient Dashboard</h3>
                  <p className="text-gray-600">ID: {selectedPatient.id} • {selectedPatient.city}, {selectedPatient.state}</p>
                </div>
                <button 
                  onClick={() => setShowPatientModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Patient Health Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="border-red-200">
                  <CardContent className="p-4 text-center bg-red-50">
                    <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-700">{selectedPatient.hbLevel} g/dL</p>
                    <p className="text-sm text-red-600">Hemoglobin</p>
                    <Badge variant={selectedPatient.hbLevel < 7 ? 'error' : selectedPatient.hbLevel < 9 ? 'warning' : 'success'} className="mt-2">
                      {selectedPatient.hbLevel < 7 ? 'Critical' : selectedPatient.hbLevel < 9 ? 'Low' : 'Normal'}
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="border-orange-200">
                  <CardContent className="p-4 text-center bg-orange-50">
                    <Activity className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-orange-700">{selectedPatient.ironLevel} μg/L</p>
                    <p className="text-sm text-orange-600">Iron Level</p>
                    <Badge variant={selectedPatient.ironLevel > 2000 ? 'error' : selectedPatient.ironLevel > 1500 ? 'warning' : 'success'} className="mt-2">
                      {selectedPatient.ironLevel > 2000 ? 'High' : selectedPatient.ironLevel > 1500 ? 'Elevated' : 'Normal'}
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="border-blue-200">
                  <CardContent className="p-4 text-center bg-blue-50">
                    <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-700">{selectedPatient.weight} kg</p>
                    <p className="text-sm text-blue-600">Weight</p>
                    <p className="text-xs text-blue-500 mt-2">BMI: {(selectedPatient.weight / 1.7 / 1.7).toFixed(1)}</p>
                  </CardContent>
                </Card>

                <Card className="border-green-200">
                  <CardContent className="p-4 text-center bg-green-50">
                    <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-lg font-bold text-green-700">{selectedPatient.lastTransfusion}</p>
                    <p className="text-sm text-green-600">Last Transfusion</p>
                    <p className="text-xs text-green-500 mt-2">
                      {Math.floor((new Date().getTime() - new Date(selectedPatient.lastTransfusion).getTime()) / (1000 * 60 * 60 * 24))} days ago
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Patient Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <h4 className="text-lg font-semibold text-gray-900">Patient Information</h4>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Full Name</p>
                          <p className="font-medium text-gray-900">{selectedPatient.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Age</p>
                          <p className="font-medium text-gray-900">{selectedPatient.age} years</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Gender</p>
                          <p className="font-medium text-gray-900">{selectedPatient.gender}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Blood Type</p>
                          <Badge variant="info">{selectedPatient.bloodType}</Badge>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">HLA Type</p>
                        <p className="text-sm font-mono bg-gray-100 p-2 rounded">{selectedPatient.hlaType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Contact</p>
                        <p className="font-medium text-gray-900">{selectedPatient.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium text-gray-900">{selectedPatient.area}, {selectedPatient.city}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h4 className="text-lg font-semibold text-gray-900">Treatment Plan</h4>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h5 className="font-medium text-blue-800 mb-2">Next Transfusion</h5>
                        <p className="text-sm text-blue-700">
                          Recommended: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-blue-600">Based on current Hb levels</p>
                      </div>
                      
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <h5 className="font-medium text-orange-800 mb-2">Iron Chelation</h5>
                        <p className="text-sm text-orange-700">
                          {selectedPatient.ironLevel > 2000 ? 'Increase dosage' : 'Continue current regimen'}
                        </p>
                        <p className="text-xs text-orange-600">Monitor liver function</p>
                      </div>
                      
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h5 className="font-medium text-green-800 mb-2">Follow-up</h5>
                        <p className="text-sm text-green-700">Schedule in 2 weeks</p>
                        <p className="text-xs text-green-600">Regular monitoring required</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex space-x-4">
                <Button className="flex-1">
                  <VideoIcon className="h-4 w-4 mr-2" />
                  Schedule Video Consultation
                </Button>
                <Button variant="outline" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  Update Treatment Plan
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => generatePatientReport(selectedPatient)}>
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Patient
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trainee Doctors Modal */}
      {showTrainees && isTrainer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Trainee Doctors Under Supervision</h3>
                  <p className="text-gray-600">Total: {traineeUnderTrainer.length} trainee doctors</p>
                </div>
                <button 
                  onClick={() => setShowTrainees(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {traineeUnderTrainer.map((trainee) => (
                  <Card key={trainee.id} className="hover:shadow-lg transition-shadow border border-green-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-lg">{trainee.name}</h4>
                          <p className="text-sm text-gray-600">{trainee.specialization}</p>
                          <p className="text-sm text-gray-600">{trainee.hospital}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="info">{trainee.experience} years</Badge>
                            <Badge variant="success">{trainee.linkedPatients} patients</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 mb-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">4.{Math.floor(Math.random() * 3) + 6}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium text-gray-900">{trainee.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Region:</span>
                          <span className="font-medium text-gray-900">{trainee.region}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Patients Load:</span>
                          <Badge variant={trainee.linkedPatients > 15 ? 'warning' : 'success'}>
                            {trainee.linkedPatients}/20
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex space-x-2">
                        <Button size="sm" className="flex-1">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                        <Button size="sm" variant="outline">
                          <VideoIcon className="h-4 w-4 mr-2" />
                          Video Call
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Consultations Modal */}
      {showConsultations && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Consultation Management</h3>
                  <p className="text-gray-600">Pending: {todayStats.pendingRequests} • Scheduled: {upcomingConsultations.length}</p>
                </div>
                <button 
                  onClick={() => setShowConsultations(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Pending Requests */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Pending Consultation Requests</h4>
                <div className="space-y-4">
                  {consultationRequests.filter(r => r.status === 'pending').map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h5 className="font-medium text-gray-900">
                            {request.type === 'doctor_consultation' ? 'Doctor Consultation' : 'Counseling Session'}
                          </h5>
                          <Badge variant="warning">Pending</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{request.description}</p>
                        <p className="text-xs text-gray-500">Requested: {request.requestDate.toLocaleDateString()}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => handleScheduleConsultation(request.id)}>
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Consultations */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Consultations</h4>
                <div className="space-y-4">
                  {upcomingConsultations.map((consultation) => (
                    <div key={consultation.id} className="flex items-center justify-between p-4 border border-green-200 rounded-lg bg-green-50">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h5 className="font-medium text-gray-900">{consultation.type}</h5>
                          <Badge variant="success">Scheduled</Badge>
                        </div>
                        <p className="text-sm text-gray-600">Time: {consultation.time}</p>
                      </div>
                      <div className="flex space-x-2">
                        {consultation.meetingLink && (
                          <Button size="sm" onClick={() => handleJoinMeeting(consultation.meetingLink)}>
                            <VideoIcon className="h-4 w-4 mr-2" />
                            Join Meeting
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Patient Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Patient Activity</h3>
            <Button variant="outline" size="sm" onClick={() => setCurrentView('/consultations')}>
              <VideoIcon className="h-4 w-4 mr-2" />
              All Consultations
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignedPatients.slice(0, 5).map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Heart className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{patient.name}</p>
                    <p className="text-sm text-gray-600">Last transfusion: {patient.lastTransfusion}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="info">{patient.bloodType}</Badge>
                      <Badge variant={patient.hbLevel < 7 ? 'error' : patient.hbLevel < 9 ? 'warning' : 'success'}>
                        Hb: {patient.hbLevel} g/dL
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => {
                    setSelectedPatient(patient);
                    setShowPatientModal(true);
                  }}>
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics for Trainers */}
      {isTrainer && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Brain className="h-6 w-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Training Performance Metrics</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <Award className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <p className="text-2xl font-bold text-purple-700">{traineeUnderTrainer.length}</p>
                <p className="text-sm text-purple-600">Trainees Supervised</p>
                <p className="text-xs text-purple-500 mt-1">Active mentorship</p>
              </div>
              
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <p className="text-2xl font-bold text-blue-700">92%</p>
                <p className="text-sm text-blue-600">Training Success Rate</p>
                <p className="text-xs text-blue-500 mt-1">Above average</p>
              </div>
              
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <p className="text-2xl font-bold text-green-700">{Math.round(todayStats.averageResponseTime * 10) / 10}h</p>
                <p className="text-sm text-green-600">Avg Response Time</p>
                <p className="text-xs text-green-500 mt-1">Excellent performance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}