import React, { useState, useEffect } from "react";
import styles from "./connectdisplay.module.css";

const ConnectDisplay = () => {
    const [connectData, setConnectData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConnectData = async () => {
            setLoading(true);
            try {
                const response = await fetch("https://dama-backend.vercel.app/connect");
                if (response.ok) {
                    const data = await response.json();
                    setConnectData(data[0]); // Mengambil elemen pertama karena hanya ada satu data
                } else {
                    throw new Error("Failed to fetch connect data.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchConnectData();
    }, []);

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>Error: {error}</div>;
    if (!connectData) return null;

    return (
        <div className={styles.connectContainer} style={{ backgroundImage: `url(${connectData.connect_img})` }}>
            <div className={styles.connectContent}>
                <h2>{connectData.connect_text}</h2>
                <a href="/contact" className={styles.contactButton}>Get in Touch</a>
            </div>
        </div>
    );
};

export default ConnectDisplay;
