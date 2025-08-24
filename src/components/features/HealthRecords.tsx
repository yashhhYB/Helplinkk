import React, { useState } from 'react';
import { Activity, Plus, TrendingUp, Download, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { useApp } from '../../context/AppContext';

export function HealthRecords() {
  const { healthRecords, addHealthRecord } = useApp();
  const [showTrendsView, setShowTrendsView] = useState(true);

  const latestRecord = healthRecords[0];
  const previousRecord = healthRecords[1];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health History & Trends</h1>
          <p className="text-gray-600">Past transfusion history and health parameter trends</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant={showTrendsView ? "primary" : "outline"} 
            size="sm"
            onClick={() => setShowTrendsView(true)}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Trends
          </Button>
          <Button 
            variant={!showTrendsView ? "primary" : "outline"} 
            size="sm"
            onClick={() => setShowTrendsView(false)}
          >
            <Activity className="h-4 w-4 mr-2" />
            History
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Records
          </Button>
        </div>
      </div>

      {/* Latest Metrics */}
      {latestRecord && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hemoglobin</p>
                  <p className="text-2xl font-bold text-gray-900">{latestRecord.hemoglobinLevel} g/dL</p>
                  {previousRecord && (
                    <div className="flex items-center mt-1">
                      <TrendingUp className={`h-4 w-4 mr-1 ${
                        latestRecord.hemoglobinLevel > previousRecord.hemoglobinLevel 
                          ? 'text-green-600' : 'text-red-600'
                      }`} />
                      <span className={`text-xs ${
                        latestRecord.hemoglobinLevel > previousRecord.hemoglobinLevel 
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {latestRecord.hemoglobinLevel > previousRecord.hemoglobinLevel ? '+' : ''}
                        {(latestRecord.hemoglobinLevel - previousRecord.hemoglobinLevel).toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                <Activity className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Iron Level</p>
                  <p className="text-2xl font-bold text-gray-900">{latestRecord.ironLevel} μg/L</p>
                  <Badge variant="error" className="mt-1">High</Badge>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Weight</p>
                  <p className="text-2xl font-bold text-gray-900">{latestRecord.weight} kg</p>
                  <p className="text-xs text-gray-500 mt-1">Stable</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Blood Pressure</p>
                  <p className="text-lg font-bold text-gray-900">{latestRecord.vitalSigns.bloodPressure}</p>
                  <p className="text-xs text-gray-500 mt-1">Normal</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showTrendsView ? (
        /* Health Trends View */
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Health Parameter Trends</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">
                  {latestRecord ? latestRecord.hemoglobinLevel : 8.2} g/dL
                </p>
                <p className="text-sm text-gray-600">Current Hemoglobin</p>
                <p className="text-xs text-gray-500 mt-1">
                  {previousRecord && latestRecord ? 
                    (latestRecord.hemoglobinLevel > previousRecord.hemoglobinLevel ? '↗️ Improving' : '↘️ Declining') 
                    : 'Stable'
                  }
                </p>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-600">
                  {latestRecord ? latestRecord.ironLevel : 2100} μg/L
                </p>
                <p className="text-sm text-gray-600">Current Iron Level</p>
                <p className="text-xs text-gray-500 mt-1">
                  {latestRecord && latestRecord.ironLevel > 2000 ? '⚠️ High' : '✅ Normal'}
                </p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{healthRecords.length}</p>
                <p className="text-sm text-gray-600">Total Transfusions</p>
                <p className="text-xs text-gray-500 mt-1">
                  Last: {latestRecord ? latestRecord.recordDate.toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Transfusion Frequency Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Average interval between transfusions</p>
                  <p className="font-semibold text-gray-900">21 days</p>
                </div>
                <div>
                  <p className="text-gray-600">Recommended frequency</p>
                  <p className="font-semibold text-gray-900">Every 3-4 weeks</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Past History View */
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Past Transfusion History</h3>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Pre-Transfusion Hb</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Post-Transfusion Hb</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Units Given</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Hospital</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {healthRecords.map((record, index) => (
                    <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">
                        {record.recordDate.toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="warning">
                          {index < healthRecords.length - 1 ? 
                            (healthRecords[index + 1].hemoglobinLevel - 1.5).toFixed(1) : 
                            (record.hemoglobinLevel - 1.5).toFixed(1)
                          } g/dL
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={record.hemoglobinLevel < 8 ? 'error' : record.hemoglobinLevel < 10 ? 'warning' : 'success'}>
                          {record.hemoglobinLevel} g/dL
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-900">2 units</td>
                      <td className="py-3 px-4 text-gray-900">City Hospital</td>
                      <td className="py-3 px-4 text-gray-600 max-w-xs truncate">
                        {record.notes || 'Regular transfusion'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}