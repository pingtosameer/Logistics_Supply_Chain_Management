"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { useDriver } from "@/components/DriverContext";
import { getAllShipments } from "@/lib/data";

export default function DriversPage() {
    const { drivers, removeDriver, assignShipmentToDriver } = useDriver();
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [shipmentIdInput, setShipmentIdInput] = useState('');
    const [assignError, setAssignError] = useState('');
    const [expandedRegions, setExpandedRegions] = useState({});

    const toggleRegion = (regionName) => {
        setExpandedRegions(prev => ({
            ...prev,
            [regionName]: !prev[regionName]
        }));
    };

    const handleAssignClick = (driver) => {
        setSelectedDriver(driver);
        setShipmentIdInput('');
        setAssignError('');
        setAssignModalOpen(true);
    };

    const handleAssignSubmit = async (e) => {
        e.preventDefault();
        if (selectedDriver && shipmentIdInput.trim()) {
            const trimmedInput = shipmentIdInput.trim();

            // 1. Verify if this shipment is already assigned to a DIFFERENT driver
            const existingDriver = drivers.find(d =>
                d.id !== selectedDriver.id &&
                (d.recentAssignments || []).some(a => a.id === trimmedInput)
            );

            if (existingDriver) {
                setAssignError(`Shipment is already assigned to ${existingDriver.name} (${existingDriver.id}).`);
                return;
            }

            // 2. VERIFY SHIPMENT EXISTS IN DATABASE / LOCAL STORAGE 
            let shipmentData = null;
            let shipmentStatus = null;

            // Check local overrides first
            const localShipments = JSON.parse(localStorage.getItem('local_shipments') || '[]');
            const localMatch = localShipments.find(s => s.id === trimmedInput);

            if (localMatch) {
                shipmentData = localMatch;
                shipmentStatus = localMatch.status;
            } else {
                // Check server shipments dynamically 
                try {
                    const dbShipments = await getAllShipments();
                    const dbMatch = dbShipments.find(s => s.id === trimmedInput);
                    if (dbMatch) {
                        shipmentData = dbMatch;
                        shipmentStatus = dbMatch.status;
                    }
                } catch (error) {
                    console.error("Error verifying shipment:", error);
                }
            }

            if (!shipmentData) {
                setAssignError(`Invalid Tracking Number. Could not find shipment in database.`);
                return;
            }

            if (shipmentStatus === 'Delivered') {
                setAssignError(`Cannot assign shipment ${trimmedInput} because it is already Delivered.`);
                return;
            }

            // 3. REGION VALIDATION
            const driverRegion = selectedDriver.region || "";
            const shipmentOrigin = shipmentData.origin || "";
            const shipmentDest = shipmentData.destination || "";
            const shipmentLoc = shipmentData.currentLocation || "";

            if (driverRegion && driverRegion !== "Other" && !(
                shipmentOrigin.toLowerCase().includes(driverRegion.toLowerCase()) ||
                shipmentDest.toLowerCase().includes(driverRegion.toLowerCase()) ||
                shipmentLoc.toLowerCase().includes(driverRegion.toLowerCase())
            )) {
                setAssignError(`Region Mismatch: Driver is in ${driverRegion}. Shipment route is ${shipmentOrigin} to ${shipmentDest}.`);
                return;
            }

            // Assign shipment to the driver using context with its actual status
            assignShipmentToDriver(selectedDriver.id, trimmedInput, shipmentStatus || 'In Transit');
            setAssignModalOpen(false);
            setSelectedDriver(null);
            setAssignError('');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Driver Fleet</h1>
                <Link href="/dashboard/drivers/add" className={styles.addButton}>+ Add Driver</Link>
            </div>

            {Object.entries(drivers.reduce((acc, driver) => {
                const region = driver.region || "Other";
                if (!acc[region]) acc[region] = [];
                acc[region].push(driver);
                return acc;
            }, {})).map(([region, regionDrivers]) => {
                const totalRegionShipments = regionDrivers.reduce((acc, driver) => acc + (driver.recentAssignments?.length || 0), 0);
                const totalRegionDelivered = regionDrivers.reduce((acc, driver) => acc + (driver.recentAssignments?.filter(a => a.status === 'Delivered').length || 0), 0);

                let performance = "New / N/A";
                let perfColor = "var(--color-text-muted)";
                let perfBg = "transparent";

                if (totalRegionShipments > 0) {
                    const deliveryRate = totalRegionDelivered / totalRegionShipments;
                    const percentStr = `(${Math.round(deliveryRate * 100)}%)`;
                    if (deliveryRate >= 0.8) {
                        performance = `Good 🎉 ${percentStr}`;
                        perfColor = "#10b981"; // emerald-500
                        perfBg = "rgba(16, 185, 129, 0.1)";
                    } else if (deliveryRate >= 0.5) {
                        performance = `Satisfactory 👍 ${percentStr}`;
                        perfColor = "var(--color-primary)"; // cyan
                        perfBg = "rgba(6, 182, 212, 0.1)";
                    } else if (deliveryRate >= 0.2) {
                        performance = `Moderate ⚠️ ${percentStr}`;
                        perfColor = "#f59e0b"; // amber-500
                        perfBg = "rgba(245, 158, 11, 0.1)";
                    } else {
                        performance = `Poor 🚨 ${percentStr}`;
                        perfColor = "#ef4444"; // red-500
                        perfBg = "rgba(239, 68, 68, 0.1)";
                    }
                }

                const isExpanded = expandedRegions[region] === true; // Default to closed

                return (
                    <div key={region} style={{ marginBottom: '2.5rem' }}>
                        <div
                            className={styles.regionHeader}
                            onClick={() => toggleRegion(region)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '1.2rem', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s', display: 'inline-block' }}>▶</span>
                                    <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text)', margin: 0 }}>{region} Region</h2>
                                </div>
                                <span style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#4b5563', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600 }}>
                                    Total Shipments: {totalRegionShipments}
                                </span>
                                <span style={{ background: perfBg, color: perfColor, padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600 }}>
                                    Performance: {performance}
                                </span>
                            </div>
                            <span style={{ background: 'var(--color-primary-light)', color: 'var(--color-surface)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600 }}>
                                Total Drivers: {regionDrivers.length}
                            </span>
                        </div>
                        {isExpanded && (
                            <div className={styles.grid}>
                                {regionDrivers.map((driver) => {
                                    const assignments = driver.recentAssignments || [];
                                    const deliveredCount = assignments.filter(a => a.status === 'Delivered').length;
                                    const openCount = assignments.length - deliveredCount;

                                    return (
                                        <div key={driver.id} className={styles.card}>
                                            <div className={styles.cardHeader}>
                                                <div className={styles.avatar}>{driver.name.charAt(0)}</div>
                                                <div style={{ flex: 1 }}>
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
                                                {driver.experience && (
                                                    <div className={styles.row}>
                                                        <span>Experience:</span>
                                                        <strong>{driver.experience} Years</strong>
                                                    </div>
                                                )}
                                                <div className={styles.row}>
                                                    <span>Phone:</span>
                                                    <strong>{driver.phone}</strong>
                                                </div>
                                                <div className={styles.row}>
                                                    <span>Alt. Phone:</span>
                                                    <strong>{driver.altPhone || "N/A"}</strong>
                                                </div>
                                                <div className={styles.row}>
                                                    <span>Total Shipments:</span>
                                                    <strong>{assignments.length}</strong>
                                                </div>
                                                <div className={styles.row}>
                                                    <span>Open Shipments:</span>
                                                    <strong style={{ color: 'var(--color-primary)' }}>{openCount}</strong>
                                                </div>
                                                <div className={styles.row}>
                                                    <span>Delivered:</span>
                                                    <strong style={{ color: 'var(--color-success)' }}>{deliveredCount}</strong>
                                                </div>
                                            </div>
                                            <div className={styles.actions}>
                                                <Link href={`/dashboard/drivers/${driver.id}`} className={styles.actionBtn}>
                                                    View Summary
                                                </Link>

                                                <button className={styles.actionBtn} onClick={() => handleAssignClick(driver)}>
                                                    Assign
                                                </button>

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
                                                        border: '1px solid #fecaca',
                                                        flex: '0 0 auto',
                                                        padding: 'var(--spacing-sm)'
                                                    }}
                                                    title="Delete Driver"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}

            {assignModalOpen && selectedDriver && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div className={styles.card} style={{ width: '100%', maxWidth: '400px' }}>
                        <h3 className={styles.title} style={{ marginBottom: '1rem' }}>Assign Shipment to {selectedDriver.name}</h3>
                        <form onSubmit={handleAssignSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Shipment ID / Tracking Number</label>
                                <input
                                    type="text"
                                    value={shipmentIdInput}
                                    onChange={(e) => {
                                        setShipmentIdInput(e.target.value);
                                        setAssignError('');
                                    }}
                                    placeholder="e.g. TRK-IN-123456"
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                    required
                                />
                                {assignError && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.5rem' }}>{assignError}</p>}
                            </div>
                            <div className={styles.actions} style={{ justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setAssignModalOpen(false)} style={{
                                    padding: '0.5rem 1rem', background: 'none', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer'
                                }}>Cancel</button>
                                <button type="submit" className={styles.addButton} style={{ padding: '0.5rem 1rem' }}>Assign Shipment</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
