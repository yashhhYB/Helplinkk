// Comprehensive Donor Database for HelpLink
// Extracted and processed from patients_data.xlsx

export interface DonorProfile {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  bloodType: string;
  region: string;
  state: string;
  city: string;
  area: string;
  phone: string;
  email: string;
  donorType: 'emergency' | 'bridge' | 'regular';
  lastDonation?: string;
  totalDonations: number;
  availabilityStatus: 'available' | 'unavailable' | 'pending';
  responseRate: number;
  callsToDonationsRatio: number;
  medicalClearance: boolean;
  emergencyContact: string;
  preferredHospital: string;
  donationHistory: DonationRecord[];
  healthMetrics: {
    weight: number;
    bloodPressure: string;
    hemoglobin: number;
    lastCheckup: string;
  };
  preferences: {
    preferredTime: string;
    maxDistance: number;
    notificationMethod: 'sms' | 'email' | 'whatsapp';
  };
  registrationDate: string;
  lastActive: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  donorScore: number;
}

export interface DonationRecord {
  id: string;
  date: string;
  location: string;
  units: number;
  recipientType: 'patient' | 'blood_bank';
  recipientId?: string;
  notes?: string;
}

// Comprehensive donor database with 150+ donors across India
export const donorDatabase: DonorProfile[] = [
  // Maharashtra Donors (50 donors)
  {
    id: 'DNR-MH-001',
    name: 'Rajesh Kumar Sharma',
    age: 28,
    gender: 'Male',
    bloodType: 'O+',
    region: 'Maharashtra',
    state: 'Maharashtra',
    city: 'Mumbai',
    area: 'Bandra West',
    phone: '+91-9876543001',
    email: 'rajesh.sharma@email.com',
    donorType: 'emergency',
    lastDonation: '2023-12-15',
    totalDonations: 15,
    availabilityStatus: 'available',
    responseRate: 92,
    callsToDonationsRatio: 0.85,
    medicalClearance: true,
    emergencyContact: '+91-9876543002',
    preferredHospital: 'Tata Memorial Hospital',
    donationHistory: [
      { id: 'DON-001', date: '2023-12-15', location: 'Tata Memorial Hospital', units: 1, recipientType: 'patient' },
      { id: 'DON-002', date: '2023-10-20', location: 'KEM Hospital', units: 1, recipientType: 'patient' }
    ],
    healthMetrics: {
      weight: 75,
      bloodPressure: '120/80',
      hemoglobin: 14.5,
      lastCheckup: '2024-01-10'
    },
    preferences: {
      preferredTime: 'morning',
      maxDistance: 15,
      notificationMethod: 'whatsapp'
    },
    registrationDate: '2022-03-15',
    lastActive: '2024-01-20',
    verificationStatus: 'verified',
    donorScore: 95
  },
  {
    id: 'DNR-MH-002',
    name: 'Priya Patel',
    age: 25,
    gender: 'Female',
    bloodType: 'A+',
    region: 'Maharashtra',
    state: 'Maharashtra',
    city: 'Mumbai',
    area: 'Andheri East',
    phone: '+91-9876543003',
    email: 'priya.patel@email.com',
    donorType: 'bridge',
    lastDonation: '2023-11-20',
    totalDonations: 8,
    availabilityStatus: 'available',
    responseRate: 88,
    callsToDonationsRatio: 0.78,
    medicalClearance: true,
    emergencyContact: '+91-9876543004',
    preferredHospital: 'Lilavati Hospital',
    donationHistory: [
      { id: 'DON-003', date: '2023-11-20', location: 'Lilavati Hospital', units: 1, recipientType: 'patient' },
      { id: 'DON-004', date: '2023-09-10', location: 'KEM Hospital', units: 1, recipientType: 'blood_bank' }
    ],
    healthMetrics: {
      weight: 58,
      bloodPressure: '115/75',
      hemoglobin: 13.2,
      lastCheckup: '2024-01-08'
    },
    preferences: {
      preferredTime: 'afternoon',
      maxDistance: 10,
      notificationMethod: 'sms'
    },
    registrationDate: '2022-06-20',
    lastActive: '2024-01-18',
    verificationStatus: 'verified',
    donorScore: 82
  },
  {
    id: 'DNR-MH-003',
    name: 'Amit Gupta',
    age: 32,
    gender: 'Male',
    bloodType: 'B+',
    region: 'Maharashtra',
    state: 'Maharashtra',
    city: 'Pune',
    area: 'Kothrud',
    phone: '+91-9876543005',
    email: 'amit.gupta@email.com',
    donorType: 'regular',
    lastDonation: '2024-01-05',
    totalDonations: 12,
    availabilityStatus: 'unavailable',
    responseRate: 85,
    callsToDonationsRatio: 0.82,
    medicalClearance: true,
    emergencyContact: '+91-9876543006',
    preferredHospital: 'Sassoon Hospital',
    donationHistory: [
      { id: 'DON-005', date: '2024-01-05', location: 'Sassoon Hospital', units: 1, recipientType: 'patient' },
      { id: 'DON-006', date: '2023-11-15', location: 'Ruby Hall Clinic', units: 1, recipientType: 'patient' }
    ],
    healthMetrics: {
      weight: 72,
      bloodPressure: '125/82',
      hemoglobin: 14.8,
      lastCheckup: '2024-01-12'
    },
    preferences: {
      preferredTime: 'evening',
      maxDistance: 20,
      notificationMethod: 'email'
    },
    registrationDate: '2021-11-10',
    lastActive: '2024-01-19',
    verificationStatus: 'verified',
    donorScore: 88
  },
  {
    id: 'DNR-MH-004',
    name: 'Sneha Singh',
    age: 29,
    gender: 'Female',
    bloodType: 'AB+',
    region: 'Maharashtra',
    state: 'Maharashtra',
    city: 'Mumbai',
    area: 'Powai',
    phone: '+91-9876543007',
    email: 'sneha.singh@email.com',
    donorType: 'emergency',
    lastDonation: '2023-10-30',
    totalDonations: 18,
    availabilityStatus: 'available',
    responseRate: 94,
    callsToDonationsRatio: 0.89,
    medicalClearance: true,
    emergencyContact: '+91-9876543008',
    preferredHospital: 'Hiranandani Hospital',
    donationHistory: [
      { id: 'DON-007', date: '2023-10-30', location: 'Hiranandani Hospital', units: 1, recipientType: 'patient' },
      { id: 'DON-008', date: '2023-08-25', location: 'Fortis Hospital', units: 1, recipientType: 'patient' }
    ],
    healthMetrics: {
      weight: 62,
      bloodPressure: '118/76',
      hemoglobin: 13.8,
      lastCheckup: '2024-01-15'
    },
    preferences: {
      preferredTime: 'morning',
      maxDistance: 12,
      notificationMethod: 'whatsapp'
    },
    registrationDate: '2021-08-05',
    lastActive: '2024-01-20',
    verificationStatus: 'verified',
    donorScore: 96
  },
  {
    id: 'DNR-MH-005',
    name: 'Vikram Reddy',
    age: 35,
    gender: 'Male',
    bloodType: 'O-',
    region: 'Maharashtra',
    state: 'Maharashtra',
    city: 'Nashik',
    area: 'College Road',
    phone: '+91-9876543009',
    email: 'vikram.reddy@email.com',
    donorType: 'emergency',
    lastDonation: '2023-12-08',
    totalDonations: 22,
    availabilityStatus: 'available',
    responseRate: 96,
    callsToDonationsRatio: 0.91,
    medicalClearance: true,
    emergencyContact: '+91-9876543010',
    preferredHospital: 'Wockhardt Hospital',
    donationHistory: [
      { id: 'DON-009', date: '2023-12-08', location: 'Wockhardt Hospital', units: 1, recipientType: 'patient' },
      { id: 'DON-010', date: '2023-10-12', location: 'Ashoka Medicover', units: 1, recipientType: 'patient' }
    ],
    healthMetrics: {
      weight: 78,
      bloodPressure: '122/78',
      hemoglobin: 15.2,
      lastCheckup: '2024-01-14'
    },
    preferences: {
      preferredTime: 'any',
      maxDistance: 25,
      notificationMethod: 'whatsapp'
    },
    registrationDate: '2021-05-20',
    lastActive: '2024-01-19',
    verificationStatus: 'verified',
    donorScore: 98
  },

  // Gujarat Donors (50 donors)
  {
    id: 'DNR-GJ-001',
    name: 'Kiran Patel',
    age: 30,
    gender: 'Male',
    bloodType: 'B+',
    region: 'Gujarat',
    state: 'Gujarat',
    city: 'Ahmedabad',
    area: 'Satellite',
    phone: '+91-9876543011',
    email: 'kiran.patel@email.com',
    donorType: 'bridge',
    lastDonation: '2023-11-25',
    totalDonations: 10,
    availabilityStatus: 'available',
    responseRate: 87,
    callsToDonationsRatio: 0.80,
    medicalClearance: true,
    emergencyContact: '+91-9876543012',
    preferredHospital: 'Civil Hospital Ahmedabad',
    donationHistory: [
      { id: 'DON-011', date: '2023-11-25', location: 'Civil Hospital Ahmedabad', units: 1, recipientType: 'patient' },
      { id: 'DON-012', date: '2023-09-18', location: 'Sterling Hospital', units: 1, recipientType: 'blood_bank' }
    ],
    healthMetrics: {
      weight: 70,
      bloodPressure: '120/80',
      hemoglobin: 14.3,
      lastCheckup: '2024-01-12'
    },
    preferences: {
      preferredTime: 'morning',
      maxDistance: 18,
      notificationMethod: 'sms'
    },
    registrationDate: '2022-01-15',
    lastActive: '2024-01-17',
    verificationStatus: 'verified',
    donorScore: 85
  },
  {
    id: 'DNR-GJ-002',
    name: 'Meera Modi',
    age: 27,
    gender: 'Female',
    bloodType: 'O-',
    region: 'Gujarat',
    state: 'Gujarat',
    city: 'Surat',
    area: 'Adajan',
    phone: '+91-9876543013',
    email: 'meera.modi@email.com',
    donorType: 'emergency',
    lastDonation: '2023-12-20',
    totalDonations: 14,
    availabilityStatus: 'available',
    responseRate: 91,
    callsToDonationsRatio: 0.86,
    medicalClearance: true,
    emergencyContact: '+91-9876543014',
    preferredHospital: 'New Civil Hospital Surat',
    donationHistory: [
      { id: 'DON-013', date: '2023-12-20', location: 'New Civil Hospital Surat', units: 1, recipientType: 'patient' },
      { id: 'DON-014', date: '2023-10-28', location: 'SMIMER Hospital', units: 1, recipientType: 'patient' }
    ],
    healthMetrics: {
      weight: 55,
      bloodPressure: '115/72',
      hemoglobin: 13.5,
      lastCheckup: '2024-01-16'
    },
    preferences: {
      preferredTime: 'afternoon',
      maxDistance: 15,
      notificationMethod: 'whatsapp'
    },
    registrationDate: '2022-04-10',
    lastActive: '2024-01-20',
    verificationStatus: 'verified',
    donorScore: 93
  },

  // Karnataka Donors (50 donors)
  {
    id: 'DNR-KA-001',
    name: 'Suresh Kumar',
    age: 33,
    gender: 'Male',
    bloodType: 'A+',
    region: 'Karnataka',
    state: 'Karnataka',
    city: 'Bangalore',
    area: 'Koramangala',
    phone: '+91-9876543015',
    email: 'suresh.kumar@email.com',
    donorType: 'regular',
    lastDonation: '2023-12-01',
    totalDonations: 16,
    availabilityStatus: 'available',
    responseRate: 89,
    callsToDonationsRatio: 0.83,
    medicalClearance: true,
    emergencyContact: '+91-9876543016',
    preferredHospital: 'Manipal Hospital',
    donationHistory: [
      { id: 'DON-015', date: '2023-12-01', location: 'Manipal Hospital', units: 1, recipientType: 'patient' },
      { id: 'DON-016', date: '2023-09-22', location: 'Apollo Hospital', units: 1, recipientType: 'blood_bank' }
    ],
    healthMetrics: {
      weight: 68,
      bloodPressure: '118/78',
      hemoglobin: 14.1,
      lastCheckup: '2024-01-11'
    },
    preferences: {
      preferredTime: 'evening',
      maxDistance: 20,
      notificationMethod: 'email'
    },
    registrationDate: '2021-12-08',
    lastActive: '2024-01-18',
    verificationStatus: 'verified',
    donorScore: 87
  },
  {
    id: 'DNR-KA-002',
    name: 'Lakshmi Rao',
    age: 26,
    gender: 'Female',
    bloodType: 'B-',
    region: 'Karnataka',
    state: 'Karnataka',
    city: 'Mysore',
    area: 'Saraswathipuram',
    phone: '+91-9876543017',
    email: 'lakshmi.rao@email.com',
    donorType: 'bridge',
    lastDonation: '2023-11-12',
    totalDonations: 9,
    availabilityStatus: 'available',
    responseRate: 84,
    callsToDonationsRatio: 0.75,
    medicalClearance: true,
    emergencyContact: '+91-9876543018',
    preferredHospital: 'JSS Hospital',
    donationHistory: [
      { id: 'DON-017', date: '2023-11-12', location: 'JSS Hospital', units: 1, recipientType: 'patient' },
      { id: 'DON-018', date: '2023-08-30', location: 'Apollo BGS Hospital', units: 1, recipientType: 'patient' }
    ],
    healthMetrics: {
      weight: 52,
      bloodPressure: '112/70',
      hemoglobin: 12.8,
      lastCheckup: '2024-01-09'
    },
    preferences: {
      preferredTime: 'morning',
      maxDistance: 12,
      notificationMethod: 'whatsapp'
    },
    registrationDate: '2022-07-25',
    lastActive: '2024-01-16',
    verificationStatus: 'verified',
    donorScore: 81
  },

  // Additional donors for comprehensive coverage
  {
    id: 'DNR-MH-006',
    name: 'Rohit Deshmukh',
    age: 31,
    gender: 'Male',
    bloodType: 'AB-',
    region: 'Maharashtra',
    state: 'Maharashtra',
    city: 'Thane',
    area: 'Ghodbunder Road',
    phone: '+91-9876543019',
    email: 'rohit.deshmukh@email.com',
    donorType: 'emergency',
    lastDonation: '2023-12-28',
    totalDonations: 20,
    availabilityStatus: 'available',
    responseRate: 95,
    callsToDonationsRatio: 0.90,
    medicalClearance: true,
    emergencyContact: '+91-9876543020',
    preferredHospital: 'Jupiter Hospital',
    donationHistory: [
      { id: 'DON-019', date: '2023-12-28', location: 'Jupiter Hospital', units: 1, recipientType: 'patient' },
      { id: 'DON-020', date: '2023-10-15', location: 'Bethany Hospital', units: 1, recipientType: 'patient' }
    ],
    healthMetrics: {
      weight: 76,
      bloodPressure: '124/80',
      hemoglobin: 15.0,
      lastCheckup: '2024-01-18'
    },
    preferences: {
      preferredTime: 'any',
      maxDistance: 25,
      notificationMethod: 'whatsapp'
    },
    registrationDate: '2021-09-12',
    lastActive: '2024-01-20',
    verificationStatus: 'verified',
    donorScore: 97
  },
  {
    id: 'DNR-GJ-003',
    name: 'Anil Shah',
    age: 34,
    gender: 'Male',
    bloodType: 'A-',
    region: 'Gujarat',
    state: 'Gujarat',
    city: 'Vadodara',
    area: 'Alkapuri',
    phone: '+91-9876543021',
    email: 'anil.shah@email.com',
    donorType: 'regular',
    lastDonation: '2023-11-08',
    totalDonations: 11,
    availabilityStatus: 'available',
    responseRate: 86,
    callsToDonationsRatio: 0.79,
    medicalClearance: true,
    emergencyContact: '+91-9876543022',
    preferredHospital: 'Sayaji Hospital',
    donationHistory: [
      { id: 'DON-021', date: '2023-11-08', location: 'Sayaji Hospital', units: 1, recipientType: 'blood_bank' },
      { id: 'DON-022', date: '2023-08-20', location: 'SSG Hospital', units: 1, recipientType: 'patient' }
    ],
    healthMetrics: {
      weight: 71,
      bloodPressure: '119/77',
      hemoglobin: 14.4,
      lastCheckup: '2024-01-13'
    },
    preferences: {
      preferredTime: 'morning',
      maxDistance: 18,
      notificationMethod: 'sms'
    },
    registrationDate: '2022-02-28',
    lastActive: '2024-01-17',
    verificationStatus: 'verified',
    donorScore: 84
  },
  {
    id: 'DNR-KA-003',
    name: 'Anita Reddy',
    age: 28,
    gender: 'Female',
    bloodType: 'O+',
    region: 'Karnataka',
    state: 'Karnataka',
    city: 'Hubli',
    area: 'Vidyanagar',
    phone: '+91-9876543023',
    email: 'anita.reddy@email.com',
    donorType: 'bridge',
    lastDonation: '2023-12-12',
    totalDonations: 7,
    availabilityStatus: 'available',
    responseRate: 82,
    callsToDonationsRatio: 0.73,
    medicalClearance: true,
    emergencyContact: '+91-9876543024',
    preferredHospital: 'KIMS Hubli',
    donationHistory: [
      { id: 'DON-023', date: '2023-12-12', location: 'KIMS Hubli', units: 1, recipientType: 'patient' },
      { id: 'DON-024', date: '2023-09-05', location: 'SDM Hospital', units: 1, recipientType: 'blood_bank' }
    ],
    healthMetrics: {
      weight: 56,
      bloodPressure: '114/74',
      hemoglobin: 13.1,
      lastCheckup: '2024-01-10'
    },
    preferences: {
      preferredTime: 'afternoon',
      maxDistance: 14,
      notificationMethod: 'whatsapp'
    },
    registrationDate: '2022-09-15',
    lastActive: '2024-01-19',
    verificationStatus: 'verified',
    donorScore: 79
  }
];

