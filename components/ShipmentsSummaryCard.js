"use client";

import styles from "./DashboardCards.module.css";
import Link from "next/link";

export default function ShipmentsSummaryCard({ inTransit = 0, manifested = 0, delivered = 0 }) {
    return (
        <div className={`${styles.card} ${styles.cyanBorder}`}>
            <h3 className={styles.cardTitle}>Shipments</h3>
            <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                    <p className={styles.statValueCyan}>{inTransit}</p>
                    <p className={styles.statLabel}>In Transit</p>
                </div>
                <div className={styles.statItem}>
                    <p className={styles.statValueCyan}>{manifested}</p>
                    <p className={styles.statLabel}>Manifested</p>
                </div>
                <div className={styles.statItem}>
                    <p className={styles.statValueCyan}>{delivered}</p>
                    <p className={styles.statLabel}>Delivered</p>
                </div>
            </div>
            <div className={styles.cardFooter}>
                <Link href="#" className={styles.footerLink}>
                    <span>📦 Create shipment</span>
                </Link>
                <Link href="/dashboard/shipments" className={styles.footerLink}>
                    <span>👁️ View shipment</span>
                </Link>
            </div>
        </div>
    );
}
