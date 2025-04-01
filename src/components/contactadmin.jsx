import React, { useState, useEffect } from "react";
import styles from "./admin.module.css";

const ContactAdmin = () => {
    const [contacts, setContacts] = useState([]);
    const [newContact, setNewContact] = useState({
        contact_title: "",
        contact_subtitle: "",
        contact_image: null,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedContact, setSelectedContact] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        const fetchContacts = async () => {
            setLoading(true);
            try {
                const response = await fetch("https://dama-backend.vercel.app/contacts");
                if (response.ok) {
                    const data = await response.json();
                    setContacts(data);
                } else {
                    setMessage("Failed to fetch contacts.");
                }
            } catch (error) {
                console.error("Error fetching contacts:", error);
                setMessage("Failed to fetch contacts.");
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, []);

    const addContact = async () => {
        if (!newContact.contact_title || !newContact.contact_image) {
            setMessage("Contact title and image are required.");
            return;
        }

        if (newContact.contact_image.size > 5 * 1024 * 1024) {
            setMessage("Image size must be less than 5MB.");
            return;
        }

        if (!newContact.contact_image.type.startsWith("image/")) {
            setMessage("File type must be an image.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("contact_title", newContact.contact_title);
            formData.append("contact_subtitle", newContact.contact_subtitle);
            formData.append("contact_image", newContact.contact_image);

            const response = await fetch("https://dama-backend.vercel.app/contacts", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setMessage("Contact added successfully!");
                const data = await response.json();
                setContacts([...contacts, data]);
                setNewContact({
                    contact_title: "",
                    contact_subtitle: "",
                    contact_image: null,
                });
                setImagePreview(null);
                setShowForm(false);
                setEditIndex(null);
            } else {
                const errorData = await response.json();
                setMessage(`Failed to add contact: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error adding contact:", error);
            setMessage(`Failed to add contact: ${error.message}`);
        }
        setLoading(false);
    };

    const updateContact = async () => {
        if (!newContact.contact_title) {
            setMessage("Contact title is required.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("contact_title", newContact.contact_title);
            formData.append("contact_subtitle", newContact.contact_subtitle);
            if(newContact.contact_image){
                formData.append("contact_image", newContact.contact_image);
            }

            const response = await fetch(`https://dama-backend.vercel.app/contacts/${selectedContact.id}`, {
                method: "PUT",
                body: formData,
            });

            if (response.ok) {
                setMessage("Contact updated successfully!");
                const updatedData = await response.json();
                const updatedContacts = contacts.map(contact =>
                    contact.id === updatedData.id ? updatedData : contact
                );
                setContacts(updatedContacts);
                setNewContact({
                    contact_title: "",
                    contact_subtitle: "",
                    contact_image: null,
                });
                setSelectedContact(null);
                setImagePreview(null);
                setShowForm(false);
                setEditIndex(null);
            } else {
                const errorData = await response.json();
                setMessage(`Failed to update contact: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error updating contact:", error);
            setMessage(`Failed to update contact: ${error.message}`);
        }
        setLoading(false);
    };

    const deleteContact = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this contact?");
        if (!confirmDelete) return;

        setLoading(true);
        try {
            const response = await fetch(`https://dama-backend.vercel.app/contacts/${id}`, { method: "DELETE" });
            if (response.ok) {
                setMessage("Contact deleted successfully!");
                setContacts(contacts.filter(contact => contact.id !== id));
            } else {
                const errorData = await response.json();
                setMessage(`Failed to delete contact: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error deleting contact:", error);
            setMessage("Failed to delete contact.");
        }
        setLoading(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setNewContact({ ...newContact, contact_image: file });
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleUpload = () => {
        setNewContact({ contact_title: "", contact_subtitle: "", contact_image: null });
        setSelectedContact(null);
        setImagePreview(null);
        setShowForm(true);
        setEditIndex(null);
    };

    const handleEdit = (contact, index) => {
        setSelectedContact(contact);
        setNewContact({
            contact_title: contact.contact_title,
            contact_subtitle: contact.contact_subtitle,
            contact_image: null,
        });
        setImagePreview(contact.contact_image);
        setEditIndex(index);
        setShowForm(true);
    };

    return (
        <section className={styles.adminContainer}>
            <h2>Contacts Admin</h2>
            {message && (
                <p className={`${styles.message} ${message.startsWith("Failed") ? styles.error : styles.success}`}>
                    {message}
                </p>
            )}

            <button onClick={handleUpload} className={styles.uploadButton}>Upload Contact</button>

            {showForm && editIndex === null && (
                <form className={styles.taglineForm}>
                    <label htmlFor="contactTitle">Contact Title:</label>
                    <input
                        type="text"
                        id="contactTitle"
                        placeholder="Contact Title"
                        value={newContact.contact_title}
                        onChange={(e) => setNewContact({ ...newContact, contact_title: e.target.value })}
                        className={styles.inputField}
                    />
                    <label htmlFor="contactSubTitle">Contact Sub Title:</label>
                    <input
                        type="text"
                        id="contactSubTitle"
                        placeholder="Contact Sub Title"
                        value={newContact.contact_subtitle}
                        onChange={(e) => setNewContact({ ...newContact, contact_subtitle: e.target.value })}
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

                    <button onClick={selectedContact ? updateContact : addContact} disabled={loading} className={styles.actionButton}>
                        {loading
                            ? selectedContact
                                ? "Updating..."
                                : "Adding..."
                            : selectedContact
                                ? "Update Contact"
                                : "Add Contact"}
                    </button>
                    <button onClick={() => { setShowForm(false); setEditIndex(null); }} className={styles.cancelButton}>Cancel</button>
                </form>
            )}

            <div className={styles.taglineList}>
                {contacts.map((contact, index) => (
                    <div key={contact.id} className={styles.taglineItem}>
                        <div className={styles.taglineContent}>
                            <img src={contact.contact_image} alt={contact.contact_title} className={styles.taglineImage} />
                            <div>
                                <span>{contact.contact_title}</span>
                                <p>{contact.contact_subtitle}</p>
                            </div>
                        </div>
                        <div className={styles.taglineActions}>
                            <button onClick={() => handleEdit(contact, index)} className={styles.actionButton}>Edit</button>
                            <button onClick={() => deleteContact(contact.id)} disabled={loading} className={styles.deleteButton}>Delete</button>
                        </div>
                        {showForm && editIndex === index && (
                            <form className={`${styles.taglineForm} ${styles.editForm}`}>
                                <label htmlFor="editContactTitle">Contact Title:</label>
                                <input
                                    type="text"
                                    id="editContactTitle"
                                    placeholder="Contact Title"
                                    value={newContact.contact_title}
                                    onChange={(e) => setNewContact({ ...newContact, contact_title: e.target.value })}
                                    className={styles.inputField}
                                />
                                <label htmlFor="editContactSubTitle">Contact Sub Title:</label>
                                <input
                                    type="text"
                                    id="editContactSubTitle"
                                    placeholder="Contact Sub Title"
                                    value={newContact.contact_subtitle}
                                    onChange={(e) => setNewContact({ ...newContact, contact_subtitle: e.target.value })}
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

                                <button onClick={updateContact} disabled={loading} className={styles.actionButton}>
                                    {loading ? "Updating..." : "Update Contact"}
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

export default ContactAdmin;