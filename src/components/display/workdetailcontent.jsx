// components/WorkDetailContent.jsx
import React, { useState } from 'react';
import styles from './workdetailcontent.module.css';

const WorkDetailContent = ({ work }) => {
  const [selectedImage, setSelectedImage] = useState(work.work_main_img);

  return (
    <>
      <section className={styles['section-1']} style={{ backgroundImage: `url(${work.work_main_img})` }}>
        <h1>{work.work_title}</h1>
        <h2>{work.work_subtitle}</h2>
      </section>
      <section className={styles['section-2']}>
        {work.work_img.map((img) => (
          <img
            key={img}
            src={img}
            alt="Work Image"
            onClick={() => setSelectedImage(img)}
          />
        ))}
      </section>
      <section className={styles['section-3']}>
        <div className={styles['section-3-left']}>
          <img src={selectedImage} alt="Selected Work Image" />
        </div>
        <div className={styles['section-3-right']}>
          <p><strong>Description:</strong> {work.work_desc}</p>
          <p><strong>Detail:</strong> {work.work_detail}</p>
          <p><strong>Client:</strong> {work.work_people}</p>
          <p><strong>Category:</strong> {work.work_category}</p>
          {work.work_logo_img && (
            <img src={work.work_logo_img} alt="Work Logo" className={styles['work-logo']} />
          )}
        </div>
      </section>
    </>
  );
};

export default WorkDetailContent;