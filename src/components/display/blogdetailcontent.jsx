import React from 'react';
import styles from './BlogDetailContent.module.css';

const BlogDetailContent = ({ blog }) => {
  return (
    <div className={styles.blogDetailContainer}>
      <div className={styles.contentWrapper}>
        <h1 className={styles.blogTitle}>{blog.title}</h1>
        <div className={styles.meta}>
          <p className={styles.author}>{blog.author_name}</p>
          <p className={styles.date}>
            {new Date(blog.published_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
        {blog.cover_image && (
          <img src={blog.cover_image} alt={blog.title} className={styles.coverImage} />
        )}
        <div className={styles.blogContent} dangerouslySetInnerHTML={{ __html: blog.content }} />
        {blog.image_list && blog.image_list.length > 0 && (
          <div className={styles.imageList}>
            {blog.image_list.map((image, index) => (
              <div key={index} className={styles.imageItemWrapper}>
                <img src={image} alt={`Image ${index + 1}`} className={styles.imageItem} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetailContent;