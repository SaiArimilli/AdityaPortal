export enum UserRole {
  MENTOR = 'MENTOR',
  PARENT = 'PARENT',
  GUEST = 'GUEST'
}

export interface Marks {
  weekend: number;
  mid: number;
}

export interface Signatures {
  mentor?: string; // Base64 string
  principal?: string; // Base64 string
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  year: string;
  section: string;
  attendance: number; // Percentage 0-100
  marks: Marks;
  signatures: Signatures;
}

export interface User {
  username: string;
  role: UserRole;
  token?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}