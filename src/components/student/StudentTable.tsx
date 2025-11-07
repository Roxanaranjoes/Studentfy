'use client';

import React from 'react';
import { FiEdit2, FiTrash2, FiUsers } from 'react-icons/fi';
import { Student } from '@/types/students';
import { MiButton } from '../button/Button';
import styles from './studentTable.module.css';

interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Cargando estudiantes...</p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className={styles.empty}>
        <FiUsers className={styles.emptyIcon} />
        <p className={styles.emptyText}>No hay estudiantes registrados</p>
        <p className={styles.emptySubtext}>Comienza agregando tu primer estudiante</p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Nombre</th>
            <th className={styles.th}>Apellido</th>
            <th className={styles.th}>Email</th>
            <th className={styles.th}>Edad</th>
            <th className={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {students.map((student) => (
            <tr key={student.id} className={styles.tr}>
              <td className={styles.td}>{student.name}</td>
              <td className={styles.td}>{student.lastName}</td>
              <td className={styles.td}>{student.email}</td>
              <td className={styles.td}>{student.age}</td>
              <td className={styles.td}>
                <div className={styles.actions}>
                  <MiButton
                    variant="info"
                    icon={<FiEdit2 />}
                    iconOnly
                    ariaLabel="Editar estudiante"
                    click={() => onEdit(student)}
                  />
                  <MiButton
                    variant="danger"
                    icon={<FiTrash2 />}
                    iconOnly
                    ariaLabel="Eliminar estudiante"
                    click={() => onDelete(student.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
