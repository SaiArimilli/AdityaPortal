import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { X, Save } from 'lucide-react';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (student: Omit<Student, 'id' | 'signatures'>) => void;
  initialData?: Student;
}

export const StudentModal: React.FC<StudentModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    year: '',
    section: '',
    weekendMarks: 0,
    midMarks: 0,
    attendance: 0
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        rollNumber: initialData.rollNumber,
        year: initialData.year,
        section: initialData.section,
        weekendMarks: initialData.marks.weekend,
        midMarks: initialData.marks.mid,
        attendance: initialData.attendance || 0
      });
    } else {
      setFormData({
        name: '',
        rollNumber: '',
        year: '',
        section: '',
        weekendMarks: 0,
        midMarks: 0,
        attendance: 0
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      rollNumber: formData.rollNumber,
      year: formData.year,
      section: formData.section,
      attendance: Number(formData.attendance),
      marks: {
        weekend: Number(formData.weekendMarks),
        mid: Number(formData.midMarks)
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="bg-blue-900 px-6 py-4 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold">{initialData ? 'Edit Student' : 'Add New Student'}</h2>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                required
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. John Doe"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Roll Number</label>
              <input
                required
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.rollNumber}
                onChange={e => setFormData({...formData, rollNumber: e.target.value})}
                placeholder="e.g. 2024001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
              <select
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.year}
                onChange={e => setFormData({...formData, year: e.target.value})}
              >
                <option value="">Select Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Section</label>
              <input
                required
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.section}
                onChange={e => setFormData({...formData, section: e.target.value})}
                placeholder="e.g. A"
              />
            </div>
            
             <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Attendance (%)</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  value={formData.attendance}
                  onChange={e => setFormData({...formData, attendance: Number(e.target.value)})}
                />
                <span className="w-12 text-center font-bold text-slate-700">{formData.attendance}%</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 my-4 pt-4">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">Exam Marks</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Weekend Exam</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.weekendMarks}
                  onChange={e => setFormData({...formData, weekendMarks: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mid Exam</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.midMarks}
                  onChange={e => setFormData({...formData, midMarks: Number(e.target.value)})}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-md shadow-blue-200 transition-all flex items-center gap-2"
            >
              <Save size={18} />
              Save Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};