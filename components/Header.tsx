import React from 'react';
import { GraduationCap } from 'lucide-react';
import chairman from './chairman.jpeg';
import secretary from './secretary.jpeg';

export const Header: React.FC = () => {
  return (
    <header className="bg-blue-900 text-white shadow-lg border-b-4 border-yellow-500">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Chairman Photo - Top Left */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-white bg-gray-200">
              <img 
                src={chairman} 
                alt="Chairman" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs mt-1 font-medium text-blue-200">Chairman</span>
          </div>

          {/* Center Logo & Title */}
          <div className="flex flex-col items-center text-center flex-1">
            <div className="flex items-center gap-3 mb-2">
              <GraduationCap size={40} className="text-yellow-400" />
              <h1 className="text-2xl md:text-4xl font-bold uppercase tracking-wide">
                Aditya Degree College
              </h1>
            </div>
            <h2 className="text-lg md:text-xl font-semibold text-blue-200">
              Mentor Digital System
            </h2>
            <div className="h-1 w-24 bg-yellow-500 mt-2 rounded-full"></div>
          </div>

          {/* Secretary Photo - Top Right */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-white bg-gray-200">
              <img 
                src={secretary} 
                alt="Secretary" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs mt-1 font-medium text-blue-200">Secretary</span>
          </div>

        </div>
      </div>
    </header>
  );
};