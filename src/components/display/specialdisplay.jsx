import React, { useState, useEffect } from "react";
import styles from "./specialdisplay.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const SpecialDisplay = () => {
    const [servicesSpecialData, setServicesSpecialData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [showIncludes, setShowIncludes] = useState(false);
    const [contactData, setContactData] = useState(null);
    const [contactLoading, setContactLoading] = useState(true);
    const [contactError, setContactError] = useState(null);

    useEffect(() => {
        const fetchServicesSpecialData = async () => {
            setLoading(true);
            try {
                const response = await fetch("https://dama-backend.vercel.app/services_special");
                if (response.ok) {
                    const data = await response.json();
                    setServicesSpecialData(data);
                } else {
                    throw new Error("Failed to fetch services data.");
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

        fetchServicesSpecialData();
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
            <h2 className={styles.sectionTitle}>Special Packages</h2>
            <div className={styles.divider}></div>
            <div className={styles.specialDisplayColumn}>
                {servicesSpecialData.map((service, index) => (
                    <div key={service.id} className={styles.specialDisplayItem}>
                        <div className={index % 2 === 0 ? styles.row : styles.rowReverse}>
                            <div className={styles.imageColumn}>
                                {service.services_special_img && (
                                    <img src={service.services_special_img} alt={service.services_special_name} className={styles.specialImage} />
                                )}
                            </div>
                            <div className={styles.textColumn}>
                                <div className={styles.combinedText}>
                                    <h3>{service.services_special_name}</h3>
                                    <h4>{service.services_special_title}</h4>
                                    <p>{service.services_special_desc}</p>
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
                                        {service.services_special_include.map((include, index) => (
                                            <li key={index}>{include}</li>
                                        ))}
                                    </ul>
                                )}
                                <div className={styles.divider}></div>
                                <div className={styles.contactUsSection}>
                                    {contactData && contactData.dama_whatsapp && (
                                        <a href={`https://wa.me/${contactData.dama_whatsapp}`} target="_blank" rel="noopener noreferrer" className={styles.whatsappButton}>
                                            Contact Us via WhatsApp
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default SpecialDisplay;