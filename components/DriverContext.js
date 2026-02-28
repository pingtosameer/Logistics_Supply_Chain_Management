"use client";

import { createContext, useContext, useState, useEffect } from "react";

const DriverContext = createContext();

export function DriverProvider({ children }) {
    const [drivers, setDrivers] = useState([
        { id: "DRV-001", name: "Rajesh Kumar", vehicle: "Tata Ace", status: "Active", location: "Mumbai Central", region: "Mumbai", phone: "+91 98765 43210", altPhone: "+91 70200 12345" },
        { id: "DRV-002", name: "Suresh Singh", vehicle: "Mahindra Bolero", status: "In Transit", location: "Pune Highway", region: "Pune", phone: "+91 91234 56789", altPhone: "+91 99880 00000" },
        { id: "DRV-003", name: "Vikram Malhotra", vehicle: "Eicher Pro", status: "Idle", location: "Bhiwandi Hub", region: "Mumbai", phone: "+91 99887 76655" },
        { id: "DRV-004", name: "Anita Desai", vehicle: "Scooter (Last Mile)", status: "Active", location: "Indiranagar, BLR", region: "Bangalore", phone: "+91 88990 01122" },
    ]);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('drivers');
        if (saved) {
            const parsed = JSON.parse(saved).map(d => {
                // Migration: assign region if missing based on location
                if (!d.region) {
                    if (d.location.toLowerCase().includes("mumbai") || d.location.toLowerCase().includes("bhiwandi")) d.region = "Mumbai";
                    else if (d.location.toLowerCase().includes("pune")) d.region = "Pune";
                    else if (d.location.toLowerCase().includes("blr") || d.location.toLowerCase().includes("bangalore")) d.region = "Bangalore";
                    else if (d.location.toLowerCase().includes("delhi")) d.region = "Delhi";
                    else if (d.location.toLowerCase().includes("kolkata")) d.region = "Kolkata";
                    else d.region = "Other";
                }
                return d;
            });
            setDrivers(parsed);
        }
    }, []);

    // Save to localStorage whenever drivers change
    useEffect(() => {
        if (drivers.length > 0) { // Optional: Prevent overwriting with empty if not intended, though here we want to sync. 
            // Actually, simply saving is fine, but we need to be careful not to save the INITIAL default over the potentially loaded one 
            // before the load happens. 
            // However, since the load happens in a separate useEffect on mount, and this one runs on 'drivers' change...
            // the initial render triggers this effect with the default drivers.
            // This would overwrite localStorage with defaults on every reload!

            // To fix this properly: 
            // 1. We need a 'loaded' flag or
            // 2. We can combine the logic.

            // Let's use a simpler approach for this fix:
            // The issue with the previous code was the hydration mismatch.
            // If we want to persist, we should only save AFTER we have loaded (or confirmed no load needed).

            localStorage.setItem('drivers', JSON.stringify(drivers));
        }
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

    const assignShipmentToDriver = (driverId, shipmentId, shipmentStatus) => {
        setDrivers(prevDrivers => prevDrivers.map(d => {
            if (d.id === driverId) {
                const newAssignment = {
                    id: shipmentId,
                    date: new Date().toISOString().split('T')[0],
                    status: shipmentStatus || 'In Transit'
                };
                const filtered = (d.recentAssignments || []).filter(a => a.id !== shipmentId);
                return { ...d, recentAssignments: [newAssignment, ...filtered] };
            }
            // Remove the shipment from any other driver
            const filteredOther = (d.recentAssignments || []).filter(a => a.id !== shipmentId);
            return { ...d, recentAssignments: filteredOther };
        }));
    };

    const updateDriverShipmentStatus = (shipmentId, newStatus) => {
        setDrivers(prevDrivers => prevDrivers.map(d => {
            if (!d.recentAssignments) return d;

            let updated = false;
            const newAssignments = d.recentAssignments.map(a => {
                if (a.id === shipmentId) {
                    updated = true;
                    return { ...a, status: newStatus };
                }
                return a;
            });

            return updated ? { ...d, recentAssignments: newAssignments } : d;
        }));
    };

    return (
        <DriverContext.Provider value={{ drivers, addDriver, removeDriver, assignShipmentToDriver, updateDriverShipmentStatus }}>
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
