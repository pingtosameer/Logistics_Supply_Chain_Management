"use client";

import styles from "./page.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDriver } from "@/components/DriverContext";

const REGION_CITIES = {
    "Mumbai": ["Mumbai Central", "Andheri", "Bandra", "Navi Mumbai", "Bhiwandi Hub", "Thane", "Dadar"],
    "Pune": ["Pune City", "Kothrud", "Hinjewadi", "Viman Nagar", "Pune Highway", "Pimpri-Chinchwad"],
    "Bangalore": ["Indiranagar", "Koramangala", "Whitefield", "Jayanagar", "Electronic City", "Malleswaram"],
    "Delhi": ["New Delhi", "Dwarka", "Rohini", "Connaught Place", "Vasant Kunj", "Karol Bagh"],
    "Kolkata": ["Salt Lake", "New Town", "Park Street", "Howrah", "Alipore", "Dum Dum"],
    "Other": ["Other"]
};

export default function AddDriverPage() {
    const router = useRouter();
    const { addDriver } = useDriver();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState("");
    const [customRegion, setCustomRegion] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [customCity, setCustomCity] = useState("");
    const [availableCities, setAvailableCities] = useState([]);

    useEffect(() => {
        if (selectedRegion && REGION_CITIES[selectedRegion]) {
            setAvailableCities(REGION_CITIES[selectedRegion]);
        } else {
            setAvailableCities([]);
        }
    }, [selectedRegion]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.target);
        const finalRegion = selectedRegion === "Other" ? customRegion.trim() : selectedRegion;
        const finalCity = selectedCity === "Other" ? customCity.trim() : selectedCity;

        const newDriver = {
            name: formData.get("name"),
            vehicle: formData.get("vehicle"),
            phone: formData.get("phone"),
            email: formData.get("email"),
            status: formData.get("status"),
            region: finalRegion,
            location: finalCity,
            experience: formData.get("experience"),
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
                    <label className={styles.label} htmlFor="name">Full Name <span style={{ color: 'red' }}>*</span></label>
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
                    <label className={styles.label} htmlFor="vehicle">Vehicle <span style={{ color: 'red' }}>*</span></label>
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
                    <label className={styles.label} htmlFor="phone">Phone Number <span style={{ color: 'red' }}>*</span></label>
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

                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="region">Region <span style={{ color: 'red' }}>*</span></label>
                    <select
                        id="regionSelect"
                        className={styles.select}
                        required
                        value={selectedRegion}
                        onChange={(e) => {
                            setSelectedRegion(e.target.value);
                            setSelectedCity("");
                            setCustomCity("");
                        }}
                    >
                        <option value="" disabled>Select a Region</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Pune">Pune</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Other">Other (Enter Manually)</option>
                    </select>
                    {selectedRegion === "Other" && (
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Type new region..."
                            value={customRegion}
                            onChange={(e) => setCustomRegion(e.target.value)}
                            style={{ marginTop: '0.5rem' }}
                            required
                        />
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="city">City (Hired Location) <span style={{ color: 'red' }}>*</span></label>
                    <select
                        id="citySelect"
                        className={styles.select}
                        required
                        disabled={!selectedRegion}
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                    >
                        <option value="" disabled>{selectedRegion ? "Select a City" : "Select a Region first"}</option>
                        {availableCities.map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                    {selectedCity === "Other" && (
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Type new city..."
                            value={customCity}
                            onChange={(e) => setCustomCity(e.target.value)}
                            style={{ marginTop: '0.5rem' }}
                            required
                        />
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="experience">Experience (Years) <span style={{ color: 'red' }}>*</span></label>
                    <input
                        type="number"
                        id="experience"
                        name="experience"
                        className={styles.input}
                        placeholder="e.g. 5"
                        min="0"
                        required
                    />
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
