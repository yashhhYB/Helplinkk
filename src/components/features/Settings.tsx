import React, { useState } from 'react';
import { User, Bell, Shield, Globe, Save } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useAuth } from '../../context/AuthContext';

export function Settings() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    region: user?.region || ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    emergencyAlerts: true
  });

  const regionOptions = [
    { value: 'North', label: 'North' },
    { value: 'South', label: 'South' },
    { value: 'East', label: 'East' },
    { value: 'West', label: 'West' },
    { value: 'Central', label: 'Central' }
  ];

  const handleSaveProfile = () => {
    console.log('Saving profile:', profileData);
    // In a real app, this would update the user profile
  };

  const handleSaveNotifications = () => {
    console.log('Saving notification settings:', notificationSettings);
    // In a real app, this would update notification preferences
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <User className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={profileData.firstName}
              onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
            />
            <Input
              label="Last Name"
              value={profileData.lastName}
              onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
            />
            <Input
              label="Phone Number"
              value={profileData.phone}
              onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
            />
            <Select
              label="Region"
              value={profileData.region}
              onChange={(e) => setProfileData(prev => ({ ...prev, region: e.target.value }))}
              options={regionOptions}
            />
          </div>
          <div className="mt-6">
            <Button onClick={handleSaveProfile}>
              <Save className="h-4 w-4 mr-2" />
              Save Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Bell className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(notificationSettings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </p>
                  <p className="text-sm text-gray-600">
                    {key === 'emailNotifications' && 'Receive updates via email'}
                    {key === 'smsNotifications' && 'Receive SMS alerts for urgent matters'}
                    {key === 'pushNotifications' && 'Browser push notifications'}
                    {key === 'emergencyAlerts' && 'Critical emergency notifications'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setNotificationSettings(prev => ({ 
                      ...prev, 
                      [key]: e.target.checked 
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Button onClick={handleSaveNotifications}>
              <Save className="h-4 w-4 mr-2" />
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Security & Privacy</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button variant="outline">
              Change Password
            </Button>
            <Button variant="outline">
              Two-Factor Authentication
            </Button>
            <Button variant="outline">
              Privacy Settings
            </Button>
            <Button variant="danger">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}