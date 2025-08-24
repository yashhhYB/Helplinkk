import React, { useState, useEffect } from 'react';
import { Heart, Users, Stethoscope, Shield, ArrowRight, Brain, Activity, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';

interface WelcomeScreenProps {
  onRoleSelect: (role: string) => void;
}

export function WelcomeScreen({ onRoleSelect }: WelcomeScreenProps) {
  const [showBranding, setShowBranding] = useState(true);
  const [showRoles, setShowRoles] = useState(false);
  const [currentDemo, setCurrentDemo] = useState(0);

  const demos = [
    {
      role: 'Patient',
      icon: Heart,
      color: 'from-red-500 to-pink-500',
      description: 'AI-powered health management for thalassemia patients',
      features: [
        '🩺 Real-time health monitoring with AI insights',
        '🏥 Smart hospital & donor matching',
        '📱 Digital health passport with trends'
      ],
      stats: '45+ Patients Registered'
    },
    {
      role: 'User',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      description: 'Join the community and become a life-saving donor',
      features: [
        '❤️ Become a verified blood donor',
        '🤝 Support patients in need',
        '🌟 Gamified donation tracking'
      ],
      stats: '120+ Active Donors'
    },
    {
      role: 'Doctor',
      icon: Stethoscope,
      color: 'from-green-500 to-emerald-500',
      description: 'Advanced tools for thalassemia care management',
      features: [
        '👥 Regional patient management',
        '📹 Virtual consultation platform',
        '🧠 AI-powered decision support'
      ],
      stats: '25+ Medical Professionals'
    },
    {
      role: 'Admin',
      icon: Shield,
      color: 'from-purple-500 to-indigo-500',
      description: 'Comprehensive analytics and resource optimization',
      features: [
        '📊 AI blood demand forecasting',
        '🗺️ Regional resource optimization',
        '🔍 Fraud detection & prevention'
      ],
      stats: 'Managing 3 States'
    }
  ];

  useEffect(() => {
    // Show branding for 2 seconds
    const brandingTimer = setTimeout(() => {
      setShowBranding(false);
      setShowRoles(true);
    }, 2000);

    return () => clearTimeout(brandingTimer);
  }, []);

  useEffect(() => {
    if (showRoles) {
      const interval = setInterval(() => {
        setCurrentDemo((prev) => (prev + 1) % demos.length);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [showRoles, demos.length]);

  if (showBranding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-teal-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-purple-400 rounded-full opacity-30 animate-bounce"></div>
          <div className="absolute bottom-32 left-40 w-28 h-28 bg-teal-400 rounded-full opacity-25 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-20 h-20 bg-pink-400 rounded-full opacity-20 animate-bounce"></div>
        </div>

        <div className="text-center z-10">
          <div className="relative mb-8">
            <div className="inline-flex items-center justify-center p-6 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full shadow-2xl animate-pulse">
              <Heart className="h-20 w-20 text-white animate-bounce" />
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full opacity-30 animate-ping"></div>
          </div>
          
          <h1 className="text-7xl font-bold bg-gradient-to-r from-white via-blue-200 to-teal-200 bg-clip-text text-transparent mb-6 animate-fade-in">
            HelpLink
          </h1>
          
          <div className="space-y-4 animate-fade-in-up">
            <p className="text-2xl text-blue-100 font-light">
              AI-Powered Thalassemia Care Network
            </p>
            <p className="text-lg text-blue-200 opacity-80">
              Connecting Patients • Donors • Doctors • Communities
            </p>
          </div>

          <div className="mt-12 flex justify-center space-x-8">
            <div className="flex items-center space-x-2 text-blue-200">
              <Brain className="h-6 w-6" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-200">
              <Activity className="h-6 w-6" />
              <span>Real-time</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-200">
              <MapPin className="h-6 w-6" />
              <span>Pan-India</span>
            </div>
          </div>

          <div className="mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto opacity-60"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Header */}
      <div className="text-center pt-8 pb-6">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl mb-4 shadow-lg">
          <Heart className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-2">
          Welcome to HelpLink
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          India's first AI-powered thalassemia care ecosystem
        </p>
      </div>

      {/* Interactive Demo Carousel */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl border border-gray-100">
          <div 
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentDemo * 100}%)` }}
          >
            {demos.map((demo, index) => {
              const Icon = demo.icon;
              return (
                <div key={index} className="w-full flex-shrink-0 p-12">
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center p-6 bg-gradient-to-r ${demo.color} rounded-3xl mb-8 shadow-lg`}>
                      <Icon className="h-16 w-16 text-white" />
                    </div>
                    
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">{demo.role} Dashboard</h3>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">{demo.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      {demo.features.map((feature, idx) => (
                        <div key={idx} className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                          <p className="text-sm font-medium text-gray-800">{feature}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-teal-100 rounded-full">
                      <span className="text-sm font-semibold text-blue-800">{demo.stats}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Demo indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {demos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentDemo(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentDemo 
                    ? 'bg-blue-600 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Role Selection Cards */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Choose Your Role</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {demos.map((demo, index) => {
            const Icon = demo.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${demo.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <div className="p-8 text-center relative z-10">
                  <div className={`inline-flex items-center justify-center p-4 bg-gradient-to-r ${demo.color} rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{demo.role}</h3>
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">{demo.description}</p>
                  
                  <div className="mb-6">
                    <span className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                      {demo.stats}
                    </span>
                  </div>
                  
                  <Button
                    onClick={() => onRoleSelect(demo.role.toLowerCase())}
                    className="w-full group-hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-8">Powered by Advanced AI & Technology</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl mb-4">🧠</div>
              <h4 className="font-semibold mb-3 text-lg">AI Health Insights</h4>
              <p className="text-sm opacity-90 leading-relaxed">Smart analysis of health trends with personalized recommendations</p>
            </div>
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl mb-4">🗺️</div>
              <h4 className="font-semibold mb-3 text-lg">Smart Matching</h4>
              <p className="text-sm opacity-90 leading-relaxed">AI-powered donor and hospital matching with real-time optimization</p>
            </div>
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl mb-4">🌐</div>
              <h4 className="font-semibold mb-3 text-lg">Multi-language</h4>
              <p className="text-sm opacity-90 leading-relaxed">Available in Hindi, Marathi, and English with voice support</p>
            </div>
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl mb-4">📊</div>
              <h4 className="font-semibold mb-3 text-lg">Predictive Analytics</h4>
              <p className="text-sm opacity-90 leading-relaxed">Blood demand forecasting and resource optimization</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}