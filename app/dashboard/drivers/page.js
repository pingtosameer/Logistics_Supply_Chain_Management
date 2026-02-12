"use client";

import styles from "./page.module.css";
import Link from "next/link";
import { useDriver } from "@/components/DriverContext";

export default function DriversPage() {
    const { drivers, removeDriver } = useDriver();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Driver Fleet</h1>
                <Link href="/dashboard/drivers/add" className={styles.addButton}>+ Add Driver</Link>
            </div>

            <div className={styles.grid}>
                {drivers.map((driver) => (
                    <div key={driver.id} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.avatar}>{driver.name.charAt(0)}</div>
                            <div>
                                <h3 className={styles.name}>{driver.name}</h3>
                                <p className={styles.id}>{driver.id}</p>
                            </div>
                            <span className={`${styles.status} ${styles[driver.status.toLowerCase().replace(' ', '')]}`}>
                                {driver.status}
                            </span>
                        </div>
                        <div className={styles.details}>
                            <div className={styles.row}>
                                <span>Vehicle:</span>
                                <strong>{driver.vehicle}</strong>
                            </div>
                            <div className={styles.row}>
                                <span>Location:</span>
                                <strong>{driver.location || "N/A"}</strong>
                            </div>
                            <div className={styles.row}>
                                <span>Phone:</span>
                                <strong>{driver.phone}</strong>
                            </div>
                            <div className={styles.row}>
                                <span>Alt. Phone:</span>
                                <strong>{driver.altPhone || "N/A"}</strong>
                            </div>
                        </div>
                        <div className={styles.actions}>
                            <Link href={`/dashboard/drivers/${driver.id}`} className={styles.actionBtn}>
                                View Profile
                            </Link>
                            <Link href="/tracking/TRK-IN-849201?returnTo=/dashboard/drivers" className={`${styles.actionBtn} ${styles.trackBtn}`}>
                                Track
                            </Link>
                            <button
                                onClick={() => {
                                    if (confirm('Are you sure you want to remove this driver?')) {
                                        removeDriver(driver.id);
                                    }
                                }}
                                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                style={{
                                    backgroundColor: '#fee2e2',
                                    color: '#dc2626',
                                    border: '1px solid #fecaca'
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
