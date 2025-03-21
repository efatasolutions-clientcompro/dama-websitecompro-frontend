import React, { useState, useEffect, useRef } from "react";
import styles from "./taglineDisplay.module.css";

const TaglineDisplay = () => {
  const [taglines, setTaglines] = useState([]);
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextTaglineIndex, setNextTaglineIndex] = useState(1);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const animationFrameRef = useRef(0);

  useEffect(() => {
    const fetchTaglines = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://dama-backend.vercel.app/taglines");
        if (response.ok) {
          const data = await response.json();
          setTaglines(data);
        } else {
          throw new Error("Failed to fetch taglines.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTaglines();
  }, []);

  useEffect(() => {
    const transitionInterval = 5000;
    const transitionDuration = 2000;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTransitionProgress(0);
      animateTransition(transitionDuration);
    }, transitionInterval);

    return () => clearInterval(interval);
  }, [taglines, nextTaglineIndex]);

  const animateTransition = (duration) => {
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const normalizedProgress = Math.min(progress / duration, 1);

      setTransitionProgress(normalizedProgress);

      if (progress < duration) {
        animationFrameRef.current = requestAnimationFrame(step);
      } else {
        setCurrentTaglineIndex(nextTaglineIndex);
        setNextTaglineIndex((prevIndex) => (prevIndex + 1) % taglines.length);
        setIsTransitioning(false);
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading taglines...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  const currentTagline = taglines[currentTaglineIndex];
  const nextTagline = taglines[nextTaglineIndex];

  return (
    <div className={styles.taglineContainer}>
      <div
        className={styles.backgroundImage}
        style={{
          opacity: isTransitioning ? 1 - transitionProgress : 1,
          zIndex: isTransitioning ? 1 : 0,
          transition: isTransitioning ? "opacity 2s ease-in-out" : "none",
          willChange: "opacity",
        }}
      >
        <img src={currentTagline.tagline_img} alt={currentTagline.tagline_text} />
      </div>
      <div
        className={styles.backgroundImage}
        style={{
          opacity: isTransitioning ? transitionProgress : 0,
          zIndex: isTransitioning ? 2 : 0,
          transition: isTransitioning ? "opacity 2s ease-in-out" : "none",
          willChange: "opacity",
        }}
      >
        <img src={nextTagline.tagline_img} alt={nextTagline.tagline_text} />
      </div>
      <div className={styles.taglineContent}>
        <h2>{currentTagline.tagline_text}</h2>
        <p>{currentTagline.tagline_sub_text}</p>
        <a href="/services" className={styles.servicesButton}>
          Our Services
        </a>
      </div>
    </div>
  );
};

export default TaglineDisplay;