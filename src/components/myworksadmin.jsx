import React, { useState } from 'react';
import WorksAdmin from '../components/worksadmin.jsx';
import WorkPage from '../components/workpageadmin.jsx';
import styles from './myhomeadmin.module.css'; // Menggunakan gaya yang sama

const MyWorksAdmin = () => {
    const [showWorksAdmin, setShowWorksAdmin] = useState(false);
    const [showWorkPage, setShowWorkPage] = useState(false);

    const navigateTo = (path) => {
        window.location.href = path;
    };

    return (
        <div className={styles.adminContainer}>
            <h2>Works Admin Panel</h2>

            {/* Container untuk tombol "Go to" */}
            <div className={styles.goToContainer}>
                <button onClick={() => navigateTo('/adminonlydama/servicesdama')} className={`${styles.adminButton} ${styles.goToButton}`}>Go to Services Page</button>
                <button onClick={() => navigateTo('/adminonlydama/homedama')} className={`${styles.adminButton} ${styles.goToButton}`}>Go to Home Page</button>
                <button onClick={() => navigateTo('/adminonlydama/footerdama')} className={`${styles.adminButton} ${styles.goToButton}`}>Go to Footer Page</button>
                <button onClick={() => navigateTo('/adminonlydama/aboutdama')} className={`${styles.adminButton} ${styles.goToButton}`}>Go to About Page</button>
                <button onClick={() => navigateTo('/adminonlydama/blogsdama')} className={`${styles.adminButton} ${styles.goToButton}`}>Go to Blogs Page</button>
            </div>

            {/* Container untuk tombol "Show" */}
            <div className={styles.showContainer}>
                <button
                    onClick={() => setShowWorksAdmin(!showWorksAdmin)}
                    className={`${styles.adminButton} ${showWorksAdmin ? styles.active : ''}`}
                >
                    {showWorksAdmin ? 'Hide Works Admin' : 'Show Works Admin'}
                </button>
                <button
                    onClick={() => setShowWorkPage(!showWorkPage)}
                    className={`${styles.adminButton} ${showWorkPage ? styles.active : ''}`}
                >
                    {showWorkPage ? 'Hide Work Page Admin' : 'Show Work Page Admin'}
                </button>
            </div>

            {showWorksAdmin && <WorksAdmin />}
            {showWorkPage && <WorkPage />}
        </div>
    );
};

export default MyWorksAdmin;