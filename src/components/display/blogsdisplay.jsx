import React, { useState, useEffect } from "react";
import styles from "./blogsdisplay.module.css";

const BlogsDisplay = () => {
    const [blogsData, setBlogsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest"); // "newest" atau "oldest"

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
                    setMessage("Failed to fetch blogs data.");
                }
            } catch (error) {
                console.error("Error fetching blogs data:", error);
                setMessage("Failed to fetch blogs data.");
            } finally {
                setLoading(false);
            }
        };

        fetchBlogsData();
    }, []);

    const filteredBlogs = blogsData.filter((blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedBlogs = [...filteredBlogs].sort((a, b) => {
        const dateA = new Date(a.published_at);
        const dateB = new Date(b.published_at);
        return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return (
        <div className={styles.blogsDisplayContainer}>
            <div className={styles.contentWrapper}>
                <h2 className={styles.pageTitle}></h2>

                <div className={styles.searchSortContainer}>
                    <input
                        type="text"
                        placeholder="Search blogs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchBar}
                    />
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={styles.sortBy}>
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </div>

                <div className={styles.blogsList}>
                    {sortedBlogs.map((blog) => (
                        <div key={blog.id} className={styles.blogItem}>
                            <div className={styles.blogContent}>
                                <h3 className={styles.blogTitle}>{blog.title}</h3>
                                <p className={styles.excerpt}>{blog.excerpt}</p>
                                <div className={styles.meta}>
                                    <p className={styles.author}>{blog.author_name}</p>
                                    <p className={styles.date}>
                                        {new Date(blog.published_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <a href={`/blogs/${blog.slug}`} className={styles.readMore}>Read More</a>
                            </div>
                            {blog.cover_image && (
                                <img src={blog.cover_image} alt={blog.title} className={styles.coverImage} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogsDisplay;