import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Header } from './components/Header';
import { BackendService } from './services/mockBackend';
import { AuthState, UserRole, Student } from './types';
import { LogIn, Users, Search, LogOut, Plus, GraduationCap, ChevronRight, UserCircle, ArrowLeft, Trash2, Edit, X, Bell, Mail, BarChart3 } from 'lucide-react';
import { StudentCard } from './components/StudentCard';
import { StudentModal } from './components/StudentModal';
import { SignatureUpload } from './components/SignatureUpload';

// --- Authentication Context ---
const AuthContext = React.createContext<{
  auth: AuthState;
  login: (u: string, p: string) => Promise<void>;
  logout: () => void;
}>({
  auth: { user: null, isAuthenticated: false },
  login: async () => {},
  logout: () => {}
});

// --- Page Components ---

// 1. Landing Page
const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">
        
        {/* Parent Portal Card */}
        <div 
          onClick={() => navigate('/parent')}
          className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all cursor-pointer group border-t-4 border-green-500"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Users size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-green-600 transition-colors">Parent Portal</h2>
          <p className="text-slate-500 mb-6">Access your child's academic progress, attendance, and marks reports.</p>
          <span className="text-green-600 font-medium flex items-center gap-2">
            View Student Data <ChevronRight size={20} />
          </span>
        </div>

        {/* Mentor Login Card */}
        <div 
          onClick={() => navigate('/login')}
          className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all cursor-pointer group border-t-4 border-blue-500"
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <GraduationCap size={32} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">Mentor Login</h2>
          <p className="text-slate-500 mb-6">Faculty access for managing student data, marks, and digital signatures.</p>
          <span className="text-blue-600 font-medium flex items-center gap-2">
            Login to Dashboard <ChevronRight size={20} />
          </span>
        </div>

      </div>
    </div>
  );
};

// 2. Login Page
const LoginPage = () => {
  const { login } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Try "mentor" / "admin123"');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Mentor Login</h2>
          <p className="text-slate-500 text-sm">Aditya Degree College Faculty Access</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <div className="relative">
              <UserCircle className="absolute left-3 top-2.5 text-slate-400" size={20} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter mentor ID"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <LogOut className="absolute left-3 top-2.5 text-slate-400 rotate-90" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter password"
                required
              />
            </div>
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-lg shadow-blue-200 disabled:opacity-50"
            >
              {isLoading ? 'Authenticating...' : 'Login'}
            </button>
            <button 
              type="button"
              onClick={() => {setUsername(''); setPassword('')}}
              className="w-full mt-3 text-slate-500 text-sm hover:text-slate-800"
            >
              Reset Fields
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 3. Mentor Dashboard
const Dashboard = () => {
  const { logout } = React.useContext(AuthContext);
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  React.useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const data = await BackendService.getAllStudents();
    setStudents(data);
  };

  const handleAddStudent = async (data: Omit<Student, 'id' | 'signatures'>) => {
    await BackendService.addStudent(data);
    loadStudents();
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.rollNumber.includes(search) ||
    s.year.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Student Database</h2>
          <p className="text-slate-500">Manage student records, attendance, and performance</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, roll no..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            title="Add Student"
          >
            <Plus size={24} />
          </button>
          <button 
            onClick={logout}
            className="bg-slate-200 text-slate-700 p-2 rounded-lg hover:bg-slate-300 transition-colors"
            title="Logout"
          >
            <LogOut size={24} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-blue-500">
          <div className="text-slate-500 text-sm font-medium uppercase">Total Students</div>
          <div className="text-3xl font-bold text-slate-800 mt-1">{students.length}</div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-green-500">
          <div className="text-slate-500 text-sm font-medium uppercase">Passed (Avg {'>'} 40%)</div>
          <div className="text-3xl font-bold text-slate-800 mt-1">
            {students.filter(s => (s.marks.weekend + s.marks.mid)/2 >= 40).length}
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-red-500">
          <div className="text-slate-500 text-sm font-medium uppercase">Low Attendance ({'<'} 75%)</div>
          <div className="text-3xl font-bold text-slate-800 mt-1">
             {students.filter(s => s.attendance < 75).length}
          </div>
        </div>
      </div>

      {/* Student List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map(student => (
          <StudentCard 
            key={student.id} 
            student={student} 
            onClick={() => setSelectedStudent(student)} 
          />
        ))}
        {filteredStudents.length === 0 && (
           <div className="col-span-full text-center py-12 text-slate-400">
             No students found matching your search.
           </div>
        )}
      </div>

      <StudentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddStudent} 
      />

      {/* Student Detail View */}
      {selectedStudent && (
        <StudentDetailView 
          student={selectedStudent} 
          onClose={() => setSelectedStudent(null)} 
          isMentor={true}
          onUpdate={async (updated) => {
             await BackendService.updateStudent(selectedStudent.id, updated);
             loadStudents();
             setSelectedStudent(null);
          }}
          onDelete={async () => {
            if(confirm('Are you sure you want to delete this student record?')) {
               await BackendService.deleteStudent(selectedStudent.id);
               loadStudents();
               setSelectedStudent(null);
            }
          }}
        />
      )}
    </div>
  );
};

