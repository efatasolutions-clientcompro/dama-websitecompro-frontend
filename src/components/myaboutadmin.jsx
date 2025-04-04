import React, { useState } from 'react';
import AboutAdmin from '../components/aboutadmin.jsx';
import VisionAdmin from '../components/visionadmin.jsx';
import MissionAdmin from '../components/missionadmin.jsx';
import WhyAdmin from '../components/whyadmin.jsx';
import PeopleAdmin from '../components/peopleadmin.jsx';
import styles from './myhomeadmin.module.css'; // Sesuaikan path jika perlu

const MyAboutAdmin = () => {
    const [showAbout, setShowAbout] = useState(false);
    const [showVision, setShowVision] = useState(false);
    const [showMission, setShowMission] = useState(false);
    const [showWhy, setShowWhy] = useState(false);
    const [showPeople, setShowPeople] = useState(false);

    const navigateTo = (path) => {
        window.location.href = path;
    };

    return (
        <div className={styles.adminContainer}>
            <h2>About Admin Panel</h2>

            {/* Container untuk tombol "Go to" */}
            <div className={styles.goToContainer}>
                <button onClick={() => navigateTo('/adminonlydama/servicesdama')} className={`${styles.adminButton} ${styles.goToButton}`}>Go to Services Page</button>
                <button onClick={() => navigateTo('/adminonlydama/worksdama')} className={`${styles.adminButton} ${styles.goToButton}`}>Go to Works Page</button>
                <button onClick={() => navigateTo('/adminonlydama/footerdama')} className={`${styles.adminButton} ${styles.goToButton}`}>Go to Footer Page</button>
                <button onClick={() => navigateTo('/adminonlydama/homedama')} className={`${styles.adminButton} ${styles.goToButton}`}>Go to Home Page</button>
                <button onClick={() => navigateTo('/adminonlydama/blogsdama')} className={`${styles.adminButton} ${styles.goToButton}`}>Go to Blogs Page</button>
            </div>

            {/* Container untuk tombol "Show" */}
            <div className={styles.showContainer}>
                <button
                    onClick={() => setShowAbout(!showAbout)}
                    className={`${styles.adminButton} ${showAbout ? styles.active : ''}`}
                >
                    {showAbout ? 'Hide About Section' : 'Show About Section'}
                </button>
                <button
                    onClick={() => setShowVision(!showVision)}
                    className={`${styles.adminButton} ${showVision ? styles.active : ''}`}
                >
                    {showVision ? 'Hide Vision Section' : 'Show Vision Section'}
                </button>
                <button
                    onClick={() => setShowMission(!showMission)}
                    className={`${styles.adminButton} ${showMission ? styles.active : ''}`}
                >
                    {showMission ? 'Hide Mission Section' : 'Show Mission Section'}
                </button>
                <button
                    onClick={() => setShowWhy(!showWhy)}
                    className={`${styles.adminButton} ${showWhy ? styles.active : ''}`}
                >
                    {showWhy ? 'Hide Why Section' : 'Show Why Section'}
                </button>
                <button
                    onClick={() => setShowPeople(!showPeople)}
                    className={`${styles.adminButton} ${showPeople ? styles.active : ''}`}
                >
                    {showPeople ? 'Hide People Section' : 'Show People Section'}
                </button>
            </div>

            {showAbout && <AboutAdmin />}
            {showVision && <VisionAdmin />}
            {showMission && <MissionAdmin />}
            {showWhy && <WhyAdmin />}
            {showPeople && <PeopleAdmin />}
        </div>
    );
};

export default MyAboutAdmin;