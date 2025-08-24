import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, AlertCircle, Calendar, Phone, Brain, Heart, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { AISymptomAssistant } from '../../services/aiModels';
import { useApp } from '../../context/AppContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  suggestions?: string[];
  severity?: string;
  analysis?: any;
}

export function AISymptomAssistantComponent() {
  const { healthRecords } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '👋 Hello! I\'m your AI Health Assistant. I can help you understand symptoms, analyze your health trends, and connect you with doctors. How are you feeling today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const patientData = {
    hemoglobinLevel: healthRecords[0]?.hemoglobinLevel || 8.2,
    ironLevel: healthRecords[0]?.ironLevel || 2100,
    weight: healthRecords[0]?.weight || 65,
    lastTransfusion: healthRecords[0]?.recordDate || new Date()
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // AI Analysis
    setTimeout(() => {
      const analysis = AISymptomAssistant.analyzeSymptoms(inputText, patientData);
      const response = AISymptomAssistant.generateResponse(analysis, patientData);
      
      let suggestions = [];
      if (analysis.severity === 'critical') {
        suggestions = ['Call Emergency (108)', 'Find Nearest Hospital', 'Contact Doctor'];
      } else if (analysis.severity === 'high') {
        suggestions = ['Schedule Urgent Appointment', 'Check Vitals', 'Monitor Symptoms'];
      } else {
        suggestions = ['Book Consultation', 'Track Symptoms', 'View Health Records'];
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'ai',
        timestamp: new Date(),
        suggestions,
        severity: analysis.severity,
        analysis
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);

    setInputText('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion.includes('Emergency')) {
      window.open('tel:108', '_self');
    } else if (suggestion.includes('Hospital')) {
      // Navigate to nearby hospitals
      console.log('Finding nearest hospitals...');
    } else if (suggestion.includes('Doctor')) {
      // Navigate to consultations
      console.log('Contacting doctor...');
    } else {
      setInputText(suggestion);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  const quickSymptoms = [
    { text: 'I feel very tired and weak', icon: '😴' },
    { text: 'I have chest pain', icon: '💔' },
    { text: 'I feel short of breath', icon: '😮‍💨' },
    { text: 'I have a headache', icon: '🤕' },
    { text: 'When is my next transfusion?', icon: '🩸' },
    { text: 'Check my health trends', icon: '📊' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Symptom Assistant</h1>
          <p className="text-gray-600">24/7 intelligent health support and guidance</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="success" className="px-3 py-1">
            <Bot className="h-4 w-4 mr-2" />
            AI Online
          </Badge>
          <Badge variant="info">24/7 Available</Badge>
        </div>
      </div>

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">ThalAssist AI</h3>
              <p className="text-sm text-gray-600">Your personal thalassemia health advisor</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : `bg-gray-100 text-gray-900 rounded-bl-sm ${
                          message.severity ? getSeverityColor(message.severity) : ''
                        }`
                  }`}
                >
                  <div className="flex items-start space-x-2 mb-2">
                    {message.sender === 'ai' && (
                      <Bot className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  
                  {message.suggestions && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs font-medium opacity-80">Quick Actions:</p>
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className={`block w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${
                            message.sender === 'user'
                              ? 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white'
                              : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                          }`}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-4 rounded-2xl rounded-bl-sm">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-purple-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">AI is analyzing...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Symptoms */}
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-600 mb-3">Quick Symptoms:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickSymptoms.map((symptom, index) => (
                <button
                  key={index}
                  onClick={() => setInputText(symptom.text)}
                  className="flex items-center space-x-2 px-3 py-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors text-left"
                >
                  <span>{symptom.icon}</span>
                  <span className="truncate">{symptom.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Describe your symptoms or ask a question..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              disabled={isTyping}
            />
            <Button 
              size="sm" 
              onClick={handleSendMessage} 
              disabled={!inputText.trim() || isTyping}
              className="px-4 py-3"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Emergency Notice */}
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
              <p className="text-xs text-red-800">
                <strong>Emergency:</strong> For life-threatening symptoms, call 108 or visit the nearest hospital immediately.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Status Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Activity className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Current Health Status</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Heart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{patientData.hemoglobinLevel} g/dL</p>
              <p className="text-sm text-blue-700">Hemoglobin Level</p>
              <Badge variant={patientData.hemoglobinLevel < 7 ? 'error' : patientData.hemoglobinLevel < 9 ? 'warning' : 'success'} className="mt-2">
                {patientData.hemoglobinLevel < 7 ? 'Critical' : patientData.hemoglobinLevel < 9 ? 'Low' : 'Stable'}
              </Badge>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Activity className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600">{patientData.ironLevel} μg/L</p>
              <p className="text-sm text-orange-700">Iron Level</p>
              <Badge variant={patientData.ironLevel > 2000 ? 'error' : patientData.ironLevel > 1500 ? 'warning' : 'success'} className="mt-2">
                {patientData.ironLevel > 2000 ? 'High' : patientData.ironLevel > 1500 ? 'Elevated' : 'Normal'}
              </Badge>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-green-600">
                {Math.floor((new Date().getTime() - patientData.lastTransfusion.getTime()) / (1000 * 60 * 60 * 24))} days
              </p>
              <p className="text-sm text-green-700">Since Last Transfusion</p>
              <Badge variant="info" className="mt-2">Next Due Soon</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}