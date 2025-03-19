import React, { useState, useEffect } from "react";
import styles from "./servicesadmin.module.css";

const ServicesIndividualAdmin = () => {
    const [servicesIndividualData, setServicesIndividualData] = useState([]);
    const [newServiceIndividual, setNewServiceIndividual] = useState({
        services_individual_name: "",
        services_individual_title: "",
        services_individual_desc: "",
        services_individual_include: [],
        services_individual_img: null,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedServiceIndividual, setSelectedServiceIndividual] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [includeInput, setIncludeInput] = useState("");

    useEffect(() => {
        const fetchServicesIndividualData = async () => {
            setLoading(true);
            try {
                const response = await fetch("https://dama-backend.vercel.app/services_individual");
                if (response.ok) {
                    const data = await response.json();
                    setServicesIndividualData(data);
                } else {
                    console.error("Fetch error:", response.status, response.statusText);
                    setMessage("Failed to fetch Services Individual data.");
                }
            } catch (error) {
                console.error("Error fetching Services Individual data:", error);
                setMessage("Failed to fetch Services Individual data.");
            } finally {
                setLoading(false);
            }
        };

        try {
            fetchServicesIndividualData();
        } catch (error) {
            console.error("Error in useEffect:", error);
        }
    }, []);

    const addServiceIndividual = async () => {
        if (!newServiceIndividual.services_individual_name || !newServiceIndividual.services_individual_title || !newServiceIndividual.services_individual_desc || newServiceIndividual.services_individual_include.length === 0) {
            setMessage("Name, title, description, and at least one include are required.");
            return;
        }

        if (newServiceIndividual.services_individual_img && newServiceIndividual.services_individual_img.size > 5 * 1024 * 1024) {
            setMessage("Image size must be less than 5MB.");
            return;
        }

        if (newServiceIndividual.services_individual_img && !newServiceIndividual.services_individual_img.type.startsWith("image/")) {
            setMessage("File type must be an image.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("services_individual_name", newServiceIndividual.services_individual_name);
            formData.append("services_individual_title", newServiceIndividual.services_individual_title);
            formData.append("services_individual_desc", newServiceIndividual.services_individual_desc);
            formData.append("services_individual_include", JSON.stringify(newServiceIndividual.services_individual_include));
            if (newServiceIndividual.services_individual_img) {
                formData.append("services_individual_img", newServiceIndividual.services_individual_img);
            }

            const response = await fetch("https://dama-backend.vercel.app/services_individual", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setMessage("Services Individual added successfully!");
                const data = await response.json();
                setServicesIndividualData([...servicesIndividualData, data]);
                setNewServiceIndividual({
                    services_individual_name: "",
                    services_individual_title: "",
                    services_individual_desc: "",
                    services_individual_include: [],
                    services_individual_img: null,
                });
                setImagePreview(null);
                setShowForm(false);
                setEditIndex(null);
            } else {
                const errorData = await response.json();
                setMessage(`Failed to add Services Individual: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error adding Services Individual:", error);
            setMessage(`Failed to add Services Individual: ${error.message}`);
        }
        setLoading(false);
    };

    const updateServiceIndividual = async () => {
        if (!newServiceIndividual.services_individual_name || !newServiceIndividual.services_individual_title || !newServiceIndividual.services_individual_desc || newServiceIndividual.services_individual_include.length === 0) {
            setMessage("Name, title, description, and at least one include are required.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("services_individual_name", newServiceIndividual.services_individual_name);
            formData.append("services_individual_title", newServiceIndividual.services_individual_title);
            formData.append("services_individual_desc", newServiceIndividual.services_individual_desc);
            formData.append("services_individual_include", JSON.stringify(newServiceIndividual.services_individual_include));
            if (newServiceIndividual.services_individual_img) {
                formData.append("services_individual_img", newServiceIndividual.services_individual_img);
            }

            const response = await fetch(`https://dama-backend.vercel.app/services_individual/${selectedServiceIndividual.id}`, {
                method: "PUT",
                body: formData,
            });

            if (response.ok) {
                setMessage("Services Individual updated successfully!");
                const updatedData = await response.json();
                const updatedServicesIndividualData = servicesIndividualData.map(serviceIndividual =>
                    serviceIndividual.id === updatedData.id ? updatedData : serviceIndividual
                );
                setServicesIndividualData(updatedServicesIndividualData);
                setNewServiceIndividual({
                    services_individual_name: "",
                    services_individual_title: "",
                    services_individual_desc: "",
                    services_individual_include: [],
                    services_individual_img: null,
                });
                setSelectedServiceIndividual(null);
                setImagePreview(null);
                setShowForm(false);
                setEditIndex(null);
            } else {
                const errorData = await response.json();
                setMessage(`Failed to update Services Individual: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error updating Services Individual:", error);
            setMessage(`Failed to update Services Individual: ${error.message}`);
        }
        setLoading(false);
    };

    const deleteServiceIndividual = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Services Individual?");
        if (!confirmDelete) return;

        setLoading(true);
        try {
            const response = await fetch(`https://dama-backend.vercel.app/services_individual/${id}`, { method: "DELETE" });
            if (response.ok) {
                setMessage("Services Individual deleted successfully!");
                setServicesIndividualData(servicesIndividualData.filter(serviceIndividual => serviceIndividual.id !== id));
            } else {
                const errorData = await response.json();
                setMessage(`Failed to delete Services Individual: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error deleting Services Individual:", error);
            setMessage("Failed to delete Services Individual.");
        }
        setLoading(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setNewServiceIndividual({ ...newServiceIndividual, services_individual_img: file });
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleUpload = () => {
        setNewServiceIndividual({
            services_individual_name: "",
            services_individual_title: "",
            services_individual_desc: "",
            services_individual_include: [],
            services_individual_img: null,
        });
        setSelectedServiceIndividual(null);
        setImagePreview(null);
        setShowForm(true);
        setEditIndex(null);
    };

    const handleEdit = (serviceIndividual, index) => {
        setSelectedServiceIndividual(serviceIndividual);
        setNewServiceIndividual({
            services_individual_name: serviceIndividual.services_individual_name,
            services_individual_title: serviceIndividual.services_individual_title,
            services_individual_desc: serviceIndividual.services_individual_desc,
            services_individual_include: serviceIndividual.services_individual_include,
            services_individual_img: serviceIndividual.services_individual_img,
        });
        setImagePreview(serviceIndividual.services_individual_img);
        setEditIndex(index);
        setShowForm(true);
    };

    const handleIncludeChange = (e) => {
        setIncludeInput(e.target.value);
    };

    const handleAddInclude = () => {
        if (includeInput) {
            setNewServiceIndividual({
                ...newServiceIndividual,
                services_individual_include: [...newServiceIndividual.services_individual_include, includeInput],
            });
            setIncludeInput("");
        }
    };

    const handleRemoveInclude = (index) => {
        setNewServiceIndividual({
            ...newServiceIndividual,
            services_individual_include: newServiceIndividual.services_individual_include.filter((_, i) => i !== index),
        });
    };

    return (
        <section className={styles.adminContainer}>
            <h2>Services Individual Admin</h2>
            {message && (
                <p className={`${styles.message} ${message.startsWith("Failed") ? styles.error : styles.success}`}>
                    {message}
                </p>
            )}

            <button onClick={handleUpload} className={styles.uploadButton}>Add Services Individual</button>

            {showForm && editIndex === null && (
                <form className={styles.taglineForm}>
                    <label htmlFor="serviceIndividualName">Name:</label>
                    <input
                        type="text"
                        id="serviceIndividualName"
                        placeholder="Name"
                        value={newServiceIndividual.services_individual_name}
                        onChange={(e) => setNewServiceIndividual({ ...newServiceIndividual, services_individual_name: e.target.value })}
                        className={styles.inputField}
                    />
                    <label htmlFor="serviceIndividualTitle">Title:</label>
                    <input
                        type="text"
                        id="serviceIndividualTitle"
                        placeholder="Title"
                        value={newServiceIndividual.services_individual_title}
                        onChange={(e) => setNewServiceIndividual({ ...newServiceIndividual, services_individual_title: e.target.value })}
                        className={styles.inputField}
                    />
                    <label htmlFor="serviceIndividualDesc">Description:</label>
                    <textarea
                        id="serviceIndividualDesc"
                        placeholder="Description"
                        value={newServiceIndividual.services_individual_desc}
                        onChange={(e) => setNewServiceIndividual({ ...newServiceIndividual, services_individual_desc: e.target.value })}
                        className={styles.inputField}
                    />
                    <label>Includes:</label>
                    <div className={styles.includeContainer}>
                        <input
                            type="text"
                            placeholder="Add include"
                            value={includeInput}
                            onChange={handleIncludeChange}
                            className={styles.includeInput}
                        />
                        <button type="button" onClick={handleAddInclude} className={styles.includeButton}>Add</button>
                    </div>
                    <ul className={styles.includeList}>
                        {newServiceIndividual.services_individual_include.map((include, index) => (
                            <li key={index} className={styles.includeItem}>
                                {include}
                                <button type="button" onClick={() => handleRemoveInclude(index)} className={styles.removeInclude}>X</button>
                            </li>
                        ))}
                    </ul>
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

                    <button onClick={selectedServiceIndividual ? updateServiceIndividual : addServiceIndividual} disabled={loading} className={styles.actionButton}>
                        {loading
                            ? selectedServiceIndividual
                                ? "Updating..."
                                : "Adding..."
                            : selectedServiceIndividual
                                ? "Update Services Individual"
                                : "Add Services Individual"}
                    </button>
                    <button onClick={() => { setShowForm(false); setEditIndex(null); }} className={styles.cancelButton}>Cancel</button>
                </form>
            )}

            <div className={styles.taglineList}>
                {servicesIndividualData.map((serviceIndividual, index) => (
                    <div key={serviceIndividual.id} className={styles.taglineItem}>
                        <div className={styles.taglineContent}>
                            <h3>{serviceIndividual.services_individual_name}</h3>
                            <h4>{serviceIndividual.services_individual_title}</h4>
                            <p>{serviceIndividual.services_individual_desc}</p>
                            <ul>
                                {serviceIndividual.services_individual_include.map((include, index) => (
                                    <li key={index}>{include}</li>
                                ))}
                            </ul>
                            {serviceIndividual.services_individual_img && <img src={serviceIndividual.services_individual_img} alt={serviceIndividual.services_individual_name} className={styles.taglineImage} />}
                        </div>
                        <div className={styles.taglineActions}>
                            <button onClick={() => handleEdit(serviceIndividual, index)} className={styles.actionButton}>Edit</button>
                            <button onClick={() => deleteServiceIndividual(serviceIndividual.id)} disabled={loading} className={styles.deleteButton}>Delete</button>
                        </div>
                        {showForm && editIndex === index && (
                            <form className={`${styles.taglineForm} ${styles.editForm}`}>
                                <label htmlFor="editServiceIndividualName">Name:</label>
                                <input
                                    type="text"
                                    id="editServiceIndividualName"
                                    placeholder="Name"
                                    value={newServiceIndividual.services_individual_name}
                                    onChange={(e) => setNewServiceIndividual({ ...newServiceIndividual, services_individual_name: e.target.value })}
                                    className={styles.inputField}
                                />
                                <label htmlFor="editServiceIndividualTitle">Title:</label>
                                <input
                                    type="text"
                                    id="editServiceIndividualTitle"
                                    placeholder="Title"
                                    value={newServiceIndividual.services_individual_title}
                                    onChange={(e) => setNewServiceIndividual({ ...newServiceIndividual, services_individual_title: e.target.value })}
                                    className={styles.inputField}
                                />
                                <label htmlFor="editServiceIndividualDesc">Description:</label>
                                <textarea
                                    id="editServiceIndividualDesc"
                                    placeholder="Description"
                                    value={newServiceIndividual.services_individual_desc}
                                    onChange={(e) => setNewServiceIndividual({ ...newServiceIndividual, services_individual_desc: e.target.value })}
                                    className={styles.inputField}
                                />
                                <label>Includes:</label>
                                <div className={styles.includeContainer}>
                                    <input
                                        type="text"
                                        placeholder="Add include"
                                        value={includeInput}
                                        onChange={handleIncludeChange}
                                        className={styles.includeInput}
                                    />
                                    <button type="button" onClick={handleAddInclude} className={styles.includeButton}>Add</button>
                                </div>
                                <ul className={styles.includeList}>
                                    {newServiceIndividual.services_individual_include.map((include, index) => (
                                        <li key={index} className={styles.includeItem}>
                                            {include}
                                            <button type="button" onClick={() => handleRemoveInclude(index)} className={styles.removeInclude}>X</button>
                                        </li>
                                    ))}
                                </ul>
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

                                <button onClick={updateServiceIndividual} disabled={loading} className={styles.actionButton}>
                                    {loading ? "Updating..." : "Update Services Individual"}
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

export default ServicesIndividualAdmin;