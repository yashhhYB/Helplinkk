import React, { useState } from 'react';
import { Heart, Mail, Lock, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

const roleOptions = [
  { value: 'patient', label: 'Patient' },
  { value: 'user', label: 'User' },
  { value: 'trainer_doctor', label: 'Trainer Doctor' },
  { value: 'trainee_doctor', label: 'Trainee Doctor' },
  { value: 'admin', label: 'Administrator' }
];

interface LoginFormProps {
  preSelectedRole?: string;
}

export function LoginForm({ preSelectedRole }: LoginFormProps) {
  const { login } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: preSelectedRole || 'patient'
  });
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    state: '',
    bloodType: '',
    role: 'patient'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Generate unique patient ID
      const patientId = `THL-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const userData = { ...registerData, patientId };
      
      // Mock registration - in production, this would call your API
      localStorage.setItem('helplink_user', JSON.stringify({
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      
      window.location.reload();
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(formData.email, formData.password, formData.role);
      if (!success) {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl mb-4">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to HelpLink</h1>
          <p className="text-gray-600">Connecting Thalassemia patients with life-saving care</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Sign in to your account</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="I am a"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              options={roleOptions}
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter your email"
              required
            />

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Enter your password"
              required
            />

            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button 
                onClick={() => setShowRegister(true)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Register here
              </button>
            </p>
          </div>

          {/* Registration Modal */}
          {showRegister && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">Create Account</h3>
                    <button 
                      onClick={() => setShowRegister(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="First Name"
                        value={registerData.firstName}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, firstName: e.target.value }))}
                        required
                      />
                      <Input
                        label="Last Name"
                        value={registerData.lastName}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, lastName: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <Input
                      label="Email"
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                    
                    <Input
                      label="Password"
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                    
                    <Input
                      label="Phone"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                    
                    <Input
                      label="State"
                      value={registerData.state}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, state: e.target.value }))}
                      placeholder="e.g., Maharashtra"
                      required
                    />
                    
                    <Select
                      label="Blood Type"
                      value={registerData.bloodType}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, bloodType: e.target.value }))}
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
                    
                    <Select
                      label="I am a"
                      value={registerData.role}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, role: e.target.value }))}
                      options={roleOptions}
                    />
                    
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-700 mb-2">Demo Credentials:</p>
            <p className="text-xs text-gray-600">Email: demo@helplink.com</p>
            <p className="text-xs text-gray-600">Password: demo123</p>
          </div>
        </div>
      </div>
    </div>
  );
}