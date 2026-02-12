"use client";

import styles from "./page.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDriver } from "@/components/DriverContext";

export default function AddDriverPage() {
    const router = useRouter();
    const { addDriver } = useDriver();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.target);
        const newDriver = {
            name: formData.get("name"),
            vehicle: formData.get("vehicle"),
            phone: formData.get("phone"),
            email: formData.get("email"),
            status: formData.get("status"),
            location: "Depot (Default)", // Default location for new drivers
        };

        addDriver(newDriver);

        // Simulate a brief delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500));

        alert("Driver 'Added' successfully!");
        router.push("/dashboard/drivers");
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Add New Driver</h1>
                <p className={styles.subtitle}>Enter the details for the new driver.</p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className={styles.input}
                        placeholder="e.g. Rahul Verma"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="vehicle">Vehicle</label>
                    <input
                        type="text"
                        id="vehicle"
                        name="vehicle"
                        className={styles.input}
                        placeholder="e.g. Tata Ace - MH 12 AB 1234"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="phone">Phone Number</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className={styles.input}
                        placeholder="+91 98765 43210"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className={styles.input}
                        placeholder="driver@example.com"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="status">Initial Status</label>
                    <select id="status" name="status" className={styles.select} defaultValue="Active">
                        <option value="Active">Active</option>
                        <option value="Idle">Idle</option>
                        <option value="On Leave">On Leave</option>
                    </select>
                </div>

                <div className={styles.actions}>
                    <Link href="/dashboard/drivers" className={styles.cancelBtn}>
                        Cancel
                    </Link>
                    <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                        {isSubmitting ? "Adding..." : "Add Driver"}
                    </button>
                </div>
            </form>
        </div>
    );
}
