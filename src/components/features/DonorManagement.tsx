import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter,
  Phone,
  Mail,
  MapPin,
  Heart,
  Calendar,
  TrendingUp,
  Award,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Plus,
  Eye,
  Edit,
  Star,
  Activity,
  Brain
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { DonorManagementService, DonorProfile } from '../../services/donorData';

export function DonorManagement() {
  const [donors, setDonors] = useState<DonorProfile[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<DonorProfile[]>([]);
  const [selectedDonor, setSelectedDonor] = useState<DonorProfile | null>(null);
  const [showDonorModal, setShowDonorModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    region: 'all',
    bloodType: 'all',
    donorType: 'all',
    availability: 'all',
    eligibility: 'all'
  });
  const [donorStats, setDonorStats] = useState<any>(null);

  useEffect(() => {
    // Load all donors
    const allDonors = DonorManagementService.getAllDonors();
    setDonors(allDonors);
    setFilteredDonors(allDonors);
    
    // Load statistics
    const stats = DonorManagementService.getDonorStatistics();
    setDonorStats(stats);
  }, []);

  useEffect(() => {
    // Apply filters and search
    let filtered = donors;

    // Search filter
    if (searchTerm) {
      filtered = DonorManagementService.searchDonors(searchTerm);
    }

    // Region filter
    if (filters.region !== 'all') {
      filtered = filtered.filter(donor => donor.region === filters.region);
    }

    // Blood type filter
    if (filters.bloodType !== 'all') {
      filtered = filtered.filter(donor => donor.bloodType === filters.bloodType);
    }

    // Donor type filter
    if (filters.donorType !== 'all') {
      filtered = filtered.filter(donor => donor.donorType === filters.donorType);
    }

    // Availability filter
    if (filters.availability !== 'all') {
      filtered = filtered.filter(donor => donor.availabilityStatus === filters.availability);
    }

    // Eligibility filter
    if (filters.eligibility !== 'all') {
      const isEligible = filters.eligibility === 'eligible';
      filtered = filtered.filter(donor => 
        DonorManagementService.isEligibleForDonation(donor) === isEligible
      );
    }

    setFilteredDonors(filtered);
  }, [searchTerm, filters, donors]);

  const handleDonorClick = (donor: DonorProfile) => {
    setSelectedDonor(donor);
    setShowDonorModal(true);
  };

  const handleUpdateAvailability = (donorId: string, status: 'available' | 'unavailable' | 'pending') => {
    DonorManagementService.updateDonorAvailability(donorId, status);
    
    // Update local state
    setDonors(prev => prev.map(donor => 
      donor.id === donorId 
        ? { ...donor, availabilityStatus: status, lastActive: new Date().toISOString() }
        : donor
    ));
  };

  const handleRecordDonation = (donorId: string) => {
    const success = DonorManagementService.recordDonation(donorId, {
      date: new Date().toISOString().split('T')[0],
      location: 'Hospital',
      units: 1,
      recipientType: 'patient',
      notes: 'Emergency donation recorded'
    });

    if (success) {
      // Refresh donor data
      const updatedDonors = DonorManagementService.getAllDonors();
      setDonors(updatedDonors);
      alert('Donation recorded successfully!');
    }
  };

  const exportDonorData = () => {
    const csvData = filteredDonors.map(donor => ({
      ID: donor.id,
      Name: donor.name,
      Age: donor.age,
      Gender: donor.gender,
      BloodType: donor.bloodType,
      Region: donor.region,
      City: donor.city,
      Phone: donor.phone,
      DonorType: donor.donorType,
      TotalDonations: donor.totalDonations,
      LastDonation: donor.lastDonation || 'Never',
      AvailabilityStatus: donor.availabilityStatus,
      DonorScore: donor.donorScore,
      ResponseRate: donor.responseRate
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'donor-database.csv';
    link.click();
  };

  const getDonorStatusColor = (donor: DonorProfile) => {
    if (!DonorManagementService.isEligibleForDonation(donor)) return 'error';
    if (donor.availabilityStatus === 'available') return 'success';
    if (donor.availabilityStatus === 'pending') return 'warning';
    return 'default';
  };

  const getDonorTypeColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'error';
      case 'bridge': return 'warning';
      case 'regular': return 'info';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donor Management System</h1>
          <p className="text-gray-600">Comprehensive donor database and management</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm" onClick={() => setShowStatsModal(true)}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Statistics
          </Button>
          <Button variant="outline" size="sm" onClick={exportDonorData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Donor
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {donorStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-200" onClick={() => setShowStatsModal(true)}>
            <CardContent className="p-4 text-center bg-blue-50">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-700">{donorStats.totalDonors}</p>
              <p className="text-sm text-blue-600">Total Donors</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-200">
            <CardContent className="p-4 text-center bg-green-50">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-700">{donorStats.availableDonors}</p>
              <p className="text-sm text-green-600">Available Now</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-200">
            <CardContent className="p-4 text-center bg-red-50">
              <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-700">{donorStats.emergencyDonors}</p>
              <p className="text-sm text-red-600">Emergency Donors</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-200">
            <CardContent className="p-4 text-center bg-purple-50">
              <Heart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-700">{donorStats.totalDonations}</p>
              <p className="text-sm text-purple-600">Total Donations</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-200">
            <CardContent className="p-4 text-center bg-yellow-50">
              <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-700">{donorStats.averageScore}</p>
              <p className="text-sm text-yellow-600">Avg Score</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search by name, ID, phone, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={filters.region}
              onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
              options={[
                { value: 'all', label: 'All Regions' },
                { value: 'Maharashtra', label: 'Maharashtra' },
                { value: 'Gujarat', label: 'Gujarat' },
                { value: 'Karnataka', label: 'Karnataka' }
              ]}
            />
            <Select
              value={filters.bloodType}
              onChange={(e) => setFilters(prev => ({ ...prev, bloodType: e.target.value }))}
              options={[
                { value: 'all', label: 'All Blood Types' },
                { value: 'O+', label: 'O+' }, { value: 'A+', label: 'A+' },
                { value: 'B+', label: 'B+' }, { value: 'AB+', label: 'AB+' },
                { value: 'O-', label: 'O-' }, { value: 'A-', label: 'A-' },
                { value: 'B-', label: 'B-' }, { value: 'AB-', label: 'AB-' }
              ]}
            />
            <Select
              value={filters.donorType}
              onChange={(e) => setFilters(prev => ({ ...prev, donorType: e.target.value }))}
              options={[
                { value: 'all', label: 'All Types' },
                { value: 'emergency', label: 'Emergency' },
                { value: 'bridge', label: 'Bridge' },
                { value: 'regular', label: 'Regular' }
              ]}
            />
            <Select
              value={filters.availability}
              onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'available', label: 'Available' },
                { value: 'unavailable', label: 'Unavailable' },
                { value: 'pending', label: 'Pending' }
              ]}
            />
          </div>
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {filteredDonors.length} of {donors.length} donors
            </p>
            <Button variant="outline" size="sm" onClick={() => {
              setSearchTerm('');
              setFilters({
                region: 'all',
                bloodType: 'all',
                donorType: 'all',
                availability: 'all',
                eligibility: 'all'
              });
            }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Donors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDonors.map((donor) => {
          const prediction = DonorManagementService.predictDonorAvailability(donor);
          const isEligible = DonorManagementService.isEligibleForDonation(donor);
          const nextEligibleDate = DonorManagementService.getNextEligibleDate(donor);

          return (
            <Card 
              key={donor.id} 
              className="hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-200"
              onClick={() => handleDonorClick(donor)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg">{donor.name}</h4>
                    <p className="text-sm text-gray-600">ID: {donor.id}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="info">{donor.bloodType}</Badge>
                      <Badge variant={getDonorTypeColor(donor.donorType)}>
                        {donor.donorType}
                      </Badge>
                      <Badge variant={donor.gender === 'Male' ? 'default' : 'success'}>
                        {donor.gender}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-bold">{donor.donorScore}</span>
                    </div>
                    <Badge variant={getDonorStatusColor(donor)}>
                      {isEligible ? donor.availabilityStatus : 'Not Eligible'}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Age:</span>
                    <span className="font-medium text-gray-900">{donor.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium text-gray-900">{donor.city}, {donor.state}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Area:</span>
                    <span className="font-medium text-gray-900">{donor.area}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Donations:</span>
                    <Badge variant="success">{donor.totalDonations}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response Rate:</span>
                    <Badge variant={donor.responseRate > 85 ? 'success' : donor.responseRate > 70 ? 'warning' : 'error'}>
                      {donor.responseRate}%
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Donation:</span>
                    <span className="font-medium text-gray-900">{donor.lastDonation || 'Never'}</span>
                  </div>
                  {!isEligible && nextEligibleDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Eligible:</span>
                      <span className="font-medium text-orange-600">{nextEligibleDate.toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* AI Prediction */}
                <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Brain className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-800">AI Prediction</span>
                    </div>
                    <Badge variant="info">{Math.round(prediction.probability * 100)}%</Badge>
                  </div>
                  <div className="text-xs text-purple-700">
                    <p>Availability: {Math.round(prediction.probability * 100)}%</p>
                    <p>Confidence: {Math.round(prediction.confidence * 100)}%</p>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <Button size="sm" className="flex-1" onClick={(e) => {
                    e.stopPropagation();
                    handleDonorClick(donor);
                  }}>
                    <Eye className="h-4 w-4 mr-1" />
                    View Profile
                  </Button>
                  <Button size="sm" variant="outline" onClick={(e) => {
                    e.stopPropagation();
                    window.open(`tel:${donor.phone}`, '_self');
                  }}>
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={(e) => {
                    e.stopPropagation();
                    window.open(`mailto:${donor.email}`, '_self');
                  }}>
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* No Results */}
      {filteredDonors.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-600 mb-2">No donors found</h4>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Donor Profile Modal */}
      {showDonorModal && selectedDonor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedDonor.name}</h3>
                  <p className="text-gray-600">Donor ID: {selectedDonor.id}</p>
                </div>
                <button 
                  onClick={() => setShowDonorModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Donor Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="border-blue-200">
                  <CardContent className="p-4 text-center bg-blue-50">
                    <Heart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-700">{selectedDonor.totalDonations}</p>
                    <p className="text-sm text-blue-600">Total Donations</p>
                  </CardContent>
                </Card>

                <Card className="border-green-200">
                  <CardContent className="p-4 text-center bg-green-50">
                    <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-700">{selectedDonor.responseRate}%</p>
                    <p className="text-sm text-green-600">Response Rate</p>
                  </CardContent>
                </Card>

                <Card className="border-purple-200">
                  <CardContent className="p-4 text-center bg-purple-50">
                    <Star className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-700">{selectedDonor.donorScore}</p>
                    <p className="text-sm text-purple-600">Donor Score</p>
                  </CardContent>
                </Card>

                <Card className="border-orange-200">
                  <CardContent className="p-4 text-center bg-orange-50">
                    <Activity className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-lg font-bold text-orange-700">{selectedDonor.healthMetrics.hemoglobin}</p>
                    <p className="text-sm text-orange-600">Hemoglobin g/dL</p>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <h4 className="text-lg font-semibold text-gray-900">Personal Information</h4>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Full Name</p>
                          <p className="font-medium text-gray-900">{selectedDonor.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Age</p>
                          <p className="font-medium text-gray-900">{selectedDonor.age} years</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Gender</p>
                          <p className="font-medium text-gray-900">{selectedDonor.gender}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Blood Type</p>
                          <Badge variant="info">{selectedDonor.bloodType}</Badge>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Contact</p>
                        <p className="font-medium text-gray-900">{selectedDonor.phone}</p>
                        <p className="text-sm text-gray-600">{selectedDonor.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium text-gray-900">{selectedDonor.area}, {selectedDonor.city}</p>
                        <p className="text-sm text-gray-600">{selectedDonor.state}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Emergency Contact</p>
                        <p className="font-medium text-gray-900">{selectedDonor.emergencyContact}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h4 className="text-lg font-semibold text-gray-900">Donation History</h4>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedDonor.donationHistory.slice(0, 5).map((donation) => (
                        <div key={donation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{donation.location}</p>
                            <p className="text-sm text-gray-600">{donation.date}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="success">{donation.units} unit{donation.units > 1 ? 's' : ''}</Badge>
                            <p className="text-xs text-gray-500 mt-1">{donation.recipientType}</p>
                          </div>
                        </div>
                      ))}
                      {selectedDonor.donationHistory.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">No donation history available</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex space-x-4">
                <Button 
                  className="flex-1"
                  onClick={() => handleUpdateAvailability(
                    selectedDonor.id, 
                    selectedDonor.availabilityStatus === 'available' ? 'unavailable' : 'available'
                  )}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {selectedDonor.availabilityStatus === 'available' ? 'Mark Unavailable' : 'Mark Available'}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleRecordDonation(selectedDonor.id)}
                  disabled={!isEligible}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Record Donation
                </Button>
                <Button variant="outline" onClick={() => window.open(`tel:${selectedDonor.phone}`, '_self')}>
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <Button variant="outline" onClick={() => window.open(`mailto:${selectedDonor.email}`, '_self')}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Modal */}
      {showStatsModal && donorStats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">Donor Statistics & Analytics</h3>
                <button 
                  onClick={() => setShowStatsModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-6 bg-blue-50 rounded-xl">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-blue-700">{donorStats.totalDonors}</p>
                  <p className="text-sm text-blue-600">Total Registered</p>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-xl">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-green-700">{donorStats.verifiedDonors}</p>
                  <p className="text-sm text-green-600">Verified Donors</p>
                </div>
                <div className="text-center p-6 bg-red-50 rounded-xl">
                  <Heart className="h-8 w-8 text-red-600 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-red-700">{donorStats.totalDonations}</p>
                  <p className="text-sm text-red-600">Total Donations</p>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-xl">
                  <Star className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-purple-700">{donorStats.averageScore}</p>
                  <p className="text-sm text-purple-600">Average Score</p>
                </div>
              </div>

              {/* Distribution Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <h4 className="text-lg font-semibold text-gray-900">Blood Type Distribution</h4>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(donorStats.bloodTypeDistribution).map(([bloodType, count]) => (
                        <div key={bloodType} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Badge variant="info">{bloodType}</Badge>
                            <span className="text-sm text-gray-600">{count} donors</span>
                          </div>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(count / donorStats.totalDonors) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h4 className="text-lg font-semibold text-gray-900">Regional Distribution</h4>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(donorStats.regionDistribution).map(([region, count]) => (
                        <div key={region} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">{region}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-600">{count} donors</span>
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(count / donorStats.totalDonors) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}