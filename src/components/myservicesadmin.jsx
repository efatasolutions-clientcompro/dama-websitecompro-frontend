import React, { useState } from 'react';
import ServicesSpecialAdmin from '../components/servicesspecialadmin.jsx';
import ServicesIndividualAdmin from '../components/servicesindividualadmin.jsx';
import styles from './myservicesadmin.module.css'; // Menggunakan servicesadmin.module.css

const MyServicesAdmin = () => {
    const [showServicesSpecial, setShowServicesSpecial] = useState(false);
    const [showServicesIndividual, setShowServicesIndividual] = useState(false);

    return (
        <div className={styles.adminContainer}>
            <h2>My Services Admin Panel</h2>

            <div className={styles.buttonContainer}>
                <button
                    onClick={() => setShowServicesSpecial(!showServicesSpecial)}
                    className={`${styles.adminButton} ${showServicesSpecial ? styles.active : ''}`}
                >
                    {showServicesSpecial ? 'Hide Services Special' : 'Show Services Special'}
                </button>
                <button
                    onClick={() => setShowServicesIndividual(!showServicesIndividual)}
                    className={`${styles.adminButton} ${showServicesIndividual ? styles.active : ''}`}
                >
                    {showServicesIndividual ? 'Hide Services Individual' : 'Show Services Individual'}
                </button>
            </div>

            <div className={styles.adminContent}>
                {showServicesSpecial && (
                    <div className={styles.adminSection}>
                        <h3>Services Special Admin</h3>
                        <ServicesSpecialAdmin />
                    </div>
                )}
                {showServicesIndividual && (
                    <div className={styles.adminSection}>
                        <h3>Services Individual Admin</h3>
                        <ServicesIndividualAdmin />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyServicesAdmin;