import React, { useState, useEffect } from "react";
import styles from "./admin.module.css";

const WorkPageAdmin = () => {
    const [work_pages, setWorkPages] = useState([]);
    const [newWorkPage, setNewWorkPage] = useState({
        work_page_text: "",
        work_page_sub_text: "",
        work_page_img: null,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedWorkPage, setSelectedWorkPage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [showForm, setShowForm] = useState(false);
    
    useEffect(() => {
        const fetchWorkPages = async () => {
            setLoading(true);
            try {
                const response = await fetch("https://dama-backend.vercel.app/work_page");
                if (response.ok) {
                    const data = await response.json();
                    setWorkPages(data);
                } else {
                    setMessage("Failed to fetch work pages.");
                }
            } catch (error) {
                console.error("Error fetching work pages:", error);
                setMessage("Failed to fetch work pages.");
            } finally {
                setLoading(false);
            }
        };

        fetchWorkPages();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewWorkPage({ ...newWorkPage, work_page_img: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const addWorkPage = async () => {
        if (!newWorkPage.work_page_text || !newWorkPage.work_page_img) {
            setMessage("Work page text and image are required.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("work_page_text", newWorkPage.work_page_text);
            formData.append("work_page_sub_text", newWorkPage.work_page_sub_text);
            formData.append("work_page_img", newWorkPage.work_page_img);

            const response = await fetch("https://dama-backend.vercel.app/work_page", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setMessage("Work page added successfully!");
                const data = await response.json();
                setWorkPages([...work_pages, data]);
                setNewWorkPage({
                    work_page_text: "",
                    work_page_sub_text: "",
                    work_page_img: null,
                });
                setImagePreview(null);
                setShowForm(false);
            } else {
                const errorData = await response.json();
                setMessage(`Failed to add work page: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error adding work page:", error);
            setMessage(`Failed to add work page: ${error.message}`);
        }
        setLoading(false);
    };

    const deleteWorkPage = async (id) => {
        if (!window.confirm("Are you sure you want to delete this work page?")) return;

        setLoading(true);
        try {
            const response = await fetch(`https://dama-backend.vercel.app/work_page/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setWorkPages(work_pages.filter((work_page) => work_page.id !== id));
                setMessage("Work page deleted successfully!");
            } else {
                setMessage("Failed to delete work page.");
            }
        } catch (error) {
            console.error("Error deleting work page:", error);
            setMessage("Failed to delete work page.");
        }
        setLoading(false);
    };

    return (
        <section className={styles.adminContainer}>
            <h2>Work Page Admin</h2>
            {message && (
                <p className={`${styles.message} ${message.startsWith("Failed") ? styles.error : styles.success}`}>
                    {message}
                </p>
            )}

            <button onClick={() => setShowForm(true)} className={styles.uploadButton}>Upload Work Page</button>

            {showForm && (
                <form className={styles.taglineForm}>
                    <label htmlFor="workPageText">Work Page Text:</label>
                    <input
                        type="text"
                        id="workPageText"
                        placeholder="Work Page Text"
                        value={newWorkPage.work_page_text}
                        onChange={(e) => setNewWorkPage({ ...newWorkPage, work_page_text: e.target.value })}
                        className={styles.inputField}
                    />
                    <label htmlFor="workPageSubText">Work Page Sub Text:</label>
                    <input
                        type="text"
                        id="workPageSubText"
                        placeholder="Work Page Sub Text"
                        value={newWorkPage.work_page_sub_text}
                        onChange={(e) => setNewWorkPage({ ...newWorkPage, work_page_sub_text: e.target.value })}
                        className={styles.inputField}
                    />
                    <div className={styles.imageUploadContainer}>
                        <input type="file" accept="image/*" onChange={handleFileChange} className={styles.imageUploadBox} />
                        {imagePreview && <img src={imagePreview} alt="Preview" className={styles.imagePreview} />}
                    </div>
                    <button onClick={addWorkPage} disabled={loading} className={styles.actionButton}>
                        {loading ? "Adding..." : "Add Work Page"}
                    </button>
                </form>
            )}

            <div className={styles.taglineList}>
                {work_pages.map((work_page) => (
                    <div key={work_page.id} className={styles.taglineItem}>
                        <img src={work_page.work_page_img} alt={work_page.work_page_text} className={styles.taglineImage} />
                        <div>
                            <span>{work_page.work_page_text}</span>
                            <p>{work_page.work_page_sub_text}</p>
                        </div>
                        <div className={styles.taglineActions}>
                            <button onClick={() => deleteWorkPage(work_page.id)} className={styles.deleteButton}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default WorkPageAdmin;
