import axios from "axios";
import type {
  Student,
  StudentFormData,
  Program,
  ProgramFormData,
  Enrollment,
  EnrollmentFormData,
} from "@/types";

const API_GATEWAY = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:7000";

const api = axios.create({
  baseURL: API_GATEWAY,
  headers: { "Content-Type": "application/json" },
});

// Patient API

export const studentApi = {
  getAll: async (): Promise<Student[]> => {
    const { data } = await api.get("/api/v1/patients");
    return data;
  },

  getById: async (nic: string): Promise<Student> => {
    const { data } = await api.get(`/api/v1/patients/${nic}`);
    return data;
  },

  create: async (formData: StudentFormData): Promise<Student> => {
    const form = new FormData();
    form.append("nic", formData.nic);
    form.append("name", formData.name);
    form.append("address", formData.address);
    form.append("mobile", formData.mobile);
    if (formData.email) form.append("email", formData.email);
    if (formData.picture) form.append("picture", formData.picture);

    const { data } = await api.post("/api/v1/patients", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  update: async (nic: string, formData: StudentFormData): Promise<Student> => {
    const form = new FormData();
    form.append("name", formData.name);
    form.append("address", formData.address);
    form.append("mobile", formData.mobile);
    if (formData.email) form.append("email", formData.email);
    if (formData.picture) form.append("picture", formData.picture);

    const { data } = await api.put(`/api/v1/patients/${nic}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  delete: async (nic: string): Promise<void> => {
    await api.delete(`/api/v1/patients/${nic}`);
  },

  getPictureUrl: (nic: string): string =>
    `${API_GATEWAY}/api/v1/patients/${nic}/picture`,
};

// Doctor API

export const programApi = {
  getAll: async (): Promise<Program[]> => {
    const { data } = await api.get("/api/v1/doctors");
    return data;
  },

  getById: async (doctorSlotId: string): Promise<Program> => {
    const { data } = await api.get(`/api/v1/doctors/${doctorSlotId}`);
    return data;
  },

  create: async (body: ProgramFormData): Promise<Program> => {
    const { data } = await api.post("/api/v1/doctors", body);
    return data;
  },

  update: async (doctorSlotId: string, body: ProgramFormData): Promise<Program> => {
    const { data } = await api.put(`/api/v1/doctors/${doctorSlotId}`, body);
    return data;
  },

  delete: async (doctorSlotId: string): Promise<void> => {
    await api.delete(`/api/v1/doctors/${doctorSlotId}`);
  },
};

// Appointment API

export const enrollmentApi = {
  getAll: async (): Promise<Enrollment[]> => {
    const { data } = await api.get("/api/v1/appointments");
    return data;
  },

  getById: async (id: number): Promise<Enrollment> => {
    const { data } = await api.get(`/api/v1/appointments/${id}`);
    return data;
  },

  getByProgram: async (doctorSlotId: string): Promise<Enrollment[]> => {
    const { data } = await api.get("/api/v1/appointments", {
      params: { doctorSlotId },
    });
    return data;
  },

  create: async (body: EnrollmentFormData): Promise<Enrollment> => {
    const { data } = await api.post("/api/v1/appointments", body);
    return data;
  },

  update: async (id: number, body: EnrollmentFormData): Promise<Enrollment> => {
    const { data } = await api.put(`/api/v1/appointments/${id}`, body);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/v1/appointments/${id}`);
  },
};