// 4. Parent Portal Search
const ParentPortal = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [student, setStudent] = useState<Student | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setStudent(null);
    
    try {
      // Mock search by roll number
      const found = await BackendService.getStudentByRollNumber(searchQuery);
      if (found) {
        setStudent(found);
      } else {
        setError('No student found with this Roll Number.');
      }
    } catch (err) {
      setError('Error fetching data.');
    } finally {
      setIsLoading(false);
    }
  };

  if (student) {
    return (
      <div className="container mx-auto px-4 py-8">
         <button 
           onClick={() => setStudent(null)}
           className="mb-6 flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
         >
           <ArrowLeft size={20} /> Back to Search
         </button>
         <StudentDetailView 
           student={student} 
           onClose={() => setStudent(null)} 
           isMentor={false} // Read only
         />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border-t-4 border-green-500">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Parent Portal</h2>
        <p className="text-center text-slate-500 mb-8">Secure Access for Parents & Guardians</p>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-lg transition-all"
              placeholder="Enter Student Roll Number"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 font-bold text-lg transition-colors shadow-lg shadow-green-200 disabled:opacity-70"
          >
            {isLoading ? 'Searching...' : 'Access Report'}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-slate-400">
           By accessing this portal, you agree to Aditya Degree College's digital usage policy.
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl text-center font-medium border border-red-100">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

// 5. Shared Student Detail View
const StudentDetailView: React.FC<{
  student: Student;
  onClose: () => void;
  isMentor: boolean;
  onUpdate?: (s: Partial<Student>) => void;
  onDelete?: () => void;
}> = ({ student, onClose, isMentor, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localStudent, setLocalStudent] = useState(student);
  
  // Notification Simulation
  const handleNotifyParent = () => {
    alert(`Notification Sent!\n\nEmail and SMS alerts have been dispatched to the registered parent contacts for ${student.name}.`);
  };

  const handleSave = () => {
    if (onUpdate) onUpdate(localStudent);
    setIsEditing(false);
  };

  const handleSignatureUpload = (type: 'mentor' | 'principal', base64: string) => {
    if (!isMentor) return;
    const updatedSignatures = { ...localStudent.signatures, [type]: base64 };
    if (!base64) delete updatedSignatures[type];
    const updated = { ...localStudent, signatures: updatedSignatures };
    setLocalStudent(updated);
    if(onUpdate) onUpdate(updated);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl my-8 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-800 text-white px-8 py-6 flex justify-between items-start">
           <div>
             <h2 className="text-3xl font-bold">{student.name}</h2>
             <p className="text-slate-300 mt-1 flex gap-4">
               <span>Roll: {student.rollNumber}</span>
               <span>|</span>
               <span>{student.year} - {student.section}</span>
             </p>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
             <X size={24} />
           </button>
        </div>

        <div className="p-8">
          {/* Action Bar for Mentor */}
          {isMentor && (
            <div className="flex flex-wrap justify-end gap-3 mb-6">
               <button 
                 onClick={handleNotifyParent}
                 className="flex items-center gap-2 px-4 py-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 font-medium transition-colors"
                 title="Send SMS/Email to Parents"
               >
                 <Bell size={18} /> Notify Parent
               </button>
               <button 
                 onClick={() => setIsEditing(true)}
                 className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 font-medium transition-colors"
               >
                 <Edit size={18} /> Edit Data
               </button>
               <button 
                 onClick={onDelete}
                 className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 font-medium transition-colors"
               >
                 <Trash2 size={18} /> Delete
               </button>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Left Column: Academic Performance */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
                <BarChart3 size={20} /> Academic Performance
              </h3>
              
              {/* Graphical Analysis */}
              <div className="bg-slate-50 p-6 rounded-xl mb-6">
                <div className="flex items-end justify-center h-48 gap-8 px-4">
                   {/* Weekend Bar */}
                   <div className="flex flex-col items-center w-24">
                      <span className="text-blue-600 font-bold mb-1">{localStudent.marks.weekend}</span>
                      <div 
                        className="w-full bg-blue-500 rounded-t-lg transition-all duration-1000 relative group"
                        style={{ height: `${localStudent.marks.weekend}%` }}
                      >
                         <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      <span className="text-xs text-slate-500 mt-2 font-medium">Weekend</span>
                   </div>
                   
                   {/* Mid Bar */}
                   <div className="flex flex-col items-center w-24">
                      <span className="text-purple-600 font-bold mb-1">{localStudent.marks.mid}</span>
                      <div 
                        className="w-full bg-purple-500 rounded-t-lg transition-all duration-1000 relative group"
                        style={{ height: `${localStudent.marks.mid}%` }}
                      >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      <span className="text-xs text-slate-500 mt-2 font-medium">Mid Exam</span>
                   </div>
                </div>
                <div className="text-center mt-4 text-xs text-slate-400">Graphical Performance Analysis</div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 uppercase text-xs tracking-wider">
                      <th className="p-3 border-b font-bold">Exam</th>
                      <th className="p-3 border-b font-bold">Max</th>
                      <th className="p-3 border-b font-bold">Obtained</th>
                      <th className="p-3 border-b font-bold">Result</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700 text-sm">
                    <tr>
                      <td className="p-3 border-b font-medium">Weekend</td>
                      <td className="p-3 border-b">100</td>
                      <td className="p-3 border-b font-bold">{localStudent.marks.weekend}</td>
                      <td className="p-3 border-b">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${localStudent.marks.weekend >= 40 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {localStudent.marks.weekend >= 40 ? 'PASS' : 'FAIL'}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 border-b font-medium">Mid Exam</td>
                      <td className="p-3 border-b">100</td>
                      <td className="p-3 border-b font-bold">{localStudent.marks.mid}</td>
                      <td className="p-3 border-b">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${localStudent.marks.mid >= 40 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {localStudent.marks.mid >= 40 ? 'PASS' : 'FAIL'}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Attendance & Signatures */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
                 Attendance & Remarks
              </h3>

              {/* Attendance Tracker */}
              <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm mb-6">
                <div className="flex justify-between items-end mb-2">
                   <span className="text-slate-500 font-medium text-sm">Overall Attendance</span>
                   <span className={`text-2xl font-bold ${localStudent.attendance >= 75 ? 'text-green-600' : 'text-red-500'}`}>
                     {localStudent.attendance}%
                   </span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                   <div 
                     className={`h-full rounded-full transition-all duration-1000 ${localStudent.attendance >= 75 ? 'bg-green-500' : 'bg-red-500'}`} 
                     style={{ width: `${localStudent.attendance}%` }}
                   ></div>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                   {localStudent.attendance >= 75 ? 'Student has maintained good attendance.' : 'Warning: Attendance is below required threshold (75%).'}
                </p>
              </div>

              {/* Signatures */}
              <div className="space-y-4">
                 <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Digital Signatures</h4>
                 <div className="grid grid-cols-2 gap-4">
                    <SignatureUpload 
                      label="Mentor"
                      currentSignature={localStudent.signatures.mentor}
                      readOnly={!isMentor}
                      onUpload={(b64) => handleSignatureUpload('mentor', b64)}
                    />
                    <SignatureUpload 
                      label="Principal"
                      currentSignature={localStudent.signatures.principal}
                      readOnly={!isMentor}
                      onUpload={(b64) => handleSignatureUpload('principal', b64)}
                    />
                 </div>
              </div>
            </div>

          </div>
          
          {/* Edit Modal internal */}
          {isEditing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
               <div className="bg-white p-6 rounded-xl shadow-xl w-96">
                  <h3 className="text-lg font-bold mb-4">Update Student Data</h3>
                  <div className="space-y-4">
                     <div>
                       <label className="block text-sm font-medium mb-1">Attendance (%)</label>
                       <input 
                          type="number"
                          min="0"
                          max="100" 
                          value={localStudent.attendance}
                          onChange={e => setLocalStudent({...localStudent, attendance: Number(e.target.value)})}
                          className="w-full border p-2 rounded"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium mb-1">Weekend Marks</label>
                       <input 
                          type="number" 
                          value={localStudent.marks.weekend}
                          onChange={e => setLocalStudent({...localStudent, marks: {...localStudent.marks, weekend: Number(e.target.value)}})}
                          className="w-full border p-2 rounded"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium mb-1">Mid Marks</label>
                       <input 
                          type="number" 
                          value={localStudent.marks.mid}
                          onChange={e => setLocalStudent({...localStudent, marks: {...localStudent.marks, mid: Number(e.target.value)}})}
                          className="w-full border p-2 rounded"
                       />
                     </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-600">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">Save Updates</button>
                  </div>
               </div>
            </div>
          )}
        </div>

        <div className="bg-slate-50 px-8 py-4 text-center text-slate-400 text-sm border-t">
           Aditya Degree College • Mentor Digital System
        </div>
      </div>
    </div>
  );
};


// --- Main App Container ---
const AppContent = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-slate-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/parent" element={<ParentPortal />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="bg-slate-900 text-slate-400 py-6 text-center text-sm">
        <p>© {new Date().getFullYear()} Aditya Degree College. All rights reserved.</p>
      </footer>
    </div>
  );
};

// Protected Route Wrapper
const ProtectedRoute: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { auth } = React.useContext(AuthContext);
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });

  const login = async (u: string, p: string) => {
    const user = await BackendService.login(u, p);
    setAuth({ user, isAuthenticated: true });
  };

  const logout = () => {
    setAuth({ user: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AuthContext.Provider>
  );
}