import React, { useState, useEffect, useRef, useMemo } from 'react';

const ClientDisplay = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const fetchClients = async () => {
            setLoading(true);
            try {
                const response = await fetch("https://dama-backend.vercel.app/ourclients");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setClients(data);
            } catch (err) {
                console.error("Error fetching clients:", err);
                setError("Failed to fetch clients.");
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    const duplicatedClients = useMemo(() => {
        return [...clients, ...clients];
    }, [clients]);

    useEffect(() => {
        if (scrollContainerRef.current && duplicatedClients.length > 0) {
            const scrollContainer = scrollContainerRef.current;
            let scrollPosition = 0;
            const scrollSpeed = 1;
            let animationFrameId;

            const scroll = () => {
                scrollPosition += scrollSpeed;
                if (scrollPosition > scrollContainer.scrollWidth / 2) {
                    scrollPosition = 0;
                }
                scrollContainer.scrollLeft = scrollPosition;
                animationFrameId = requestAnimationFrame(scroll);
            };

            scroll();

            return () => {
                cancelAnimationFrame(animationFrameId);
            };
        }
    }, [duplicatedClients]);

    if (loading) return <p>Loading clients...</p>;
    if (error) return <p>Error: {error}</p>;

    const styles = {
        section: {
            height: "20vh", // Tetap 50vh
            textAlign: "center",
            color: "var(--color-4)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
        },
        message: {
            color: "red",
            marginBottom: "20px",
        },
        loading: {
            marginBottom: "20px",
        },
        container: {
            display: "flex",
            overflowX: "hidden",
            whiteSpace: "nowrap",
            padding: "20px 0",
            width: "100%",
        },
        clientlogoItem: {
            margin: "0 30px",
            cursor: "pointer",
            display: "inline-block",
        },
        image: {
            height: "80px",
            objectFit: "contain",
            maxWidth: "150px",
        },
    };

    return (
        <section style={styles.section}>
            <div style={styles.container} ref={scrollContainerRef} role="region" aria-label="Client Logos">
                {duplicatedClients.map((client) => (
                    <a
                        key={`${client.id}-${Math.random()}`}
                        href={client.client_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.clientlogoItem}
                        aria-label={`Client logo: ${client.client_name}`}
                    >
                        <img src={client.client_logo_img} alt={client.client_name} style={styles.image} />
                    </a>
                ))}
            </div>
        </section>
    );
};

export default ClientDisplay;