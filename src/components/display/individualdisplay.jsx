import React, { useState, useEffect } from "react";
import styles from "./specialdisplay.module.css"; // Menggunakan styles dari specialdisplay
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faTiktok, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';

const IndividualDisplay = () => {
    const [servicesIndividualData, setServicesIndividualData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [showIncludes, setShowIncludes] = useState(false);
    const [contactData, setContactData] = useState(null);
    const [contactLoading, setContactLoading] = useState(true);
    const [contactError, setContactError] = useState(null);

    useEffect(() => {
        const fetchServicesIndividualData = async () => {
            setLoading(true);
            try {
                const response = await fetch("https://dama-backend.vercel.app/services_individual");
                if (response.ok) {
                    const data = await response.json();
                    setServicesIndividualData(data);
                } else {
                    throw new Error("Failed to fetch Services Individual data.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchContactData = async () => {
            setContactLoading(true);
            try {
                const response = await fetch("https://dama-backend.vercel.app/dama");
                if (response.ok) {
                    const data = await response.json();
                    setContactData(data[0]);
                } else {
                    throw new Error("Failed to fetch contact data.");
                }
            } catch (err) {
                setContactError(err.message);
            } finally {
                setContactLoading(false);
            }
        };

        fetchServicesIndividualData();
        fetchContactData();
    }, []);

    const toggleIncludes = (service) => {
        if (selectedService === service) {
            setShowIncludes(!showIncludes);
        } else {
            setSelectedService(service);
            setShowIncludes(true);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (contactLoading) return <p>Loading contact data...</p>;
    if (contactError) return <p>Error loading contact data: {contactError}</p>;

    return (
        <section className={styles.specialDisplayContainer}>
            <h2 className={styles.sectionTitle}>Individual Services</h2>
            <div className={styles.divider}></div>
            <div className={styles.specialDisplayColumn}>
                {servicesIndividualData.map(service => (
                    <div key={service.id} className={styles.specialDisplayItem}>
                        <div className={styles.textColumn}>
                            <div className={styles.combinedText}>
                                <h3>{service.services_individual_name}</h3>
                                <h4>{service.services_individual_title}</h4>
                                <p>{service.services_individual_desc}</p>
                            </div>
                            <div className={styles.divider}></div>
                            <div className={styles.includesToggle}>
                                <button onClick={() => toggleIncludes(service)} className={styles.includesButton}>
                                    What's Included
                                    <FontAwesomeIcon
                                        icon={selectedService === service && showIncludes ? faChevronUp : faChevronDown}
                                        className={styles.toggleIcon}
                                    />
                                </button>
                            </div>
                            {selectedService === service && showIncludes && (
                                <ul className={styles.includesList}>
                                    {service.services_individual_include.map((include, index) => (
                                        <li key={index}>{include}</li>
                                    ))}
                                </ul>
                            )}
                            <div className={styles.divider}></div>
                            <div className={styles.contactUsSection}>
                                {contactData && (
                                    <div className={styles.contactIcons}>
                                        {contactData.dama_whatsapp && (
                                            <a href={`https://wa.me/${contactData.dama_whatsapp}`} target="_blank" rel="noopener noreferrer" className={styles.contactIconLink}>
                                                <FontAwesomeIcon icon={faWhatsapp} className={styles.contactIcon} />
                                            </a>
                                        )}
                                        {contactData.dama_instagram && (
                                            <a href={`https://www.instagram.com/${contactData.dama_instagram}`} target="_blank" rel="noopener noreferrer" className={styles.contactIconLink}>
                                                <FontAwesomeIcon icon={faInstagram} className={styles.contactIcon} />
                                            </a>
                                        )}
                                        {contactData.dama_linkedin && (
                                            <a href={`https://www.linkedin.com/in/${contactData.dama_linkedin}`} target="_blank" rel="noopener noreferrer" className={styles.contactIconLink}>
                                                <FontAwesomeIcon icon={faLinkedin} className={styles.contactIcon} />
                                            </a>
                                        )}
                                        {contactData.dama_tiktok && (
                                            <a href={`https://www.tiktok.com/@${contactData.dama_tiktok}`} target="_blank" rel="noopener noreferrer" className={styles.contactIconLink}>
                                                <FontAwesomeIcon icon={faTiktok} className={styles.contactIcon} />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={styles.imageColumn}>
                            {service.services_individual_img && (
                                <img src={service.services_individual_img} alt={service.services_individual_name} className={styles.specialImage} />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default IndividualDisplay;