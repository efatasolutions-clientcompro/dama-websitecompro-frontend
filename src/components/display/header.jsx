// header.jsx
import React from 'react';
import styles from './header.module.css';

const Header = () => {
    const goToHome = () => {
        window.location.href = "/";
    };

    const toggleNavMobile = () => {
        const navMobile = document.querySelector(`.${styles.navMobile}`);
        navMobile.classList.toggle(styles.active);
    };

    return (
        <header className={styles.header}>
            <div className={styles.headerContainer}>
                <nav className={styles.navLeft}>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/about">About Us</a></li>
                        <li className={styles.dropdown}>
                            <a href="/services">Service</a>
                            <div className={styles.dropdownContent}>
                                <a href="/services/individual">Individual</a>
                                <a href="/services/special">Special</a>
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
                        <li><a href="/blog">Blog</a></li>
                        <li><a href="/contact">Contact Us</a></li>
                    </ul>
                </nav>

                <div className={styles.hamburger} onClick={toggleNavMobile}>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                </div>

                <nav className={styles.navMobile}>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/about">About Us</a></li>
                        <li className={styles.dropdown}>
                            <a href="/services">Service</a>
                            <div className={styles.dropdownContent}>
                                <a href="/services/individual">Individual</a>
                                <a href="/services/special">Special</a>
                            </div>
                        </li>
                        <li><a href="/works">Our Works</a></li>
                        <li><a href="/blog">Blog</a></li>
                        <li><a href="/contact">Contact Us</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;