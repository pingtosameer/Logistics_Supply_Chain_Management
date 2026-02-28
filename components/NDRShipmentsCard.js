"use client";

import styles from "./DashboardCards.module.css";
import Link from "next/link";

export default function NDRShipmentsCard({ rto = 0, missingAppt = 0, missingContact = 0 }) {
    return (
        <div className={`${styles.card} ${styles.blueBorder}`}>
            <h3 className={styles.cardTitle}>NDR Shipments</h3>
            <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                    <p className={styles.statValueBlue}>{rto}</p>
                    <p className={styles.statLabel}>RTO/ Reattempt</p>
                </div>
                <div className={styles.statItem}>
                    <p className={styles.statValueBlue}>{missingAppt}</p>
                    <p className={styles.statLabel}>Missing Appointment</p>
                </div>
                <div className={styles.statItem}>
                    <p className={styles.statValueBlue}>{missingContact}</p>
                    <p className={styles.statLabel}>Missing Contact Details</p>
                </div>
            </div>
            <div className={styles.cardFooter} style={{ justifyContent: 'flex-end' }}>
                <Link href="#" className={styles.footerLink}>
                    <span>👁️ View shipment</span>
                </Link>
            </div>
        </div>
    );
}
