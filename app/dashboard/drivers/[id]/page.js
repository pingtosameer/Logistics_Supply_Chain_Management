"use client";

import styles from "./page.module.css";
import Link from "next/link";
import CallDriverButton from "@/components/CallDriverButton";
import { useDriver } from "@/components/DriverContext";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getAllShipments } from "@/lib/data";

export default function DriverProfile() {
    const params = useParams();
    const { drivers } = useDriver();
    const [driver, setDriver] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateFilter, setDateFilter] = useState('all');

    useEffect(() => {
        const loadDriverDetails = async () => {
            if (params?.id && drivers.length > 0) {
                const foundDriver = drivers.find(d => d.id === params.id);
                if (foundDriver) {
                    try {
                        const localShipments = JSON.parse(localStorage.getItem('local_shipments') || '[]');
                        const dbShipments = await getAllShipments();

                        const updatedAssignments = foundDriver.recentAssignments?.map(assignment => {
                            const localMatch = localShipments.find(s => s.id === assignment.id);
                            if (localMatch) return { ...assignment, status: localMatch.status };

                            const dbMatch = dbShipments.find(s => s.id === assignment.id);
                            if (dbMatch) return { ...assignment, status: dbMatch.status };

                            return assignment;
                        });

                        setDriver({ ...foundDriver, recentAssignments: updatedAssignments || [] });
                    } catch (error) {
                        console.error("Error loading driver shipment details:", error);
                        setDriver(foundDriver);
                    }
                } else {
                    setDriver(null);
                }
                setLoading(false);
            }
        };

        loadDriverDetails();
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

    // Filter assignments by date
    const getFilteredAssignments = () => {
        if (!driver.recentAssignments) return [];

        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        const last7Days = new Date();
        last7Days.setDate(today.getDate() - 7);
        const last7Str = last7Days.toISOString().split('T')[0];

        const last30Days = new Date();
        last30Days.setDate(today.getDate() - 30);
        const last30Str = last30Days.toISOString().split('T')[0];

        return driver.recentAssignments.filter(assignment => {
            if (dateFilter === 'today') return assignment.date === todayStr;
            if (dateFilter === 'week') return assignment.date >= last7Str;
            if (dateFilter === 'month') return assignment.date >= last30Str;
            return true;
        });
    };

    const filteredAssignments = getFilteredAssignments();
    const deliveredCount = filteredAssignments.filter(a => a.status === 'Delivered').length;
    const openCount = filteredAssignments.length - deliveredCount;

    return (
        <div className={styles.container}>
            <Link href="/dashboard/drivers" className={styles.backLink}>← Back to Fleet</Link>

            <div className={styles.header}>
                <div className={styles.profileHeader}>
                    <div className={styles.avatar}>{driver.name.charAt(0)}</div>
                    <div>
                        <h1 className={styles.name}>{driver.name}</h1>
                        <p className={styles.id}>
                            ID: {driver.id}
                            {driver.region ? ` • ${driver.region} Region` : ''}
                            {driver.location ? ` • ${driver.location}` : ''}
                        </p>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 className={styles.cardTitle} style={{ margin: 0 }}>Summary ({dateFilter === 'all' ? 'All Time' : dateFilter === 'today' ? 'Today' : dateFilter === 'week' ? 'Last 7 Days' : 'This Month'})</h3>
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            style={{ padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '0.85rem' }}
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">Last 7 Days</option>
                            <option value="month">This Month</option>
                        </select>
                    </div>

                    <div className={styles.detailRow}>
                        <span>Rating</span>
                        <strong className={styles.rating}>★ {driver.rating || "New"}</strong>
                    </div>
                    {driver.experience && (
                        <div className={styles.detailRow}>
                            <span>Experience</span>
                            <strong>{driver.experience} Years</strong>
                        </div>
                    )}
                    <div className={styles.detailRow}>
                        <span>Total Shipments</span>
                        <strong style={{ color: 'var(--color-text)' }}>{filteredAssignments.length}</strong>
                    </div>
                    <div className={styles.detailRow}>
                        <span>Open Shipments</span>
                        <strong style={{ color: 'var(--color-primary)' }}>{openCount}</strong>
                    </div>
                    <div className={styles.detailRow}>
                        <span>Delivered Shipments</span>
                        <strong style={{ color: 'var(--color-success)' }}>{deliveredCount}</strong>
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
                <h2 className={styles.sectionTitle}>Assigned Shipments</h2>
                {filteredAssignments.length > 0 ? (
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
                            {filteredAssignments.map(assignment => (
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
                        <p>No assignments found for this timeframe.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
