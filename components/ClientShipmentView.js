"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/app/dashboard/shipments/[id]/page.module.css";
import Timeline from "@/components/Timeline";
import ShipmentActions from "@/components/ShipmentActions";
import { useDriver } from "@/components/DriverContext";

export default function ClientShipmentView({ id, initialShipment }) {
    const { updateDriverShipmentStatus } = useDriver();
    const [shipment, setShipment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [podUploaded, setPodUploaded] = useState(false);
    const [podFileBase64, setPodFileBase64] = useState(null);
    const [podFileName, setPodFileName] = useState('');

    // Edit Form State
    const [editForm, setEditForm] = useState({
        recipient: '',
        origin: '',
        destination: '',
        courier: '',
        estimatedDelivery: ''
    });

    // Status Form State
    const [statusForm, setStatusForm] = useState({
        status: 'In Transit',
        location: '',
        comment: ''
    });

    // Import modal styles dynamically or reuse existing ones? 
    // Since we can't easily import another module's CSS here without standard import, 
    // and we want to use the same classes.
    // We'll trust that we can import it.
    // CHECK: imports at top need to change too.

    useEffect(() => {
        const localShipments = JSON.parse(localStorage.getItem('local_shipments') || '[]');
        const found = localShipments.find(s => s.id === id);
        if (found) {
            setShipment(found);
            setPodUploaded(!!found.podUploaded);
        } else if (initialShipment) {
            setShipment(initialShipment);
            setPodUploaded(!!initialShipment.podUploaded);
        } else {
            setShipment(null);
        }
        setLoading(false);
    }, [id, initialShipment]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'var(--color-success)';
            case 'In Transit': return 'var(--color-primary)';
            case 'Delayed': return 'var(--color-danger)';
            case 'Pending': return 'var(--color-warning)';
            case 'Returned': return 'var(--color-text-muted)';
            case 'Misrouted': return '#ef4444';
            case 'Pickup Done': return '#3b82f6';
            case 'Shipment Created & Pick Up Pending': return '#8b5cf6';
            default: return 'var(--color-text-muted)';
        }
    };

    const getStatusBgColor = (status) => {
        switch (status) {
            case 'Delivered': return 'rgba(16, 185, 129, 0.1)';
            case 'In Transit': return 'rgba(59, 130, 246, 0.1)';
            case 'Delayed': return 'rgba(239, 68, 68, 0.1)';
            case 'Pending': return 'rgba(245, 158, 11, 0.1)';
            case 'Returned': return 'rgba(107, 114, 128, 0.1)';
            case 'Misrouted': return 'rgba(239, 68, 68, 0.15)';
            case 'Pickup Done': return 'rgba(59, 130, 246, 0.15)';
            case 'Shipment Created & Pick Up Pending': return 'rgba(139, 92, 246, 0.15)';
            default: return 'rgba(107, 114, 128, 0.1)';
        }
    };

    const handleEdit = () => {
        setEditForm({
            recipient: shipment.recipient,
            origin: shipment.origin,
            destination: shipment.destination,
            courier: shipment.courier || 'FedEx', // Default if missing
            estimatedDelivery: shipment.estimatedDelivery ? shipment.estimatedDelivery.split('T')[0] : ''
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateStatus = () => {
        setStatusForm({
            status: shipment.status,
            location: shipment.currentLocation || '',
            comment: ''
        });
        setIsStatusModalOpen(true);
    };

    const saveEdit = (e) => {
        e.preventDefault();
        const updatedShipment = { ...shipment, ...editForm };

        // Update local state
        setShipment(updatedShipment);

        // Update localStorage overrides
        const localShipments = JSON.parse(localStorage.getItem('local_shipments') || '[]');
        const existingIndex = localShipments.findIndex(s => s.id === id);
        let updatedList;
        if (existingIndex >= 0) {
            updatedList = [...localShipments];
            updatedList[existingIndex] = updatedShipment;
        } else {
            updatedList = [updatedShipment, ...localShipments];
        }
        localStorage.setItem('local_shipments', JSON.stringify(updatedList));

        setIsEditModalOpen(false);
    };

    const saveStatus = (e) => {
        e.preventDefault();
        const newEvent = {
            id: Date.now().toString(),
            status: statusForm.status,
            location: statusForm.location,
            timestamp: new Date().toISOString(),
            description: statusForm.comment || `Shipment is ${statusForm.status}`
        };

        let updatedShipment = {
            ...shipment,
            status: statusForm.status,
            currentLocation: statusForm.location,
            lastUpdated: new Date().toISOString(),
            events: [newEvent, ...(shipment.events || [])]
        };

        if (statusForm.status === 'Pickup Done') {
            const today = new Date();
            today.setDate(today.getDate() + 4);
            updatedShipment.estimatedDelivery = today.toISOString().split('T')[0];
        }

        setShipment(updatedShipment);

        // Update localStorage overrides
        const localShipments = JSON.parse(localStorage.getItem('local_shipments') || '[]');
        const existingIndex = localShipments.findIndex(s => s.id === id);
        let updatedList;
        if (existingIndex >= 0) {
            updatedList = [...localShipments];
            updatedList[existingIndex] = updatedShipment;
        } else {
            updatedList = [updatedShipment, ...localShipments];
        }
        localStorage.setItem('local_shipments', JSON.stringify(updatedList));

        // Sync globally with driver context
        if (updateDriverShipmentStatus) {
            updateDriverShipmentStatus(id, statusForm.status);
        }

        setIsStatusModalOpen(false);
    };

    if (loading) {
        return <div className={styles.container}>Loading...</div>;
    }

    if (!shipment) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <Link href="/dashboard/shipments" className={styles.backLink}>← Back</Link>
                </div>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <h2>Shipment Not Found</h2>
                    <p>The shipment {id} could not be found locally or on the server.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <Link href="/dashboard/shipments" className={styles.backLink}>← Back</Link>
                    <h1 className={styles.title}>Shipment {shipment.id}</h1>
                </div>
                <div className={styles.actions}>
                    <ShipmentActions onEdit={handleEdit} onUpdateStatus={handleUpdateStatus} />
                </div>
            </div>

            <div className={styles.grid}>
                <div className={styles.mainInfo}>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Shipping Details</h3>
                        <div className={styles.detailsRow}>
                            <div>
                                <span className={styles.label}>Sender</span>
                                <p className={styles.value}>{shipment.sender}</p>
                            </div>
                            <div>
                                <span className={styles.label}>Origin</span>
                                <p className={styles.value}>{shipment.origin}</p>
                            </div>
                        </div>
                        <div className={styles.detailsRow}>
                            <div>
                                <span className={styles.label}>Courier Partner</span>
                                <p className={styles.value}>{shipment.courier}</p>
                            </div>
                            <div>
                                <span className={styles.label}>Service Type</span>
                                <p className={styles.value}>Express Delivery</p>
                            </div>
                        </div>
                        <div className={styles.detailsRow}>
                            <div>
                                <span className={styles.label}>Recipient</span>
                                <p className={styles.value}>{shipment.recipient}</p>
                            </div>
                            <div>
                                <span className={styles.label}>Destination</span>
                                <p className={styles.value}>{shipment.destination}</p>
                            </div>
                        </div>
                        <div className={styles.detailsRow}>
                            <div>
                                <span className={styles.label}>Estimated Delivery</span>
                                <p className={styles.value}>{shipment.estimatedDelivery}</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Tracking History</h3>
                        <Timeline events={shipment.events || []} />
                    </div>
                </div>

                <div className={styles.sidebar}>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Current Status</h3>
                        <div className={styles.statusBox} style={{ backgroundColor: getStatusBgColor(shipment.status) }}>
                            <p className={styles.statusText} style={{ color: getStatusColor(shipment.status) }}>{shipment.status}</p>
                            <p className={styles.locationText}>{shipment.currentLocation}</p>
                            <p className={styles.timeText}>Last updated: {new Date(shipment.lastUpdated).toLocaleString()}</p>
                        </div>
                    </div>

                    {shipment.status === 'Delivered' && (
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Proof of Delivery (POD)</h2>
                            {!podUploaded ? (
                                <>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                                        Upload the signed POD document or image.
                                    </p>
                                    <input
                                        type="file"
                                        style={{ marginBottom: '1rem', width: '100%' }}
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setPodFileName(file.name);

                                                // Create a FileReader to read the file
                                                const reader = new FileReader();
                                                reader.onloadend = (event) => {
                                                    // Create an image element to draw the file onto a canvas for compression
                                                    const img = new Image();
                                                    img.onload = () => {
                                                        const canvas = document.createElement('canvas');
                                                        const MAX_WIDTH = 800; // Compress to max 800px width
                                                        const scaleSize = MAX_WIDTH / img.width;

                                                        let newWidth = img.width;
                                                        let newHeight = img.height;

                                                        if (scaleSize < 1) {
                                                            newWidth = MAX_WIDTH;
                                                            newHeight = img.height * scaleSize;
                                                        }

                                                        canvas.width = newWidth;
                                                        canvas.height = newHeight;

                                                        const ctx = canvas.getContext('2d');
                                                        ctx.drawImage(img, 0, 0, newWidth, newHeight);

                                                        // Compress to aggressive JPEG (much smaller than standard Base64 PNGs)
                                                        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
                                                        setPodFileBase64(compressedBase64);
                                                    };
                                                    img.src = event.target.result;
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    <button
                                        className={styles.primaryButton}
                                        style={{ width: '100%' }}
                                        onClick={() => {
                                            if (!podFileBase64) {
                                                alert("Please select a file first.");
                                                return;
                                            }
                                            // Save to local_pods 
                                            const existingPods = JSON.parse(localStorage.getItem('local_pods') || '[]');
                                            const newPod = {
                                                shipmentId: id,
                                                date: new Date().toISOString(),
                                                fileData: podFileBase64,
                                                fileName: podFileName
                                            };
                                            localStorage.setItem('local_pods', JSON.stringify([newPod, ...existingPods]));

                                            // Mark podUploaded in local_shipments
                                            const localShipments = JSON.parse(localStorage.getItem('local_shipments') || '[]');
                                            const updatedShipments = localShipments.map(s => {
                                                if (s.id === id) return { ...s, podUploaded: true };
                                                return s;
                                            });
                                            localStorage.setItem('local_shipments', JSON.stringify(updatedShipments));

                                            alert("POD Uploaded successfully!");
                                            setPodUploaded(true);
                                        }}
                                    >
                                        Upload POD
                                    </button>
                                </>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-success)', fontWeight: 'bold' }}>
                                    <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>✅</span> POD Uploaded
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div className={styles.card} style={{ width: '100%', maxWidth: '500px' }}>
                        <h3 className={styles.cardTitle}>Edit Shipment Details</h3>
                        <form onSubmit={saveEdit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label className={styles.label}>Recipient Name</label>
                                <input
                                    type="text"
                                    value={editForm.recipient}
                                    onChange={(e) => setEditForm({ ...editForm, recipient: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label className={styles.label}>Origin</label>
                                <input
                                    type="text"
                                    value={editForm.origin}
                                    onChange={(e) => setEditForm({ ...editForm, origin: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label className={styles.label}>Destination</label>
                                <input
                                    type="text"
                                    value={editForm.destination}
                                    onChange={(e) => setEditForm({ ...editForm, destination: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label className={styles.label}>Estimated Delivery</label>
                                <input
                                    type="date"
                                    value={editForm.estimatedDelivery}
                                    onChange={(e) => setEditForm({ ...editForm, estimatedDelivery: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label className={styles.label}>Courier</label>
                                <select
                                    value={editForm.courier}
                                    onChange={(e) => setEditForm({ ...editForm, courier: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                >
                                    <option value="FedEx">FedEx</option>
                                    <option value="BlueDart">BlueDart</option>
                                    <option value="DTDC">DTDC</option>
                                    <option value="Delhivery">Delhivery</option>
                                    <option value="Ecom Express">Ecom Express</option>
                                </select>
                            </div>
                            <div className={styles.actions} style={{ justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className={styles.secondaryButton}>Cancel</button>
                                <button type="submit" className={styles.primaryButton}>Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Status Modal */}
            {isStatusModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div className={styles.card} style={{ width: '100%', maxWidth: '500px' }}>
                        <h3 className={styles.cardTitle}>Update Status</h3>
                        <form onSubmit={saveStatus}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label className={styles.label}>New Status</label>
                                <select
                                    value={statusForm.status}
                                    onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                >
                                    <option value="Shipment Created & Pick Up Pending">Shipment Created & Pick Up Pending</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Pickup Done">Pickup Done</option>
                                    <option value="In Transit">In Transit</option>
                                    <option value="Delayed">Delayed</option>
                                    <option value="Misrouted">Misrouted</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Returned">Returned</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label className={styles.label}>Location</label>
                                <input
                                    type="text"
                                    value={statusForm.location}
                                    onChange={(e) => setStatusForm({ ...statusForm, location: e.target.value })}
                                    placeholder="City, State"
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label className={styles.label}>Comment / Description</label>
                                <textarea
                                    value={statusForm.comment}
                                    onChange={(e) => setStatusForm({ ...statusForm, comment: e.target.value })}
                                    placeholder="e.g. Arrived at Sorting Hub"
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px' }}
                                />
                            </div>
                            <div className={styles.actions} style={{ justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setIsStatusModalOpen(false)} className={styles.secondaryButton}>Cancel</button>
                                <button type="submit" className={styles.primaryButton}>Update Status</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
