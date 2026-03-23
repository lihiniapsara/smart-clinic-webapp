// Student types
export interface Student {
  nic: string;
  name: string;
  address: string;
  mobile: string;
  email?: string;
  picture?: string;
}

export interface StudentFormData {
  nic: string;
  name: string;
  address: string;
  mobile: string;
  email?: string;
  picture?: File | null;
}

// Program types
export interface Program {
  doctorSlotId: string;
  description: string;
}

export interface ProgramFormData {
  doctorSlotId: string;
  description: string;
}

// Enrollment types
export interface StudentSummary {
  name: string;
  address: string;
  mobile: string;
  email?: string;
  picture?: string;
}

export interface Enrollment {
  id?: number;
  date: string;
  patientId: string;
  doctorSlotId: string;
  patient?: StudentSummary;
}

export interface EnrollmentFormData {
  date: string;
  patientId: string;
  doctorSlotId: string;
}

// API response wrapper
export interface ApiError {
  message: string;
  status?: number;
}
