import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BloodRequest, TransplantRequest, FinancialRequest, ConsultationRequest, HealthRecord } from '../types';

interface AppContextType {
  currentView: string;
  setCurrentView: (view: string) => void;
  bloodRequests: BloodRequest[];
  addBloodRequest: (request: Omit<BloodRequest, 'id' | 'requestDate'>) => void;
  updateBloodRequestStatus: (id: string, status: string) => void;
  transplantRequests: TransplantRequest[];
  addTransplantRequest: (request: Omit<TransplantRequest, 'id' | 'requestDate'>) => void;
  updateTransplantRequestStatus: (id: string, status: string, adminNotes?: string) => void;
  financialRequests: FinancialRequest[];
  addFinancialRequest: (request: Omit<FinancialRequest, 'id' | 'requestDate'>) => void;
  updateFinancialRequestStatus: (id: string, status: string, adminNotes?: string) => void;
  consultationRequests: ConsultationRequest[];
  addConsultationRequest: (request: Omit<ConsultationRequest, 'id' | 'requestDate'>) => void;
  updateConsultationStatus: (id: string, status: string, scheduledDate?: Date, meetingLink?: string) => void;
  healthRecords: HealthRecord[];
  addHealthRecord: (record: Omit<HealthRecord, 'id'>) => void;
  notifications: any[];
  addNotification: (notification: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState('/dashboard');
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([
    {
      id: '1',
      patientId: '1',
      bloodType: 'O+',
      urgency: 'critical',
      unitsRequired: 2,
      status: 'pending',
      requestDate: new Date('2024-01-20'),
      requiredBy: new Date('2024-01-22'),
      hospital: 'City Medical Center',
      notes: 'Patient experiencing severe anemia symptoms'
    }
  ]);

  const [transplantRequests, setTransplantRequests] = useState<TransplantRequest[]>([
    {
      id: '1',
      patientId: '1',
      hlaType: 'A*01:01, B*08:01, C*07:01',
      status: 'pending',
      requestDate: new Date('2024-01-18'),
      medicalJustification: 'Severe thalassemia major with iron overload complications'
    }
  ]);

  const [financialRequests, setFinancialRequests] = useState<FinancialRequest[]>([
    {
      id: '1',
      patientId: '1',
      amount: 5000,
      purpose: 'Iron chelation therapy medication costs',
      status: 'pending',
      requestDate: new Date('2024-01-19'),
      documentation: ['medical_report.pdf', 'prescription.pdf']
    }
  ]);

  const [consultationRequests, setConsultationRequests] = useState<ConsultationRequest[]>([
    {
      id: '1',
      patientId: '1',
      type: 'doctor_consultation',
      status: 'scheduled',
      requestDate: new Date('2024-01-17'),
      scheduledDate: new Date('2024-01-25'),
      description: 'Follow-up consultation for recent transfusion',
      meetingLink: 'https://teams.microsoft.com/join/consultation-123'
    }
  ]);

  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([
    {
      id: '1',
      patientId: '1',
      recordDate: new Date('2024-01-15'),
      hemoglobinLevel: 8.2,
      ironLevel: 2100,
      weight: 65,
      vitalSigns: {
        bloodPressure: '120/80',
        heartRate: 72,
        temperature: 36.5
      },
      notes: 'Post-transfusion checkup. Patient feeling better.'
    },
    {
      id: '2',
      patientId: '1',
      recordDate: new Date('2024-01-01'),
      hemoglobinLevel: 7.8,
      ironLevel: 2050,
      weight: 64,
      vitalSigns: {
        bloodPressure: '118/78',
        heartRate: 75,
        temperature: 36.7
      },
      notes: 'Regular monthly checkup.'
    }
  ]);

  const [notifications, setNotifications] = useState<any[]>([
    {
      id: '1',
      title: 'Blood Request Update',
      message: 'Your blood request has been processed',
      type: 'blood_request',
      timestamp: new Date(),
      read: false
    }
  ]);

  const addBloodRequest = (request: Omit<BloodRequest, 'id' | 'requestDate'>) => {
    const newRequest: BloodRequest = {
      ...request,
      id: Date.now().toString(),
      requestDate: new Date()
    };
    setBloodRequests(prev => [...prev, newRequest]);
    
    addNotification({
      id: Date.now().toString(),
      title: 'Blood Request Submitted',
      message: `Your ${request.bloodType} blood request has been submitted`,
      type: 'blood_request',
      timestamp: new Date(),
      read: false
    });
  };

  const updateBloodRequestStatus = (id: string, status: string) => {
    setBloodRequests(prev => 
      prev.map(req => req.id === id ? { ...req, status: status as any } : req)
    );
  };

  const addTransplantRequest = (request: Omit<TransplantRequest, 'id' | 'requestDate'>) => {
    const newRequest: TransplantRequest = {
      ...request,
      id: Date.now().toString(),
      requestDate: new Date()
    };
    setTransplantRequests(prev => [...prev, newRequest]);
  };

  const updateTransplantRequestStatus = (id: string, status: string, adminNotes?: string) => {
    setTransplantRequests(prev => 
      prev.map(req => req.id === id ? { ...req, status: status as any, adminNotes } : req)
    );
  };

  const addFinancialRequest = (request: Omit<FinancialRequest, 'id' | 'requestDate'>) => {
    const newRequest: FinancialRequest = {
      ...request,
      id: Date.now().toString(),
      requestDate: new Date()
    };
    setFinancialRequests(prev => [...prev, newRequest]);
  };

  const updateFinancialRequestStatus = (id: string, status: string, adminNotes?: string) => {
    setFinancialRequests(prev => 
      prev.map(req => req.id === id ? { ...req, status: status as any, adminNotes } : req)
    );
  };

  const addConsultationRequest = (request: Omit<ConsultationRequest, 'id' | 'requestDate'>) => {
    const newRequest: ConsultationRequest = {
      ...request,
      id: Date.now().toString(),
      requestDate: new Date()
    };
    setConsultationRequests(prev => [...prev, newRequest]);
  };

  const updateConsultationStatus = (id: string, status: string, scheduledDate?: Date, meetingLink?: string) => {
    setConsultationRequests(prev => 
      prev.map(req => req.id === id ? { 
        ...req, 
        status: status as any, 
        scheduledDate, 
        meetingLink 
      } : req)
    );
  };

  const addHealthRecord = (record: Omit<HealthRecord, 'id'>) => {
    const newRecord: HealthRecord = {
      ...record,
      id: Date.now().toString()
    };
    setHealthRecords(prev => [...prev, newRecord]);
  };

  const addNotification = (notification: any) => {
    setNotifications(prev => [notification, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      currentView,
      setCurrentView,
      bloodRequests,
      addBloodRequest,
      updateBloodRequestStatus,
      transplantRequests,
      addTransplantRequest,
      updateTransplantRequestStatus,
      financialRequests,
      addFinancialRequest,
      updateFinancialRequestStatus,
      consultationRequests,
      addConsultationRequest,
      updateConsultationStatus,
      healthRecords,
      addHealthRecord,
      notifications,
      addNotification
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}