import React, { useEffect, useState } from "react";
import styles from "./toworksdisplay.module.css";

const ToWorksDisplay = () => {
    const [toWork, setToWork] = useState(null);
    const [workImages, setWorkImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchToWorks = async () => {
            setLoading(true);
            try {
                const response = await fetch("https://dama-backend.vercel.app/toworks");
                if (response.ok) {
                    const data = await response.json();
                    if (data.length > 0) {
                        setToWork(data[0]);
                    }
                } else {
                    setMessage("Failed to fetch to works.");
                }
            } catch (error) {
                console.error("Error fetching to works:", error);
                setMessage("Failed to fetch to works.");
            }
        };

        const fetchWorkImages = async () => {
            try {
                const response = await fetch("https://dama-backend.vercel.app/works");
                if (response.ok) {
                    const data = await response.json();
                    const sortedData = data.sort((a, b) => b.id - a.id);
                    setWorkImages(sortedData.slice(0, 3));
                }
            } catch (error) {
                console.error("Error fetching work images:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchToWorks();
        fetchWorkImages();
    }, []);

    return (
        <section className={styles.container}>
            {loading && <p className={styles.loading}>Loading...</p>}
            {message && <p className={styles.message}>{message}</p>}
            {toWork && (
                <div className={styles.toworkContent}>
                    <h1 className={styles.toworksText}>{toWork.toworks_text}</h1>
                    <p className={styles.toworksSubText}>{toWork.toworks_sub_text}</p>
                </div>
            )}
            <div className={styles.imageGallery}>
                {workImages.map((work) => (
                    <div key={work.id} className={styles.imageContainer}>
                        <img src={work.work_main_img} alt={work.work_title} className={styles.workImage} />
                        <div className={styles.imageOverlay}>{work.work_title}</div>
                    </div>
                ))}
            </div>
            <div className={styles.buttonContainer}>
                <a href="/works" className={styles.portfolioButton}>View Our Portfolio</a>
            </div>
        </section>
    );
};

export default ToWorksDisplay;
