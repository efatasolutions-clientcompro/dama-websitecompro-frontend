import React, { useState, useEffect } from "react";
import styles from "./faqdisplay.module.css";

const FaqDisplay = () => {
    const [faqData, setFaqData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchFaqData = async () => {
            try {
                const response = await fetch("https://dama-backend.vercel.app/faq");
                if (response.ok) {
                    const data = await response.json();
                    setFaqData(data);
                } else {
                    console.error("Failed to fetch FAQ data.");
                }
            } catch (error) {
                console.error("Error fetching FAQ data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFaqData();
    }, []);

    if (loading) {
        return <p>Loading FAQ...</p>;
    }

    const filteredFaqData = faqData.filter(faq =>
        faq.faq_question.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className={styles.faqContainer}>
            <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchBar}
            />
            {filteredFaqData.map((faq, index) => (
                <div key={faq.id} className={styles.faqItem}>
                    {index % 2 === 0 ? ( // Genap (angka di kiri)
                        <>
                            <div className={styles.faqIndex}>
                                <div className={styles.indexNumber}>{String(index + 1).padStart(2, '0')}</div>
                            </div>
                            <div className={styles.faqContent}>
                                <div className={styles.faqQuestion} style={{ textAlign: "left" }}>
                                    <strong>{faq.faq_question}</strong>
                                </div>
                                <div className={styles.faqAnswer} style={{ textAlign: "left" }}>
                                    <p>{faq.faq_answer}</p>
                                </div>
                            </div>
                        </>
                    ) : ( // Ganjil (angka di kanan)
                        <>
                            <div className={styles.faqContent}>
                                <div className={styles.faqQuestion} style={{ textAlign: "right" }}>
                                    <strong>{faq.faq_question}</strong>
                                </div>
                                <div className={styles.faqAnswer} style={{ textAlign: "right" }}>
                                    <p>{faq.faq_answer}</p>
                                </div>
                            </div>
                            <div className={styles.faqIndex}>
                                <div className={styles.indexNumber}>{String(index + 1).padStart(2, '0')}</div>
                            </div>
                        </>
                    )}
                </div>
            ))}
        </section>
    );
};

export default FaqDisplay;