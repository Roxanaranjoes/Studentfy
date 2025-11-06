import { apiClient } from './api';
import { mockStudentService } from './mockStudentService';
import { Student, CreateStudentDTO, UpdateStudentDTO } from '@/types/students';

// Toggle para usar mock o API real
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

const realStudentService = {
  getAllStudents: async (): Promise<Student[]> => {
    const response = await apiClient.get<Student[]>('/students');
    return response.data;
  },

  getStudentById: async (id: string): Promise<Student> => {
    const response = await apiClient.get<Student>(`/students/${id}`);
    return response.data;
  },

  createStudent: async (student: CreateStudentDTO): Promise<Student> => {
    const response = await apiClient.post<Student>('/students', student);
    return response.data;
  },

  updateStudent: async (id: string, student: UpdateStudentDTO): Promise<Student> => {
    const response = await apiClient.put<Student>(`/students/${id}`, student);
    return response.data;
  },

  deleteStudent: async (id: string): Promise<void> => {
    await apiClient.delete(`/students/${id}`);
  },
};

// Exportar mock o servicio real según configuración
export const studentService = USE_MOCK ? mockStudentService : realStudentService;