import { Student, CreateStudentDTO, UpdateStudentDTO } from '@/types/students';

// Simular delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Datos iniciales
let mockStudents: Student[] = [
  {
    id: '1',
    name: 'María García',
    email: 'maria@example.com',
    career: 'Ingeniería en Sistemas',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Juan López',
    email: 'juan@example.com',
    career: 'Administración de Empresas',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Ana Martínez',
    email: 'ana@example.com',
    career: 'Psicología',
    status: 'inactive',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Carlos Rodríguez',
    email: 'carlos@example.com',
    career: 'Ingeniería Civil',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Laura Fernández',
    email: 'laura@example.com',
    career: 'Medicina',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
];

export const mockStudentService = {
  getAllStudents: async (): Promise<Student[]> => {
    await delay(500); // Simular latencia de red
    return [...mockStudents];
  },

  getStudentById: async (id: string): Promise<Student> => {
    await delay(300);
    const student = mockStudents.find(s => s.id === id);
    if (!student) {
      throw new Error('Estudiante no encontrado');
    }
    return student;
  },

  createStudent: async (student: CreateStudentDTO): Promise<Student> => {
    await delay(500);
    const newStudent: Student = {
      id: Date.now().toString(),
      ...student,
      createdAt: new Date().toISOString(),
    };
    mockStudents.push(newStudent);
    return newStudent;
  },

  updateStudent: async (id: string, studentData: UpdateStudentDTO): Promise<Student> => {
    await delay(500);
    const index = mockStudents.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Estudiante no encontrado');
    }
    
    const updatedStudent = {
      ...mockStudents[index],
      ...studentData,
      id,
    };
    
    mockStudents[index] = updatedStudent;
    return updatedStudent;
  },

  deleteStudent: async (id: string): Promise<void> => {
    await delay(500);
    const index = mockStudents.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Estudiante no encontrado');
    }
    mockStudents.splice(index, 1);
  },
};