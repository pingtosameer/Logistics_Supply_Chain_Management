"use client";

import styles from "./DashboardBanner.module.css";
import Image from "next/image";

export default function DashboardBanner() {
    return (
        <div className={styles.bannerContainer}>
            <div className={styles.content}>
                <h2 className={styles.title}>Experience the Convenience of Appointment-Based Delivery!</h2>
                <p className={styles.subtitle}>No more waiting around—schedule your delivery for a time that fits your schedule.</p>
            </div>
            <div className={styles.action}>
                <button className={styles.scheduleBtn}>Schedule Now</button>
            </div>
        </div>
    );
}
