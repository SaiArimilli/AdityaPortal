import React from 'react';
import { Student } from '../types';
import { User, BookOpen, BarChart2, Clock } from 'lucide-react';

interface StudentCardProps {
  student: Student;
  onClick: () => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student, onClick }) => {
  const average = Math.round((student.marks.weekend + student.marks.mid) / 2);
  
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 p-5 cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
            {student.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-slate-800">{student.name}</h3>
            <p className="text-sm text-slate-500 flex items-center gap-1">
              <User size={14} /> {student.rollNumber}
            </p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-bold ${average >= 40 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {average >= 40 ? 'PASS' : 'FAIL'}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-slate-50 p-2 rounded col-span-2 flex justify-between items-center">
           <span className="text-slate-400 text-xs">Class</span>
           <span className="font-medium text-slate-700">{student.year} - {student.section}</span>
        </div>
        
        <div className="bg-slate-50 p-2 rounded flex flex-col justify-center">
          <span className="text-slate-400 text-xs block mb-1">Avg Marks</span>
          <span className="font-medium flex items-center gap-1 text-slate-800">
            <BarChart2 size={14} className="text-blue-500" /> {average}%
          </span>
        </div>

        <div className="bg-slate-50 p-2 rounded flex flex-col justify-center">
          <span className="text-slate-400 text-xs block mb-1">Attendance</span>
          <span className="font-medium flex items-center gap-1 text-slate-800">
            <Clock size={14} className={student.attendance >= 75 ? 'text-green-500' : 'text-orange-500'} /> 
            {student.attendance}%
          </span>
        </div>
      </div>
    </div>
  );
};