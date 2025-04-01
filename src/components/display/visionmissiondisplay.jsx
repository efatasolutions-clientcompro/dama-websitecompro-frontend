import React, { useState, useEffect } from "react";
import styles from "./visionmissiondisplay.module.css";

const VisionMissionDisplay = () => {
    const [visionData, setVisionData] = useState([]);
    const [missionData, setMissionData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVisionMissionData = async () => {
            setLoading(true);
            try {
                const visionResponse = await fetch("https://dama-backend.vercel.app/visions");
                const missionResponse = await fetch("https://dama-backend.vercel.app/missions");

                if (!visionResponse.ok || !missionResponse.ok) {
                    throw new Error("Failed to fetch vision or mission data.");
                }

                const vision = await visionResponse.json();
                const mission = await missionResponse.json();

                setVisionData(vision);
                setMissionData(mission);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVisionMissionData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <section className={styles.visionMissionContainer}>
            {visionData.length > 0 && (
                <div className={styles.visionSection}>
                    <h2>Vision</h2>
                    {visionData.map((vision) => (
                        <p key={vision.id}>{vision.vision_content}</p>
                    ))}
                </div>
            )}
            {missionData.length > 0 && (
                <div className={styles.missionSection}>
                    <h2>Mission</h2>
                    {missionData.map((mission) => (
                        <p key={mission.id}>{mission.mission_content}</p>
                    ))}
                </div>
            )}
        </section>
    );
};

export default VisionMissionDisplay;