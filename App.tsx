
import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import LandingPage from './components/LandingPage';
import DashboardLayout from './components/DashboardLayout';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  GraduationCap, 
  Wallet, 
  Settings, 
  LogOut, 
  HelpCircle,
  BarChart3,
  Calendar,
  MessageSquare,
  FileQuestion
} from 'lucide-react';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.GUEST);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 font-bold text-xl animate-pulse">جاري تحضير "العقرب"...</p>
        </div>
      </div>
    );
  }

  if (role === UserRole.GUEST) {
    return <LandingPage onStart={(selectedRole) => setRole(selectedRole)} />;
  }

  return (
    <DashboardLayout 
      role={role} 
      onLogout={() => setRole(UserRole.GUEST)}
      onRoleSwitch={(newRole) => setRole(newRole)}
    />
  );
};

export default App;
