import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { PatientDashboard } from '../dashboard/PatientDashboard';
import { DonorDashboard } from '../dashboard/DonorDashboard';
import { DoctorDashboard } from '../dashboard/DoctorDashboard';
import { AdminDashboard } from '../dashboard/AdminDashboard';
import { UserDashboard } from '../features/UserDashboard';
import { BloodRequestForm } from '../features/BloodRequestForm';
import { BloodRequestsList } from '../features/BloodRequestsList';
import { DonorMatching } from '../features/DonorMatching';
import { ThalCarePassport } from '../features/ThalCarePassport';
import { HealthRecords } from '../features/HealthRecords';
import { TransplantRequests } from '../features/TransplantRequests';
import { FinancialRequests } from '../features/FinancialRequests';
import { ConsultationRequests } from '../features/ConsultationRequests';
import { CommunityChat } from '../features/CommunityChat';
import { Settings } from '../features/Settings';
import { AIHealthAnalyzerComponent } from '../features/AIHealthAnalyzer';
import { AISymptomAssistantComponent } from '../features/AISymptomAssistant';
import { NearbyHospitals } from '../features/NearbyHospitals';
import { DonorManagement } from '../features/DonorManagement';

export function MainContent() {
  const { user } = useAuth();
  const { currentView } = useApp();

  const renderContent = () => {
    switch (currentView) {
      case '/dashboard':
        switch (user?.role) {
          case 'patient':
            return <PatientDashboard />;
          case 'user':
            return <UserDashboard />;
          case 'trainer_doctor':
          case 'trainee_doctor':
            return <DoctorDashboard />;
          case 'admin':
            return <AdminDashboard />;
          default:
            return <PatientDashboard />;
        }
      case '/blood-requests':
        return user?.role === 'admin' ? <BloodRequestsList /> : <BloodRequestForm />;
      case '/donor-management':
        return <DonorManagement />;
      case '/users':
        return <DonorMatching />;
      case '/records':
        return <HealthRecords />;
      case '/passport':
        return <ThalCarePassport />;
      case '/transplant':
        return <TransplantRequests />;
      case '/financial':
        return <FinancialRequests />;
      case '/consultations':
        return <ConsultationRequests />;
      case '/community':
        return <CommunityChat />;
      case '/ai-health':
        return <AIHealthAnalyzerComponent />;
      case '/nearby':
        return <NearbyHospitals />;
      case '/settings':
        return <Settings />;
      default:
        return user?.role === 'patient' ? <PatientDashboard /> : 
               user?.role === 'user' ? <UserDashboard /> :
               user?.role === 'admin' ? <AdminDashboard /> : <DoctorDashboard />;
    }
  };

  return (
    <main className="flex-1 p-6">
      {renderContent()}
    </main>
  );
}