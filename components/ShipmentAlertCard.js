"use client";

import styles from "./DashboardBottomCards.module.css";
import Link from "next/link";

export default function ShipmentAlertCard() {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Shipment Alert</h3>
            </div>

            <div className={styles.alertBox}>
                <h4 className={styles.alertType}>Open Weight Discrepencies</h4>
                <div className={styles.alertContent}>
                    <div>
                        <span className={styles.countText}>Count - 0</span>
                        <p className={styles.expiringText}>0 Discrepancy Expiring Today</p>
                    </div>
                    <button className={styles.actionBtn}>Take Action</button>
                </div>
            </div>

            <div className={styles.alertBox}>
                <h4 className={styles.alertType}>Stuck Shipment Details</h4>
                <div className={styles.alertContent}>
                    <div>
                        <span className={styles.countTextCyan}>Count - 0</span>
                    </div>
                    <button className={styles.actionBtn}>View</button>
                </div>
            </div>
        </div>
    );
}
