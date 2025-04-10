import React, { useState, useEffect, useCallback, useMemo } from "react";
import styles from "./worksadmin.module.css"; // Assuming both files use the same CSS module

const ToWorksAdmin = () => {
    const [toWorksData, setToWorksData] = useState([]);
    const [newToWork, setNewToWork] = useState({
        toworks_text: "",
        toworks_sub_text: "",
        one_img: null,
        one_name: "",
        one_link: "",
        two_img: null,
        two_name: "",
        two_link: "",
        three_img: null,
        three_name: "",
        three_link: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedToWork, setSelectedToWork] = useState(null);
    const [imagePreviews, setImagePreviews] = useState({
        one_img: null,
        two_img: null,
        three_img: null,
    });
    const [showForm, setShowForm] = useState(false);
    const [editItemId, setEditItemId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddForm, setShowAddForm] = useState(false); // To control when the add form is visible

    const fetchToWorksData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch("https://dama-backend.vercel.app/toworks");
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to fetch: ${errorData.error || response.statusText}`);
            }
            const data = await response.json();
            setToWorksData(data);
        } catch (error) {
            console.error("Error fetching To Works data:", error);
            setMessage(`Failed to fetch To Works data: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleApiError = useCallback(async (response, successMessage) => {
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed: ${errorData.error || response.statusText}`);
        }
        setMessage(successMessage);
    }, []);

    const addToWork = useCallback(async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("toworks_text", newToWork.toworks_text);
            formData.append("toworks_sub_text", newToWork.toworks_sub_text);
            formData.append("one_name", newToWork.one_name || "");
            formData.append("one_link", newToWork.one_link || "");
            formData.append("two_name", newToWork.two_name || "");
            formData.append("two_link", newToWork.two_link || "");
            formData.append("three_name", newToWork.three_name || "");
            formData.append("three_link", newToWork.three_link || "");
            if (newToWork.one_img) formData.append("one_img", newToWork.one_img);
            if (newToWork.two_img) formData.append("two_img", newToWork.two_img);
            if (newToWork.three_img) formData.append("three_img", newToWork.three_img);

            const response = await fetch("https://dama-backend.vercel.app/toworks", {
                method: "POST",
                body: formData,
            });

            await handleApiError(response, "To Work added successfully!");
            const data = await response.json();
            setToWorksData([...toWorksData, data[0]]);
            resetForm();
        } catch (error) {
            console.error("Error adding To Work:", error);
            setMessage(`Failed to add To Work: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }, [newToWork, toWorksData, handleApiError]);

    const updateToWork = useCallback(async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("toworks_text", newToWork.toworks_text);
            formData.append("toworks_sub_text", newToWork.toworks_sub_text);
            formData.append("one_name", newToWork.one_name || "");
            formData.append("one_link", newToWork.one_link || "");
            formData.append("two_name", newToWork.two_name || "");
            formData.append("two_link", newToWork.two_link || "");
            formData.append("three_name", newToWork.three_name || "");
            formData.append("three_link", newToWork.three_link || "");
            if (newToWork.one_img) formData.append("one_img", newToWork.one_img);
            if (newToWork.two_img) formData.append("two_img", newToWork.two_img);
            if (newToWork.three_img) formData.append("three_img", newToWork.three_img);

            const response = await fetch(`https://dama-backend.vercel.app/toworks/${selectedToWork.id}`, {
                method: "PUT",
                body: formData,
            });

            await handleApiError(response, "To Work updated successfully!");
            const updatedData = await response.json();
            const updatedToWorksData = toWorksData.map((item) =>
                item.id === updatedData[0].id ? updatedData[0] : item
            );
            setToWorksData(updatedToWorksData);
            resetForm();
        } catch (error) {
            console.error("Error updating To Work:", error);
            setMessage(`Failed to update To Work: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }, [newToWork, toWorksData, selectedToWork, handleApiError]);

    const deleteToWork = useCallback(async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this To Work entry?");
        if (!confirmDelete) return;

        setLoading(true);
        try {
            const response = await fetch(`https://dama-backend.vercel.app/toworks/${id}`, { method: "DELETE" });
            await handleApiError(response, "To Work entry deleted successfully!");
            setToWorksData(toWorksData.filter((item) => item.id !== id));
        } catch (error) {
            console.error("Error deleting To Work entry:", error);
            setMessage(`Failed to delete To Work entry: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }, [toWorksData, handleApiError]);

    const handleImageChange = useCallback((e, imageName) => {
        const file = e.target.files[0];
        setNewToWork({ ...newToWork, [imageName]: file });
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews({ ...imagePreviews, [imageName]: reader.result });
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreviews({ ...imagePreviews, [imageName]: selectedToWork ? selectedToWork[imageName] : null });
        }
    }, [newToWork, selectedToWork, imagePreviews]);

    const handleEdit = useCallback((item) => {
        setSelectedToWork(item);
        setNewToWork({
            toworks_text: item.toworks_text || "",
            toworks_sub_text: item.toworks_sub_text || "",
            one_img: null, // Reset file input
            one_name: item.one_name || "",
            one_link: item.one_link || "",
            two_img: null, // Reset file input
            two_name: item.two_name || "",
            two_link: item.two_link || "",
            three_img: null, // Reset file input
            three_name: item.three_name || "",
            three_link: item.three_link || "",
        });
        setImagePreviews({
            one_img: item.one_img || null,
            two_img: item.two_img || null,
            three_img: item.three_img || null,
        });
        setEditItemId(item.id);
        setShowForm(true);
        setShowAddForm(false);
    }, []);

    const resetForm = useCallback(() => {
        setNewToWork({
            toworks_text: "",
            toworks_sub_text: "",
            one_img: null,
            one_name: "",
            one_link: "",
            two_img: null,
            two_name: "",
            two_link: "",
            three_img: null,
            three_name: "",
            three_link: "",
        });
        setSelectedToWork(null);
        setImagePreviews({ one_img: null, two_img: null, three_img: null });
        setShowForm(false);
        setEditItemId(null);
        setShowAddForm(false);
    }, []);

    useEffect(() => {
        fetchToWorksData();
    }, [fetchToWorksData]);

    const filteredToWorksData = useMemo(() => {
        return toWorksData.filter(item =>
            item.toworks_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.toworks_sub_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.one_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.two_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.three_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, toWorksData]);

    return (
        <section className={styles.adminContainer}>
            <h2><a href="/adminonlydama/homedama">To Works Admin</a></h2>
            {message && <p className={`${styles.message} ${message.startsWith("Failed") ? styles.error : styles.success}`}>{message}</p>}
            <input
                type="text"
                placeholder="Search To Works"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
            />
            <button onClick={() => { setShowAddForm(true); setShowForm(true); setEditItemId(null); resetForm(); }} className={styles.uploadButton}>Add To Work</button>

            {showAddForm && showForm && !editItemId && (
                <form onSubmit={(e) => { e.preventDefault(); addToWork(); }} className={styles.workForm}>
                    <label htmlFor="toworks_text">To Works Text:</label>
                    <input
                        type="text"
                        id="toworks_text"
                        placeholder="To Works Text"
                        value={newToWork.toworks_text}
                        onChange={(e) => setNewToWork({ ...newToWork, toworks_text: e.target.value })}
                        className={styles.inputField}
                        required
                    />

                    <label htmlFor="toworks_sub_text">To Works Sub Text:</label>
                    <input
                        type="text"
                        id="toworks_sub_text"
                        placeholder="To Works Sub Text"
                        value={newToWork.toworks_sub_text}
                        onChange={(e) => setNewToWork({ ...newToWork, toworks_sub_text: e.target.value })}
                        className={styles.inputField}
                    />

                    <div className={styles.imageInputs}>
                        <div className={styles.imageInputContainer}>
                            <label htmlFor="one_img">Image 1:</label>
                            {imagePreviews.one_img && <img src={imagePreviews.one_img} alt="Preview 1" className={styles.imagePreview} />}
                            <input type="file" id="one_img" name="one_img" onChange={(e) => handleImageChange(e, "one_img")} className={styles.fileInput} />
                            <input type="text" placeholder="Image 1 Name" value={newToWork.one_name || ""} onChange={(e) => setNewToWork({ ...newToWork, one_name: e.target.value })} className={styles.inputField} />
                            <input type="text" placeholder="Image 1 Link" value={newToWork.one_link || ""} onChange={(e) => setNewToWork({ ...newToWork, one_link: e.target.value })} className={styles.inputField} />
                        </div>

                        <div className={styles.imageInputContainer}>
                            <label htmlFor="two_img">Image 2:</label>
                            {imagePreviews.two_img && <img src={imagePreviews.two_img} alt="Preview 2" className={styles.imagePreview} />}
                            <input type="file" id="two_img" name="two_img" onChange={(e) => handleImageChange(e, "two_img")} className={styles.fileInput} />
                            <input type="text" placeholder="Image 2 Name" value={newToWork.two_name || ""} onChange={(e) => setNewToWork({ ...newToWork, two_name: e.target.value })} className={styles.inputField} />
                            <input type="text" placeholder="Image 2 Link" value={newToWork.two_link || ""} onChange={(e) => setNewToWork({ ...newToWork, two_link: e.target.value })} className={styles.inputField} />
                        </div>

                        <div className={styles.imageInputContainer}>
                            <label htmlFor="three_img">Image 3:</label>
                            {imagePreviews.three_img && <img src={imagePreviews.three_img} alt="Preview 3" className={styles.imagePreview} />}
                            <input type="file" id="three_img" name="three_img" onChange={(e) => handleImageChange(e, "three_img")} className={styles.fileInput} />
                            <input type="text" placeholder="Image 3 Name" value={newToWork.three_name || ""} onChange={(e) => setNewToWork({ ...newToWork, three_name: e.target.value })} className={styles.inputField} />
                            <input type="text" placeholder="Image 3 Link" value={newToWork.three_link || ""} onChange={(e) => setNewToWork({ ...newToWork, three_link: e.target.value })} className={styles.inputField} />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className={styles.actionButton}>
                        {loading ? "Adding..." : "Add To Work"}
                    </button>
                    <button type="button" onClick={() => { setShowForm(false); setShowAddForm(false); }} className={styles.cancelButton}>Cancel</button>
                </form>
            )}

            <div className={styles.workList}>
                {filteredToWorksData.map((item) => (
                    <div key={item.id} className={styles.workItem}>
                        <div className={styles.workContent}>
                            <h3>{item.toworks_text}</h3>
                            <p>{item.toworks_sub_text}</p>
                            <div className={styles.imagePreviews}>
                                {item.one_img && <img src={item.one_img} alt={item.one_name} className={styles.imagePreview} />}
                                {item.two_img && <img src={item.two_img} alt={item.two_name} className={styles.imagePreview} />}
                                {item.three_img && <img src={item.three_img} alt={item.three_name} className={styles.imagePreview} />}
                            </div>
                        </div>
                        <div className={styles.workActions}>
                            <button onClick={() => handleEdit(item)} className={styles.actionButton}>Edit</button>
                            <button onClick={() => deleteToWork(item.id)} disabled={loading} className={styles.deleteButton}>Delete</button>
                        </div>
                        {editItemId === item.id && showForm && (
                            <form onSubmit={(e) => { e.preventDefault(); updateToWork(); }} className={styles.workForm}>
                                <label htmlFor="toworks_text">To Works Text:</label>
                                <input
                                    type="text"
                                    id="toworks_text"
                                    placeholder="To Works Text"
                                    value={newToWork.toworks_text}
                                    onChange={(e) => setNewToWork({ ...newToWork, toworks_text: e.target.value })}
                                    className={styles.inputField}
                                    required
                                />

                                <label htmlFor="toworks_sub_text">To Works Sub Text:</label>
                                <input
                                    type="text"
                                    id="toworks_sub_text"
                                    placeholder="To Works Sub Text"
                                    value={newToWork.toworks_sub_text}
                                    onChange={(e) => setNewToWork({ ...newToWork, toworks_sub_text: e.target.value })}
                                    className={styles.inputField}
                                />

                                <div className={styles.imageimageInputs}
                                >
                                    <div className={styles.imageInputContainer}>
                                    <label htmlFor="one_img">Image 1:</label>
                                        {imagePreviews.one_img && <img src={imagePreviews.one_img} alt="Preview 1" className={styles.imagePreview} />}
                                        <input type="file" id="one_img" name="one_img" onChange={(e) => handleImageChange(e, "one_img")} className={styles.fileInput} />
                                        <input type="text" placeholder="Image 1 Name" value={newToWork.one_name || ""} onChange={(e) => setNewToWork({ ...newToWork, one_name: e.target.value })} className={styles.inputField} />
                                        <input type="text" placeholder="Image 1 Link" value={newToWork.one_link || ""} onChange={(e) => setNewToWork({ ...newToWork, one_link: e.target.value })} className={styles.inputField} />
                                    </div>

                                    <div className={styles.imageInputContainer}>
                                        <label htmlFor="two_img">Image 2:</label>
                                        {imagePreviews.two_img && <img src={imagePreviews.two_img} alt="Preview 2" className={styles.imagePreview} />}
                                        <input type="file" id="two_img" name="two_img" onChange={(e) => handleImageChange(e, "two_img")} className={styles.fileInput} />
                                        <input type="text" placeholder="Image 2 Name" value={newToWork.two_name || ""} onChange={(e) => setNewToWork({ ...newToWork, two_name: e.target.value })} className={styles.inputField} />
                                        <input type="text" placeholder="Image 2 Link" value={newToWork.two_link || ""} onChange={(e) => setNewToWork({ ...newToWork, two_link: e.target.value })} className={styles.inputField} />
                                    </div>

                                    <div className={styles.imageInputContainer}>
                                        <label htmlFor="three_img">Image 3:</label>
                                        {imagePreviews.three_img && <img src={imagePreviews.three_img} alt="Preview 3" className={styles.imagePreview} />}
                                        <input type="file" id="three_img" name="three_img" onChange={(e) => handleImageChange(e, "three_img")} className={styles.fileInput} />
                                        <input type="text" placeholder="Image 3 Name" value={newToWork.three_name || ""} onChange={(e) => setNewToWork({ ...newToWork, three_name: e.target.value })} className={styles.inputField} />
                                        <input type="text" placeholder="Image 3 Link" value={newToWork.three_link || ""} onChange={(e) => setNewToWork({ ...newToWork, three_link: e.target.value })} className={styles.inputField} />
                                    </div>
                                </div>

                                <button type="submit" disabled={loading} className={styles.actionButton}>
                                    {loading ? "Updating..." : "Update To Work"}
                                </button>
                                <button type="button" onClick={() => { setShowForm(false); setEditItemId(null); }} className={styles.cancelButton}>Cancel</button>
                            </form>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ToWorksAdmin;