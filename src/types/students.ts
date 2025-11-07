 export interface Student {
  id: string;
  name: string;
  lastName: string;
  email: string;
  age: number;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  username: string;
  password: string;
}
export interface CreateStudentDTO {
  name: string;
  lastName: string;
  email: string;
  age: number;
}

export interface UpdateStudent extends Partial<CreateStudentDTO> {
  id: string;
}
