// components/WorksDisplay.jsx
import React, { useState, useEffect } from "react";
import styles from "./worksdisplay.module.css";

const WorksDisplay = () => {
    const [worksData, setWorksData] = useState([]);
    const [filteredWorks, setFilteredWorks] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");

    const VALID_WORK_CATEGORIES = [
        "Start Up Package",
        "Brand Management",
        "Brand Consultation",
        "Collection Development",
        "TikTok Management",
        "Social Media Management",
        "Styling & Creative Direction",
        "Fabric Sourcing & Consulting"
    ];

    useEffect(() => {
        const fetchWorksData = async () => {
            try {
                const response = await fetch("https://dama-backend.vercel.app/works");
                if (response.ok) {
                    const data = await response.json();
                    setWorksData(data);
                } else {
                    console.error("Fetch error:", response.status, response.statusText);
                }
            } catch (error) {
                console.error("Error fetching Works data:", error);
            }
        };

        fetchWorksData();
    }, []);

    useEffect(() => {
        if (selectedCategory === "All") {
            setFilteredWorks(worksData);
        } else {
            const filtered = worksData.filter(work => work.work_category === selectedCategory);
            setFilteredWorks(filtered);
        }
    }, [worksData, selectedCategory]);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    return (
        <section className={styles.worksDisplayContainer}>
            <div className={styles.categoryFilter}>
                <button
                    className={`${styles.categoryButton} ${selectedCategory === "All" ? styles.active : ""}`}
                    onClick={() => handleCategoryClick("All")}
                >
                    All
                </button>
                {VALID_WORK_CATEGORIES.map(category => (
                    <button
                        key={category}
                        className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ""}`}
                        onClick={() => handleCategoryClick(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className={styles.worksGrid}>
                {filteredWorks.map(work => (
                    <div key={work.id} className={styles.workItem}>
                        <a href={`/works/${work.work_title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
                            <div className={styles.workItemImageContainer}>
                                {work.work_main_img && (
                                    <img src={work.work_main_img} alt={work.work_title} className={styles.workImage} />
                                )}
                                <div className={styles.workInfo}>
                                    <h3>{work.work_title}</h3>
                                    <h4>{work.work_subtitle}</h4>
                                    <p>{work.work_category}</p>
                                    {work.work_logo_img && (
                                        <img src={work.work_logo_img} alt="Work Logo" className={styles.workLogo} />
                                    )}
                                </div>
                            </div>
                        </a>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default WorksDisplay;