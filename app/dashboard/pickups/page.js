"use client";

import styles from "./page.module.css";
import { useState, useEffect } from "react";
import AssignDriverModal from "@/components/AssignDriverModal";
import { useDriver } from "@/components/DriverContext";

export default function PickupsPage() {
    const { drivers, assignShipmentToDriver } = useDriver();
    const [pickups, setPickups] = useState([]);
    const [selectedPickup, setSelectedPickup] = useState(null);
    const [detailsPickup, setDetailsPickup] = useState(null);

    // 5 sample open pickup assignments
    const initialPickups = [
        {
            id: "PU-10023",
            vendorName: "TechCorp Suppliers",
            location: "123 Industrial Pkwy, Mumbai",
            requestDate: "Oct 24, 2024",
            requestTime: "14:00 - 18:00",
            items: 45,
            status: "Shipment Created & Pick Up Pending"
        },
        {
            id: "PU-10024",
            vendorName: "Global Imports Ltd",
            location: "Warehouse 4A, Delhi",
            requestDate: "Oct 25, 2024",
            requestTime: "09:00 - 12:00",
            items: 12,
            status: "Shipment Created & Pick Up Pending"
        },
        {
            id: "PU-10025",
            vendorName: "FastFashion Apparel",
            location: "Sector 14, Gurugram",
            requestDate: "Oct 24, 2024",
            requestTime: "16:00 - 19:00",
            items: 150,
            status: "Shipment Created & Pick Up Pending"
        },
        {
            id: "PU-10026",
            vendorName: "ElecTronics City",
            location: "IT Park Block C, Bangalore",
            requestDate: "Oct 24, 2024",
            requestTime: "10:00 - 13:00",
            items: 8,
            status: "Shipment Created & Pick Up Pending"
        },
        {
            id: "PU-10027",
            vendorName: "Books & More Dist.",
            location: "Central Market, Pune",
            requestDate: "Oct 25, 2024",
            requestTime: "14:00 - 17:00",
            items: 300,
            status: "Shipment Created & Pick Up Pending"
        }
    ];

    useEffect(() => {
        const fetchLocalPickups = () => {
            const localShipments = JSON.parse(localStorage.getItem('local_shipments') || '[]');

            // Filter local shipments that are pending and NOT already assigned to a driver
            const unassignedLocalShipments = localShipments.filter(s => {
                if (s.status !== "Shipment Created & Pick Up Pending") return false;

                // Check if this shipment ID is already in any driver's recentAssignments
                const isAssigned = drivers.some(d =>
                    (d.recentAssignments || []).some(a => a.id === s.id)
                );

                return !isAssigned;
            });

            const localPickups = unassignedLocalShipments.map(s => {
                // Parse a mock date/time from the event date or just use a default
                const eventDate = s.events && s.events.length > 0 ? new Date(s.events[0].date) : new Date();

                return {
                    id: s.id,
                    vendorName: s.sender,
                    location: s.origin, // e.g. "Mumbai"
                    requestDate: eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    requestTime: "ASAP",
                    items: 1, // Defaulting to 1 for locally tracked mock logic
                    status: s.status,
                    isLocalShipment: true // Flag to identify shipments from localStorage
                };
            });

            // Filter initialPickups to also remove ones that might have been assigned
            const unassignedInitialPickups = initialPickups.filter(p => {
                const isAssigned = drivers.some(d =>
                    (d.recentAssignments || []).some(a => a.id === p.id)
                );
                return !isAssigned;
            });

            // Merge unique entries (local takes precedence if ID collision exists)
            const pickupMap = new Map();
            [...unassignedInitialPickups, ...localPickups].forEach(p => pickupMap.set(p.id, p));
            setPickups(Array.from(pickupMap.values()));
        };

        fetchLocalPickups();
    }, [drivers]); // Re-run when drivers change to update the list if assignment happened elsewhere

    const handleOpenAssignModal = (pickup) => {
        // Extract city from the location string (e.g. "123 Industrial Pkwy, Mumbai" -> "Mumbai")
        const locationParts = pickup.location.split(',');
        const regionHint = locationParts.length > 1 ? locationParts[locationParts.length - 1].trim() : pickup.location.trim();

        // Create a synthetic shipment object that AssignDriverModal expects
        const mockShipmentData = {
            id: pickup.id,
            origin: regionHint, // Used for driver filtering by Region
            destination: regionHint, // Same as origin for pickups
        };

        setSelectedPickup({ original: pickup, mockShipment: mockShipmentData });
    };

    const handleAssignClose = () => {
        if (selectedPickup) {
            // Let's check if it actually got assigned
            const isAssigned = drivers.some(d =>
                (d.recentAssignments || []).some(a => a.id === selectedPickup.original.id)
            );

            if (isAssigned) {
                // Update local storage status
                if (selectedPickup.original.isLocalShipment) {
                    const localShipments = JSON.parse(localStorage.getItem('local_shipments') || '[]');
                    const updatedShipments = localShipments.map(s => {
                        if (s.id === selectedPickup.original.id) {
                            return {
                                ...s,
                                status: "Pickup Done", // Update status
                                events: [
                                    {
                                        date: new Date().toISOString(),
                                        status: "Pickup Done",
                                        location: s.origin,
                                        description: "Driver assigned for pickup"
                                    },
                                    ...(s.events || [])
                                ]
                            };
                        }
                        return s;
                    });
                    localStorage.setItem('local_shipments', JSON.stringify(updatedShipments));
                }

                // Remove from local state
                setPickups(pickups.filter(p => p.id !== selectedPickup.original.id));
            }
        }
        setSelectedPickup(null);
    };

    const getRegion = (locationStr) => {
        const parts = locationStr.split(',');
        return parts.length > 1 ? parts[parts.length - 1].trim() : locationStr.trim();
    };

    return (
        <div className={styles.container}>
            <div className={styles.header} style={{ marginBottom: '1.5rem' }}>
                <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
                    Active vendor pickup requests waiting for assignment.
                </p>
            </div>

            <div className={styles.grid}>
                {pickups.map(pickup => (
                    <div key={pickup.id} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.vendorName}>{pickup.vendorName}</span>
                            <span className={styles.pickupStatus} style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
                                {getRegion(pickup.location)}
                            </span>
                        </div>
                        <div className={styles.details}>
                            <div className={styles.row}>
                                <span>Ref ID</span>
                                <strong>{pickup.id}</strong>
                            </div>
                            <div className={styles.row}>
                                <span>Date</span>
                                <strong>{pickup.requestDate}</strong>
                            </div>
                            <div className={styles.row}>
                                <span>Time Window</span>
                                <strong>{pickup.requestTime}</strong>
                            </div>
                            <div className={styles.row}>
                                <span>Location</span>
                                <strong style={{ textAlign: 'right', maxWidth: '150px' }}>{pickup.location}</strong>
                            </div>
                            <div className={styles.row}>
                                <span>Total Items</span>
                                <strong>{pickup.items} boxes</strong>
                            </div>
                        </div>
                        <div className={styles.actions}>
                            <button
                                className={styles.actionBtn}
                                onClick={() => setDetailsPickup(pickup)}
                            >
                                View Details
                            </button>
                            <button
                                className={`${styles.actionBtn} ${styles.primaryBtn}`}
                                onClick={() => handleOpenAssignModal(pickup)}
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

            {selectedPickup && (
                <AssignDriverModal
                    shipment={selectedPickup.mockShipment}
                    currentDriver={null}
                    onClose={handleAssignClose}
                />
            )}

            {detailsPickup && (
                <div className={styles.overlay} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div style={{ background: 'var(--color-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', width: '90%', maxWidth: '500px' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Pickup Details</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <p><strong>Ref ID:</strong> {detailsPickup.id}</p>
                            <p><strong>Vendor Name:</strong> {detailsPickup.vendorName}</p>
                            <p><strong>Exact Location:</strong> {detailsPickup.location}</p>
                            <p><strong>Region:</strong> {getRegion(detailsPickup.location)}</p>
                            <p><strong>Date:</strong> {detailsPickup.requestDate}</p>
                            <p><strong>Time Window:</strong> {detailsPickup.requestTime}</p>
                            <p><strong>Total Items:</strong> {detailsPickup.items} boxes</p>
                            <p><strong>Status:</strong> {detailsPickup.status}</p>
                        </div>
                        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button
                                onClick={() => setDetailsPickup(null)}
                                style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', cursor: 'pointer', background: 'transparent' }}
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    setDetailsPickup(null);
                                    handleOpenAssignModal(detailsPickup);
                                }}
                                style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', background: 'var(--color-primary)', color: 'white', fontWeight: 600 }}
                            >
                                Assign Driver
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
