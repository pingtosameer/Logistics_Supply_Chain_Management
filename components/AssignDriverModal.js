"use client";

import { useState } from "react";
import styles from "./AssignDriverModal.module.css";
import { useDriver } from "@/components/DriverContext";

export default function AssignDriverModal({ shipment, currentDriver, onClose }) {
    const { drivers, assignShipmentToDriver } = useDriver();
    const [selectedDriverId, setSelectedDriverId] = useState(null);
    const [reason, setReason] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    if (!shipment) return null;

    const requiredRegions = [
        shipment.origin.toLowerCase().trim(),
        shipment.destination.toLowerCase().trim()
    ];

    // Filter drivers that match the region (and aren't already assigned this shipment)
    // We also roughly calculate performance for display
    const eligibleDrivers = drivers.filter(driver => {
        const driverRegion = (driver.region || "").toLowerCase().trim();
        const matchesRoute = requiredRegions.includes(driverRegion);

        const alreadyAssigned = (driver.recentAssignments || []).some(a => a.id === shipment.id);

        return matchesRoute && !alreadyAssigned;
    }).map(driver => {
        const assignments = driver.recentAssignments || [];
        const delivered = assignments.filter(a => a.status === 'Delivered').length;
        const openShipments = assignments.length - delivered;
        let performance = "N/A";
        let perfColor = "var(--color-text-muted)";

        if (assignments.length > 0) {
            const deliveryRate = delivered / assignments.length;
            if (deliveryRate >= 0.8) {
                performance = `Good (${Math.round(deliveryRate * 100)}%)`;
                perfColor = "#10b981";
            } else if (deliveryRate >= 0.5) {
                performance = `Satisfactory (${Math.round(deliveryRate * 100)}%)`;
                perfColor = "var(--color-primary)";
            } else {
                performance = `Poor/Mod (${Math.round(deliveryRate * 100)}%)`;
                perfColor = "#ef4444";
            }
        }

        return { ...driver, openShipments, totalShipments: assignments.length, performance, perfColor };
    });

    const driversToShow = eligibleDrivers;

    const handleAssign = () => {
        if (!selectedDriverId) return;
        if (currentDriver && !reason.trim()) {
            setError("A reason is required to reassign a shipment.");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            // Option to save the reason to a database/log. For now we just require it.
            assignShipmentToDriver(selectedDriverId, shipment.id);
            setSuccessMessage(`Shipment successfully ${currentDriver ? 'reassigned' : 'assigned'}!`);
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err) {
            setError(err.message || 'Failed to assign driver.');
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>{currentDriver ? 'Reassign Driver' : 'Assign Driver'}</h2>
                    <button className={styles.closeBtn} onClick={onClose} disabled={submitting}>✕</button>
                </div>

                <div className={styles.shipmentInfo}>
                    <p><strong>Tracking ID:</strong> {shipment.id}</p>
                    <p><strong>Route:</strong> {shipment.origin} → {shipment.destination}</p>
                    {currentDriver && <p style={{ color: '#b45309', fontWeight: 600, marginTop: '0.5rem' }}>Currently Assigned To: {currentDriver.name}</p>}
                </div>

                {eligibleDrivers.length > 0 && (
                    <div className={styles.autoDetectNotice}>
                        Auto-detected {eligibleDrivers.length} matching driver(s) for this route's regions.
                    </div>
                )}

                {error && <div className={styles.error}>{error}</div>}
                {successMessage && <div className={styles.success}>{successMessage}</div>}

                <div className={styles.driverList}>
                    {driversToShow.length === 0 && !successMessage ? (
                        <div className={styles.autoDetectNotice} style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fee2e2', padding: '1rem', textAlign: 'center', borderRadius: 'var(--radius-md)' }}>
                            No other driver available in this region. Please wait for arranging new driver.
                        </div>
                    ) : (
                        driversToShow.map(driver => (
                            <div
                                key={driver.id}
                                className={`${styles.driverCard} ${selectedDriverId === driver.id ? styles.selected : ''}`}
                                onClick={() => !submitting && !successMessage && setSelectedDriverId(driver.id)}
                            >
                                <div className={styles.driverMain}>
                                    <strong>{driver.name}</strong>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{driver.id} • {driver.region || "No Region"}</span>
                                </div>
                                <div className={styles.driverStats}>
                                    <span title="Open Shipments" className={styles.statBadge}>{driver.openShipments} Open</span>
                                    {driver.performance && (
                                        <span style={{ color: driver.perfColor, fontSize: '0.8rem', fontWeight: 600 }}>{driver.performance}</span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {currentDriver && (
                    <div className={styles.reasonBlock} style={{ padding: '0 var(--spacing-xl) var(--spacing-md)' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text)' }}>
                            Reason for Reassignment <span style={{ color: 'red' }}>*</span>
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Please provide a reason for transferring this shipment..."
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', minHeight: '60px', fontFamily: 'inherit' }}
                            disabled={submitting || successMessage}
                        />
                    </div>
                )}

                <div className={styles.footer}>
                    <button className={styles.cancelBtn} onClick={onClose} disabled={submitting || successMessage}>Cancel</button>
                    <button
                        className={styles.assignBtn}
                        onClick={handleAssign}
                        disabled={!selectedDriverId || submitting || successMessage || (currentDriver && !reason.trim())}
                    >
                        {submitting ? 'Processing...' : successMessage ? 'Success ✓' : currentDriver ? 'Confirm Reassignment' : 'Confirm Assignment'}
                    </button>
                </div>
            </div>
        </div>
    );
}
