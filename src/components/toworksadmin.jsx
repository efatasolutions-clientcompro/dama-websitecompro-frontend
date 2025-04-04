import React, { useState, useEffect } from "react";
import styles from "./homeadmin.module.css"; // Menggunakan homeadmin.module.css

const ToWorksAdmin = () => {
    const [toWork, setToWork] = useState(null); // Ubah ke satu item
    const [newToWork, setNewToWork] = useState({
        toworks_text: "",
        toworks_sub_text: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchToWorks = async () => {
            setLoading(true);
            try {
                const response = await fetch("https://dama-backend.vercel.app/toworks");
                if (response.ok) {
                    const data = await response.json();
                    if (data.length > 0) {
                        setToWork(data[0]); // Ambil hanya item pertama
                    }
                } else {
                    setMessage("Failed to fetch to works.");
                }
            } catch (error) {
                console.error("Error fetching to works:", error);
                setMessage("Failed to fetch to works.");
            } finally {
                setLoading(false);
            }
        };

        fetchToWorks();
    }, []);

    const updateToWork = async () => {
        if (!newToWork.toworks_text) {
            setMessage("To work text is required.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`https://dama-backend.vercel.app/toworks/${toWork.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newToWork),
            });

            if (response.ok) {
                setMessage("To work updated successfully!");
                const updatedData = await response.json();
                setToWork(updatedData); // Perbarui dengan data yang diterima
                setNewToWork({
                    toworks_text: "",
                    toworks_sub_text: "",
                });
                setShowForm(false);
            } else {
                const errorData = await response.json();
                setMessage(`Failed to update to work: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error updating to work:", error);
            setMessage(`Failed to update to work: ${error.message}`);
        }
        setLoading(false);
    };

    const handleEdit = () => {
        if (toWork) {
            setNewToWork({
                toworks_text: toWork.toworks_text,
                toworks_sub_text: toWork.toworks_sub_text,
            });
            setShowForm(true);
        }
    };

    return (
        <section className={styles.adminContainer}>
            <h2>To Works Admin</h2>
            {message && (
                <p className={`${styles.message} ${message.startsWith("Failed") ? styles.error : styles.success}`}>
                    {message}
                </p>
            )}

            {toWork && (
                <div className={styles.taglineItem}>
                    <div className={styles.taglineContent}>
                        <div>
                            <span>{toWork.toworks_text}</span>
                            <p>{toWork.toworks_sub_text}</p>
                        </div>
                    </div>
                    <div className={styles.taglineActions}>
                        <button onClick={handleEdit} className={styles.actionButton}>Edit</button>
                    </div>
                </div>
            )}

            {showForm && (
                <form className={styles.taglineForm}>
                    <label htmlFor="toWorkText">To Work Text:</label>
                    <input
                        type="text"
                        id="toWorkText"
                        placeholder="To Work Text"
                        value={newToWork.toworks_text}
                        onChange={(e) => setNewToWork({ ...newToWork, toworks_text: e.target.value })}
                        className={styles.inputField}
                    />
                    <label htmlFor="toWorkSubText">To Work Sub Text:</label>
                    <input
                        type="text"
                        id="toWorkSubText"
                        placeholder="To Work Sub Text"
                        value={newToWork.toworks_sub_text}
                        onChange={(e) => setNewToWork({ ...newToWork, toworks_sub_text: e.target.value })}
                        className={styles.inputField}
                    />

                    <button onClick={updateToWork} disabled={loading} className={styles.actionButton}>
                        {loading ? "Updating..." : "Update To Work"}
                    </button>
                    <button onClick={() => setShowForm(false)} className={styles.cancelButton}>Cancel</button>
                </form>
            )}
        </section>
    );
};

export default ToWorksAdmin;