"use client";

import styles from "./page.module.css";
import Link from "next/link";
import CallDriverButton from "@/components/CallDriverButton";
import { useDriver } from "@/components/DriverContext";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DriverProfile() {
    const params = useParams();
    const { drivers } = useDriver();
    const [driver, setDriver] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params?.id && drivers.length > 0) {
            const foundDriver = drivers.find(d => d.id === params.id);
            setDriver(foundDriver);
            setLoading(false);
        }
    }, [params, drivers]);

    if (loading) {
        return <div className={styles.loading}>Loading driver profile...</div>;
    }

    if (!driver) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <h1>Driver Not Found</h1>
                    <Link href="/dashboard/drivers" className={styles.backLink}>← Back to Fleet</Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Link href="/dashboard/drivers" className={styles.backLink}>← Back to Fleet</Link>

            <div className={styles.header}>
                <div className={styles.profileHeader}>
                    <div className={styles.avatar}>{driver.name.charAt(0)}</div>
                    <div>
                        <h1 className={styles.name}>{driver.name}</h1>
                        <p className={styles.id}>ID: {driver.id}</p>
                    </div>
                </div>
                <div className={styles.headerActions}>
                    <span className={`${styles.status} ${styles[driver.status.toLowerCase().replace(' ', '')]}`}>
                        {driver.status}
                    </span>
                    <CallDriverButton phone={driver.phone} />
                </div>
            </div>

            <div className={styles.grid}>
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Vehicle Details</h3>
                    <div className={styles.detailRow}>
                        <span>Vehicle Model</span>
                        <strong>{driver.vehicle ? driver.vehicle.split('-')[0] : "N/A"}</strong>
                    </div>
                    <div className={styles.detailRow}>
                        <span>Plate Number</span>
                        <strong>{driver.vehicle && driver.vehicle.includes('-') ? driver.vehicle.split('-')[1] : "N/A"}</strong>
                    </div>
                </div>

                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Performance</h3>
                    <div className={styles.detailRow}>
                        <span>Rating</span>
                        <strong className={styles.rating}>★ {driver.rating || "New"}</strong>
                    </div>
                    <div className={styles.detailRow}>
                        <span>Total Deliveries</span>
                        <strong>{driver.totalDeliveries || 0}</strong>
                    </div>
                </div>

                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Contact Info</h3>
                    <div className={styles.detailRow}>
                        <span>Phone</span>
                        <strong>{driver.phone}</strong>
                    </div>
                    <div className={styles.detailRow}>
                        <span>Email</span>
                        <strong>{driver.email || "N/A"}</strong>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Recent Assignments</h2>
                {driver.recentAssignments && driver.recentAssignments.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Shipment ID</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {driver.recentAssignments.map(assignment => (
                                <tr key={assignment.id}>
                                    <td data-label="Shipment ID">{assignment.id}</td>
                                    <td data-label="Date">{assignment.date}</td>
                                    <td data-label="Status"><span className={styles.tag}>{assignment.status}</span></td>
                                    <td data-label="Action"><Link href={`/dashboard/shipments/${assignment.id}?returnTo=/dashboard/drivers/${driver.id}`} className={styles.link}>View</Link></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.emptyState}>
                        <p>No recent assignments found for this driver.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
