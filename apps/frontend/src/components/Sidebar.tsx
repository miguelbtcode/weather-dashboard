import React from 'react';
import { Zap, LayoutGrid, MapPin, Clock, Settings } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-20 bg-secondary-950 flex flex-col items-center py-6 hidden md:flex">
      <div className="mb-12">
        <Zap className="text-primary-500" size={28} />
        <span className="text-xs text-center block mt-1 text-primary-400">SkySense</span>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-8">
          <li>
            <button className="p-3 rounded-xl bg-primary-700/20 text-primary-400 hover:bg-primary-700/30 transition-colors">
              <LayoutGrid size={22} />
            </button>
          </li>
          <li>
            <button className="p-3 rounded-xl text-secondary-400 hover:text-white hover:bg-secondary-800 transition-colors">
              <MapPin size={22} />
            </button>
          </li>
          <li>
            <button className="p-3 rounded-xl text-secondary-400 hover:text-white hover:bg-secondary-800 transition-colors">
              <Clock size={22} />
            </button>
          </li>
        </ul>
      </nav>
      
      <div className="mt-auto">
        <button className="p-3 rounded-xl text-secondary-400 hover:text-white hover:bg-secondary-800 transition-colors">
          <Settings size={22} />
        </button>
      </div>
    </aside>
  );
};