// Mock API service for HelpLink
// This replaces the backend API with frontend mock data

import { User, BloodRequest, DonorPrediction } from '../types';
import { DonorManagementService, DonorProfile } from './donorData';

// Mock data stores
const mockUsers = new Map<string, any>();
const mockBloodRequests = new Map<string, BloodRequest>();
const mockDonors = new Map<string, any>();

// Initialize mock data
const initializeMockData = () => {
  // Mock blood centers
  const bloodCenters = [
    {
      id: 'center1',
      name: 'Central Blood Bank',
      region: 'North',
      bloodInventory: {
        'A+': 15, 'A-': 8, 'B+': 12, 'B-': 5,
        'AB+': 7, 'AB-': 3, 'O+': 25, 'O-': 10
      }
    }
  ];

  // Mock donors
  const donors = [
    {
      id: 'donor1',
      name: 'Anonymous Donor 001',
      bloodType: 'O+',
      region: 'North',
      donorType: 'emergency',
      lastDonation: '2023-11-15',
      totalDonations: 15,
      callsRatio: 0.85,
      responseRate: 0.90
    },
    {
      id: 'donor2',
      name: 'Anonymous Donor 002',
      bloodType: 'O+',
      region: 'North',
      donorType: 'bridge',
      lastDonation: '2023-12-01',
      totalDonations: 8,
      callsRatio: 0.78,
      responseRate: 0.85
    }
  ];

  donors.forEach(donor => mockDonors.set(donor.id, donor));
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Authentication API
export const authAPI = {
  login: async (email: string, password: string, role: string) => {
    await delay(500);
    
    // Demo credentials
    if (email === 'demo@helplink.com' && password === 'demo123') {
      const mockUser: User = {
        id: '1',
        email,
        role: role as any,
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        region: 'North',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      return {
        success: true,
        user: mockUser,
        token: 'demo-token'
      };
    }
    
    throw new Error('Invalid credentials');
  },

  register: async (userData: any) => {
    await delay(500);
    
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockUsers.set(newUser.id, newUser);

    return {
      success: true,
      user: newUser,
      token: 'demo-token'
    };
  }
};

// Blood Requests API
export const bloodRequestAPI = {
  create: async (requestData: any) => {
    await delay(1000);
    
    const requestId = Date.now().toString();
    const bloodRequest: BloodRequest = {
      id: requestId,
      patientId: '1',
      bloodType: requestData.bloodType,
      urgency: requestData.urgency,
      unitsRequired: requestData.unitsRequired,
      status: 'pending',
      requestDate: new Date(),
      requiredBy: new Date(requestData.requiredBy),
      hospital: requestData.hospital,
      notes: requestData.notes
    };

    mockBloodRequests.set(requestId, bloodRequest);

    // Simulate blood center check
    const centerCheck = checkBloodCenterStock(requestData.bloodType, requestData.unitsRequired);
    
    if (centerCheck.available) {
      bloodRequest.status = 'approved';
      bloodRequest.fulfilledBy = 'center';
      
      return {
        success: true,
        request: bloodRequest,
        message: 'Blood available at blood center',
        fulfillmentMethod: 'center'
      };
    }

    // Simulate AI donor matching
    const donorMatches = getAIDonorMatches(requestData);
    
    return {
      success: true,
      request: bloodRequest,
      donorMatches,
      fulfillmentMethod: 'donor_matching'
    };
  },

  getAll: async () => {
    await delay(300);
    return {
      success: true,
      requests: Array.from(mockBloodRequests.values())
    };
  },

  getById: async (id: string) => {
    await delay(300);
    const request = mockBloodRequests.get(id);
    return {
      success: true,
      request
    };
  },

  updateStatus: async (id: string, status: string) => {
    await delay(300);
    const request = mockBloodRequests.get(id);
    if (request) {
      request.status = status as any;
      mockBloodRequests.set(id, request);
    }
    return {
      success: true,
      request
    };
  }
};

// Donor Management API
export const donorAPI = {
  getMatches: async (bloodType: string, region: string) => {
    await delay(500);
    
    const matches = DonorManagementService.findMatchingDonors(bloodType, region, 'medium')
      .map(donor => {
        const prediction = DonorManagementService.predictDonorAvailability(donor);
        return {
          ...donor,
          availabilityScore: prediction.probability
        };
      });

    return {
      success: true,
      matches
    };
  },

  getAllDonors: async () => {
    await delay(300);
    return {
      success: true,
      donors: DonorManagementService.getAllDonors()
    };
  },

  getDonorById: async (donorId: string) => {
    await delay(300);
    const donor = DonorManagementService.getDonorById(donorId);
    return {
      success: true,
      donor
    };
  },

  searchDonors: async (query: string) => {
    await delay(400);
    const results = DonorManagementService.searchDonors(query);
    return {
      success: true,
      donors: results
    };
  },

  getDonorStatistics: async () => {
    await delay(300);
    const stats = DonorManagementService.getDonorStatistics();
    return {
      success: true,
      statistics: stats
    };
  },
  updateAvailability: async (donorId: string, available: boolean) => {
    await delay(300);
    const donor = mockDonors.get(donorId);
    if (donor) {
      donor.availabilityStatus = available ? 'available' : 'unavailable';
      mockDonors.set(donorId, donor);
    }
    return {
      success: true,
      donor
    };
  },

  getDonationHistory: async (donorId: string) => {
    await delay(300);
    
    const mockHistory = [
      { date: '2023-12-01', location: 'City Hospital', units: 1 },
      { date: '2023-10-15', location: 'General Hospital', units: 2 },
      { date: '2023-08-20', location: 'City Hospital', units: 1 }
    ];

    return {
      success: true,
      history: mockHistory
    };
  }
};

// Machine Learning API
export const mlAPI = {
  predictDonorAvailability: async (features: any) => {
    await delay(800);
    
    const predictions: DonorPrediction[] = [
      {
        donorId: 'donor1',
        availabilityProbability: 0.92,
        factors: {
          callsToDonationsRatio: 0.85,
          daysSinceLastDonation: 65,
          totalDonations: 15,
          responseHistory: 0.90
        }
      },
      {
        donorId: 'donor2',
        availabilityProbability: 0.87,
        factors: {
          callsToDonationsRatio: 0.78,
          daysSinceLastDonation: 45,
          totalDonations: 8,
          responseHistory: 0.85
        }
      }
    ];

    return {
      success: true,
      predictions,
      model: 'azure-ml-donor-availability-v1.2',
      confidence: 0.89
    };
  },

  getModelMetrics: async () => {
    await delay(500);
    
    return {
      success: true,
      metrics: {
        accuracy: 0.89,
        precision: 0.91,
        recall: 0.87,
        f1Score: 0.89,
        lastTrained: '2024-01-15'
      }
    };
  }
};

// Notifications API
export const notificationAPI = {
  send: async (recipients: string[], message: string, type: string) => {
    await delay(600);
    
    const results = recipients.map(recipient => ({
      recipientId: recipient,
      status: 'sent',
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sentAt: new Date()
    }));

    return {
      success: true,
      results,
      totalSent: recipients.length
    };
  },

  getHistory: async (userId: string) => {
    await delay(300);
    
    const mockHistory = [
      {
        id: '1',
        message: 'Blood request approved',
        type: 'blood_request',
        sentAt: '2024-01-20T10:30:00Z',
        status: 'delivered'
      },
      {
        id: '2',
        message: 'Appointment reminder',
        type: 'appointment',
        sentAt: '2024-01-19T14:00:00Z',
        status: 'delivered'
      }
    ];

    return {
      success: true,
      notifications: mockHistory
    };
  }
};

// Health Records API
export const healthRecordsAPI = {
  getRecords: async (patientId: string) => {
    await delay(400);
    
    const mockRecords = [
      {
        id: '1',
        patientId,
        recordDate: '2024-01-15',
        hemoglobinLevel: 8.2,
        ironLevel: 2100,
        weight: 65,
        vitalSigns: { 
          bloodPressure: '120/80', 
          heartRate: 72, 
          temperature: 36.5 
        }
      },
      {
        id: '2',
        patientId,
        recordDate: '2024-01-01',
        hemoglobinLevel: 7.8,
        ironLevel: 2050,
        weight: 64,
        vitalSigns: { 
          bloodPressure: '118/78', 
          heartRate: 75, 
          temperature: 36.7 
        }
      }
    ];

    return {
      success: true,
      records: mockRecords
    };
  },

  addRecord: async (patientId: string, recordData: any) => {
    await delay(500);
    
    const newRecord = {
      id: Date.now().toString(),
      patientId,
      recordDate: new Date().toISOString().split('T')[0],
      ...recordData
    };

    return {
      success: true,
      record: newRecord
    };
  },

  generatePassport: async (patientId: string) => {
    await delay(1000);
    
    // Mock PDF generation
    const pdfData = new Blob(['Mock PDF content'], { type: 'application/pdf' });
    return pdfData;
  }
};

// Helper functions
function checkBloodCenterStock(bloodType: string, unitsRequired: number) {
  const mockInventory: { [key: string]: number } = {
    'A+': 15, 'A-': 8, 'B+': 12, 'B-': 5,
    'AB+': 7, 'AB-': 3, 'O+': 25, 'O-': 10
  };
  
  return {
    available: (mockInventory[bloodType] || 0) >= unitsRequired,
    units: mockInventory[bloodType] || 0
  };
}

function getAIDonorMatches(requestData: any): DonorPrediction[] {
  return [
    {
      donorId: 'donor1',
      availabilityProbability: 0.92,
      factors: {
        callsToDonationsRatio: 0.85,
        daysSinceLastDonation: 65,
        totalDonations: 15,
        responseHistory: 0.90
      }
    },
    {
      donorId: 'donor2',
      availabilityProbability: 0.87,
      factors: {
        callsToDonationsRatio: 0.78,
        daysSinceLastDonation: 45,
        totalDonations: 8,
        responseHistory: 0.85
      }
    }
  ];
}

// Initialize mock data
initializeMockData();

export default {
  authAPI,
  bloodRequestAPI,
  donorAPI,
  mlAPI,
  notificationAPI,
  healthRecordsAPI
};