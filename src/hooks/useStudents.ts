'use client';

import { useState, useEffect, useCallback } from 'react';
import { Student, CreateStudentDTO } from '@/types/students';
import { studentService } from '@/services/studentService';

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await studentService.getAllStudents();
      setStudents(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los estudiantes';
      setError(errorMessage);
      console.error('Error fetching students:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createStudent = async (student: CreateStudentDTO) => {
    setError(null);
    try {
      const newStudent = await studentService.createStudent(student);
      setStudents((prev) => [...prev, newStudent]);
      return newStudent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el estudiante';
      setError(errorMessage);
      console.error('Error creating student:', err);
      throw err;
    }
  };

  const updateStudent = async (id: string, student: CreateStudentDTO) => {
    setError(null);
    try {
      const updatedStudent = await studentService.updateStudent(id, { ...student, id });
      setStudents((prev) =>
        prev.map((s) => (s.id === id ? updatedStudent : s))
      );
      return updatedStudent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el estudiante';
      setError(errorMessage);
      console.error('Error updating student:', err);
      throw err;
    }
  };

  const deleteStudent = async (id: string) => {
    setError(null);
    try {
      await studentService.deleteStudent(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar el estudiante';
      setError(errorMessage);
      console.error('Error deleting student:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return {
    students,
    isLoading,
    error,
    createStudent,
    updateStudent,
    deleteStudent,
    refetch: fetchStudents,
  };
};