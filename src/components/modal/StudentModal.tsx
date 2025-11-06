'use client';

import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { Student, CreateStudentDTO } from '@/types/students';
import { MiButton } from '../button/Button';
import styles from './studentModal.module.css';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: CreateStudentDTO) => Promise<void>;
  student?: Student | null;
  title?: string;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  student = null,
  title = 'Agregar Estudiante',
}) => {
  const [formData, setFormData] = useState<CreateStudentDTO>({
    name: '',
    email: '',
    career: '',
    status: 'active',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        email: student.email,
        career: student.career,
        status: student.status,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        career: '',
        status: 'active',
      });
    }
    setErrors({});
  }, [student, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.career.trim()) {
      newErrors.career = 'La carrera es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving student:', error);
      setErrors({ submit: 'Error al guardar el estudiante. Intenta nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Cerrar">
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {errors.submit && (
            <div className={styles.errorAlert}>{errors.submit}</div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Nombre completo *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              placeholder="Ej: María García"
            />
            {errors.name && <span className={styles.error}>{errors.name}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Correo electrónico *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              placeholder="Ej: maria@example.com"
            />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="career" className={styles.label}>
              Carrera *
            </label>
            <input
              type="text"
              id="career"
              name="career"
              value={formData.career}
              onChange={handleChange}
              className={`${styles.input} ${errors.career ? styles.inputError : ''}`}
              placeholder="Ej: Ingeniería en Sistemas"
            />
            {errors.career && <span className={styles.error}>{errors.career}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status" className={styles.label}>
              Estado *
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={styles.input}
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>

          <div className={styles.footer}>
            <MiButton
              variant="secondary"
              text="Cancelar"
              click={onClose}
              disabled={isLoading}
            />
            <MiButton
              variant="primary"
              text={isLoading ? 'Guardando...' : 'Guardar'}
              disabled={isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};