"use client";

import styles from "../app/dashboard/shipments/[id]/page.module.css";

export default function ShipmentActions({ onEdit, onUpdateStatus }) {
    const handleEdit = () => {
        if (onEdit) {
            onEdit();
        } else {
            alert("Edit functionality coming soon!");
        }
    };

    const handleUpdateStatus = () => {
        if (onUpdateStatus) {
            onUpdateStatus();
        } else {
            alert("Update Status functionality coming soon!");
        }
    };

    return (
        <div className={styles.actions}>
            <button onClick={handleEdit} className={styles.secondaryButton}>Edit Details</button>
            <button onClick={handleUpdateStatus} className={styles.primaryButton}>Update Status</button>
        </div>
    );
}
