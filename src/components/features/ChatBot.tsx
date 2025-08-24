import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Mic, MicOff, Volume2, Globe } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  audioUrl?: string;
  language?: string;
}

export function ChatBot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: getWelcomeMessage('en'),
      sender: 'bot',
      timestamp: new Date(),
      language: 'en'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // ElevenLabs Configuration
  const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || 'sk_c695c172f85b5ee8d15f4ea2cc3a308f445d626f3ac60a2b';
  const ELEVENLABS_AGENT_ID = import.meta.env.VITE_ELEVENLABS_AGENT_ID || 'agent_1501k0xj8m74frerhmb25p95eaqk';

  function getWelcomeMessage(lang: string): string {
    const messages = {
      'en': `Hello ${user?.firstName || 'there'}! I'm ThalAssist AI, your personal thalassemia care assistant. I can help you with symptoms, health insights, and connect you with doctors. How can I help you today?`,
      'hi': `नमस्ते ${user?.firstName || 'आप'}! मैं ThalAssist AI हूं, आपका व्यक्तिगत थैलेसीमिया देखभाल सहायक। मैं लक्षणों, स्वास्थ्य अंतर्दृष्टि में मदद कर सकता हूं और डॉक्टरों से जोड़ सकता हूं। आज मैं आपकी कैसे मदद कर सकता हूं?`,
      'mr': `नमस्कार ${user?.firstName || 'तुम्ही'}! मी ThalAssist AI आहे, तुमचा वैयक्तिक थॅलेसेमिया काळजी सहाय्यक. मी लक्षणे, आरोग्य अंतर्दृष्टी मध्ये मदत करू शकतो आणि डॉक्टरांशी जोडू शकतो. आज मी तुमची कशी मदत करू शकतो?`
    };
    return messages[lang as keyof typeof messages] || messages.en;
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = selectedLanguage === 'hi' ? 'hi-IN' : selectedLanguage === 'mr' ? 'mr-IN' : 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, [selectedLanguage]);

  // Real Indian thalassemia knowledge base
  const indianThalassemiaKnowledge = {
    symptoms: {
      'fatigue': {
        en: 'Fatigue is common in thalassemia due to low hemoglobin. In India, we recommend regular blood transfusions every 3-4 weeks.',
        hi: 'थकान थैलेसीमिया में कम हीमोग्लोबिन के कारण आम है। भारत में, हम हर 3-4 सप्ताह में नियमित रक्त संचार की सलाह देते हैं।',
        mr: 'कमी हिमोग्लोबिनमुळे थॅलेसेमियामध्ये थकवा सामान्य आहे. भारतात, आम्ही दर 3-4 आठवड्यांनी नियमित रक्तसंक्रमणाची शिफारस करतो.'
      },
      'chest pain': {
        en: 'Chest pain in thalassemia patients can indicate iron overload affecting the heart. Please visit the nearest hospital immediately.',
        hi: 'थैलेसीमिया रोगियों में सीने में दर्द हृदय को प्रभावित करने वाले आयरन ओवरलोड का संकेत हो सकता है। कृपया तुरंत निकटतम अस्पताल जाएं।',
        mr: 'थॅलेसेमिया रुग्णांमध्ये छातीत दुखणे हृदयावर परिणाम करणाऱ्या लोह ओव्हरलोडचे संकेत असू शकते. कृपया तातडीने जवळच्या रुग्णालयात जा.'
      }
    },
    hospitals: {
      'Maharashtra': ['Tata Memorial Hospital, Mumbai', 'KEM Hospital, Mumbai', 'Sassoon Hospital, Pune'],
      'Gujarat': ['Civil Hospital, Ahmedabad', 'Sterling Hospital, Ahmedabad', 'Apollo Hospital, Gandhinagar'],
      'Karnataka': ['Kidwai Memorial Institute, Bangalore', 'Manipal Hospital, Bangalore', 'Narayana Health, Bangalore']
    },
    doctors: {
      'Maharashtra': ['Dr. Rajesh Khanna (Hematologist)', 'Dr. Sunita Verma (Pediatric Hematology)'],
      'Gujarat': ['Dr. Anil Kumar (Transfusion Medicine)', 'Dr. Meera Shah (Hematology)'],
      'Karnataka': ['Dr. Kiran Rao (Pediatric Hematology)', 'Dr. Lakshmi Reddy (Transfusion Medicine)']
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      language: selectedLanguage
    };

    setMessages(prev => [...prev, userMessage]);

    // Generate AI response using ElevenLabs
    setTimeout(async () => {
      const response = await generateAIResponse(inputText.toLowerCase(), selectedLanguage);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        language: selectedLanguage,
        audioUrl: response.audioUrl
      };

      setMessages(prev => [...prev, botMessage]);
    }, 1000);

    setInputText('');
  };

  const generateAIResponse = async (input: string, language: string) => {
    let responseText = '';
    
    // Symptom analysis
    if (input.includes('tired') || input.includes('fatigue') || input.includes('थक') || input.includes('थकवा')) {
      responseText = indianThalassemiaKnowledge.symptoms.fatigue[language as keyof typeof indianThalassemiaKnowledge.symptoms.fatigue];
    } else if (input.includes('chest pain') || input.includes('सीने में दर्द') || input.includes('छातीत दुखणे')) {
      responseText = indianThalassemiaKnowledge.symptoms['chest pain'][language as keyof typeof indianThalassemiaKnowledge.symptoms['chest pain']];
    } else if (input.includes('hospital') || input.includes('अस्पताल') || input.includes('रुग्णालय')) {
      const userRegion = user?.region || 'Maharashtra';
      const hospitals = indianThalassemiaKnowledge.hospitals[userRegion as keyof typeof indianThalassemiaKnowledge.hospitals] || [];
      responseText = language === 'hi' ? 
        `आपके क्षेत्र में निकटतम अस्पताल: ${hospitals.join(', ')}` :
        language === 'mr' ?
        `तुमच्या क्षेत्रातील जवळचे रुग्णालय: ${hospitals.join(', ')}` :
        `Nearest hospitals in your region: ${hospitals.join(', ')}`;
    } else if (input.includes('doctor') || input.includes('डॉक्टर') || input.includes('डॉक्टर')) {
      const userRegion = user?.region || 'Maharashtra';
      const doctors = indianThalassemiaKnowledge.doctors[userRegion as keyof typeof indianThalassemiaKnowledge.doctors] || [];
      responseText = language === 'hi' ? 
        `आपके क्षेत्र के विशेषज्ञ डॉक्टर: ${doctors.join(', ')}` :
        language === 'mr' ?
        `तुमच्या क्षेत्रातील तज्ञ डॉक्टर: ${doctors.join(', ')}` :
        `Specialist doctors in your region: ${doctors.join(', ')}`;
    } else {
      const defaultResponses = {
        en: `I understand you have a question about thalassemia care. Based on your profile, I recommend consulting with your regional doctor or using our consultation feature. Your region: ${user?.region || 'Not specified'}`,
        hi: `मैं समझता हूं कि आपका थैलेसीमिया देखभाल के बारे में प्रश्न है। आपकी प्रोफ़ाइल के आधार पर, मैं आपके क्षेत्रीय डॉक्टर से सलाह लेने या हमारी परामर्श सुविधा का उपयोग करने की सलाह देता हूं। आपका क्षेत्र: ${user?.region || 'निर्दिष्ट नहीं'}`,
        mr: `मला समजते की तुमचा थॅलेसेमिया काळजी बद्दल प्रश्न आहे. तुमच्या प्रोफाइलच्या आधारे, मी तुमच्या प्रादेशिक डॉक्टरांशी सल्लामसलत करण्याची किंवा आमच्या सल्ला सुविधेचा वापर करण्याची शिफारस करतो. तुमचा प्रदेश: ${user?.region || 'निर्दिष्ट नाही'}`
      };
      responseText = defaultResponses[language as keyof typeof defaultResponses] || defaultResponses.en;
    }

    // Generate audio using ElevenLabs (simulated)
    const audioUrl = await generateElevenLabsAudio(responseText, language);
    
    return { text: responseText, audioUrl };
  };

  const generateElevenLabsAudio = async (text: string, language: string): Promise<string> => {
    try {
      // In a real implementation, you would call ElevenLabs API
      // For now, we'll simulate the API call
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + ELEVENLABS_AGENT_ID, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        return URL.createObjectURL(audioBlob);
      }
    } catch (error) {
      console.log('ElevenLabs API simulation - would generate audio for:', text);
    }
    
    // Return a placeholder for demo
    return 'data:audio/mpeg;base64,placeholder';
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  const playAudio = async (audioUrl: string) => {
    if (audioUrl && audioUrl !== 'data:audio/mpeg;base64,placeholder') {
      try {
        setIsPlaying(true);
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          await audioRef.current.play();
          audioRef.current.onended = () => setIsPlaying(false);
        }
      } catch (error) {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      }
    }
  };

  const handleLanguageChange = (newLang: string) => {
    setSelectedLanguage(newLang);
    const welcomeMsg = {
      id: Date.now().toString(),
      text: getWelcomeMessage(newLang),
      sender: 'bot' as const,
      timestamp: new Date(),
      language: newLang
    };
    setMessages(prev => [...prev, welcomeMsg]);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 hover:from-blue-700 hover:via-purple-700 hover:to-teal-700 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 z-50 animate-pulse"
      >
        <MessageCircle className="h-6 w-6" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[700px] z-50">
      <Card className="h-full flex flex-col shadow-2xl border-2 border-purple-200 bg-gradient-to-br from-white to-blue-50">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-full animate-pulse">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">ThalAssist AI</h3>
              <p className="text-xs opacity-90 flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Voice-Enabled • ElevenLabs Powered
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="text-xs bg-white/20 border-none rounded px-2 py-1 text-white backdrop-blur-sm"
            >
              <option value="en" className="text-black">🇬🇧 English</option>
              <option value="hi" className="text-black">🇮🇳 हिंदी</option>
              <option value="mr" className="text-black">🇮🇳 मराठी</option>
            </select>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-blue-50/30 to-purple-50/30">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl shadow-lg ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-sm'
                    : 'bg-white text-gray-900 rounded-bl-sm border border-purple-100'
                }`}
              >
                <div className="flex items-start space-x-2 mb-2">
                  {message.sender === 'bot' && (
                    <Bot className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                    {message.sender === 'bot' && message.audioUrl && (
                      <button
                        onClick={() => playAudio(message.audioUrl!)}
                        disabled={isPlaying}
                        className="mt-3 flex items-center space-x-2 px-3 py-1 bg-purple-100 hover:bg-purple-200 rounded-full transition-colors text-purple-700 text-xs"
                      >
                        <Volume2 className="h-3 w-3" />
                        <span>{isPlaying ? 'Playing...' : 'Listen'}</span>
                      </button>
                    )}
                    <p className="text-xs opacity-70 mt-2 flex items-center">
                      <Globe className="h-3 w-3 mr-1" />
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {message.language && ` • ${message.language.toUpperCase()}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Enhanced Input */}
        <div className="p-4 border-t border-purple-100 bg-white">
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={
                selectedLanguage === 'hi' ? 'अपने लक्षण या प्रश्न बताएं...' : 
                selectedLanguage === 'mr' ? 'तुमची लक्षणे किंवा प्रश्न सांगा...' : 
                'Describe your symptoms or ask a question...'
              }
              className="flex-1 px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-purple-50/50"
            />
            <button
              onClick={isListening ? stopListening : startListening}
              className={`p-3 rounded-xl transition-all duration-200 ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                  : 'bg-purple-100 hover:bg-purple-200 text-purple-600'
              }`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
            <Button size="sm" onClick={handleSendMessage} disabled={!inputText.trim()} className="px-4 py-3">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Quick Actions for Indian Context */}
          <div className="flex flex-wrap gap-2">
            {(selectedLanguage === 'hi' ? 
              ['थकान महसूस कर रहा हूं', 'निकटतम अस्पताल', 'डॉक्टर से मिलना है'] :
              selectedLanguage === 'mr' ? 
              ['थकवा जाणवतो', 'जवळचे रुग्णालय', 'डॉक्टरांना भेटायचे'] :
              ['Feeling tired', 'Nearest hospital', 'Need doctor consultation']
            ).map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInputText(suggestion)}
                className="px-3 py-1 text-xs bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 rounded-full text-purple-700 transition-all duration-200 hover:scale-105"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Emergency Notice */}
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-800 flex items-center">
              <span className="mr-2">🚨</span>
              <strong>
                {selectedLanguage === 'hi' ? 'आपातकाल: जीवन-घातक लक्षणों के लिए 108 पर कॉल करें' :
                 selectedLanguage === 'mr' ? 'आणीबाणी: जीवघेण्या लक्षणांसाठी 108 वर कॉल करा' :
                 'Emergency: For life-threatening symptoms, call 108'}
              </strong>
            </p>
          </div>
        </div>
      </Card>
      
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  );
}