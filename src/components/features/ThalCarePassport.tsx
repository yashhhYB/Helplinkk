import React from 'react';
import { 
  Download, 
  Share2, 
  FileText, 
  Heart,
  Activity,
  Calendar,
  MapPin,
  Stethoscope
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useApp } from '../../context/AppContext';

export function ThalCarePassport() {
  const { healthRecords } = useApp();
  
  const patientData = {
    name: 'John Doe',
    id: 'THL-2024-001247',
    bloodType: 'B+',
    hlaType: 'A*01:01, B*08:01, C*07:01',
    dateOfBirth: '1990-05-15',
    emergencyContact: '+1-555-0123',
    preferredHospital: 'City Medical Center'
  };

  const transfusionHistory = healthRecords.map((record, index) => ({
    date: record.recordDate.toLocaleDateString(),
    units: 2,
    location: 'City Hospital',
    hbBefore: index < healthRecords.length - 1 ? healthRecords[index + 1].hemoglobinLevel : record.hemoglobinLevel - 1.5,
    hbAfter: record.hemoglobinLevel
  }));

  const healthTrends = {
    averageHb: healthRecords.length > 0 ? 
      (healthRecords.reduce((sum, record) => sum + record.hemoglobinLevel, 0) / healthRecords.length).toFixed(1) : 8.4,
    lastIronLevel: healthRecords[0]?.ironLevel || 2100,
    chelationCompliance: 85,
    nextAppointment: '2024-02-01'
  };

  const generatePDF = () => {
    // Simulate PDF generation
    const link = document.createElement('a');
    link.href = 'data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQo+PgplbmRvYmoKeHJlZgowIDQKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDQKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjE3NAolJUVPRgo=';
    link.download = 'patient-passport.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Passport</h1>
          <p className="text-gray-600">Digital health record for thalassemia care</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button size="sm" onClick={generatePDF}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Patient Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Patient Information</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Full Name</p>
              <p className="text-lg font-semibold text-gray-900">{patientData.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Patient ID</p>
              <p className="text-lg font-semibold text-gray-900">{patientData.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Blood Type</p>
              <Badge variant="info" className="text-lg px-3 py-1">{patientData.bloodType}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">HLA Type</p>
              <p className="text-sm text-gray-900 font-mono">{patientData.hlaType}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Date of Birth</p>
              <p className="text-lg font-semibold text-gray-900">{patientData.dateOfBirth}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Emergency Contact</p>
              <p className="text-lg font-semibold text-gray-900">{patientData.emergencyContact}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Trends */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Activity className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Health Trends & Metrics</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{healthTrends.averageHb}</p>
              <p className="text-sm text-gray-600">Avg. Hemoglobin</p>
              <p className="text-xs text-gray-500">g/dL (Last 6 months)</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{healthTrends.lastIronLevel}</p>
              <p className="text-sm text-gray-600">Iron Level</p>
              <p className="text-xs text-gray-500">μg/L (Latest)</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{healthTrends.chelationCompliance}%</p>
              <p className="text-sm text-gray-600">Chelation Compliance</p>
              <p className="text-xs text-gray-500">Last 3 months</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-lg font-bold text-purple-600">Feb 1</p>
              <p className="text-sm text-gray-600">Next Appointment</p>
              <p className="text-xs text-gray-500">Dr. Smith</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transfusion History */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Heart className="h-6 w-6 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Transfusion History</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Units</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Location</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Hb Before</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Hb After</th>
                </tr>
              </thead>
              <tbody>
                {transfusionHistory.map((record, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">{record.date}</td>
                    <td className="py-3 px-4 text-gray-900">{record.units}</td>
                    <td className="py-3 px-4 text-gray-900">{record.location}</td>
                    <td className="py-3 px-4">
                      <Badge variant="warning">{record.hbBefore} g/dL</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="success">{record.hbAfter} g/dL</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Preferred Care Team */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Stethoscope className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Preferred Care Team</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Stethoscope className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Dr. Sarah Smith</p>
                  <p className="text-sm text-gray-600">Hematologist</p>
                  <p className="text-sm text-gray-600">City Medical Center</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">{patientData.preferredHospital}</p>
                  <p className="text-sm text-gray-600">Preferred Hospital</p>
                  <p className="text-sm text-gray-600">North Region</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}