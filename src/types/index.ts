export interface User {
  id: string;
  email: string;
  role: 'patient' | 'user' | 'trainer_doctor' | 'trainee_doctor' | 'admin';
  firstName: string;
  lastName: string;
  phone: string;
  region: string;
  state?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Patient extends User {
  bloodType: string;
  hlaType?: string;
  medicalHistory: string;
  emergencyContact: string;
  preferredHospital?: string;
  ironLevel?: number;
  hemoglobinLevel?: number;
  lastTransfusion?: Date;
  patientId?: string;
  state?: string;
}

export interface UserProfile extends User {
  bloodType: string;
  isDonor?: boolean;
  donorType?: 'emergency' | 'bridge';
  lastDonation?: Date;
  availabilityStatus?: 'available' | 'unavailable' | 'pending';
  totalDonations?: number;
  callsToDonationsRatio?: number;
}

export interface Doctor extends User {
  specialization: string;
  licenseNumber: string;
  hospital: string;
  availableForConsultation: boolean;
  linkedPatients: string[];
}

export interface BloodRequest {
  id: string;
  patientId: string;
  bloodType: string;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  unitsRequired: number;
  status: 'pending' | 'approved' | 'fulfilled' | 'cancelled';
  requestDate: Date;
  requiredBy: Date;
  hospital: string;
  notes?: string;
  fulfilledBy?: 'center' | 'donor';
  donorId?: string;
}

export interface TransplantRequest {
  id: string;
  patientId: string;
  hlaType: string;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  requestDate: Date;
  medicalJustification: string;
  adminNotes?: string;
}

export interface FinancialRequest {
  id: string;
  patientId: string;
  amount: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  requestDate: Date;
  documentation: string[];
  adminNotes?: string;
}

export interface ConsultationRequest {
  id: string;
  patientId: string;
  doctorId?: string;
  type: 'doctor_consultation' | 'counseling';
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  requestDate: Date;
  scheduledDate?: Date;
  description: string;
  meetingLink?: string;
}

export interface BloodCenter {
  id: string;
  name: string;
  region: string;
  bloodInventory: { [bloodType: string]: number };
  contactInfo: string;
}

export interface HealthRecord {
  id: string;
  patientId: string;
  recordDate: Date;
  hemoglobinLevel: number;
  ironLevel: number;
  weight: number;
  vitalSigns: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
  };
  notes?: string;
}

export interface DonorPrediction {
  donorId: string;
  availabilityProbability: number;
  factors: {
    callsToDonationsRatio: number;
    daysSinceLastDonation: number;
    totalDonations: number;
    responseHistory: number;
  };
}