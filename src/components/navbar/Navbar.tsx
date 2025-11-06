'use client';

import React from 'react';
import { Badge } from '../badge/Badge';
import { MiButton } from '../button/Button';
import styles from './navbar.module.css';
import { FiLogOut, FiBookOpen } from 'react-icons/fi';

interface NavbarProps {
  userEmail: string;
  userRole: 'admin' | 'user';
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ userEmail, userRole, onLogout }) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <FiBookOpen size={24} color="white" />
          </div>
          <span className={styles.logoText}>Learnify</span>
        </div>

        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <span className={styles.userEmail}>{userEmail}</span>
            <Badge text={userRole} color={userRole === 'admin' ? 'blue' : 'gray'} />
          </div>
          <MiButton
            variant="secondary"
            text="Cerrar sesión"
            icon={<FiLogOut />}
            click={onLogout}
          />
        </div>
      </div>
    </nav>
  );
};