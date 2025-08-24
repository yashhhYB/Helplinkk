// AI Models and Services for HelpLink
import { mockPatients, mockUsers, mockDoctors } from './supabase';

// Google Maps API Integration
export class GoogleMapsService {
  private static apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyAq4zQcQ1B4vdmZL5suv63IY703bh_whPU';

  static async findNearbyHospitals(region: string, bloodType: string) {
    // Mock implementation - in production, use Google Places API
    const hospitals = [
      {
        id: '1',
        name: 'Tata Memorial Hospital',
        address: 'Dr E Borges Road, Parel, Mumbai, Maharashtra 400012',
        distance: '2.3 km',
        phone: '+91-22-2417-7000',
        bloodAvailable: { [bloodType]: Math.floor(Math.random() * 50) + 10 },
        coordinates: { lat: 19.0176, lng: 72.8562 }
      },
      {
        id: '2',
        name: 'KEM Hospital',
        address: 'Acharya Donde Marg, Parel, Mumbai, Maharashtra 400012',
        distance: '3.7 km',
        phone: '+91-22-2413-6051',
        bloodAvailable: { [bloodType]: Math.floor(Math.random() * 30) + 5 },
        coordinates: { lat: 19.0144, lng: 72.8479 }
      },
      {
        id: '3',
        name: 'Lilavati Hospital',
        address: 'A-791, Bandra Reclamation, Bandra West, Mumbai, Maharashtra 400050',
        distance: '5.2 km',
        phone: '+91-22-2675-1000',
        bloodAvailable: { [bloodType]: Math.floor(Math.random() * 40) + 8 },
        coordinates: { lat: 19.0596, lng: 72.8295 }
      }
    ];

    return hospitals.filter(h => h.bloodAvailable[bloodType] > 0);
  }

  static async findNearbyDonors(region: string, bloodType: string) {
    return mockUsers
      .filter(user => user.region === region && user.bloodType === bloodType && user.isDonor)
      .map(donor => ({
        ...donor,
        distance: `${(Math.random() * 10 + 1).toFixed(1)} km`,
        availabilityScore: Math.random() * 0.4 + 0.6,
        coordinates: { 
          lat: 19.0760 + (Math.random() - 0.5) * 0.1, 
          lng: 72.8777 + (Math.random() - 0.5) * 0.1 
        }
      }));
  }
}

// AI Health Trend Analyzer
export class AIHealthAnalyzer {
  static analyzeHealthTrends(healthRecords: any[]) {
    if (healthRecords.length < 2) return [];

    const latest = healthRecords[0];
    const previous = healthRecords[1];
    const insights = [];

    // Hemoglobin trend analysis
    const hbTrend = latest.hemoglobinLevel - previous.hemoglobinLevel;
    const hbDropRate = Math.abs(hbTrend) / 14; // per day

    if (hbDropRate > 0.2) {
      insights.push({
        type: 'warning',
        severity: 'high',
        title: 'Rapid Hemoglobin Drop',
        message: `Your Hb has been dropping faster than average (${hbDropRate.toFixed(2)} g/dL per day). You may need earlier transfusion.`,
        recommendation: 'Schedule transfusion within 3-5 days',
        icon: '⚠️'
      });
    }

    // Iron overload detection
    if (latest.ironLevel > 2000) {
      insights.push({
        type: 'alert',
        severity: 'critical',
        title: 'Iron Overload Detected',
        message: `Iron level is ${latest.ironLevel} μg/L (normal: 300-400). Consult doctor immediately.`,
        recommendation: 'Increase chelation therapy dosage',
        icon: '🚨'
      });
    }

    // Liver function analysis
    const liverFunction = this.calculateLiverFunction(latest);
    if (liverFunction.risk === 'high') {
      insights.push({
        type: 'urgent',
        severity: 'critical',
        title: 'Liver Function Concern',
        message: 'Elevated liver enzymes detected. Iron overload may be affecting liver function.',
        recommendation: 'Immediate hepatologist consultation required',
        icon: '🏥'
      });
    }

    return insights;
  }

