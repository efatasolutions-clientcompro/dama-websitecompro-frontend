import React, { useState, useEffect } from "react";
import styles from "./worksadmin.module.css"; // Menggunakan worksadmin.module.css

const BlogsAdmin = () => {
    const [blogsData, setBlogsData] = useState([]);
    const [newBlog, setNewBlog] = useState({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        author_name: "",
        author_contact: "",
        published_at: "",
        is_published: false,
        cover_image: null,
        image_list: [],
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState(null);
    const [imageListPreviews, setImageListPreviews] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [imageInputs, setImageInputs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredBlogsData, setFilteredBlogsData] = useState([]);

    useEffect(() => {
        const fetchBlogsData = async () => {
            setLoading(true);
            try {
                const response = await fetch("https://dama-backend.vercel.app/blogs");
                if (response.ok) {
                    const data = await response.json();
                    setBlogsData(data);
                } else {
                    console.error("Fetch error:", response.status, response.statusText);
                    setMessage("Failed to fetch Blogs data.");
                }
            } catch (error) {
                console.error("Error fetching Blogs data:", error);
                setMessage("Failed to fetch Blogs data.");
            } finally {
                setLoading(false);
            }
        };

        try {
            fetchBlogsData();
        } catch (error) {
            console.error("Error in useEffect:", error);
        }
    }, []);

    useEffect(() => {
        const results = blogsData.filter(blog =>
            blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.author_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredBlogsData(results);
    }, [searchTerm, blogsData]);

    const addBlog = async () => {
        if (!newBlog.title || !newBlog.content) {
            setMessage("Title and content are required.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            Object.keys(newBlog).forEach((key) => {
                if (key === "image_list") {
                    newBlog.image_list.forEach((file) => {
                        if (file) {
                            formData.append("image_list", file);
                        }
                    });
                } else if (newBlog[key]) {
                    formData.append(key, newBlog[key]);
                }
            });

            const response = await fetch("https://dama-backend.vercel.app/blogs", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setMessage("Blog added successfully!");
                const data = await response.json();
                setBlogsData([...blogsData, data[0]]);
                resetForm();
            } else {
                const errorData = await response.json();
                setMessage(`Failed to add Blog: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error adding Blog:", error);
            setMessage(`Failed to add Blog: ${error.message}`);
        }
        setLoading(false);
    };

    const updateBlog = async () => {
        if (!newBlog.title || !newBlog.content) {
            setMessage("Title and content are required.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            Object.keys(newBlog).forEach((key) => {
                if (key === "image_list") {
                    newBlog.image_list.forEach((file) => {
                        if (file) {
                            formData.append("image_list", file);
                        }
                    });
                } else if (newBlog[key]) {
                    formData.append(key, newBlog[key]);
                }
            });

            const response = await fetch(`https://dama-backend.vercel.app/blogs/${selectedBlog.id}`, {
                method: "PUT",
                body: formData,
            });

            if (response.ok) {
                setMessage("Blog updated successfully!");
                const updatedData = await response.json();
                const updatedBlogsData = blogsData.map((blog) =>
                    blog.id === updatedData[0].id ? updatedData[0] : blog
                );
                setBlogsData(updatedBlogsData);
                resetForm();
            } else {
                const errorData = await response.json();
                setMessage(`Failed to update Blog: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error updating Blog:", error);
            setMessage(`Failed to update Blog: ${error.message}`);
        }
        setLoading(false);
    };

    const deleteBlog = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Blog?");
        if (!confirmDelete) return;

        setLoading(true);
        try {
            const response = await fetch(`https://dama-backend.vercel.app/blogs/${id}`, { method: "DELETE" });
            if (response.ok) {
                setMessage("Blog deleted successfully!");
                setBlogsData(blogsData.filter((blog) => blog.id !== id));
            } else {
                const errorData = await response.json();
                setMessage(`Failed to delete Blog: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error deleting Blog:", error);
            setMessage("Failed to delete Blog.");
        }
        setLoading(false);
    };

    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        setNewBlog({ ...newBlog, cover_image: file });
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setCoverImagePreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setCoverImagePreview(null);
        }
    };

    const handleImageListChange = (e, index) => {
        const file = e.target.files[0];
        const updatedImages = [...newBlog.image_list];
        updatedImages[index] = file;
        setNewBlog({ ...newBlog, image_list: updatedImages });

        const updatedPreviews = [...imageListPreviews];
        updatedPreviews[index] = URL.createObjectURL(file);
        setImageListPreviews(updatedPreviews);
    };

    const handleAddImageInput = () => {
        setImageInputs([...imageInputs, imageInputs.length]);
        setNewBlog({ ...newBlog, image_list: [...newBlog.image_list, null] });
        setImageListPreviews([...imageListPreviews, null]);
    };

    const handleRemoveImageInput = (index) => {
        setImageInputs(imageInputs.filter((i) => i !== index));
        const updatedImages = [...newBlog.image_list];
        updatedImages.splice(index, 1);
        setNewBlog({ ...newBlog, image_list: updatedImages });

        const updatedPreviews = [...imageListPreviews];
        updatedPreviews.splice(index, 1);
        setImageListPreviews(updatedPreviews);
    };

    const handleUpload = () => {
        resetForm();
        setShowForm(true);
    };

    const handleEdit = (blog, index) => {
        setSelectedBlog(blog);
        setNewBlog({
            title: blog.title,
            slug: blog.slug,
            content: blog.content,
            excerpt: blog.excerpt,
            author_name: blog.author_name,
            author_contact: blog.author_contact,
            published_at: blog.published_at,
            is_published: blog.is_published,
            cover_image: null,
            image_list: blog.image_list || [],
        });
        setCoverImagePreview(blog.cover_image);
        setImageListPreviews(blog.image_list || []);
        setEditIndex(index);
        setShowForm(true);
        setImageInputs(blog.image_list ? blog.image_list.map((_, i) => i) : []);
    };

    const resetForm = () => {
        setNewBlog({
            title: "",
            slug: "",
            content: "",
            excerpt: "",
            author_name: "",
            author_contact: "",
            published_at: "",
            is_published: false,
            cover_image: null,
            image_list: [],
        });
        setSelectedBlog(null);
        setCoverImagePreview(null);
        setImageListPreviews([]);
        setShowForm(false);
        setEditIndex(null);
        setImageInputs([]);
    };

    return (
        <section className={styles.adminContainer}>
            <h2><a href="/adminonlydama/homedama">Blogs Admin</a></h2>
            {message && (
                <p className={`${styles.message} ${message.startsWith("Failed") ? styles.error : styles.success}`}>
                    {message}
                </p>
            )}

            <div className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="Search Blogs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            <button onClick={handleUpload} className={styles.uploadButton}>Add Blog</button>

            {showForm && editIndex === null && (
                <form className={styles.workForm}>
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        placeholder="Title"
                        value={newBlog.title}
                        onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                        className={styles.inputField}
                    />
                    <label htmlFor="slug">Slug:</label>
                    <input
                        type="text"
                        id="slug"
                        placeholder="Slug"
                        value={newBlog.slug}
                        onChange={(e) => setNewBlog({ ...newBlog, slug: e.target.value })}
                        className={styles.inputField}
                    />
                    <label htmlFor="content">Content:</label>
                    <textarea
                        id="content"
                        placeholder="Content"
                        value={newBlog.content}
                        onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                        className={styles.inputField}
                    />
                    <label htmlFor="excerpt">Excerpt:</label>
                    <textarea
                        id="excerpt"
                        placeholder="Excerpt"
                        value={newBlog.excerpt}
                        onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
                        className={styles.inputField}
                    />
                    <label htmlFor="author_name">Author Name:</label>
                    <input
                        type="text"
                        id="author_name"
                        placeholder="Author Name"
                        value={newBlog.author_name}
                        onChange={(e) => setNewBlog({ ...newBlog, author_name: e.target.value })}
                        className={styles.inputField}
                    />
                    <label htmlFor="author_contact">Author Contact:</label>
                    <input
                        type="text"
                        id="author_contact"
                        placeholder="Author Contact"
                        value={newBlog.author_contact}
                        onChange={(e) => setNewBlog({ ...newBlog, author_contact: e.target.value })}
                        className={styles.inputField}
                    />
                    <label htmlFor="published_at">Published At:</label>
                    <input
                        type="datetime-local"
                        id="published_at"
                        value={newBlog.published_at}
                        onChange={(e) => setNewBlog({ ...newBlog, published_at: e.target.value })}
                        className={styles.inputField}
                    />
                    <label htmlFor="is_published">Is Published:</label>
                    <select
                        id="is_published"
                        value={newBlog.is_published}
                        onChange={(e) => setNewBlog({ ...newBlog, is_published: e.target.value === "true" })}
                        className={styles.inputField}
                    >
                        <option value="true">True</option>
                        <option value="false">False</option>
                    </select>

                    <div className={styles.imageUploadContainer}>
                        <div className={styles.imageUploadBox}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleCoverImageChange}
                                id="coverImageUpload"
                                style={{ display: "none" }}
                            />
                            <label htmlFor="coverImageUpload">Upload Cover Image</label>
                        </div>
                        {coverImagePreview && (
                            <div className={styles.imagePreviewContainer}>
                                <img src={coverImagePreview} alt="Cover Preview" className={styles.imagePreview} />
                                <p className={styles.imageCaption}>Cover Image Preview</p>
                            </div>
                        )}
                    </div>

                    {imageInputs.map((index) => (
                        <div key={index} className={styles.imageUploadContainer}>
                            <div className={styles.imageUploadBox}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageListChange(e, index)}
                                    id={`imageListUpload${index}`}
                                    style={{ display: "none" }}
                                />
                                <label htmlFor={`imageListUpload${index}`}>Upload Image {index + 1}</label>
                            </div>
                            {imageListPreviews[index] && (
                                <div className={styles.imagePreviewContainer}>
                                    <img src={imageListPreviews[index]} alt={`Image Preview ${index}`} className={styles.imagePreview} />
                                    <p className={styles.imageCaption}>Image {index + 1} Preview</p>
                                </div>
                            )}
                            <button type="button" onClick={() => handleRemoveImageInput(index)} className={styles.removeButton}>Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddImageInput} className={styles.addButton}>Add Image</button>

                    <button onClick={selectedBlog ? updateBlog : addBlog} disabled={loading} className={styles.actionButton}>
                        {loading
                            ? selectedBlog
                                ? "Updating..."
                                : "Adding..."
                            : selectedBlog
                                ? "Update Blog"
                                : "Add Blog"}
                    </button>
                    <button onClick={() => { setShowForm(false); setEditIndex(null); }} className={styles.cancelButton}>Cancel</button>
                </form>
            )}

            <div className={styles.workList}>
                {filteredBlogsData.map((blog, index) => (
                    <div key={blog.id} className={styles.workItem}>
                        <div className={styles.workContent}>
                            <h3>{blog.title}</h3>
                            <p>{blog.author_name}</p>
                        </div>
                        <div className={styles.workActions}>
                            <button onClick={() => handleEdit(blog, index)} className={styles.actionButton}>Edit</button>
                            <button onClick={() => deleteBlog(blog.id)} disabled={loading} className={styles.deleteButton}>Delete</button>
                        </div>
                        {showForm && editIndex === index && (
                            <form className={`${styles.workForm} ${styles.editForm}`}>
                                <label htmlFor="editTitle">Title:</label>
                                <input
                                    type="text"
                                    id="editTitle"
                                    placeholder="Title"
                                    value={newBlog.title}
                                    onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                                    className={styles.inputField}
                                />
                                <label htmlFor="editSlug">Slug:</label>
                                <input
                                    type="text"
                                    id="editSlug"
                                    placeholder="Slug"
                                    value={newBlog.slug}
                                    onChange={(e) => setNewBlog({ ...newBlog, slug: e.target.value })}
                                    className={styles.inputField}
                                />
                                <label htmlFor="editContent">Content:</label>
                                <textarea
                                    id="editContent"
                                    placeholder="Content"
                                    value={newBlog.content}
                                    onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                                    className={styles.inputField}
                                />
                                <label htmlFor="editExcerpt">Excerpt:</label>
                                <textarea
                                    id="editExcerpt"
                                    placeholder="Excerpt"
                                    value={newBlog.excerpt}
                                    onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
                                    className={styles.inputField}
                                />
                                <label htmlFor="editAuthor_name">Author Name:</label>
                                <input
                                    type="text"
                                    id="editAuthor_name"
                                    placeholder="Author Name"
                                    value={newBlog.author_name}
                                    onChange={(e) => setNewBlog({ ...newBlog, author_name: e.target.value })}
                                    className={styles.inputField}
                                />
                                <label htmlFor="editAuthor_contact">Author Contact:</label>
                                <input
                                    type="text"
                                    id="editAuthor_contact"
                                    placeholder="Author Contact"
                                    value={newBlog.author_contact}
                                    onChange={(e) => setNewBlog({ ...newBlog, author_contact: e.target.value })}
                                    className={styles.inputField}
                                />
                                <label htmlFor="editPublished_at">Published At:</label>
                                <input
                                    type="datetime-local"
                                    id="editPublished_at"
                                    value={newBlog.published_at}
                                    onChange={(e) => setNewBlog({ ...newBlog, published_at: e.target.value })}
                                    className={styles.inputField}
                                />
                                <label htmlFor="editIs_published">Is Published:</label>
                                <select
                                    id="editIs_published"
                                    value={newBlog.is_published}
                                    onChange={(e) => setNewBlog({ ...newBlog, is_published: e.target.value === "true" })}
                                    className={styles.inputField}
                                >
                                    <option value="true">True</option>
                                    <option value="false">False</option>
                                </select>

                                <div className={styles.imageUploadContainer}>
                                    <div className={styles.imageUploadBox}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleCoverImageChange}
                                            id="editCoverImageUpload"
                                            style={{ display: "none" }}
                                        />
                                        <label htmlFor="editCoverImageUpload">Upload Cover Image</label>
                                    </div>
                                    {coverImagePreview && (
                                        <div className={styles.imagePreviewContainer}>
                                            <img src={coverImagePreview} alt="Cover Preview" className={styles.imagePreview} />
                                            <p className={styles.imageCaption}>Cover Image Preview</p>
                                        </div>
                                    )}
                                </div>

                                {imageInputs.map((index) => (
                                    <div key={index} className={styles.imageUploadContainer}>
                                        <div className={styles.imageUploadBox}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageListChange(e, index)}
                                                id={`editImageListUpload${index}`}
                                                style={{ display: "none" }}
                                            />
                                            <label htmlFor={`editImageListUpload${index}`}>Upload Image {index + 1}</label>
                                        </div>
                                        {imageListPreviews[index] && (
                                            <div className={styles.imagePreviewContainer}>
                                                <img src={imageListPreviews[index]} alt={`Image Preview ${index}`} className={styles.imagePreview} />
                                                <p className={styles.imageCaption}>Image {index + 1} Preview</p>
                                            </div>
                                        )}
                                        <button type="button" onClick={() => handleRemoveImageInput(index)} className={styles.removeButton}>Remove</button>
                                    </div>
                                ))}
                                <button type="button" onClick={handleAddImageInput} className={styles.addButton}>Add Image</button>

                                <button onClick={updateBlog} disabled={loading} className={styles.actionButton}>
                                    {loading ? "Updating..." : "Update Blog"}
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

export default BlogsAdmin;