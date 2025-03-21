import React, { useState } from 'react';
import TaglinesAdmin from '../components/taglinesadmin.jsx';
import ToservicesAdmin from '../components/toservicesadmin.jsx';
import OurclientsAdmin from '../components/ourclientsadmin.jsx';
import ToworksAdmin from '../components/toworksadmin.jsx';
import TestimonialsAdmin from '../components/testimonialsadmin.jsx';
import ConnectAdmin from '../components/connectadmin.jsx';
import InstagramsAdmin from '../components/instagramsadmin.jsx';
import DamaAdmin from '../components/damaadmin.jsx';
import FaqAdmin from '../components/faqadmin.jsx';
import styles from './myhomeadmin.module.css';

const MyHomeAdmin = () => {
    const [showTaglines, setShowTaglines] = useState(false);
    const [showToservices, setShowToservices] = useState(false);
    const [showOurclients, setShowOurclients] = useState(false);
    const [showToworks, setShowToworks] = useState(false);
    const [showTestimonials, setShowTestimonials] = useState(false);
    const [showConnect, setShowConnect] = useState(false);
    const [showInstagrams, setShowInstagrams] = useState(false);
    const [showDama, setShowDama] = useState(false);
    const [showFaq, setShowFaq] = useState(false);

    const navigateTo = (path) => {
        window.location.href = path;
    };

    return (
        <div className={styles.adminContainer}>
            <h2>My Home Admin Panel</h2>

            <div className={styles.buttonContainer}>
                <button
                    onClick={() => setShowTaglines(!showTaglines)}
                    className={`${styles.adminButton} ${showTaglines ? styles.active : ''}`}
                >
                    {showTaglines ? 'Hide Taglines' : 'Show Taglines'}
                </button>
                <button
                    onClick={() => setShowToservices(!showToservices)}
                    className={`${styles.adminButton} ${showToservices ? styles.active : ''}`}
                >
                    {showToservices ? 'Hide To Services' : 'Show To Services'}
                </button>
                <button
                    onClick={() => setShowOurclients(!showOurclients)}
                    className={`${styles.adminButton} ${showOurclients ? styles.active : ''}`}
                >
                    {showOurclients ? 'Hide Our Clients' : 'Show Our Clients'}
                </button>
                <button
                    onClick={() => setShowToworks(!showToworks)}
                    className={`${styles.adminButton} ${showToworks ? styles.active : ''}`}
                >
                    {showToworks ? 'Hide To Works' : 'Show To Works'}
                </button>
                <button
                    onClick={() => setShowTestimonials(!showTestimonials)}
                    className={`${styles.adminButton} ${showTestimonials ? styles.active : ''}`}
                >
                    {showTestimonials ? 'Hide Testimonials' : 'Show Testimonials'}
                </button>
                <button
                    onClick={() => setShowConnect(!showConnect)}
                    className={`${styles.adminButton} ${showConnect ? styles.active : ''}`}
                >
                    {showConnect ? 'Hide Connect' : 'Show Connect'}
                </button>
                <button
                    onClick={() => setShowInstagrams(!showInstagrams)}
                    className={`${styles.adminButton} ${showInstagrams ? styles.active : ''}`}
                >
                    {showInstagrams ? 'Hide Instagrams' : 'Show Instagrams'}
                </button>
                <button
                    onClick={() => setShowDama(!showDama)}
                    className={`${styles.adminButton} ${showDama ? styles.active : ''}`}
                >
                    {showDama ? 'Hide Dama' : 'Show Dama'}
                </button>
                <button
                    onClick={() => setShowFaq(!showFaq)}
                    className={`${styles.adminButton} ${showFaq ? styles.active : ''}`}
                >
                    {showFaq ? 'Hide FAQ' : 'Show FAQ'}
                </button>
                {/* Tombol Navigasi Tanpa React Router */}
                <button
                    onClick={() => navigateTo('/adminonlydama/specialservices')}
                    className={styles.adminButton}
                >
                    Special Services
                </button>
                <button
                    onClick={() => navigateTo('/adminonlydama/individualservices')}
                    className={styles.adminButton}
                >
                    Individual Services
                </button>
                <button
                    onClick={() => navigateTo('/adminonlydama/worksdama')}
                    className={styles.adminButton}
                >
                    Works Dama
                </button>
            </div>

            {showTaglines && <TaglinesAdmin />}
            {showToservices && <ToservicesAdmin />}
            {showOurclients && <OurclientsAdmin />}
            {showToworks && <ToworksAdmin />}
            {showTestimonials && <TestimonialsAdmin />}
            {showConnect && <ConnectAdmin />}
            {showInstagrams && <InstagramsAdmin />}
            {showDama && <DamaAdmin />}
            {showFaq && <FaqAdmin />}
        </div>
    );
};

export default MyHomeAdmin;