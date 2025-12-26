import { Student, User, UserRole } from '../types';

// Initial dummy data
const INITIAL_STUDENTS: Student[] = [
  {
    id: '1',
    name: 'Sai Krishna',
    rollNumber: '2024001',
    year: '2nd Year',
    section: 'A',
    attendance: 85,
    marks: { weekend: 85, mid: 78 },
    signatures: {}
  },
  {
    id: '2',
    name: 'Anjali Devi',
    rollNumber: '2024002',
    year: '3rd Year',
    section: 'B',
    attendance: 92,
    marks: { weekend: 92, mid: 88 },
    signatures: {}
  },
  {
    id: '3',
    name: 'Rajesh Kumar',
    rollNumber: '2024003',
    year: '1st Year',
    section: 'A',
    attendance: 65,
    marks: { weekend: 45, mid: 50 },
    signatures: {}
  }
];

const STORAGE_KEY = 'aditya_mentor_system_data';

// Helper to get data
const getStudents = (): Student[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
    return INITIAL_STUDENTS;
  }
  return JSON.parse(data);
};

// Helper to save data
const saveStudents = (students: Student[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
};

export const BackendService = {
  login: async (username: string, password: string): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Hardcoded mock credentials
    if (username.toLowerCase() === 'mentor' && password === 'admin123') {
      return {
        username: 'Mentor Admin',
        role: UserRole.MENTOR,
        token: 'mock-jwt-token-xyz'
      };
    }
    throw new Error('Invalid credentials');
  },

  getAllStudents: async (): Promise<Student[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return getStudents();
  },

  getStudentById: async (id: string): Promise<Student | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return getStudents().find(s => s.id === id);
  },

  getStudentByRollNumber: async (rollNumber: string): Promise<Student | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return getStudents().find(s => s.rollNumber === rollNumber);
  },

  addStudent: async (student: Omit<Student, 'id' | 'signatures'>): Promise<Student> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const students = getStudents();
    const newStudent: Student = {
      ...student,
      id: Math.random().toString(36).substr(2, 9),
      signatures: {}
    };
    saveStudents([...students, newStudent]);
    return newStudent;
  },

  updateStudent: async (id: string, updates: Partial<Student>): Promise<Student> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const students = getStudents();
    const index = students.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Student not found');
    
    const updatedStudent = { ...students[index], ...updates };
    students[index] = updatedStudent;
    saveStudents(students);
    return updatedStudent;
  },

  deleteStudent: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const students = getStudents().filter(s => s.id !== id);
    saveStudents(students);
  }
};