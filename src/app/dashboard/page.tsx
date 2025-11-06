'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/navbar/Navbar';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { StudentTable } from '@/components/student/StudentTable';
import { StudentModal } from '@/components/modal/StudentModal';
import { MiButton } from '@/components/button/Button';
import { useStudents } from '@/hooks/useStudents';
import { Student } from '@/types/students';
import styles from './dashboard.module.css';
import { FiUsers, FiUserPlus } from 'react-icons/fi';

export default function DashboardPage() {
  const { students, isLoading, error, createStudent, updateStudent, deleteStudent } = useStudents();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleLogout = () => {
    console.log('Cerrando sesión...');
    // router.push('/login');
  };

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleDeleteStudent = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
      try {
        await deleteStudent(id);
      } catch (error) {
        alert('Error al eliminar el estudiante');
      }
    }
  };

  const handleSaveStudent = async (studentData: any) => {
    if (selectedStudent) {
      await updateStudent(selectedStudent.id, studentData);
    } else {
      await createStudent(studentData);
    }
  };

  return (
    <div className={styles.container}>
      <Navbar
        userEmail="admin@learnify.com"
        userRole="admin"
        onLogout={handleLogout}
      />

      <main className={styles.main}>
        <DashboardCard>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.iconWrapper}>
                <FiUsers className={styles.icon} />
              </div>
              <div>
                <h1 className={styles.title}>Gestión de Estudiantes</h1>
                <p className={styles.subtitle}>
                  Administra los estudiantes registrados en el sistema
                </p>
              </div>
            </div>
            <div className={styles.headerRight}>
              <MiButton
                variant="primary"
                text="Agregar Estudiante"
                icon={<FiUserPlus />}
                click={handleAddStudent}
              />
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <StudentTable
              students={students}
              onEdit={handleEditStudent}
              onDelete={handleDeleteStudent}
              isLoading={isLoading}
            />
          </div>
        </DashboardCard>
      </main>

      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStudent}
        student={selectedStudent}
        title={selectedStudent ? 'Editar Estudiante' : 'Agregar Estudiante'}
      />
    </div>
  );
}