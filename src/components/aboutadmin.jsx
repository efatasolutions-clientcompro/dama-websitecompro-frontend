import React, { useState, useEffect } from "react";
import styles from "./admin.module.css";

const AboutAdmin = () => {
    const [aboutData, setAboutData] = useState([]);
    const [newAbout, setNewAbout] = useState({
        about_title: "",
        about_subtitle: "",
        about_img: null,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedAbout, setSelectedAbout] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        const fetchAboutData = async () => {
            setLoading(true);
            try {
                const response = await fetch("https://dama-backend.vercel.app/abouts");
                if (response.ok) {
                    const data = await response.json();
                    setAboutData(data);
                } else {
                    setMessage("Failed to fetch about data.");
                }
            } catch (error) {
                console.error("Error fetching about data:", error);
                setMessage("Failed to fetch about data.");
            } finally {
                setLoading(false);
            }
        };

        fetchAboutData();
    }, []);

    const addAbout = async () => {
        if (!newAbout.about_title || !newAbout.about_img) {
            setMessage("About title and image are required.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("about_title", newAbout.about_title);
            formData.append("about_subtitle", newAbout.about_subtitle);
            formData.append("about_img", newAbout.about_img);

            const response = await fetch("https://dama-backend.vercel.app/abouts", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setMessage("About added successfully!");
                const data = await response.json();
                setAboutData([...aboutData, data]);
                setNewAbout({ about_title: "", about_subtitle: "", about_img: null });
                setImagePreview(null);
                setShowForm(false);
                setEditIndex(null);
            } else {
                const errorData = await response.json();
                setMessage(`Failed to add about: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error adding about:", error);
            setMessage(`Failed to add about: ${error.message}`);
        }
        setLoading(false);
    };

    const updateAbout = async () => {
        if (!newAbout.about_title) {
            setMessage("About title is required.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("about_title", newAbout.about_title);
            formData.append("about_subtitle", newAbout.about_subtitle);
            if(newAbout.about_img){
                formData.append("about_img", newAbout.about_img);
            }

            const response = await fetch(`https://dama-backend.vercel.app/abouts/${selectedAbout.id}`, {
                method: "PUT",
                body: formData,
            });

            if (response.ok) {
                setMessage("About updated successfully!");
                const updatedData = await response.json();
                const updatedAboutData = aboutData.map((about) =>
                    about.id === updatedData.id ? updatedData : about
                );
                setAboutData(updatedAboutData);
                setNewAbout({ about_title: "", about_subtitle: "", about_img: null });
                setSelectedAbout(null);
                setImagePreview(null);
                setShowForm(false);
                setEditIndex(null);
            } else {
                const errorData = await response.json();
                setMessage(`Failed to update about: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error updating about:", error);
            setMessage(`Failed to update about: ${error.message}`);
        }
        setLoading(false);
    };

    const deleteAbout = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this about?");
        if (!confirmDelete) return;

        setLoading(true);
        try {
            const response = await fetch(`https://dama-backend.vercel.app/abouts/${id}`, { method: "DELETE" });
            if (response.ok) {
                setMessage("About deleted successfully!");
                setAboutData(aboutData.filter((about) => about.id !== id));
            } else {
                const errorData = await response.json();
                setMessage(`Failed to delete about: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error deleting about:", error);
            setMessage("Failed to delete about.");
        }
        setLoading(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setNewAbout({ ...newAbout, about_img: file });
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleUpload = () => {
        setNewAbout({ about_title: "", about_subtitle: "", about_img: null });
        setSelectedAbout(null);
        setImagePreview(null);
        setShowForm(true);
        setEditIndex(null);
    };

    const handleEdit = (about, index) => {
        setSelectedAbout(about);
        setNewAbout({
            about_title: about.about_title,
            about_subtitle: about.about_subtitle,
            about_img: null,
        });
        setImagePreview(about.about_img);
        setEditIndex(index);
        setShowForm(true);
    };

    return (
        <section className={styles.adminContainer}>
            <h2>About Admin</h2>
            {message && (
                <p className={`${styles.message} ${message.startsWith("Failed") ? styles.error : styles.success}`}>
                    {message}
                </p>
            )}

            <button onClick={handleUpload} className={styles.uploadButton}>Upload About</button>

            {showForm && editIndex === null && (
                <form className={styles.taglineForm}>
                    <label htmlFor="aboutTitle">About Title:</label>
                    <input
                        type="text"
                        id="aboutTitle"
                        placeholder="About Title"
                        value={newAbout.about_title}
                        onChange={(e) => setNewAbout({ ...newAbout, about_title: e.target.value })}
                        className={styles.inputField}
                    />
                    <label htmlFor="aboutSubTitle">About Sub Title:</label>
                    <input
                        type="text"
                        id="aboutSubTitle"
                        placeholder="About Sub Title"
                        value={newAbout.about_subtitle}
                        onChange={(e) => setNewAbout({ ...newAbout, about_subtitle: e.target.value })}
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

                    <button onClick={selectedAbout ? updateAbout : addAbout} disabled={loading} className={styles.actionButton}>
                        {loading ? (selectedAbout ? "Updating..." : "Adding...") : (selectedAbout ? "Update About" : "Add About")}
                    </button>
                    <button onClick={() => { setShowForm(false); setEditIndex(null); }} className={styles.cancelButton}>Cancel</button>
                </form>
            )}

            <div className={styles.taglineList}>
                {aboutData.map((about, index) => (
                    <div key={about.id} className={styles.taglineItem}>
                        <div className={styles.taglineContent}>
                            <img src={about.about_img} alt={about.about_title} className={styles.taglineImage} />
                            <div>
                                <span>{about.about_title}</span>
                                <p>{about.about_subtitle}</p>
                            </div>
                        </div>
                        <div className={styles.taglineActions}>
                            <button onClick={() => handleEdit(about, index)} className={styles.actionButton}>Edit</button>
                            <button onClick={() => deleteAbout(about.id)} disabled={loading} className={styles.deleteButton}>Delete</button>
                        </div>
                        {showForm && editIndex === index && (
                            <form className={`${styles.taglineForm} ${styles.editForm}`}>
                                <label htmlFor="editAboutTitle">About Title:</label>
                                <input
                                    type="text"
                                    id="editAboutTitle"
                                    placeholder="About Title"
                                    value={newAbout.about_title}
                                    onChange={(e) => setNewAbout({ ...newAbout, about_title: e.target.value })}
                                    className={styles.inputField}
                                />
                                <label htmlFor="editAboutSubTitle">About Sub Title:</label>
                                <input
                                    type="text"
                                    id="editAboutSubTitle"
                                    placeholder="About Sub Title"
                                    value={newAbout.about_subtitle}
                                    onChange={(e) => setNewAbout({ ...newAbout, about_subtitle: e.target.value })}
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

                                <button onClick={updateAbout} disabled={loading} className={styles.actionButton}>
                                    {loading ? "Updating..." : "Update About"}
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

export default AboutAdmin;