  static calculateBloodRequirement(weight: number, currentHb: number, targetHb: number = 10) {
    // Formula: Blood Volume Required (mL) = Weight (kg) × (Hb_target - Hb_current) × 5
    const bloodVolumeRequired = weight * (targetHb - currentHb) * 5;
    const unitsRequired = Math.ceil(bloodVolumeRequired / 450); // 450ml per unit

    return {
      bloodVolumeRequired: Math.round(bloodVolumeRequired),
      unitsRequired,
      recommendation: unitsRequired > 3 ? 'Multiple session transfusion recommended' : 'Single session sufficient',
      urgency: currentHb < 7 ? 'critical' : currentHb < 8.5 ? 'high' : 'medium'
    };
  }

  static calculateLiverFunction(healthRecord: any) {
    // Mock liver function calculation based on iron levels and transfusion history
    const ironLevel = healthRecord.ironLevel;
    const riskScore = (ironLevel - 300) / 2000; // Normalized risk score

    return {
      alt: Math.round(20 + riskScore * 60), // ALT levels
      ast: Math.round(18 + riskScore * 55), // AST levels
      risk: riskScore > 0.7 ? 'high' : riskScore > 0.4 ? 'medium' : 'low',
      recommendation: riskScore > 0.7 ? 'Immediate consultation' : 'Regular monitoring'
    };
  }

  static generateHealthInsights(patientData: any) {
    const insights = [];
    
    // Transfusion frequency analysis
    const avgInterval = 21; // days
    const lastTransfusion = new Date(patientData.lastTransfusion);
    const daysSince = Math.floor((new Date().getTime() - lastTransfusion.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSince > avgInterval + 7) {
      insights.push({
        type: 'reminder',
        message: `It's been ${daysSince} days since your last transfusion. Consider scheduling soon.`,
        action: 'Schedule Transfusion'
      });
    }

    return insights;
  }
}

// AI Blood Bank Optimizer
export class AIBloodBankOptimizer {
  static predictSupplyDemandMismatch(region: string, timeframe: number) {
    // Mock AI prediction based on historical patterns
    const bloodTypes = ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'];
    const predictions = [];

    bloodTypes.forEach(bloodType => {
      const currentSupply = Math.floor(Math.random() * 100) + 20;
      const predictedDemand = Math.floor(Math.random() * 80) + 30;
      const shortage = Math.max(0, predictedDemand - currentSupply);

      predictions.push({
        bloodType,
        currentSupply,
        predictedDemand,
        shortage,
        status: shortage > 20 ? 'critical' : shortage > 10 ? 'low' : 'adequate',
        recommendation: shortage > 0 ? `Need ${shortage} more units` : 'Supply adequate'
      });
    });

    return predictions;
  }

  static recommendBloodCampLocations(region: string) {
    const locations = [
      {
        name: 'Mumbai Central',
        expectedDonors: 150,
        costEffectiveness: 0.92,
        accessibility: 'high',
        coordinates: { lat: 18.9690, lng: 72.8205 }
      },
      {
        name: 'Pune IT Hub',
        expectedDonors: 120,
        costEffectiveness: 0.88,
        accessibility: 'high',
        coordinates: { lat: 18.5204, lng: 73.8567 }
      },
      {
        name: 'Nagpur Medical College',
        expectedDonors: 80,
        costEffectiveness: 0.85,
        accessibility: 'medium',
        coordinates: { lat: 21.1458, lng: 79.0882 }
      }
    ];

    return locations.sort((a, b) => b.costEffectiveness - a.costEffectiveness);
  }

