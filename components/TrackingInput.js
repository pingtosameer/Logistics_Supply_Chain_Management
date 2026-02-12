"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./TrackingInput.module.css";

export default function TrackingInput() {
    const [trackingId, setTrackingId] = useState("");
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (trackingId.trim()) {
            router.push(`/tracking/${trackingId.trim()}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
                <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Enter your tracking ID (e.g., TRK-849201)"
                    className={styles.input}
                    aria-label="Tracking ID"
                />
                <button type="submit" className={styles.button}>
                    Track
                </button>
            </div>
        </form>
    );
}
