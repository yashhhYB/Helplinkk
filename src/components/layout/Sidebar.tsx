import React from 'react';
import { 
  Home, 
  Users, 
  Heart, 
  Calendar, 
  FileText, 
  Settings, 
  BarChart3,
  Stethoscope,
  CreditCard,
  Activity,
  MessageSquare,
  Brain,
  Bot,
  MapPin
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { cn } from '../../utils/helpers';

interface NavItem {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
  roles?: string[];
}

const navigationItems: NavItem[] = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Donor Management', path: '/donor-management', roles: ['admin'] },
  { icon: Stethoscope, label: 'Consultations', path: '/consultations', roles: ['patient', 'user', 'trainer_doctor', 'trainee_doctor'] },
  { icon: MapPin, label: 'Nearby Centers', path: '/nearby', roles: ['patient', 'user'] },
  { icon: CreditCard, label: 'Financial Help', path: '/financial', roles: ['patient', 'admin'] },
  { icon: Activity, label: 'Transplant Requests', path: '/transplant', roles: ['patient', 'admin'] },
  { icon: BarChart3, label: 'Analytics', path: '/analytics', roles: ['admin'] },
  { icon: Brain, label: 'AI Health Insights', path: '/ai-health', roles: ['patient'] },
  { icon: MessageSquare, label: 'Community', path: '/community' },
  { icon: Settings, label: 'Settings', path: '/settings' }
];

export function Sidebar() {
  const { user } = useAuth();
  const { currentView, setCurrentView } = useApp();

  const filteredItems = navigationItems.filter(item => 
    !item.roles || item.roles.includes(user?.role || '')
  );

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-16">
      <nav className="p-4 space-y-2">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => setCurrentView(item.path)}
              className={cn(
                'w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200',
                isActive 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className={cn(
                'h-5 w-5',
                isActive ? 'text-blue-600' : 'text-gray-400'
              )} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}