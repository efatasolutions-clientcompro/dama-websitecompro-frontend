import React, { useState, useEffect, useRef } from "react";
import styles from "./specialdisplay.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const IndividualDisplay = () => {
    const [servicesIndividualData, setServicesIndividualData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [showIncludes, setShowIncludes] = useState(false);
    const [contactData, setContactData] = useState(null);
    const [contactLoading, setContactLoading] = useState(true);
    const [contactError, setContactError] = useState(null);
    const [imageHeights, setImageHeights] = useState({});
    const [zoomedImages, setZoomedImages] = useState({});
    const containerRefs = useRef({});
    const [containerHeights, setContainerHeights] = useState({});

    useEffect(() => {
        const fetchServicesIndividualData = async () => {
            setLoading(true);
            try {
                const response = await fetch("https://dama-backend.vercel.app/services_individual");
                if (response.ok) {
                    const data = await response.json();
                    setServicesIndividualData(data);
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

        fetchServicesIndividualData();
        fetchContactData();
    }, []);

    const toggleIncludes = (service) => {
        if (selectedService === service) {
            setShowIncludes(!showIncludes);
            setImageHeights(prev => ({ ...prev, [service.id]: showIncludes ? 'auto' : containerRefs.current[service.id].clientHeight + 'px' }));
            setZoomedImages(prev => ({ ...prev, [service.id]: !showIncludes }));
            setContainerHeights(prev => ({ ...prev, [service.id]: showIncludes ? 'auto' : containerRefs.current[service.id].clientHeight + 'px' }));
        } else {
            setSelectedService(service);
            setShowIncludes(true);
            setImageHeights({ [service.id]: containerRefs.current[service.id].clientHeight + 'px' });
            setZoomedImages({ [service.id]: true });
            setContainerHeights({ [service.id]: containerRefs.current[service.id].clientHeight + 'px' });
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
                {servicesIndividualData.map((service, index) => (
                    <div key={service.id} className={styles.specialDisplayItem} ref={el => containerRefs.current[service.id] = el} style={{ height: containerHeights[service.id] || 'auto' }}>
                        <div className={index % 2 === 0 ? styles.row : styles.rowReverse}>
                            <div className={styles.imageColumn}>
                                {service.services_individual_img && (
                                    <img
                                        src={service.services_individual_img}
                                        alt={service.services_individual_name}
                                        className={`${styles.specialImage} ${zoomedImages[service.id] ? styles.zoomedImage : ''}`}
                                        style={{ height: imageHeights[service.id] || 'auto', transition: 'height 0.3s ease' }}
                                    />
                                )}
                            </div>
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
                                    {contactData && contactData.dama_whatsapp && (
                                        <a href={`https://wa.me/${contactData.dama_whatsapp}`} target="_blank" rel="noopener noreferrer" className={styles.whatsappButton}>
                                            Contact Us
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

export default IndividualDisplay;
