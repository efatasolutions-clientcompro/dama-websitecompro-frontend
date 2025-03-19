import React, { useState, useEffect } from "react";
import styles from "./admin.module.css";

const ConnectAdmin = () => {
    const [connectData, setConnectData] = useState([]);
    const [newConnect, setNewConnect] = useState({
        connect_text: "",
        connect_img: null,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedConnect, setSelectedConnect] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        const fetchConnectData = async () => {
            setLoading(true);
            try {
                const response = await fetch("https://dama-backend.vercel.app/connect");
                if (response.ok) {
                    const data = await response.json();
                    setConnectData(data);
                } else {
                    setMessage("Failed to fetch connect data.");
                }
            } catch (error) {
                console.error("Error fetching connect data:", error);
                setMessage("Failed to fetch connect data.");
            } finally {
                setLoading(false);
            }
        };

        fetchConnectData();
    }, []);

    const addConnect = async () => {
        if (!newConnect.connect_text || !newConnect.connect_img) {
            setMessage("Connect text and image are required.");
            return;
        }

        if (newConnect.connect_img.size > 5 * 1024 * 1024) {
            setMessage("Image size must be less than 5MB.");
            return;
        }

        if (!newConnect.connect_img.type.startsWith("image/")) {
            setMessage("File type must be an image.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("connect_text", newConnect.connect_text);
            formData.append("connect_img", newConnect.connect_img);

            const response = await fetch("https://dama-backend.vercel.app/connect", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setMessage("Connect data added successfully!");
                const data = await response.json();
                setConnectData([...connectData, data]);
                setNewConnect({
                    connect_text: "",
                    connect_img: null,
                });
                setImagePreview(null);
                setShowForm(false);
                setEditIndex(null);
            } else {
                const errorData = await response.json();
                setMessage(`Failed to add connect data: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error adding connect data:", error);
            setMessage(`Failed to add connect data: ${error.message}`);
        }
        setLoading(false);
    };

    const updateConnect = async () => {
        if (!newConnect.connect_text) {
            setMessage("Connect text is required.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("connect_text", newConnect.connect_text);
            if (newConnect.connect_img) {
                formData.append("connect_img", newConnect.connect_img);
            }

            const response = await fetch(`https://dama-backend.vercel.app/connect/${selectedConnect.id}`, {
                method: "PUT",
                body: formData,
            });

            if (response.ok) {
                setMessage("Connect data updated successfully!");
                const updatedData = await response.json();
                const updatedConnectData = connectData.map(connect =>
                    connect.id === updatedData.id ? updatedData : connect
                );
                setConnectData(updatedConnectData);
                setNewConnect({
                    connect_text: "",
                    connect_img: null,
                });
                setSelectedConnect(null);
                setImagePreview(null);
                setShowForm(false);
                setEditIndex(null);
            } else {
                const errorData = await response.json();
                setMessage(`Failed to update connect data: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error updating connect data:", error);
            setMessage(`Failed to update connect data: ${error.message}`);
        }
        setLoading(false);
    };

    const deleteConnect = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this connect data?");
        if (!confirmDelete) return;

        setLoading(true);
        try {
            const response = await fetch(`https://dama-backend.vercel.app/connect/${id}`, { method: "DELETE" });
            if (response.ok) {
                setMessage("Connect data deleted successfully!");
                setConnectData(connectData.filter(connect => connect.id !== id));
            } else {
                const errorData = await response.json();
                setMessage(`Failed to delete connect data: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error deleting connect data:", error);
            setMessage("Failed to delete connect data.");
        }
        setLoading(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setNewConnect({ ...newConnect, connect_img: file });
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleUpload = () => {
        setNewConnect({ connect_text: "", connect_img: null });
        setSelectedConnect(null);
        setImagePreview(null);
        setShowForm(true);
        setEditIndex(null);
    };

    const handleEdit = (connect, index) => {
        setSelectedConnect(connect);
        setNewConnect({
            connect_text: connect.connect_text,
            connect_img: null,
        });
        setImagePreview(connect.connect_img);
        setEditIndex(index);
        setShowForm(true);
    };

    return (
        <section className={styles.adminContainer}>
            <h2>Connect Admin</h2>
            {message && (
                <p className={`${styles.message} ${message.startsWith("Failed") ? styles.error : styles.success}`}>
                    {message}
                </p>
            )}

            <button onClick={handleUpload} className={styles.uploadButton}>Upload Connect Data</button>

            {showForm && editIndex === null && (
                <form className={styles.taglineForm}>
                    <label htmlFor="connectText">Connect Text:</label>
                    <input
                        type="text"
                        id="connectText"
                        placeholder="Connect Text"
                        value={newConnect.connect_text}
                        onChange={(e) => setNewConnect({ ...newConnect, connect_text: e.target.value })}
                        className={styles.inputField}
                    />
                    <div className={styles.imageUploadContainer}>
                        <div className={styles.imageUploadBox}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                id="imageUpload"
                                style={{ display: "none" }}
                            />
                            <label htmlFor="imageUpload">Upload Image</label>
                        </div>
                        {imagePreview && <img src={imagePreview} alt="Preview" className={styles.imagePreview} />}
                    </div>

                    <button onClick={selectedConnect ? updateConnect : addConnect} disabled={loading} className={styles.actionButton}>
                        {loading
                            ? selectedConnect
                                ? "Updating..."
                                : "Adding..."
                            : selectedConnect
                                ? "Update Connect"
                                : "Add Connect"}
                    </button>
                    <button onClick={() => { setShowForm(false); setEditIndex(null); }} className={styles.cancelButton}>Cancel</button>
                </form>
            )}

            <div className={styles.taglineList}>
                {connectData.map((connect, index) => (
                    <div key={connect.id} className={styles.taglineItem}>
                        <div className={styles.taglineContent}>
                            <img src={connect.connect_img} alt={connect.connect_text} className={styles.taglineImage} />
                            <div>
                                <span>{connect.connect_text}</span>
                            </div>
                        </div>
                        <div className={styles.taglineActions}>
                            <button onClick={() => handleEdit(connect, index)} className={styles.actionButton}>Edit</button>
                            <button onClick={() => deleteConnect(connect.id)} disabled={loading} className={styles.deleteButton}>Delete</button>
                        </div>
                        {showForm && editIndex === index && (
                            <form className={`${styles.taglineForm} ${styles.editForm}`}>
                                <label htmlFor="editConnectText">Connect Text:</label>
                                <input
                                    type="text"
                                    id="editConnectText"
                                    placeholder="Connect Text"
                                    value={newConnect.connect_text}
                                    onChange={(e) => setNewConnect({ ...newConnect, connect_text: e.target.value })}
                                    className={styles.inputField}
                                />
                                <div className={styles.imageUploadContainer}>
                                    <div className={styles.imageUploadBox}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            id="editImageUpload"
                                            style={{ display: "none" }}
                                        />
                                        <label htmlFor="editImageUpload">Upload Image</label>
                                    </div>
                                    {imagePreview && <img src={imagePreview} alt="Preview" className={styles.imagePreview} />}
                                </div>

                                <button onClick={updateConnect} disabled={loading} className={styles.actionButton}>
                                    {loading ? "Updating..." : "Update Connect"}
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

export default ConnectAdmin;