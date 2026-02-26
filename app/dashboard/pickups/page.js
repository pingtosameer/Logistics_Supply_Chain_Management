"use client";

import styles from "./page.module.css";
import { useState, useEffect } from "react";

export default function PickupsPage() {
    // 5 sample open pickup assignments
    const initialPickups = [
        {
            id: "PU-10023",
            vendorName: "TechCorp Suppliers",
            location: "123 Industrial Pkwy, Mumbai",
            requestedTime: "Today, 14:00 - 18:00",
            items: 45,
            status: "Shipment Created & Pick Up Pending"
        },
        {
            id: "PU-10024",
            vendorName: "Global Imports Ltd",
            location: "Warehouse 4A, Delhi",
            requestedTime: "Tomorrow, 09:00 - 12:00",
            items: 12,
            status: "Shipment Created & Pick Up Pending"
        },
        {
            id: "PU-10025",
            vendorName: "FastFashion Apparel",
            location: "Sector 14, Gurugram",
            requestedTime: "Today, 16:00 - 19:00",
            items: 150,
            status: "Shipment Created & Pick Up Pending"
        },
        {
            id: "PU-10026",
            vendorName: "ElecTronics City",
            location: "IT Park Block C, Bangalore",
            requestedTime: "Today, 10:00 - 13:00",
            items: 8,
            status: "Shipment Created & Pick Up Pending"
        },
        {
            id: "PU-10027",
            vendorName: "Books & More Dist.",
            location: "Central Market, Pune",
            requestedTime: "Tomorrow, 14:00 - 17:00",
            items: 300,
            status: "Shipment Created & Pick Up Pending"
        }
    ];

    const [pickups, setPickups] = useState(initialPickups);

    useEffect(() => {
        const fetchLocalPickups = () => {
            const localShipments = JSON.parse(localStorage.getItem('local_shipments') || '[]');
            const localPickups = localShipments
                .filter(s => s.status === "Shipment Created & Pick Up Pending")
                .map(s => ({
                    id: s.id,
                    vendorName: s.sender,
                    location: s.origin,
                    requestedTime: "ASAP",
                    items: 1, // Defaulting to 1 for locally tracked mock logic
                    status: s.status
                }));

            // Merge unique entries (local takes precedence if ID collision exists)
            const pickupMap = new Map();
            [...initialPickups, ...localPickups].forEach(p => pickupMap.set(p.id, p));
            setPickups(Array.from(pickupMap.values()));
        };

        fetchLocalPickups();
    }, []);

    const handleAccept = (id) => {
        setPickups(pickups.filter(p => p.id !== id));
        alert(`Pickup ${id} accepted! Driver dispatched.`);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Open Pickups</h1>
                <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                    Active vendor pickup requests waiting for assignment.
                </p>
            </div>

            <div className={styles.grid}>
                {pickups.map(pickup => (
                    <div key={pickup.id} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.vendorName}>{pickup.vendorName}</span>
                            <span className={styles.pickupStatus}>{pickup.status}</span>
                        </div>
                        <div className={styles.details}>
                            <div className={styles.row}>
                                <span>Ref ID</span>
                                <strong>{pickup.id}</strong>
                            </div>
                            <div className={styles.row}>
                                <span>Location</span>
                                <strong style={{ textAlign: 'right', maxWidth: '150px' }}>{pickup.location}</strong>
                            </div>
                            <div className={styles.row}>
                                <span>Time Window</span>
                                <strong>{pickup.requestedTime}</strong>
                            </div>
                            <div className={styles.row}>
                                <span>Total Items</span>
                                <strong>{pickup.items} boxes</strong>
                            </div>
                        </div>
                        <div className={styles.actions}>
                            <button className={styles.actionBtn}>View Details</button>
                            <button
                                className={`${styles.actionBtn} ${styles.primaryBtn}`}
                                onClick={() => handleAccept(pickup.id)}
                            >
                                Accept & Assign
                            </button>
                        </div>
                    </div>
                ))}

                {pickups.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)' }}>
                        <h3 style={{ color: 'var(--color-text-muted)' }}>No open pickups at this time!</h3>
                    </div>
                )}
            </div>
        </div>
    );
}
