import React, { useState, useEffect } from 'react';
import styles from './contactdisplay.module.css';

const ContactDisplay = () => {
    const [contactData, setContactData] = useState(null);
    const [whatsappNumber, setWhatsappNumber] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContactData = async () => {
            try {
                const response = await fetch('https://dama-backend.vercel.app/contacts');
                if (!response.ok) {
                    throw new Error('Failed to fetch contact data');
                }
                const data = await response.json();
                setContactData(data[0]); // Asumsikan hanya satu data kontak yang diambil
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        const fetchWhatsappNumber = async () => {
            try {
                const response = await fetch('https://dama-backend.vercel.app/dama');
                if (!response.ok) {
                    throw new Error('Failed to fetch whatsapp number');
                }
                const data = await response.json();
                setWhatsappNumber(data[0].dama_whatsapp);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchContactData();
        fetchWhatsappNumber();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (!contactData || !whatsappNumber) return <p>Data not available.</p>;

    return (
        <div className={styles.contactContainer} style={{ backgroundImage: `url(${contactData.contact_image})` }}>
            <div className={styles.contactContent}>
                <h2 className={styles.contactTitle}>{contactData.contact_title}</h2>
                <p className={styles.contactSubtitle}>{contactData.contact_subtitle}</p>
                <a href={`https://wa.me/${whatsappNumber}`} className={styles.whatsappLink} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                </a>
            </div>
        </div>
    );
};

export default ContactDisplay;