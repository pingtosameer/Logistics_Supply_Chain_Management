"use client";

import styles from "../app/dashboard/drivers/[id]/page.module.css";

export default function CallDriverButton({ phone }) {
    const handleCall = () => {
        if (confirm(`Call driver at ${phone}?`)) {
            window.location.href = `tel:${phone}`;
        }
    };

    return (
        <button onClick={handleCall} className={styles.primaryBtn}>
            Call Driver
        </button>
    );
}
