import React, { useState } from 'react';
import { User, DollarSign, CheckCircle, Plus, X } from 'lucide-react';
import TaskTab from './TaskTab';
import RevenueTab from './RevenueTab';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Austin');

  const tabs = [
    { id: 'Austin', name: 'Austin', icon: User, color: 'bg-blue-500' },
    { id: 'Dhanush', name: 'Dhanush', icon: User, color: 'bg-emerald-500' },
    { id: 'Ashrith', name: 'Ashrith', icon: User, color: 'bg-purple-500' },
    { id: 'Revenue', name: 'Revenue', icon: DollarSign, color: 'bg-rose-500' },
  ];

  const renderContent = () => {
    if (activeTab === 'Revenue') {
      return <RevenueTab />;
    }
    return <TaskTab person={activeTab} />;
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white/80 backdrop-blur-sm shadow-xl border-r border-white/20 min-h-screen">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Startup Dashboard</h1>
            <p className="text-gray-600 text-sm">Track progress & finances</p>
          </div>
          
          <nav className="px-4 pb-6">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl mb-2 transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {tab.id === 'Revenue' ? (
                    <IconComponent className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  ) : (
                    <div className={`w-8 h-8 rounded-full ${tab.color} flex items-center justify-center text-white text-sm font-semibold shadow-lg`}>
                      {getInitials(tab.name)}
                    </div>
                  )}
                  <span className="font-medium">{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;