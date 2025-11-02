import React, { useState, FC } from 'react';
import type { View } from './types';
import CourseSection from './components/CourseSection';
import StudyGroupSection from './components/StudyGroupSection';
import PartnerSection from './components/PartnerSection';
import AIAssistantSection from './components/AIAssistantSection';
import AcademicCapIcon from './components/icons/AcademicCapIcon';
import BookOpenIcon from './components/icons/BookOpenIcon';
import UsersIcon from './components/icons/UsersIcon';
import UserPlusIcon from './components/icons/UserPlusIcon';
import SparklesIcon from './components/icons/SparklesIcon';
import { ToastProvider } from './hooks/useToast';

const AppContent: FC = () => {
  const [view, setView] = useState<View>('courses');

  const renderView = () => {
    switch (view) {
      case 'courses':
        return <CourseSection />;
      case 'groups':
        return <StudyGroupSection />;
      case 'partners':
        return <PartnerSection />;
      case 'assistant':
        return <AIAssistantSection />;
      default:
        return <CourseSection />;
    }
  };

  const NavItem: FC<{
    label: string;
    viewName: View;
    icon: React.ReactNode;
  }> = ({ label, viewName, icon }) => (
    <button
      onClick={() => setView(viewName)}
      className={`flex items-center w-full px-4 py-3 text-left transition-all duration-200 ease-in-out rounded-lg shadow-sm hover:bg-blue-600 hover:text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
        view === viewName
          ? 'bg-blue-600 text-white shadow-lg'
          : 'bg-white text-slate-700'
      }`}
    >
      <div className="flex-shrink-0 w-8 h-8 mr-4 bg-red-500 rounded-full flex items-center justify-center shadow-md">
        {icon}
      </div>
      <span className="font-semibold">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-100">
      <aside className="w-full md:w-64 bg-white md:border-r border-slate-200 p-4 shadow-lg md:shadow-none">
        <div className="flex items-center mb-8">
          <AcademicCapIcon className="w-10 h-10 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-800 ml-2">StudySphere</h1>
        </div>
        <nav className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-3">
          <NavItem label="Courses" viewName="courses" icon={<BookOpenIcon className="w-5 h-5 text-white" />} />
          <NavItem label="Study Groups" viewName="groups" icon={<UsersIcon className="w-5 h-5 text-white" />} />
          <NavItem label="Find Partners" viewName="partners" icon={<UserPlusIcon className="w-5 h-5 text-white" />} />
          <NavItem label="AI Assistant" viewName="assistant" icon={<SparklesIcon className="w-5 h-5 text-white" />} />
        </nav>
      </aside>

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {renderView()}
      </main>
    </div>
  );
};

const App: FC = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;
