import React, { useState, useEffect } from "react";
import styles from "./aboutdisplay.module.css";

const AboutDisplay = () => {
    const [aboutData, setAboutData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAboutData = async () => {
            setLoading(true);
            try {
                const response = await fetch("https://dama-backend.vercel.app/abouts");
                if (response.ok) {
                    const data = await response.json();
                    setAboutData(data);
                } else {
                    throw new Error("Failed to fetch about data.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAboutData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <section className={styles.aboutDisplayContainer}>
            {aboutData.map((about) => (
                <div key={about.id} className={styles.aboutItem}>
                    <div className={styles.imageContainer}>
                        <img src={about.about_img} alt={about.about_title} className={styles.aboutImage} />
                    </div>
                    <div className={styles.textContainer}>
                        <h2>{about.about_title}</h2>
                        <p>{about.about_subtitle}</p>
                    </div>
                </div>
            ))}
        </section>
    );
};

export default AboutDisplay;