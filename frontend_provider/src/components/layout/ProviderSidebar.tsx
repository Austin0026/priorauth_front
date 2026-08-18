import React from 'react';
import { useProvider } from '../../context/ProviderContext';
import { AppTab } from '../../types/common';
import { Users, FilePlus2, ListFilter, BookOpen, UserSquare2 } from 'lucide-react';

export const ProviderSidebar: React.FC = () => {
  const { activeTab, setActiveTab, selectedPatientId } = useProvider();

  const navItems: { id: AppTab; label: string; icon: any; badge?: string }[] = [
    { id: 'patients', label: 'Patient Directory', icon: Users },
    ...(selectedPatientId
      ? [{ id: 'patient_chart' as AppTab, label: 'Patient Chart', icon: UserSquare2, badge: 'Active' }]
      : []),
    { id: 'new_pa', label: 'New Prior Auth', icon: FilePlus2 },
    { id: 'tracker', label: 'PA Request Tracker', icon: ListFilter, badge: '2 Active' },
    { id: 'policies', label: 'CMS Policy Explorer', icon: BookOpen },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 bg-white border-r border-slate-200 p-4 space-y-6">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
          Clinical Navigation
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={18}
                    className={isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-indigo-200/70 text-indigo-900' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Quick Launch Intake Card */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-md">
        <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1">
          Fast Track PA
        </div>
        <h4 className="text-sm font-semibold mb-2">Need a rapid lumbar MRI determination?</h4>
        <p className="text-xs text-slate-300 mb-3 leading-relaxed">
          Run our deterministic pre-check engine to verify LCD L34220 compliance before submitting.
        </p>
        <button
          onClick={() => setActiveTab('new_pa')}
          className="w-full py-2 px-3 bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg text-xs font-bold shadow transition-colors"
        >
          Start New Intake &rarr;
        </button>
      </div>
    </aside>
  );
};
