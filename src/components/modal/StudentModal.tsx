'use client';

import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { Student, CreateStudentDTO} from '@/types/students';
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
      lastName: '',
      email: '',
      age: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        lastName: student.lastName,
        email: student.email,
        age: student.age,
      });
    } else {
      setFormData({
        name: '',
        lastName: '',
        email: '',
        age: 0,
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

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (formData.age <= 0) {
      newErrors.age = 'La edad debe ser un número positivo';
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
            <label htmlFor="lastName" className={styles.label}>
              Apellido *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
              placeholder="Ej: García"
            />
            {errors.lastName && <span className={styles.error}>{errors.lastName}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="age" className={styles.label}>
              Edad *
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className={`${styles.input} ${errors.age ? styles.inputError : ''}`}
              placeholder="Ej: 25"
            />
            {errors.age && <span className={styles.error}>{errors.age}</span>}
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