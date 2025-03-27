import React, { useState, useEffect } from "react";
import styles from "./instagramsdisplay.module.css";

const InstagramsDisplay = () => {
    const [instagrams, setInstagrams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInstagrams = async () => {
            setLoading(true);
            try {
                const response = await fetch("https://dama-backend.vercel.app/instagrams");
                if (response.ok) {
                    const data = await response.json();
                    setInstagrams(data);
                } else {
                    throw new Error("Failed to fetch Instagram data.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInstagrams();
    }, []);

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>Error: {error}</div>;

    return (
        <div className={styles.instagramContainer}>
            <div className={styles.instagramScroll}>
                {instagrams.map((post) => (
                    <a 
                        key={post.id} 
                        href={post.instagram_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.instagramItem}
                    >
                        <img 
                            src={post.instagram_img} 
                            alt={post.instagram_name} 
                            className={styles.instagramImage} 
                        />
                    </a>
                ))}
            </div>
        </div>
    );
};

export default InstagramsDisplay;
