// header.jsx
import React, { useEffect } from 'react';
import styles from './header.module.css';

const Header = () => {
    const goToHome = () => {
        window.location.href = "/";
    };

    const toggleNavMobile = () => {
        const navMobile = document.querySelector(`.${styles.navMobile}`);
        const hamburger = document.querySelector(`.${styles.hamburger}`);
        navMobile.classList.toggle(styles.active);
        hamburger.classList.toggle(styles.active);
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            const navMobile = document.querySelector(`.${styles.navMobile}`);
            const hamburger = document.querySelector(`.${styles.hamburger}`);

            if (navMobile && navMobile.classList.contains(styles.active) &&
                !navMobile.contains(event.target) &&
                !hamburger.contains(event.target) &&
                event.target !== hamburger) {
                navMobile.classList.remove(styles.active);
                hamburger.classList.remove(styles.active);
            }
        };

        const handleScroll = () => {
            const navMobile = document.querySelector(`.${styles.navMobile}`);
            const hamburger = document.querySelector(`.${styles.hamburger}`);

            if (navMobile && navMobile.classList.contains(styles.active)) {
                navMobile.classList.remove(styles.active);
                hamburger.classList.remove(styles.active);
            }
        };

        document.addEventListener('click', handleOutsideClick);
        window.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header className={styles.header}>
            <div className={styles.headerContainer}>
                <nav className={styles.navLeft}>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/about">About Us</a></li>
                        <li className={styles.dropdown}>
                            <a href="/services">Services</a>
                            <div className={styles.dropdownContent}>
                                <a href="/services/individual">Individual Services</a>
                                <a href="/services/special">Special Packages</a>
                            </div>
                        </li>
                    </ul>
                </nav>

                <div className={styles.logo} onClick={goToHome}>
                    <img src="/logoa.png" alt="Your Logo" />
                </div>

                <nav className={styles.navRight}>
                    <ul>
                        <li><a href="/works">Our Works</a></li>
                        <li><a href="/blogs">Blog</a></li>
                        <li><a href="/contact">Contact Us</a></li>
                    </ul>
                </nav>

                <div className={`${styles.hamburger}`} onClick={toggleNavMobile}>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                </div>

                <nav className={`${styles.navMobile}`}>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/about">About Us</a></li>
                        <li className={styles.dropdown}>
                            <a href="/services">Services</a>
                            <div className={styles.dropdownContent}>
                                <a href="/services/individual">Individual Services</a>
                                <a href="/services/special">Special Packages</a>
                            </div>
                        </li>
                        <li><a href="/works">Our Works</a></li>
                        <li><a href="/blogs">Blog</a></li>
                        <li><a href="/contact">Contact Us</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;