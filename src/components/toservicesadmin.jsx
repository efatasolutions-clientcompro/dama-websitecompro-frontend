import React, { useState, useEffect } from "react";
import styles from "./admin.module.css";

const ToServicesAdmin = () => {
    const [toServices, setToServices] = useState([]);
    const [newToService, setNewToService] = useState({
        toservices_text: "",
        toservices_img: null,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedToService, setSelectedToService] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        const fetchToServices = async () => {
            setLoading(true);
            try {
                const response = await fetch("https://dama-backend.vercel.app/toservices");
                if (response.ok) {
                    const data = await response.json();
                    setToServices(data);
                } else {
                    setMessage("Failed to fetch to services.");
                }
            } catch (error) {
                console.error("Error fetching to services:", error);
                setMessage("Failed to fetch to services.");
            } finally {
                setLoading(false);
            }
        };

        fetchToServices();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setNewToService({ ...newToService, toservices_img: file });
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleUpload = () => {
        setNewToService({ toservices_text: "", toservices_img: null });
        setSelectedToService(null);
        setImagePreview(null);
        setShowForm(true);
        setEditIndex(null);
    };

    const handleEdit = (toService, index) => {
        setSelectedToService(toService);
        setNewToService({
            toservices_text: toService.toservices_text,
            toservices_img: null,
        });
        setImagePreview(toService.toservices_img);
        setEditIndex(index);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (!newToService.toservices_text || (!selectedToService && !newToService.toservices_img)) {
            setMessage("Service text and image are required for new services.");
            setLoading(false);
            return;
        }

        if (newToService.toservices_img && newToService.toservices_img.size > 5 * 1024 * 1024) {
            setMessage("Image size must be less than 5MB.");
            setLoading(false);
            return;
        }

        if (newToService.toservices_img && !newToService.toservices_img.type.startsWith("image/")) {
            setMessage("File type must be an image.");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("toservices_text", newToService.toservices_text);
        if (newToService.toservices_img) {
            formData.append("toservices_img", newToService.toservices_img);
        }

        try {
            const url = selectedToService
                ? `https://dama-backend.vercel.app/toservices/${selectedToService.id}`
                : "https://dama-backend.vercel.app/toservices";
            const method = selectedToService ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                if (selectedToService) {
                    setToServices(toServices.map(toService => toService.id === data.id ? data : toService));
                    setMessage("Service updated successfully!");
                } else {
                    setToServices([...toServices, data]);
                    setMessage("Service added successfully!");
                }
                setNewToService({ toservices_text: "", toservices_img: null });
                setImagePreview(null);
                setShowForm(false);
                setEditIndex(null);
            } else {
                const errorData = await response.json();
                setMessage(`Failed: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error:", error);
            setMessage(`Failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const deleteToService = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this service?");
        if (!confirmDelete) return;

        setLoading(true);
        try {
            const response = await fetch(`https://dama-backend.vercel.app/toservices/${id}`, { method: "DELETE" });
            if (response.ok) {
                setMessage("Service deleted successfully!");
                setToServices(toServices.filter(toService => toService.id !== id));
            } else {
                const errorData = await response.json();
                setMessage(`Failed to delete: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error deleting:", error);
            setMessage("Failed to delete.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className={styles.adminContainer}>
            <h2>To Services Admin</h2>
            {message && (
                <p className={`${styles.message} ${message.startsWith("Failed") ? styles.error : styles.success}`}>
                    {message}
                </p>
            )}

            <button onClick={handleUpload} className={styles.uploadButton}>Upload Service</button>

            {showForm && editIndex === null && (
                <form className={styles.toServiceForm} onSubmit={handleSubmit}>
                    <label htmlFor="toservicesText">Service Text:</label>
                    <input
                        type="text"
                        id="toservicesText"
                        placeholder="Service Text"
                        value={newToService.toservices_text}
                        onChange={(e) => setNewToService({ ...newToService, toservices_text: e.target.value })}
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

                    <button type="submit" disabled={loading} className={styles.actionButton}>
                        {loading ? (selectedToService ? "Updating..." : "Adding...") : (selectedToService ? "Update Service" : "Add Service")}
                    </button>
                    <button type="button" onClick={() => { setShowForm(false); setEditIndex(null); }} className={styles.cancelButton}>Cancel</button>
                </form>
            )}

            <div className={styles.toServiceList}>
                {toServices.map((toService, index) => (
                    <div key={toService.id} className={styles.toServiceItem}>
                        <div className={styles.toServiceContent}>
                            <img src={toService.toservices_img} alt={toService.toservices_text} className={styles.toServiceImage} />
                            <span>{toService.toservices_text}</span>
                        </div>
                        <div className={styles.toServiceActions}>
                            <button onClick={() => handleEdit(toService, index)} className={styles.actionButton}>Edit</button>
                            <button onClick={() => deleteToService(toService.id)} disabled={loading} className={styles.deleteButton}>Delete</button>
                        </div>
                        {showForm && editIndex === index && (
                            <form className={`${styles.toServiceForm} ${styles.editForm}`} onSubmit={handleSubmit}>
                                <label htmlFor="editToservicesText">Service Text:</label>
                                <input
                                    type="text"
                                    id="editToServicesText"
                                    placeholder="Service Text"
                                    value={newToService.toservices_text}
                                    onChange={(e) => setNewToService({ ...newToService, toservices_text: e.target.value })}
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

                                <button type="submit" disabled={loading} className={styles.actionButton}>
                                    {loading ? "Updating..." : "Update Service"}
                                </button>
                                <button type="button" onClick={() => { setShowForm(false); setEditIndex(null); }} className={styles.cancelButton}>Cancel</button>
                            </form>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ToServicesAdmin;