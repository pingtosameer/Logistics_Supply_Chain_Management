"use client";

import { createContext, useContext, useState, useEffect } from "react";

const DriverContext = createContext();

export function DriverProvider({ children }) {
    const [drivers, setDrivers] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('drivers');
            if (saved) {
                return JSON.parse(saved);
            }
        }
        return [
            { id: "DRV-001", name: "Rajesh Kumar", vehicle: "Tata Ace", status: "Active", location: "Mumbai Central", phone: "+91 98765 43210", altPhone: "+91 70200 12345" },
            { id: "DRV-002", name: "Suresh Singh", vehicle: "Mahindra Bolero", status: "In Transit", location: "Pune Highway", phone: "+91 91234 56789", altPhone: "+91 99880 00000" },
            { id: "DRV-003", name: "Vikram Malhotra", vehicle: "Eicher Pro", status: "Idle", location: "Bhiwandi Hub", phone: "+91 99887 76655" },
            { id: "DRV-004", name: "Anita Desai", vehicle: "Scooter (Last Mile)", status: "Active", location: "Indiranagar, BLR", phone: "+91 88990 01122" },
        ];
    });

    // Save to localStorage whenever drivers change
    useEffect(() => {
        localStorage.setItem('drivers', JSON.stringify(drivers));
    }, [drivers]);

    const addDriver = (newDriver) => {
        // Generate a unique ID using timestamp and random number to prevent collisions
        const uniqueId = newDriver.id || `DRV-${Date.now().toString().slice(-6)}`;

        const driverWithId = {
            ...newDriver,
            id: uniqueId,
            recentAssignments: [] // Initialize with empty assignments
        };
        setDrivers((prevDrivers) => [...prevDrivers, driverWithId]);
    };

    const removeDriver = (id) => {
        setDrivers((prevDrivers) => prevDrivers.filter(driver => driver.id !== id));
    };

    return (
        <DriverContext.Provider value={{ drivers, addDriver, removeDriver }}>
            {children}
        </DriverContext.Provider>
    );
}

export function useDriver() {
    const context = useContext(DriverContext);
    if (!context) {
        throw new Error("useDriver must be used within a DriverProvider");
    }
    return context;
}
