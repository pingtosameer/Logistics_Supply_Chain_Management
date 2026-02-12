"use client";

import { getAllShipments } from "@/lib/data";
import ShipmentList from "@/components/ShipmentList";
import styles from "./page.module.css";
import { useEffect, useState } from "react";

export default function ShipmentsPage() {
    const [shipments, setShipments] = useState([]);

    useEffect(() => {
        getAllShipments().then(setShipments);
    }, []);

    const handleNewShipment = () => {
        alert("New Shipment Wizard coming soon!");
    };

    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>Shipment Management</h1>
                <button className={styles.addButton} onClick={handleNewShipment}>+ New Shipment</button>
            </div>

            <ShipmentList initialShipments={shipments} />
        </div>
    );
}
