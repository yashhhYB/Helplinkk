import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Users, Heart, Stethoscope, Crown, Award } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { communityMessages } from '../../services/supabase';

interface Message {
  id: string;
  sender: string;
  role: string;
  message: string;
  timestamp: Date;
  likes: number;
  isLiked?: boolean;
}

export function CommunityChat() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(getDefaultTab());
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  function getDefaultTab() {
    if (user?.role === 'patient') return 'patient_community';
    if (user?.role === 'user') return 'user_community';
    if (user?.role?.includes('doctor')) return 'doctor_community';
    return 'user_community';
  }

  useEffect(() => {
    // Load messages based on active tab
    const communityData = communityMessages[activeTab as keyof typeof communityMessages] || [];
    setMessages(communityData.map(msg => ({ ...msg, isLiked: false })));
  }, [activeTab]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: `${user?.firstName} ${user?.lastName?.charAt(0)}.`,
      role: user?.role || 'user',
      message: newMessage,
      timestamp: new Date(),
      likes: 0,
      isLiked: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleLike = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { 
              ...msg, 
              likes: msg.isLiked ? msg.likes - 1 : msg.likes + 1,
              isLiked: !msg.isLiked
            }
          : msg
      )
    );
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'patient':
        return <Badge variant="info" className="flex items-center"><Heart className="h-3 w-3 mr-1" />Patient</Badge>;
      case 'user':
        return <Badge variant="success" className="flex items-center"><Users className="h-3 w-3 mr-1" />User</Badge>;
      case 'trainer_doctor':
        return <Badge variant="warning" className="flex items-center"><Crown className="h-3 w-3 mr-1" />Trainer Doctor</Badge>;
      case 'trainee_doctor':
        return <Badge variant="default" className="flex items-center"><Stethoscope className="h-3 w-3 mr-1" />Trainee Doctor</Badge>;
      default:
        return <Badge variant="default">Member</Badge>;
    }
  };

  const getAvailableTabs = () => {
    const tabs = [];
    
    if (user?.role === 'patient' || user?.role === 'user') {
      tabs.push({ id: 'user_community', label: 'Community', icon: Users, description: 'Patients & Users' });
    }
    
    if (user?.role?.includes('doctor')) {
      tabs.push({ id: 'doctor_community', label: 'Doctors', icon: Stethoscope, description: 'Medical Professionals' });
      tabs.push({ id: 'user_community', label: 'Community', icon: Users, description: 'Patients & Users' });
    }
    
    if (user?.role === 'admin') {
      tabs.push({ id: 'user_community', label: 'Community', icon: Users, description: 'Patients & Users' });
      tabs.push({ id: 'doctor_community', label: 'Doctors', icon: Stethoscope, description: 'Medical Professionals' });
    }
    
    return tabs;
  };

  const availableTabs = getAvailableTabs();

  const getCommunityStats = () => {
    const stats = {
      'user_community': { members: 150, online: 23, todayMessages: 45 },
      'doctor_community': { members: 35, online: 8, todayMessages: 12 }
    };
    return stats[activeTab as keyof typeof stats] || { members: 0, online: 0, todayMessages: 0 };
  };

  const stats = getCommunityStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Community Chat</h1>
          <p className="text-gray-600">Connect with the thalassemia community</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.members}</p>
            <p className="text-xs text-gray-500">Members</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.online}</p>
            <p className="text-xs text-gray-500">Online</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.todayMessages}</p>
            <p className="text-xs text-gray-500">Today</p>
          </div>
        </div>
      </div>

      {/* Community Tabs */}
      <div className="flex space-x-4">
        {availableTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'primary' : 'outline'}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center space-x-2"
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {availableTabs.find(t => t.id === activeTab)?.label} Chat
              </h3>
              <p className="text-sm text-gray-600">
                {availableTabs.find(t => t.id === activeTab)?.description}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">{stats.online} online</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div key={message.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {message.sender.charAt(0)}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">{message.sender}</span>
                      <div className="flex items-center space-x-2 mt-1">
                        {getRoleBadge(message.role)}
                        {message.role === 'trainer_doctor' && (
                          <Award className="h-4 w-4 text-yellow-500" title="Verified Medical Professional" />
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-3 leading-relaxed">{message.message}</p>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLike(message.id)}
                    className={`flex items-center space-x-1 text-sm transition-colors ${
                      message.isLiked 
                        ? 'text-red-600 hover:text-red-700' 
                        : 'text-gray-500 hover:text-red-600'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${message.isLiked ? 'fill-current' : ''}`} />
                    <span>{message.likes}</span>
                  </button>
                  <button className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                    Reply
                  </button>
                  <button className="text-sm text-gray-500 hover:text-green-600 transition-colors">
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Community Guidelines */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Community Guidelines</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Be respectful and supportive to all members</li>
              <li>• Share experiences and knowledge to help others</li>
              <li>• No medical advice - consult doctors for medical decisions</li>
              <li>• Keep discussions relevant to thalassemia care</li>
            </ul>
          </div>

          {/* Message Input */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Share your thoughts with the community..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Community Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Support Groups</h3>
            <p className="text-sm text-gray-600">Join specialized support groups for different aspects of thalassemia care</p>
            <Button variant="outline" size="sm" className="mt-4">
              Explore Groups
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Mentorship</h3>
            <p className="text-sm text-gray-600">Connect with experienced patients and caregivers for guidance</p>
            <Button variant="outline" size="sm" className="mt-4">
              Find Mentor
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Success Stories</h3>
            <p className="text-sm text-gray-600">Read inspiring stories from the thalassemia community</p>
            <Button variant="outline" size="sm" className="mt-4">
              Read Stories
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}