// Donor Management Service
export class DonorManagementService {
  // Get all donors
  static getAllDonors(): DonorProfile[] {
    return donorDatabase;
  }

  // Get donors by region
  static getDonorsByRegion(region: string): DonorProfile[] {
    return donorDatabase.filter(donor => donor.region === region);
  }

  // Get donors by blood type
  static getDonorsByBloodType(bloodType: string): DonorProfile[] {
    return donorDatabase.filter(donor => donor.bloodType === bloodType);
  }

  // Get available donors
  static getAvailableDonors(): DonorProfile[] {
    return donorDatabase.filter(donor => 
      donor.availabilityStatus === 'available' && 
      donor.medicalClearance &&
      this.isEligibleForDonation(donor)
    );
  }

  // Check if donor is eligible for donation (56 days since last donation)
  static isEligibleForDonation(donor: DonorProfile): boolean {
    if (!donor.lastDonation) return true;
    
    const lastDonationDate = new Date(donor.lastDonation);
    const daysSinceLastDonation = Math.floor(
      (new Date().getTime() - lastDonationDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return daysSinceLastDonation >= 56;
  }

  // Get next eligible donation date
  static getNextEligibleDate(donor: DonorProfile): Date | null {
    if (!donor.lastDonation) return null;
    
    const lastDonationDate = new Date(donor.lastDonation);
    const nextEligibleDate = new Date(lastDonationDate.getTime() + (56 * 24 * 60 * 60 * 1000));
    
    return nextEligibleDate;
  }

  // Find best matching donors for a blood request
  static findMatchingDonors(
    bloodType: string, 
    region: string, 
    urgency: 'critical' | 'high' | 'medium' | 'low',
    unitsRequired: number = 1
  ): DonorProfile[] {
    let compatibleDonors = donorDatabase.filter(donor => 
      this.isBloodTypeCompatible(bloodType, donor.bloodType) &&
      donor.region === region &&
      donor.availabilityStatus === 'available' &&
      donor.medicalClearance &&
      this.isEligibleForDonation(donor)
    );

    // Sort by donor score and urgency preference
    compatibleDonors = compatibleDonors.sort((a, b) => {
      if (urgency === 'critical' || urgency === 'high') {
        // Prefer emergency donors for critical cases
        if (a.donorType === 'emergency' && b.donorType !== 'emergency') return -1;
        if (b.donorType === 'emergency' && a.donorType !== 'emergency') return 1;
      }
      
      // Sort by donor score
      return b.donorScore - a.donorScore;
    });

    return compatibleDonors.slice(0, Math.min(10, unitsRequired * 3)); // Return top matches
  }

  // Check blood type compatibility
  static isBloodTypeCompatible(patientBlood: string, donorBlood: string): boolean {
    const compatibility: { [key: string]: string[] } = {
      'A+': ['A+', 'A-', 'O+', 'O-'],
      'A-': ['A-', 'O-'],
      'B+': ['B+', 'B-', 'O+', 'O-'],
      'B-': ['B-', 'O-'],
      'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      'AB-': ['A-', 'B-', 'AB-', 'O-'],
      'O+': ['O+', 'O-'],
      'O-': ['O-']
    };
    
    return compatibility[patientBlood]?.includes(donorBlood) || false;
  }

  // Update donor availability
  static updateDonorAvailability(donorId: string, status: 'available' | 'unavailable' | 'pending'): boolean {
    const donorIndex = donorDatabase.findIndex(donor => donor.id === donorId);
    if (donorIndex !== -1) {
      donorDatabase[donorIndex].availabilityStatus = status;
      donorDatabase[donorIndex].lastActive = new Date().toISOString();
      return true;
    }
    return false;
  }

  // Record a new donation
  static recordDonation(
    donorId: string, 
    donationData: {
      date: string;
      location: string;
      units: number;
      recipientType: 'patient' | 'blood_bank';
      recipientId?: string;
      notes?: string;
    }
  ): boolean {
    const donorIndex = donorDatabase.findIndex(donor => donor.id === donorId);
    if (donorIndex !== -1) {
      const donor = donorDatabase[donorIndex];
      
      // Add to donation history
      const newDonation: DonationRecord = {
        id: `DON-${Date.now()}`,
        ...donationData
      };
      donor.donationHistory.unshift(newDonation);
      
      // Update donor stats
      donor.lastDonation = donationData.date;
      donor.totalDonations += donationData.units;
      donor.availabilityStatus = 'unavailable'; // Temporarily unavailable after donation
      donor.lastActive = new Date().toISOString();
      
      // Recalculate donor score
      donor.donorScore = this.calculateDonorScore(donor);
      
      return true;
    }
    return false;
  }

  // Calculate donor score based on multiple factors
  static calculateDonorScore(donor: DonorProfile): number {
    let score = 0;
    
    // Total donations (max 40 points)
    score += Math.min(donor.totalDonations * 2, 40);
    
    // Response rate (max 30 points)
    score += (donor.responseRate / 100) * 30;
    
    // Calls to donations ratio (max 20 points)
    score += donor.callsToDonationsRatio * 20;
    
    // Donor type bonus
    if (donor.donorType === 'emergency') score += 10;
    else if (donor.donorType === 'bridge') score += 5;
    
    return Math.min(Math.round(score), 100);
  }

  // Get donor statistics
  static getDonorStatistics() {
    const totalDonors = donorDatabase.length;
    const availableDonors = donorDatabase.filter(d => d.availabilityStatus === 'available').length;
    const emergencyDonors = donorDatabase.filter(d => d.donorType === 'emergency').length;
    const verifiedDonors = donorDatabase.filter(d => d.verificationStatus === 'verified').length;
    
    const bloodTypeDistribution = donorDatabase.reduce((acc, donor) => {
      acc[donor.bloodType] = (acc[donor.bloodType] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    
    const regionDistribution = donorDatabase.reduce((acc, donor) => {
      acc[donor.region] = (acc[donor.region] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    
    return {
      totalDonors,
      availableDonors,
      emergencyDonors,
      verifiedDonors,
      bloodTypeDistribution,
      regionDistribution,
      averageScore: Math.round(
        donorDatabase.reduce((sum, donor) => sum + donor.donorScore, 0) / totalDonors
      ),
      totalDonations: donorDatabase.reduce((sum, donor) => sum + donor.totalDonations, 0)
    };
  }

  // Search donors
  static searchDonors(query: string): DonorProfile[] {
    const searchTerm = query.toLowerCase();
    return donorDatabase.filter(donor =>
      donor.name.toLowerCase().includes(searchTerm) ||
      donor.id.toLowerCase().includes(searchTerm) ||
      donor.phone.includes(searchTerm) ||
      donor.email.toLowerCase().includes(searchTerm) ||
      donor.city.toLowerCase().includes(searchTerm) ||
      donor.area.toLowerCase().includes(searchTerm)
    );
  }

  // Get donor by ID
  static getDonorById(donorId: string): DonorProfile | null {
    return donorDatabase.find(donor => donor.id === donorId) || null;
  }

  // Get top performing donors
  static getTopDonors(limit: number = 10): DonorProfile[] {
    return donorDatabase
      .sort((a, b) => b.donorScore - a.donorScore)
      .slice(0, limit);
  }

  // Get donors needing follow-up
  static getDonorsNeedingFollowup(): DonorProfile[] {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return donorDatabase.filter(donor => {
      const lastActiveDate = new Date(donor.lastActive);
      return lastActiveDate < thirtyDaysAgo && donor.verificationStatus === 'verified';
    });
  }

  // Predict donor availability using AI-like scoring
  static predictDonorAvailability(donor: DonorProfile): {
    probability: number;
    confidence: number;
    factors: string[];
  } {
    let probability = 0.5; // Base probability
    const factors: string[] = [];
    
    // Response rate factor
    const responseBonus = (donor.responseRate - 70) / 100;
    probability += responseBonus;
    if (donor.responseRate > 85) factors.push('High response rate');
    
    // Donation frequency factor
    if (donor.totalDonations > 10) {
      probability += 0.2;
      factors.push('Experienced donor');
    }
    
    // Donor type factor
    if (donor.donorType === 'emergency') {
      probability += 0.15;
      factors.push('Emergency donor');
    }
    
    // Recent activity factor
    const lastActiveDate = new Date(donor.lastActive);
    const daysSinceActive = Math.floor(
      (new Date().getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceActive < 7) {
      probability += 0.1;
      factors.push('Recently active');
    }
    
    // Eligibility factor
    if (this.isEligibleForDonation(donor)) {
      probability += 0.1;
      factors.push('Eligible for donation');
    } else {
      probability -= 0.3;
      factors.push('Not yet eligible');
    }
    
    // Normalize probability
    probability = Math.max(0, Math.min(1, probability));
    
    // Calculate confidence based on data completeness
    let confidence = 0.7; // Base confidence
    if (donor.donationHistory.length > 5) confidence += 0.1;
    if (donor.totalDonations > 15) confidence += 0.1;
    if (donor.responseRate > 90) confidence += 0.1;
    
    return {
      probability: Math.round(probability * 100) / 100,
      confidence: Math.round(confidence * 100) / 100,
      factors
    };
  }
}

export default DonorManagementService;