 export interface Student {
  id: string;
  name: string;
  email: string;
  career: string;
  status: 'active' | 'inactive';
  createdAt?: string;
}

export interface User {
  email: string;
  role: 'admin' | 'user';
  name?: string;
}

export interface CreateStudentDTO {
  name: string;
  email: string;
  career: string;
  status: 'active' | 'inactive';
}

export interface UpdateStudentDTO extends Partial<CreateStudentDTO> {
  id: string;
}