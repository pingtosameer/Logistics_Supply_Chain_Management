"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { ref, onValue, set } from "firebase/database";
import { database } from "@/lib/firebase";

const DriverContext = createContext();

export function DriverProvider({ children }) {
    const [drivers, setDrivers] = useState([
        { id: "DRV-001", name: "Rajesh Kumar", vehicle: "Tata Ace", status: "Active", location: "Mumbai Central", region: "Mumbai", phone: "+91 98765 43210", altPhone: "+91 70200 12345" },
        { id: "DRV-002", name: "Suresh Singh", vehicle: "Mahindra Bolero", status: "In Transit", location: "Pune Highway", region: "Pune", phone: "+91 91234 56789", altPhone: "+91 99880 00000" },
        { id: "DRV-003", name: "Vikram Malhotra", vehicle: "Eicher Pro", status: "Idle", location: "Bhiwandi Hub", region: "Mumbai", phone: "+91 99887 76655" },
        { id: "DRV-004", name: "Anita Desai", vehicle: "Scooter (Last Mile)", status: "Active", location: "Indiranagar, BLR", region: "Bangalore", phone: "+91 88990 01122" },
    ]);

    // Listen to Firebase Realtime Database
    useEffect(() => {
        const driversRef = ref(database, 'drivers');
        const unsubscribe = onValue(driversRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const parsed = Array.isArray(data) ? data : Object.values(data);

                const withRegion = parsed.map(d => {
                    // Migration: assign region if missing based on location
                    if (!d.region && d.location) {
                        if (d.location.toLowerCase().includes("mumbai") || d.location.toLowerCase().includes("bhiwandi")) d.region = "Mumbai";
                        else if (d.location.toLowerCase().includes("pune")) d.region = "Pune";
                        else if (d.location.toLowerCase().includes("blr") || d.location.toLowerCase().includes("bangalore")) d.region = "Bangalore";
                        else if (d.location.toLowerCase().includes("delhi")) d.region = "Delhi";
                        else if (d.location.toLowerCase().includes("kolkata")) d.region = "Kolkata";
                        else d.region = "Other";
                    }
                    return d;
                });

                // Filter out null or undefined elements that firebase arrays sometimes have
                setDrivers(withRegion.filter(d => d !== null && d !== undefined));
            }
        });

        return () => unsubscribe();
    }, []);

    // Helper to push updates to Firebase
    const updateFirebase = (newDriversList) => {
        const driversRef = ref(database, 'drivers');
        set(driversRef, newDriversList).catch(err => {
            console.error("Failed to update drivers in Firebase:", err);
        });
    };

    const addDriver = (newDriver) => {
        const uniqueId = newDriver.id || `DRV-${Date.now().toString().slice(-6)}`;
        const driverWithId = {
            ...newDriver,
            id: uniqueId,
            recentAssignments: []
        };
        const newDriversList = [...drivers, driverWithId];
        updateFirebase(newDriversList);
        // Optimistic update
        setDrivers(newDriversList);
    };

    const removeDriver = (id) => {
        const newDriversList = drivers.filter(driver => driver.id !== id);
        updateFirebase(newDriversList);
        setDrivers(newDriversList);
    };

    const assignShipmentToDriver = (driverId, shipmentId, shipmentStatus) => {
        const newDriversList = drivers.map(d => {
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
        });
        updateFirebase(newDriversList);
        setDrivers(newDriversList);
    };

    const updateDriverShipmentStatus = (shipmentId, newStatus) => {
        const newDriversList = drivers.map(d => {
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
        });
        updateFirebase(newDriversList);
        setDrivers(newDriversList);
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
