import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Navigation, Clock, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { GoogleMapsService } from '../../services/aiModels';

interface Hospital {
  id: string;
  name: string;
  address: string;
  distance: string;
  phone: string;
  bloodAvailable: { [key: string]: number };
  coordinates: { lat: number; lng: number };
}

export function NearbyHospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedBloodType, setSelectedBloodType] = useState('O+');
  const [userLocation, setUserLocation] = useState('Mumbai, Maharashtra');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNearbyHospitals();
  }, [selectedBloodType, userLocation]);

  const loadNearbyHospitals = async () => {
    setLoading(true);
    try {
      const nearbyHospitals = await GoogleMapsService.findNearbyHospitals(userLocation, selectedBloodType);
      setHospitals(nearbyHospitals);
    } catch (error) {
      console.error('Error loading hospitals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetDirections = (hospital: Hospital) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hospital.address)}&key=AIzaSyAq4zQcQ1B4vdmZL5suv63IY703bh_whPU`;
    window.open(url, '_blank');
  };

  const handleCallHospital = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleReserveBlood = (hospitalId: string, bloodType: string) => {
    // Show reservation modal or navigate to reservation page
    alert(`Reserving ${bloodType} blood at hospital ${hospitalId}. Doctor will be notified.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nearby Thalassemia Centers</h1>
          <p className="text-gray-600">Find hospitals and blood banks near you</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="success" className="px-3 py-1">
            <MapPin className="h-4 w-4 mr-2" />
            Google Maps Integrated
          </Badge>
        </div>
      </div>

      {/* Search Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Your Location"
              value={userLocation}
              onChange={(e) => setUserLocation(e.target.value)}
              placeholder="Enter your city or area"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Type Needed
              </label>
              <select
                value={selectedBloodType}
                onChange={(e) => setSelectedBloodType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'].map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hospitals List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Finding nearby hospitals...</p>
          </div>
        ) : (
          hospitals.map((hospital) => (
            <Card key={hospital.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{hospital.name}</h3>
                      <Badge variant="info">{hospital.distance}</Badge>
                      <Badge 
                        variant={hospital.bloodAvailable[selectedBloodType] > 10 ? 'success' : 
                                hospital.bloodAvailable[selectedBloodType] > 5 ? 'warning' : 'error'}
                      >
                        {hospital.bloodAvailable[selectedBloodType]} units {selectedBloodType}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{hospital.address}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span>{hospital.phone}</span>
                      </div>
                    </div>

                    {/* Blood Availability */}
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {Object.entries(hospital.bloodAvailable).map(([type, units]) => (
                        <div key={type} className="text-center p-2 bg-gray-50 rounded">
                          <p className="text-xs font-medium text-gray-600">{type}</p>
                          <p className="text-sm font-bold text-gray-900">{units}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <Button size="sm" onClick={() => handleGetDirections(hospital)}>
                      <Navigation className="h-4 w-4 mr-2" />
                      Directions
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleCallHospital(hospital.phone)}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleReserveBlood(hospital.id, selectedBloodType)}>
                      <Heart className="h-4 w-4 mr-2" />
                      Reserve Blood
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Emergency Contact */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-full">
              <Phone className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-red-800">Emergency Blood Requirement</h3>
              <p className="text-sm text-red-700">
                For urgent blood requirements, call our 24/7 helpline: <strong>1800-123-BLOOD</strong>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}