  static matchPatientsWithDonors(patientRequest: any) {
    const compatibleDonors = mockUsers.filter(user => 
      user.isDonor && 
      user.bloodType === patientRequest.bloodType &&
      user.region === patientRequest.region
    );

    return compatibleDonors.map(donor => ({
      ...donor,
      matchScore: Math.random() * 0.3 + 0.7, // 70-100% match
      availabilityProbability: Math.random() * 0.4 + 0.6,
      estimatedResponseTime: Math.floor(Math.random() * 120) + 30, // 30-150 minutes
      distance: `${(Math.random() * 15 + 2).toFixed(1)} km`
    })).sort((a, b) => b.matchScore - a.matchScore);
  }
}

// AI Symptom Assistant
export class AISymptomAssistant {
  private static symptomDatabase = {
    'fatigue': {
      causes: ['Low hemoglobin', 'Iron deficiency', 'Dehydration'],
      severity: 'medium',
      recommendations: ['Check Hb levels', 'Increase rest', 'Stay hydrated'],
      urgency: 'Schedule check-up within 2-3 days'
    },
    'chest pain': {
      causes: ['Iron overload cardiomyopathy', 'Heart complications'],
      severity: 'critical',
      recommendations: ['Seek immediate medical attention', 'Call emergency services'],
      urgency: 'Emergency - Go to hospital now'
    },
    'shortness of breath': {
      causes: ['Severe anemia', 'Heart complications', 'Lung complications'],
      severity: 'high',
      recommendations: ['Check oxygen levels', 'Immediate medical consultation'],
      urgency: 'Urgent - See doctor today'
    },
    'weakness': {
      causes: ['Dropping hemoglobin', 'Electrolyte imbalance'],
      severity: 'medium',
      recommendations: ['Monitor symptoms', 'Consider early transfusion'],
      urgency: 'Schedule appointment within week'
    }
  };

  static analyzeSymptoms(symptoms: string, patientData: any) {
    const lowerSymptoms = symptoms.toLowerCase();
    let analysis = {
      possibleCauses: [],
      severity: 'low',
      recommendations: [],
      urgency: 'Monitor symptoms',
      nextAction: 'Continue regular care'
    };

    // Check for known symptoms
    Object.entries(this.symptomDatabase).forEach(([symptom, data]) => {
      if (lowerSymptoms.includes(symptom)) {
        analysis.possibleCauses.push(...data.causes);
        analysis.recommendations.push(...data.recommendations);
        if (data.severity === 'critical') analysis.severity = 'critical';
        else if (data.severity === 'high' && analysis.severity !== 'critical') analysis.severity = 'high';
        analysis.urgency = data.urgency;
      }
    });

    // Add context based on patient data
    if (patientData.hemoglobinLevel < 7 && lowerSymptoms.includes('fatigue')) {
      analysis.recommendations.push('Your Hb is critically low - transfusion needed urgently');
      analysis.severity = 'critical';
    }

    return analysis;
  }

  static generateResponse(analysis: any, patientData: any) {
    let response = "Based on your symptoms, here's what I found:\n\n";
    
    if (analysis.possibleCauses.length > 0) {
      response += `**Possible causes:** ${analysis.possibleCauses.join(', ')}\n\n`;
    }
    
    response += `**Recommendations:**\n${analysis.recommendations.map(r => `• ${r}`).join('\n')}\n\n`;
    response += `**Urgency:** ${analysis.urgency}\n\n`;
    
    if (analysis.severity === 'critical') {
      response += "🚨 **This requires immediate medical attention!**";
    }

    return response;
  }
}

// Donor Motivation Engine
export class DonorMotivationEngine {
  static calculateDonorScore(donor: any) {
    const totalDonations = donor.totalDonations || 0;
    const responseRate = donor.responseRate || 0;
    const daysSinceLastDonation = donor.lastDonation ? 
      Math.floor((new Date().getTime() - new Date(donor.lastDonation).getTime()) / (1000 * 60 * 60 * 24)) : 365;

    let score = 0;
    score += Math.min(totalDonations * 10, 100); // Max 100 points for donations
    score += responseRate * 50; // Max 50 points for response rate
    score += daysSinceLastDonation > 56 ? 50 : 0; // 50 points if eligible

    return Math.min(score, 200);
  }

  static getDonorLevel(score: number) {
    if (score >= 150) return { level: 'Hero', badge: '🏆', color: 'gold' };
    if (score >= 100) return { level: 'Champion', badge: '🥇', color: 'silver' };
    if (score >= 50) return { level: 'Supporter', badge: '🥈', color: 'bronze' };
    return { level: 'Beginner', badge: '🌟', color: 'blue' };
  }

