"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function SettingsPage() {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    // Effect to check system preference or saved state on mount
    useEffect(() => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        setDarkMode(isDark);
    }, []);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
    };

    const [autoAssignment, setAutoAssignment] = useState(true);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>System Settings</h1>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>General Preferences</h2>
                <div className={styles.settingRow}>
                    <div className={styles.settingInfo}>
                        <h3>Enable Notifications</h3>
                        <p>Receive real-time alerts for package delays</p>
                    </div>
                    <button
                        className={`${styles.toggle} ${notifications ? styles.active : ''}`}
                        onClick={() => setNotifications(!notifications)}
                    >
                        <div className={styles.knob}></div>
                    </button>
                </div>
                <div className={styles.settingRow}>
                    <div className={styles.settingInfo}>
                        <h3>Dark Mode</h3>
                        <p>Use dark theme for the dashboard</p>
                    </div>
                    <button
                        className={`${styles.toggle} ${darkMode ? styles.active : ''}`}
                        onClick={toggleDarkMode}
                    >
                        <div className={styles.knob}></div>
                    </button>
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Automation Rules</h2>
                <div className={styles.settingRow}>
                    <div className={styles.settingInfo}>
                        <h3>Auto-Assign Drivers</h3>
                        <p>Automatically assign nearest driver to pickup</p>
                    </div>
                    <button
                        className={`${styles.toggle} ${autoAssignment ? styles.active : ''}`}
                        onClick={() => setAutoAssignment(!autoAssignment)}
                    >
                        <div className={styles.knob}></div>
                    </button>
                </div>
            </div>
        </div>
    );
}
