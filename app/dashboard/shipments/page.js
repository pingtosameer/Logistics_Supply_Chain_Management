"use client";

import { getAllShipments } from "@/lib/data";
import ShipmentList from "@/components/ShipmentList";
import styles from "./page.module.css";
import { useEffect, useState } from "react";

export default function ShipmentsPage() {
    const [shipments, setShipments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        recipient: '',
        origin: '',
        destination: '',
        courier: 'FedEx',
        status: 'Pending',
        description: ''
    });

    useEffect(() => {
        const loadData = async () => {
            const serverShipments = await getAllShipments();
            const localShipments = JSON.parse(localStorage.getItem('local_shipments') || '[]');
            // Merge, prioritizing local if duplicates existed (though IDs should be unique)
            // For simplicity just appending local ones at the top or merging.
            // Actually, let's just display all.
            setShipments([...localShipments, ...serverShipments]);
        };
        loadData();
    }, []);

    const handleNewShipment = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newShipment = {
            id: `TRK-IN-${Math.floor(100000 + Math.random() * 900000)}`,
            sender: "Direct Booking",
            recipient: formData.recipient,
            origin: formData.origin,
            destination: formData.destination,
            status: "Pending",
            courier: formData.courier,
            estimatedDelivery: "Calculating...",
            currentLocation: formData.origin,
            lastUpdated: new Date().toISOString(),
            events: [
                {
                    date: new Date().toISOString(),
                    status: "Order Placed",
                    location: formData.origin,
                    description: formData.description || "Shipment details received"
                }
            ]
        };

        // Update state
        setShipments(prev => [newShipment, ...prev]);

        // Save to local storage
        const localShipments = JSON.parse(localStorage.getItem('local_shipments') || '[]');
        localStorage.setItem('local_shipments', JSON.stringify([newShipment, ...localShipments]));

        // Reset and close
        setFormData({
            recipient: '',
            origin: '',
            destination: '',
            courier: 'FedEx',
            status: 'Pending',
            description: ''
        });
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>Shipment Management</h1>
                <button className={styles.addButton} onClick={handleNewShipment}>+ New Shipment</button>
            </div>

            <ShipmentList initialShipments={shipments} />

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2 className={styles.modalTitle}>Create New Shipment</h2>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Recipient Name</label>
                                <input
                                    type="text"
                                    name="recipient"
                                    required
                                    className={styles.input}
                                    value={formData.recipient}
                                    onChange={handleInputChange}
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Origin City</label>
                                <input
                                    type="text"
                                    name="origin"
                                    required
                                    className={styles.input}
                                    value={formData.origin}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Mumbai"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Destination City</label>
                                <input
                                    type="text"
                                    name="destination"
                                    required
                                    className={styles.input}
                                    value={formData.destination}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Delhi"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Courier</label>
                                <select
                                    name="courier"
                                    className={styles.input}
                                    value={formData.courier}
                                    onChange={handleInputChange}
                                >
                                    <option value="FedEx">FedEx</option>
                                    <option value="BlueDart">BlueDart</option>
                                    <option value="DTDC">DTDC</option>
                                    <option value="Delhivery">Delhivery</option>
                                    <option value="Ecom Express">Ecom Express</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Status</label>
                                <select
                                    name="status"
                                    className={styles.input}
                                    value={formData.status}
                                    onChange={handleInputChange}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Transit">In Transit</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Returned">Returned</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Description</label>
                                <textarea
                                    name="description"
                                    className={styles.input}
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Optional: Initial event description"
                                    rows={2}
                                />
                            </div>
                            <div className={styles.modalActions}>
                                <button type="button" className={styles.cancelButton} onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className={styles.submitButton}>Create Shipment</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
