import React from 'react';
import styles from './servicespage.module.css';

const ServicesPage = () => {
    return (
        <div className={styles.servicesContainer}>
            <div className={styles.serviceItem}>
                <a href="/services/special" className={styles.serviceLink}>
                    <img src="/special.jpg" alt="Special Packages" className={styles.serviceImage} />
                    <h2 className={styles.serviceTitle}>Special Packages</h2>
                </a>
            </div>
            <div className={styles.serviceItem}>
                <a href="/services/individual" className={styles.serviceLink}>
                    <img src="/individual.jpg" alt="Individual Services" className={styles.serviceImage} />
                    <h2 className={styles.serviceTitle}>Individual Services</h2>
                </a>
            </div>
        </div>
    );
};

export default ServicesPage;