  static generateMotivationalMessage(donor: any) {
    const score = this.calculateDonorScore(donor);
    const level = this.getDonorLevel(score);
    
    const messages = [
      `${level.badge} You're a ${level.level}! Your donations have saved ${(donor.totalDonations || 0) * 3} lives!`,
      `🎯 You're ${200 - score} points away from the next level!`,
      `💪 Your last donation was a lifesaver! Ready for the next one?`,
      `🌟 The thalassemia community needs heroes like you!`
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  }

  static getNextEligibilityDate(lastDonation: string) {
    if (!lastDonation) return new Date();
    const lastDate = new Date(lastDonation);
    const nextDate = new Date(lastDate.getTime() + (56 * 24 * 60 * 60 * 1000));
    return nextDate;
  }
}

// Fraud Detection System
export class FraudDetectionSystem {
  static detectFakeRequests(requests: any[], userId: string) {
    const userRequests = requests.filter(r => r.patientId === userId);
    const flags = [];

    // Multiple money requests in short time
    const moneyRequests = userRequests.filter(r => r.type === 'financial');
    if (moneyRequests.length > 2) {
      flags.push({
        type: 'multiple_money_requests',
        severity: 'high',
        message: `User has ${moneyRequests.length} money requests`,
        recommendation: 'Manual review required'
      });
    }

    // Unusual blood request patterns
    const bloodRequests = userRequests.filter(r => r.type === 'blood');
    const recentBloodRequests = bloodRequests.filter(r => 
      (new Date().getTime() - new Date(r.requestDate).getTime()) < (7 * 24 * 60 * 60 * 1000)
    );
    
    if (recentBloodRequests.length > 1) {
      flags.push({
        type: 'frequent_blood_requests',
        severity: 'medium',
        message: 'Multiple blood requests in one week',
        recommendation: 'Verify medical necessity'
      });
    }

    return flags;
  }

  static detectUnusualDonorBehavior(donor: any) {
    const flags = [];
    
    // Donating too frequently
    if (donor.lastDonation) {
      const daysSince = Math.floor((new Date().getTime() - new Date(donor.lastDonation).getTime()) / (1000 * 60 * 60 * 24));
      if (daysSince < 56) {
        flags.push({
          type: 'frequent_donation',
          severity: 'high',
          message: `Donor trying to donate after only ${daysSince} days`,
          recommendation: 'Block donation until eligible'
        });
      }
    }

    return flags;
  }
}

// ElevenLabs Voice Service
export class VoiceService {
  private static apiKey = 'sk_c695c172f85b5ee8d15f4ea2cc3a308f445d626f3ac60a2b';
  private static agentId = 'agent_01jxy3tef9ehd8csgycfwp4gys';

  static async translateText(text: string, targetLanguage: string) {
    // Mock translation service
    const translations = {
      'hi': {
        'Welcome to HelpLink': 'हेल्पलिंक में आपका स्वागत है',
        'Blood Request': 'रक्त अनुरोध',
        'Health Records': 'स्वास्थ्य रिकॉर्ड',
        'Next Transfusion': 'अगला रक्त संचार',
        'Iron Level': 'आयरन का स्तर',
        'Hemoglobin': 'हीमोग्लोबिन',
        'Doctor Consultation': 'डॉक्टर परामर्श'
      },
      'mr': {
        'Welcome to HelpLink': 'हेल्पलिंकमध्ये आपले स्वागत आहे',
        'Blood Request': 'रक्त विनंती',
        'Health Records': 'आरोग्य नोंदी',
        'Next Transfusion': 'पुढील रक्तसंक्रमण',
        'Iron Level': 'लोह पातळी',
        'Hemoglobin': 'हिमोग्लोबिन',
        'Doctor Consultation': 'डॉक्टर सल्लामसलत'
      }
    };

    return translations[targetLanguage]?.[text] || text;
  }

  static async generateVoiceResponse(text: string, language: string = 'en') {
    // Mock voice generation
    return {
      audioUrl: `https://api.elevenlabs.io/v1/text-to-speech/${this.agentId}`,
      duration: text.length * 0.1, // Approximate duration
      language
    };
  }
}

export default {
  GoogleMapsService,
  AIHealthAnalyzer,
  AIBloodBankOptimizer,
  AISymptomAssistant,
  DonorMotivationEngine,
  FraudDetectionSystem,
  VoiceService
};