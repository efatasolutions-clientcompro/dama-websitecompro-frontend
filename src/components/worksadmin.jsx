import React, { useState, useEffect } from "react";
import styles from "./worksadmin.module.css";

const WorksAdmin = () => {
    const [worksData, setWorksData] = useState([]);
    const [newWork, setNewWork] = useState({
        work_title: "",
        work_subtitle: "",
        work_desc: "",
        work_detail: "",
        work_people: "",
        work_category: "",
        work_main_img: null,
        work_logo_img: null,
        work_img: [],
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedWork, setSelectedWork] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState(null);
    const [logoImagePreview, setLogoImagePreview] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [workImageInputs, setWorkImageInputs] = useState([]);
    const [workImagesPreview, setWorkImagesPreview] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredWorksData, setFilteredWorksData] = useState([]);

    const VALID_WORK_CATEGORIES = [
        "Start Up Package",
        "Brand Management",
        "Brand Consultation",
        "Collection Development",
        "TikTok Management",
        "Social Media Management",
        "Styling & Creative Direction",
        "Fabric Sourcing & Consulting"
    ];

    useEffect(() => {
        const fetchWorksData = async () => {
            setLoading(true);
            try {
                const response = await fetch("https://dama-backend.vercel.app/works");
                if (response.ok) {
                    const data = await response.json();
                    setWorksData(data);
                } else {
                    console.error("Fetch error:", response.status, response.statusText);
                    setMessage("Failed to fetch Works data.");
                }
            } catch (error) {
                console.error("Error fetching Works data:", error);
                setMessage("Failed to fetch Works data.");
            } finally {
                setLoading(false);
            }
        };

        try {
            fetchWorksData();
        } catch (error) {
            console.error("Error in useEffect:", error);
        }
    }, []);

    useEffect(() => {
        const results = worksData.filter(work =>
            work.work_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            work.work_subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            work.work_desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
            work.work_category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredWorksData(results);
    }, [searchTerm, worksData]);

    const addWork = async () => {
        if (!newWork.work_title || !newWork.work_desc || !newWork.work_category) {
            setMessage("Title, description, and category are required.");
            return;
        }

        if (!VALID_WORK_CATEGORIES.includes(newWork.work_category)) {
            setMessage("Invalid work category.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            Object.keys(newWork).forEach((key) => {
                if (key === "work_img") {
                    newWork.work_img.forEach((file) => {
                        if (file) {
                            formData.append("work_img", file);
                        }
                    });
                } else if (newWork[key]) {
                    formData.append(key, newWork[key]);
                }
            });

            const response = await fetch("https://dama-backend.vercel.app/works", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setMessage("Work added successfully!");
                const data = await response.json();
                setWorksData([...worksData, data[0]]);
                resetForm();
            } else {
                const errorData = await response.json();
                setMessage(`Failed to add Work: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error adding Work:", error);
            setMessage(`Failed to add Work: ${error.message}`);
        }
        setLoading(false);
    };

    const updateWork = async () => {
        if (!newWork.work_title || !newWork.work_desc || !newWork.work_category) {
            setMessage("Title, description, and category are required.");
            return;
        }

        if (!VALID_WORK_CATEGORIES.includes(newWork.work_category)) {
            setMessage("Invalid work category.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            Object.keys(newWork).forEach((key) => {
                if (key === "work_img") {
                    newWork.work_img.forEach((file) => {
                        if (file) {
                            formData.append("work_img", file);
                        }
                    });
                } else if (newWork[key]) {
                    formData.append(key, newWork[key]);
                }
            });

            const response = await fetch(`https://dama-backend.vercel.app/works/${selectedWork.id}`, {
                method: "PUT",
                body: formData,
            });

            if (response.ok) {
                setMessage("Work updated successfully!");
                const updatedData = await response.json();
                const updatedWorksData = worksData.map((work) =>
                    work.id === updatedData[0].id ? updatedData[0] : work
                );
                setWorksData(updatedWorksData);
                resetForm();
            } else {
                const errorData = await response.json();
                setMessage(`Failed to update Work: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error updating Work:", error);
            setMessage(`Failed to update Work: ${error.message}`);
        }
        setLoading(false);
    };

    const deleteWork = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Work?");
        if (!confirmDelete) return;

        setLoading(true);
        try {
            const response = await fetch(`https://dama-backend.vercel.app/works/${id}`, { method: "DELETE" });
            if (response.ok) {
                setMessage("Work deleted successfully!");
                setWorksData(worksData.filter((work) => work.id !== id));
            } else {
                const errorData = await response.json();
                setMessage(`Failed to delete Work: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error deleting Work:", error);
            setMessage("Failed to delete Work.");
        }
        setLoading(false);
    };

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        setNewWork({ ...newWork, work_main_img: file });
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setMainImagePreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setMainImagePreview(null);
        }
    };

    const handleLogoImageChange = (e) => {
        const file = e.target.files[0];
        setNewWork({ ...newWork, work_logo_img: file });
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setLogoImagePreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setLogoImagePreview(null);
        }
    };

    const handleWorkImageChange = (e, index) => {
        const file = e.target.files[0];
        const updatedImages = [...newWork.work_img];
        updatedImages[index] = file;
        setNewWork({ ...newWork, work_img: updatedImages });

        const updatedPreviews = [...workImagesPreview];
        updatedPreviews[index] = URL.createObjectURL(file);
        setWorkImagesPreview(updatedPreviews);
    };

    const handleAddWorkImageInput = () => {
        setWorkImageInputs([...workImageInputs, workImageInputs.length]);
        setNewWork({ ...newWork, work_img: [...newWork.work_img, null] });
        setWorkImagesPreview([...workImagesPreviews, null]);
    };

    const handleRemoveWorkImageInput = (index) => {
        setWorkImageInputs(workImageInputs.filter((i) => i !== index));
        const updatedImages = [...newWork.work_img];
        updatedImages.splice(index, 1);
        setNewWork({ ...newWork, work_img: updatedImages });

        const updatedPreviews = [...workImagesPreview];
        updatedPreviews.splice(index, 1);
        setWorkImagesPreview(updatedPreviews);
    };

    const handleUpload = () => {
        resetForm();
        setShowForm(true);
    };

    const handleEdit = (work, index) => {
        setSelectedWork(work);
        setNewWork({
            work_title: work.work_title,
            work_subtitle: work.work_subtitle,
            work_desc: work.work_desc,
            work_detail: work.work_detail,
            work_people: work.work_people,
            work_category: work.work_category,
            work_main_img: null,
            work_logo_img: null,
            work_img: work.work_img || [],
        });
        setMainImagePreview(work.work_main_img);
        setLogoImagePreview(work.work_logo_img);
        setWorkImagesPreview(work.work_img || []);
        setEditIndex(index);
        setShowForm(true);
        setWorkImageInputs(work.work_img ? work.work_img.map((_, i) => i) : []);

    };

    const resetForm = () => {
        setNewWork({
            work_title: "",
            work_subtitle: "",
            work_desc: "",
            work_detail: "",
            work_people: "",
            work_category: "",
            work_main_img: null,
            work_logo_img: null,
            work_img: [],
        });
        setSelectedWork(null);
        setMainImagePreview(null);
        setLogoImagePreview(null);
        setWorkImagesPreview([]);
        setShowForm(false);
        setEditIndex(null);
        setWorkImageInputs([]);
    };

    return (
        <section className={styles.adminContainer}>
            <h2><a href="/adminonlydama/homedama">Works Admin</a></h2>
            {message && (
                <p className={`${styles.message} ${message.startsWith("Failed") ? styles.error : styles.success}`}>
                    {message}
                </p>
            )}

            <div className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="Search Works..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            <button onClick={handleUpload} className={styles.uploadButton}>Add Work</button>

            {showForm && editIndex === null && (
                <form className={styles.workForm}>
                    <label htmlFor="workTitle">Title:</label>
                    <input
                        type="text"
                        id="workTitle"
                        placeholder="Title"
                        value={newWork.work_title}
                        onChange={(e) => setNewWork({ ...newWork, work_title: e.target.value })}
                        className={styles.inputField}
                    />
                    <label htmlFor="workSubtitle">Subtitle:</label>
                    <input
                        type="text"
                        id="workSubtitle"
                        placeholder="Subtitle"
                        value={newWork.work_subtitle}
                        onChange={(e) => setNewWork({ ...newWork, work_subtitle: e.target.value })}
                        className={styles.inputField}
                    />
                    <label htmlFor="workDesc">Description:</label>
                    <textarea
                        id="workDesc"
                        placeholder="Description"
                        value={newWork.work_desc}
                        onChange={(e) => setNewWork({ ...newWork, work_desc: e.target.value })}
                        className={styles.inputField}
                    />
                    <label htmlFor="workDetail">Detail:</label>
                    <textarea
                        id="workDetail"
                        placeholder="Detail"
                        value={newWork.work_detail}
                        onChange={(e) => setNewWork({ ...newWork, work_detail: e.target.value })}
                        className={styles.inputField}
                    />
                    <label htmlFor="workPeople">People:</label>
                    <input
                        type="text"
                        id="workPeople"
                        placeholder="People"
                        value={newWork.work_people}
                        onChange={(e) => setNewWork({ ...newWork, work_people: e.target.value })}
                        className={styles.inputField}
                    />
                    <label htmlFor="workCategory">Category:</label>
                    <select
                        id="workCategory"
                        value={newWork.work_category}
                        onChange={(e) => setNewWork({ ...newWork, work_category: e.target.value })}
                        className={styles.inputField}
                    >
                        <option value="">Select Category</option>
                        {VALID_WORK_CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>

                    <div className={styles.imageUploadContainer}>
                        <div className={styles.imageUploadBox}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleMainImageChange}
                                id="mainImageUpload"
                                style={{ display: "none" }}
                            />
                            <label htmlFor="mainImageUpload">Upload Main Image</label>
                        </div>
                        {mainImagePreview && (
                            <div className={styles.imagePreviewContainer}>
                                <img src={mainImagePreview} alt="Main Preview" className={styles.imagePreview} />
                                <p className={styles.imageCaption}>Main Image Preview</p>
                            </div>
                        )}
                    </div>

                    <div className={styles.imageUploadContainer}>
                        <div className={styles.imageUploadBox}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoImageChange}
                                id="logoImageUpload"
                                style={{ display: "none" }}
                            />
                            <label htmlFor="logoImageUpload">Upload Logo Image</label>
                        </div>
                        {logoImagePreview && (
                            <div className={styles.imagePreviewContainer}>
                                <img src={logoImagePreview} alt="Logo Preview" className={styles.imagePreview} />
                                <p className={styles.imageCaption}>Logo Image Preview</p>
                            </div>
                        )}
                    </div>

                    {workImageInputs.map((index) => (
                        <div key={index} className={styles.imageUploadContainer}>
                            <div className={styles.imageUploadBox}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleWorkImageChange(e, index)}
                                    id={`workImageUpload${index}`}
                                    style={{ display: "none" }}
                                />
                                <label htmlFor={`workImageUpload${index}`}>Upload Work Image {index + 1}</label>
                            </div>
                            {workImagesPreview[index] && (
                                <div className={styles.imagePreviewContainer}>
                                    <img src={workImagesPreview[index]} alt={`Work Preview ${index}`} className={styles.imagePreview} />
                                    <p className={styles.imageCaption}>Work Image {index + 1} Preview</p>
                                </div>
                            )}
                            <button type="button" onClick={() => handleRemoveWorkImageInput(index)} className={styles.removeButton}>Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddWorkImageInput} className={styles.addButton}>Add Work Image</button>

                    <button onClick={selectedWork ? updateWork : addWork} disabled={loading} className={styles.actionButton}>
                        {loading
                            ? selectedWork
                                ? "Updating..."
                                : "Adding..."
                            : selectedWork
                                ? "Update Work"
                                : "Add Work"}
                    </button>
                    <button onClick={() => { setShowForm(false); setEditIndex(null); }} className={styles.cancelButton}>Cancel</button>
                </form>
            )}

            <div className={styles.workList}>
                {filteredWorksData.map((work, index) => (
                    <div key={work.id} className={styles.workItem}>
                        <div className={styles.workContent}>
                            <h3>{work.work_title}</h3>
                            <p>{work.work_category}</p>
                        </div>
                        <div className={styles.workActions}>
                            <button onClick={() => handleEdit(work, index)} className={styles.actionButton}>Edit</button>
                            <button onClick={() => deleteWork(work.id)} disabled={loading} className={styles.deleteButton}>Delete</button>
                        </div>
                        {showForm && editIndex === index && (
                            <form className={`${styles.workForm} ${styles.editForm}`}>
                                <label htmlFor="editWorkTitle">Title:</label>
                                <input
                                    type="text"
                                    id="editWorkTitle"
                                    placeholder="Title"
                                    value={newWork.work_title}
                                    onChange={(e) => setNewWork({ ...newWork, work_title: e.target.value })}
                                    className={styles.inputField}
                                />
                                <label htmlFor="editWorkSubtitle">Subtitle:</label>
                                <input
                                    type="text"
                                    id="editWorkSubtitle"
                                    placeholder="Subtitle"
                                    value={newWork.work_subtitle}
                                    onChange={(e) => setNewWork({ ...newWork, work_subtitle: e.target.value })}
                                    className={styles.inputField}
                                />
                                <label htmlFor="editWorkDesc">Description:</label>
                                <textarea
                                    id="editWorkDesc"
                                    placeholder="Description"
                                    value={newWork.work_desc}
                                    onChange={(e) => setNewWork({ ...newWork, work_desc: e.target.value })}
                                    className={styles.inputField}
                                />
                                <label htmlFor="editWorkDetail">Detail:</label>
                                <textarea
                                    id="editWorkDetail"
                                    placeholder="Detail"
                                    value={newWork.work_detail}
                                    onChange={(e) => setNewWork({ ...newWork, work_detail: e.target.value })}
                                    className={styles.inputField}
                                />
                                <label htmlFor="editWorkPeople">People:</label>
                                <input
                                    type="text"
                                    id="editWorkPeople"
                                    placeholder="People"
                                    value={newWork.work_people}
                                    onChange={(e) => setNewWork({ ...newWork, work_people: e.target.value })}
                                    className={styles.inputField}
                                />
                                <label htmlFor="editWorkCategory">Category:</label>
                                <select
                                    id="editWorkCategory"
                                    value={newWork.work_category}
                                    onChange={(e) => setNewWork({ ...newWork, work_category: e.target.value })}
                                    className={styles.inputField}
                                >
                                    <option value="">Select Category</option>
                                    {VALID_WORK_CATEGORIES.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>

                                <div className={styles.imageUploadContainer}>
                                    <div className={styles.imageUploadBox}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleMainImageChange}
                                            id="editMainImageUpload"
                                            style={{ display: "none" }}
                                        />
                                        <label htmlFor="editMainImageUpload">Upload Main Image</label>
                                    </div>
                                    {mainImagePreview && (
                                        <div className={styles.imagePreviewContainer}>
                                            <img src={mainImagePreview} alt="Main Preview" className={styles.imagePreview} />
                                            <p className={styles.imageCaption}>Main Image Preview</p>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.imageUploadContainer}>
                                    <div className={styles.imageUploadBox}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoImageChange}
                                            id="editLogoImageUpload"
                                            style={{ display: "none" }}
                                        />
                                        <label htmlFor="editLogoImageUpload">Upload Logo Image</label>
                                    </div>
                                    {logoImagePreview && (
                                        <div className={styles.imagePreviewContainer}>
                                            <img src={logoImagePreview} alt="Logo Preview" className={styles.imagePreview} />
                                            <p className={styles.imageCaption}>Logo Image Preview</p>
                                        </div>
                                    )}
                                </div>

                                {workImageInputs.map((index) => (
                                    <div key={index} className={styles.imageUploadContainer}>
                                        <div className={styles.imageUploadBox}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleWorkImageChange(e, index)}
                                                id={`editWorkImageUpload${index}`}
                                                style={{ display: "none" }}
                                            />
                                            <label htmlFor={`editWorkImageUpload${index}`}>Upload Work Image {index + 1}</label>
                                        </div>
                                        {workImagesPreview[index] && (
                                            <div className={styles.imagePreviewContainer}>
                                                <img src={workImagesPreview[index]} alt={`Work Preview ${index}`} className={styles.imagePreview} />
                                                <p className={styles.imageCaption}>Work Image {index + 1} Preview</p>
                                            </div>
                                        )}
                                        <button type="button" onClick={() => handleRemoveWorkImageInput(index)} className={styles.removeButton}>Remove</button>
                                    </div>
                                ))}
                                <button type="button" onClick={handleAddWorkImageInput} className={styles.addButton}>Add Work Image</button>

                                <button onClick={updateWork} disabled={loading} className={styles.actionButton}>
                                    {loading ? "Updating..." : "Update Work"}
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

export default WorksAdmin;