import React, { useState, useEffect } from "react";
import styles from "./admin.module.css";

const ToWorksAdmin = () => {
    const [toWorks, setToWorks] = useState([]);
    const [newToWork, setNewToWork] = useState({
        toworks_text: "",
        toworks_sub_text: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedToWork, setSelectedToWork] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        const fetchToWorks = async () => {
            setLoading(true);
            try {
                const response = await fetch("https://dama-backend.vercel.app/toworks");
                if (response.ok) {
                    const data = await response.json();
                    setToWorks(data);
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

    const addToWork = async () => {
        if (!newToWork.toworks_text) {
            setMessage("To work text is required.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("https://dama-backend.vercel.app/toworks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newToWork),
            });

            if (response.ok) {
                setMessage("To work added successfully!");
                const data = await response.json();
                setToWorks([...toWorks, data]);
                setNewToWork({
                    toworks_text: "",
                    toworks_sub_text: "",
                });
                setShowForm(false);
                setEditIndex(null);
            } else {
                const errorData = await response.json();
                setMessage(`Failed to add to work: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error adding to work:", error);
            setMessage(`Failed to add to work: ${error.message}`);
        }
        setLoading(false);
    };

    const updateToWork = async () => {
        if (!newToWork.toworks_text) {
            setMessage("To work text is required.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`https://dama-backend.vercel.app/toworks/${selectedToWork.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newToWork),
            });

            if (response.ok) {
                setMessage("To work updated successfully!");
                const updatedData = await response.json();
                const updatedToWorks = toWorks.map(toWork =>
                    toWork.id === updatedData.id ? updatedData : toWork
                );
                setToWorks(updatedToWorks);
                setNewToWork({
                    toworks_text: "",
                    toworks_sub_text: "",
                });
                setSelectedToWork(null);
                setShowForm(false);
                setEditIndex(null);
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

    const deleteToWork = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this to work?");
        if (!confirmDelete) return;

        setLoading(true);
        try {
            const response = await fetch(`https://dama-backend.vercel.app/toworks/${id}`, { method: "DELETE" });
            if (response.ok) {
                setMessage("To work deleted successfully!");
                setToWorks(toWorks.filter(toWork => toWork.id !== id));
            } else {
                const errorData = await response.json();
                setMessage(`Failed to delete to work: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error deleting to work:", error);
            setMessage("Failed to delete to work.");
        }
        setLoading(false);
    };

    const handleUpload = () => {
        setNewToWork({ toworks_text: "", toworks_sub_text: "" });
        setSelectedToWork(null);
        setShowForm(true);
        setEditIndex(null);
    };

    const handleEdit = (toWork, index) => {
        setSelectedToWork(toWork);
        setNewToWork({
            toworks_text: toWork.toworks_text,
            toworks_sub_text: toWork.toworks_sub_text,
        });
        setEditIndex(index);
        setShowForm(true);
    };

    return (
        <section className={styles.adminContainer}>
            <h2>To Works Admin</h2>
            {message && (
                <p className={`${styles.message} ${message.startsWith("Failed") ? styles.error : styles.success}`}>
                    {message}
                </p>
            )}

            <button onClick={handleUpload} className={styles.uploadButton}>Upload To Work</button>

            {showForm && editIndex === null && (
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

                    <button onClick={selectedToWork ? updateToWork : addToWork} disabled={loading} className={styles.actionButton}>
                        {loading
                            ? selectedToWork
                                ? "Updating..."
                                : "Adding..."
                            : selectedToWork
                                ? "Update To Work"
                                : "Add To Work"}
                    </button>
                    <button onClick={() => { setShowForm(false); setEditIndex(null); }} className={styles.cancelButton}>Cancel</button>
                </form>
            )}

            <div className={styles.taglineList}>
                {toWorks.map((toWork, index) => (
                    <div key={toWork.id} className={styles.taglineItem}>
                        <div className={styles.taglineContent}>
                            <div>
                                <span>{toWork.toworks_text}</span>
                                <p>{toWork.toworks_sub_text}</p>
                            </div>
                        </div>
                        <div className={styles.taglineActions}>
                            <button onClick={() => handleEdit(toWork, index)} className={styles.actionButton}>Edit</button>
                            <button onClick={() => deleteToWork(toWork.id)} disabled={loading} className={styles.deleteButton}>Delete</button>
                        </div>
                        {showForm && editIndex === index && (
                            <form className={`${styles.taglineForm} ${styles.editForm}`}>
                                <label htmlFor="editToWorkText">To Work Text:</label>
                                <input
                                    type="text"
                                    id="editToWorkText"
                                    placeholder="To Work Text"
                                    value={newToWork.toworks_text}
                                    onChange={(e) => setNewToWork({ ...newToWork, toworks_text: e.target.value })}
                                    className={styles.inputField}
                                />
                                <label htmlFor="editeditToWorkSubText">To Work Sub Text:</label>
                                <input
                                    type="text"
                                    id="editToWorkSubText"
                                    placeholder="To Work Sub Text"
                                    value={newToWork.toworks_sub_text}
                                    onChange={(e) => setNewToWork({ ...newToWork, toworks_sub_text: e.target.value })}
                                    className={styles.inputField}
                                />

                                <button onClick={updateToWork} disabled={loading} className={styles.actionButton}>
                                    {loading ? "Updating..." : "Update To Work"}
                                </button>
                                <button onClick={() => { setShowForm(false); setEditIndex(null); }} className={styles.cancelButton}>Cancel</button>
                            </form>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ToWorksAdmin;