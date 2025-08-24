import React, { useState } from 'react';
import { 
  Heart, 
  MapPin, 
  Users,
  Stethoscope,
  MessageSquare,
  Calendar,
  DollarSign,
  Activity,
  Phone,
  Clock,
  Share2,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useApp } from '../../context/AppContext';

export function UserDashboard() {
  const { setCurrentView } = useApp();
  const [showDonorForm, setShowDonorForm] = useState(false);
  const [isDonor, setIsDonor] = useState(false);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [showNearestCenters, setShowNearestCenters] = useState(false);
  const [showHelpPatients, setShowHelpPatients] = useState(false);
  const [donorData, setDonorData] = useState({
    name: '',
    area: '',
    phone: '',
    bloodType: '',
    lastDonation: ''
  });
  const [nextEligibleDate, setNextEligibleDate] = useState('');
  const [consultationData, setConsultationData] = useState({
    type: 'general',
    description: '',
    preferredDate: ''
  });

  const handleBecomeDonor = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDonor(true);
    setShowDonorForm(false);
    
    // Calculate next eligible date (56 days after last donation)
    if (donorData.lastDonation) {
      const lastDate = new Date(donorData.lastDonation);
      const nextDate = new Date(lastDate.getTime() + (56 * 24 * 60 * 60 * 1000));
      setNextEligibleDate(nextDate.toLocaleDateString());
    } else {
      setNextEligibleDate('Eligible now');
    }
  };

  const handleConsultationRequest = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Consultation request submitted:', consultationData);
    setShowConsultationModal(false);
    setConsultationData({ type: 'general', description: '', preferredDate: '' });
    alert('Consultation request submitted! A doctor will contact you within 24 hours.');
  };

  const handleJoinCommunity = () => {
    setCurrentView('/community');
  };

  const handleNearestCenters = () => {
    setCurrentView('/nearby');
  };

  const handleHelpPatients = () => {
    setShowHelpPatients(true);
  };
  const patientsNeedingHelp = [
    {
      id: '1',
      name: 'Sarah Johnson',
      age: 24,
      bloodType: 'O+',
      need: 'Transplant',
      location: 'Mumbai, Maharashtra',
      story: 'Needs bone marrow transplant urgently. HLA matched donor required.',
      amountNeeded: null,
      hlaType: 'A*01:01, B*08:01'
    },
    {
      id: '2',
      name: 'Rahul Sharma',
      age: 19,
      bloodType: 'B+',
      need: 'Money',
      location: 'Pune, Maharashtra',
      story: 'Family struggling with iron chelation therapy costs.',
      amountNeeded: 15000,
      hlaType: null
    },
    {
      id: '3',
      name: 'Priya Patel',
      age: 16,
      bloodType: 'A+',
      need: 'Blood',
      location: 'Nashik, Maharashtra',
      story: 'Requires regular blood transfusions. Critical hemoglobin levels.',
      amountNeeded: null,
      hlaType: null
    }
  ];

  const nearestCenters = [
    {
      name: 'Thalassemia Care Center Mumbai',
      address: 'Bandra West, Mumbai',
      distance: '2.3 km',
      services: 'Screening, Testing, Counseling',
      phone: '+91-22-2640-1234'
    },
    {
      name: 'Maharashtra Thalassemia Foundation',
      address: 'Dadar, Mumbai',
      distance: '5.1 km',
      services: 'Blood Testing, Genetic Counseling',
      phone: '+91-22-2414-5678'
    },
    {
      name: 'KEM Hospital Thalassemia Unit',
      address: 'Parel, Mumbai',
      distance: '7.8 km',
      services: 'Treatment, Transfusion, Research',
      phone: '+91-22-2413-9876'
    }
  ];

  const availableDoctors = [
    {
      id: '1',
      name: 'Dr. Rajesh Khanna',
      specialization: 'Hematology',
      hospital: 'Tata Memorial Hospital',
      experience: '15 years',
      rating: 4.8,
      nextAvailable: 'Today 3:00 PM',
      consultationFee: '₹800'
    },
    {
      id: '2',
      name: 'Dr. Sunita Verma',
      specialization: 'Pediatric Hematology',
      hospital: 'KEM Hospital',
      experience: '12 years',
      rating: 4.9,
      nextAvailable: 'Tomorrow 10:00 AM',
      consultationFee: '₹600'
    },
    {
      id: '3',
      name: 'Dr. Anil Kumar',
      specialization: 'Transfusion Medicine',
      hospital: 'Lilavati Hospital',
      experience: '18 years',
      rating: 4.7,
      nextAvailable: 'Today 5:30 PM',
      consultationFee: '₹900'
    }
  ];
  const sharePatientProfile = (patient: any) => {
    const shareText = `Help ${patient.name} (${patient.age} years) who needs ${patient.need.toLowerCase()}. ${patient.story} Location: ${patient.location}`;
    
    if (navigator.share) {
      navigator.share({
        title: `Help ${patient.name}`,
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Patient profile copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">User Dashboard</h1>
            <p className="opacity-90">Connect, support, and engage with the thalassemia community</p>
          </div>
          <Button 
            size="sm" 
            onClick={() => setShowDonorForm(true)}
            className="bg-white text-teal-600 hover:bg-gray-100"
          >
            <Heart className="h-4 w-4 mr-2" />
            Become Blood Donor
          </Button>
        </div>
      </div>

      {/* Donor Status */}
      {isDonor && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-800">Active Blood Donor</h3>
                  <p className="text-sm text-green-700">Thank you for being a life-saver!</p>
                  <p className="text-sm text-green-600">Next eligible donation: {nextEligibleDate}</p>
                </div>
              </div>
              <div className="text-right">
                <Button size="sm" variant="outline" className="border-green-600 text-green-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Mark Donation Complete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
            <Button 
              variant="outline" 
              className="h-20 w-full flex-col space-y-2 hover:bg-blue-50 transition-all duration-200 hover:scale-105"
              onClick={() => setShowConsultationModal(true)}
            >
              <Stethoscope className="h-6 w-6 text-blue-600" />
              <span className="text-sm">Doctor Consultation</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 w-full flex-col space-y-2 hover:bg-green-50 transition-all duration-200 hover:scale-105"
              onClick={handleJoinCommunity}
            >
              <MessageSquare className="h-6 w-6 text-green-600" />
              <span className="text-sm">Join Community</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 w-full flex-col space-y-2 hover:bg-purple-50 transition-all duration-200 hover:scale-105"
              onClick={handleNearestCenters}
            >
              <MapPin className="h-6 w-6 text-purple-600" />
              <span className="text-sm">Nearest Centers</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 w-full flex-col space-y-2 hover:bg-orange-50 transition-all duration-200 hover:scale-105"
              onClick={handleHelpPatients}
            >
              <Users className="h-6 w-6 text-orange-600" />
              <span className="text-sm">Help Patients</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Doctor Consultation Modal */}
      {showConsultationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Doctor Consultation</h3>
                <button 
                  onClick={() => setShowConsultationModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Consultation Request Form */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Request Consultation</h4>
                  <form onSubmit={handleConsultationRequest} className="space-y-4">
                    <Select
                      label="Consultation Type"
                      value={consultationData.type}
                      onChange={(e) => setConsultationData(prev => ({ ...prev, type: e.target.value }))}
                      options={[
                        { value: 'general', label: 'General Consultation' },
                        { value: 'emergency', label: 'Emergency Consultation' },
                        { value: 'follow_up', label: 'Follow-up Consultation' },
                        { value: 'second_opinion', label: 'Second Opinion' }
                      ]}
                    />
                    
                    <Input
                      label="Preferred Date"
                      type="date"
                      value={consultationData.preferredDate}
                      onChange={(e) => setConsultationData(prev => ({ ...prev, preferredDate: e.target.value }))}
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Describe your concern
                      </label>
                      <textarea
                        value={consultationData.description}
                        onChange={(e) => setConsultationData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Please describe your symptoms or health concerns..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      <Stethoscope className="h-4 w-4 mr-2" />
                      Submit Consultation Request
                    </Button>
                  </form>
                </div>
                
                {/* Available Doctors */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Available Doctors</h4>
                  <div className="space-y-4">
                    {availableDoctors.map((doctor) => (
                      <div key={doctor.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900">{doctor.name}</h5>
                            <p className="text-sm text-gray-600">{doctor.specialization}</p>
                            <p className="text-sm text-gray-600">{doctor.hospital}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span>⭐ {doctor.rating}</span>
                              <span>📅 {doctor.experience}</span>
                              <span>💰 {doctor.consultationFee}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="success" className="mb-2">{doctor.nextAvailable}</Badge>
                            <Button size="sm" variant="outline">
                              Book Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nearest Centers Modal */}
      {showNearestCenters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Nearest Thalassemia Centers</h3>
                <button 
                  onClick={() => setShowNearestCenters(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                {nearestCenters.map((center, index) => (
                  <div key={index} className="flex items-center justify-between p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-lg">{center.name}</h4>
                      <p className="text-sm text-gray-600 flex items-center mt-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {center.address}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{center.services}</p>
                      <p className="text-sm text-blue-600 flex items-center mt-2">
                        <Phone className="h-4 w-4 mr-1" />
                        {center.phone}
                      </p>
                    </div>
                    <div className="text-right ml-6">
                      <p className="text-lg font-bold text-blue-600 mb-3">{center.distance}</p>
                      <div className="space-y-2">
                        <Button size="sm" className="w-full">
                          <MapPin className="h-4 w-4 mr-2" />
                          Get Directions
                        </Button>
                        <Button size="sm" variant="outline" className="w-full">
                          <Phone className="h-4 w-4 mr-2" />
                          Call Center
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Emergency Contact</h4>
                <p className="text-sm text-blue-700">
                  For urgent blood requirements, call our 24/7 helpline: <strong>1800-123-BLOOD</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Patients Modal */}
      {showHelpPatients && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Help Patients in Need</h3>
                  <p className="text-gray-600">Support fellow thalassemia patients in your community</p>
                </div>
                <button 
                  onClick={() => setShowHelpPatients(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                {patientsNeedingHelp.map((patient) => (
                  <div key={patient.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h4 className="font-bold text-gray-900 text-lg">{patient.name}, {patient.age}</h4>
                          <Badge variant="info">{patient.bloodType}</Badge>
                          <Badge variant={
                            patient.need === 'Transplant' ? 'error' : 
                            patient.need === 'Money' ? 'warning' : 'success'
                          }>
                            {patient.need}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {patient.location}
                        </p>
                        
                        <p className="text-sm text-gray-700 mb-4 leading-relaxed">{patient.story}</p>
                        
                        {patient.amountNeeded && (
                          <div className="bg-green-50 p-3 rounded-lg mb-3">
                            <p className="text-sm font-medium text-green-800">
                              <DollarSign className="h-4 w-4 inline mr-1" />
                              Amount needed: ₹{patient.amountNeeded.toLocaleString()}
                            </p>
                          </div>
                        )}
                        
                        {patient.hlaType && (
                          <div className="bg-blue-50 p-3 rounded-lg mb-3">
                            <p className="text-xs font-medium text-blue-800 mb-1">HLA Type Required:</p>
                            <p className="text-xs font-mono text-blue-700">{patient.hlaType}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col space-y-3 ml-6">
                        <Button size="sm" onClick={() => sharePatientProfile(patient)}>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share Profile
                        </Button>
                        {patient.need === 'Money' && (
                          <Button size="sm" variant="secondary">
                            <DollarSign className="h-4 w-4 mr-2" />
                            Donate Money
                          </Button>
                        )}
                        {patient.need === 'Blood' && (
                          <Button size="sm" variant="secondary">
                            <Heart className="h-4 w-4 mr-2" />
                            Donate Blood
                          </Button>
                        )}
                        {patient.need === 'Transplant' && (
                          <Button size="sm" variant="secondary">
                            <Activity className="h-4 w-4 mr-2" />
                            HLA Match
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">How You Can Help</p>
                    <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                      <li>• Share patient profiles on social media to increase visibility</li>
                      <li>• Donate money for treatment costs and medications</li>
                      <li>• Become a blood donor if you're compatible</li>
                      <li>• Volunteer at local thalassemia centers</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Community Engagement */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Community Engagement</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <MessageSquare className="h-6 w-6 text-blue-600" />
                <h4 className="font-medium text-gray-900">User Community</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">Connect with other users and share experiences</p>
              <Button size="sm" className="w-full" onClick={handleJoinCommunity}>
                Join User Community
              </Button>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <Users className="h-6 w-6 text-green-600" />
                <h4 className="font-medium text-gray-900">Patient Support</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">Join patient community and provide support</p>
              <Button size="sm" variant="outline" className="w-full" onClick={handleJoinCommunity}>
                Join Patient Community
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Become Donor Modal */}
      {showDonorForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Become a Blood Donor</h3>
                <button 
                  onClick={() => setShowDonorForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleBecomeDonor} className="space-y-4">
                <Input
                  label="Full Name"
                  value={donorData.name}
                  onChange={(e) => setDonorData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
                <Input
                  label="Area/Location"
                  value={donorData.area}
                  onChange={(e) => setDonorData(prev => ({ ...prev, area: e.target.value }))}
                  placeholder="e.g., Bandra, Mumbai"
                  required
                />
                <Input
                  label="Phone Number"
                  value={donorData.phone}
                  onChange={(e) => setDonorData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+91-9876543210"
                  required
                />
                <Select
                  label="Blood Type"
                  value={donorData.bloodType}
                  onChange={(e) => setDonorData(prev => ({ ...prev, bloodType: e.target.value }))}
                  options={[
                    { value: '', label: 'Select blood type' },
                    { value: 'A+', label: 'A+' },
                    { value: 'A-', label: 'A-' },
                    { value: 'B+', label: 'B+' },
                    { value: 'B-', label: 'B-' },
                    { value: 'AB+', label: 'AB+' },
                    { value: 'AB-', label: 'AB-' },
                    { value: 'O+', label: 'O+' },
                    { value: 'O-', label: 'O-' }
                  ]}
                  required
                />
                <Input
                  label="Last Donation Date (if any)"
                  type="date"
                  value={donorData.lastDonation}
                  onChange={(e) => setDonorData(prev => ({ ...prev, lastDonation: e.target.value }))}
                />
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Donation Eligibility</p>
                      <p className="text-sm text-blue-700">
                        You can donate blood every 56 days. We'll calculate your next eligible date and send reminders.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <Button type="button" variant="outline" onClick={() => setShowDonorForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Heart className="h-4 w-4 mr-2" />
                    Register as Donor
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}