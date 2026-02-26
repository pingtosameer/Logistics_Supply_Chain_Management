const fs = require('fs');

const FILE_PATH = '/Users/sameerbhatia/Documents/Dashboard/components/ClientShipmentView.js';

const newContent = `"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Timeline from './Timeline';
import ShipmentActions from './ShipmentActions';
import styles from './ClientShipmentView.module.css';

export default function ClientShipmentView({ id, initialShipment, returnTo }) {
    const [shipment, setShipment] = useState(initialShipment);
    const [loading, setLoading] = useState(!initialShipment);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
    
    const [editForm, setEditForm] = useState({
        recipient: '',
        origin: '',
        destination: '',
        estimatedDelivery: '',
        courier: ''
    });

    const [statusForm, setStatusForm] = useState({
        status: 'In Transit',
        location: '',
        comment: ''
    });

    const [drivers, setDrivers] = useState([]);

    useEffect(() => {
        const storedDrivers = JSON.parse(localStorage.getItem('drivers_db') || '[]');
        if (storedDrivers.length === 0) {
            const initialDrivers = [
                { id: "DRV-001", name: "Ravi Kumar", phone: "+91 98765 43210", vehicle: "Tata Ace (MH-01-AB-1234)", status: "Active", rating: 4.8, completedTrips: 124, location: "Mumbai, MH", recentAssignments: [] },
                { id: "DRV-002", name: "Suresh Singh", phone: "+91 98765 43211", vehicle: "Mahindra Bolero (DL-02-CD-5678)", status: "On Duty", rating: 4.5, completedTrips: 89, location: "Delhi, DL", recentAssignments: [] },
                { id: "DRV-003", name: "Amit Patel", phone: "+91 98765 43212", vehicle: "Eicher Pro (GJ-03-EF-9012)", status: "Off Duty", rating: 4.9, completedTrips: 210, location: "Ahmedabad, GJ", recentAssignments: [] },
                { id: "DRV-004", name: "Mohammed Ali", phone: "+91 98765 43213", vehicle: "Ashok Leyland Dost (KA-04-GH-3456)", status: "Active", rating: 4.7, completedTrips: 156, location: "Bangalore, KA", recentAssignments: [] },
                { id: "DRV-005", name: "Vikram Sharma", phone: "+91 98765 43214", vehicle: "Tata 407 (UP-05-IJ-7890)", status: "On Leave", rating: 4.6, completedTrips: 112, location: "Lucknow, UP", recentAssignments: [] }
            ];
            localStorage.setItem('drivers_db', JSON.stringify(initialDrivers));
            setDrivers(initialDrivers);
        } else {
            setDrivers(storedDrivers);
        }
    }, []);

    useEffect(() => {
        if (!shipment) {
            const localShipments = JSON.parse(localStorage.getItem('local_shipments') || '[]');
            const foundLocal = localShipments.find(s => s.id === id);
            
            if (foundLocal) {
                setShipment(foundLocal);
                setLoading(false);
            } else {
                fetch(\`/api/shipments/\${id}\`)
                    .then(res => res.json())
                    .then(data => {
                        setShipment(data);
                        setLoading(false);
                    })
                    .catch(err => {
                        console.error("Error fetching shipment:", err);
                        setLoading(false);
                    });
            }
        }
    }, [id, shipment]);

    useEffect(() => {
        if (shipment) {
            setEditForm({
                recipient: shipment.recipient || '',
                origin: shipment.origin || '',
                destination: shipment.destination || '',
                estimatedDelivery: shipment.estimatedDelivery || '',
                courier: shipment.courier || ''
            });
            setStatusForm(prev => ({
                ...prev,
                status: shipment.status || 'In Transit'
            }));
        }
    }, [shipment]);

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
        setIsEditModalOpen(true);
    };

    const handleUpdateStatus = () => {
        setIsStatusModalOpen(true);
    };

    const saveEdit = (e) => {
        e.preventDefault();
        const updatedShipment = { ...shipment, ...editForm };
        setShipment(updatedShipment);
        
        const localShipments = JSON.parse(localStorage.getItem('local_shipments') || '[]');
        const existingIndex = localShipments.findIndex(s => s.id === id);
        if (existingIndex >= 0) {
            localShipments[existingIndex] = updatedShipment;
        } else {
            localShipments.push(updatedShipment);
        }
        localStorage.setItem('local_shipments', JSON.stringify(localShipments));
        
        setIsEditModalOpen(false);
    };

    const assignShipmentToDriver = (driverId, shipmentId, currentStatus) => {
        const updatedDrivers = drivers.map(driver => {
            if (driver.id === driverId) {
                const existingAssignments = driver.recentAssignments || [];
                const isAlreadyAssigned = existingAssignments.some(a => a.id === shipmentId);
                
                if (!isAlreadyAssigned) {
                    return {
                        ...driver,
                        recentAssignments: [
                            { id: shipmentId, status: currentStatus, assignedAt: new Date().toISOString() },
                            ...existingAssignments
                        ]
                    };
                }
            } else {
                const filteredAssignments = (driver.recentAssignments || []).filter(a => a.id !== shipmentId);
                return {
                    ...driver,
                    recentAssignments: filteredAssignments
                };
            }
            return driver;
        });

        setDrivers(updatedDrivers);
        localStorage.setItem('drivers_db', JSON.stringify(updatedDrivers));
        
        const localShipments = JSON.parse(localStorage.getItem('local_shipments') || '[]');
        const shipmentIndex = localShipments.findIndex(s => s.id === shipmentId);
        
        if (shipmentIndex >= 0) {
            localShipments[shipmentIndex].driverId = driverId;
            localStorage.setItem('local_shipments', JSON.stringify(localShipments));
        }
        
        setShipment(prev => ({ ...prev, driverId }));
        alert(\`Shipment \${shipmentId} assigned to driver \${driverId}\`);
    };

    const saveStatus = (e) => {
        e.preventDefault();
        
        const newUpdate = {
            id: Date.now().toString(),
            status: statusForm.status,
            location: statusForm.location,
            timestamp: new Date().toISOString(),
            description: statusForm.comment || \`Status updated to \${statusForm.status}\`
        };

        let updatedShipment = { 
            ...shipment, 
            status: statusForm.status,
            currentLocation: statusForm.location,
            updates: [newUpdate, ...(shipment.updates || [])]
        };

        if (statusForm.status === 'Pickup Done') {
            const today = new Date();
            today.setDate(today.getDate() + 4);
            updatedShipment.estimatedDelivery = today.toISOString().split('T')[0];
        }

        setShipment(updatedShipment);

        const localShipments = JSON.parse(localStorage.getItem('local_shipments') || '[]');
        const existingIndex = localShipments.findIndex(s => s.id === id);
        if (existingIndex >= 0) {
            localShipments[existingIndex] = updatedShipment;
        } else {
            localShipments.push(updatedShipment);
        }
        localStorage.setItem('local_shipments', JSON.stringify(localShipments));

        e.target.reset();
        setIsStatusModalOpen(false);
    };

    const currentDriver = drivers.find(d => (d.recentAssignments || []).some(a => a.id === id));

    if (loading) {
        return <div className={styles.container}>Loading...</div>;
    }

    if (!shipment) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <Link href={returnTo || "/dashboard/shipments"} className={styles.backLink}>← Back</Link>
                </div>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <h2>Shipment Not Found</h2>
                    <p>The shipment {id} could not be found locally or on the server.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <Link href={returnTo || "/dashboard/shipments"} className={styles.backLink}>← Back</Link>
                        <h1 className={styles.title}>Shipment {shipment.id}</h1>
                    </div>
                    <div className={styles.actions}>
                        <ShipmentActions onEdit={handleEdit} onUpdateStatus={handleUpdateStatus} />
                    </div>
                </div>

                <div className={styles.grid}>
                    <div className={styles.mainInfo}>
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Shipment Details</h2>
                            <div className={styles.detailsGrid}>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Recipient</span>
                                    <span className={styles.detailValue}>{shipment.recipient}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Origin</span>
                                    <span className={styles.detailValue}>{shipment.origin}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Destination</span>
                                    <span className={styles.detailValue}>{shipment.destination}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Courier</span>
                                    <span className={styles.detailValue}>{shipment.courier || 'Standard Logistics'}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Created Date</span>
                                    <span className={styles.detailValue}>
                                        {new Date(shipment.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Expected Delivery</span>
                                    <span className={styles.detailValue}>
                                        {shipment.estimatedDelivery ? new Date(shipment.estimatedDelivery).toLocaleDateString() : 'TBD'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Tracking History</h2>
                            <Timeline updates={shipment.updates} />
                        </div>
                    </div>

                    <div className={styles.sidebar}>
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Current Status</h2>
                            <div className={styles.statusBadge} style={{ 
                                backgroundColor: getStatusBgColor(shipment.status),
                                color: getStatusColor(shipment.status)
                            }}>
                                {shipment.status}
                            </div>
                            <div className={styles.currentLocation}>
                                <span className={styles.locationIcon}>📍</span>
                                <span>{shipment.currentLocation || 'Location unavailable'}</span>
                            </div>
                        </div>

                        {shipment.status === 'Delivered' && (
                            <div className={styles.card}>
                                <h2 className={styles.cardTitle}>Proof of Delivery (POD)</h2>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                                    Upload the signed POD document or image.
                                </p>
                                <input type="file" style={{ marginBottom: '1rem', width: '100%' }} />
                                <button className={styles.primaryButton} style={{ width: '100%' }}>
                                    Upload POD
                                </button>
                            </div>
                        )}

                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Assigned Driver</h2>
                            {currentDriver ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                                    <div className={styles.driverAvatar}>
                                        {currentDriver.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p className={styles.driverName} style={{ fontWeight: 'bold', margin: '0' }}>{currentDriver.name}</p>
                                        <p className={styles.driverId} style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0' }}>ID: {currentDriver.id}</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0' }}>{currentDriver.vehicle}</p>
                                    </div>
                                    <button onClick={() => setIsDriverModalOpen(true)} className={styles.secondaryButton} style={{ width: '100%', marginTop: '0.5rem' }}>
                                        Reassign
                                    </button>
                                </div>
                            ) : (
                                <div style={{ marginTop: '1rem' }}>
                                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>No driver is currently assigned.</p>
                                    <button onClick={() => setIsDriverModalOpen(true)} className={styles.primaryButton} style={{ width: '100%' }}>
                                        Assign Driver
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
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

            {/* Driver Assignment Modal */}
            {isDriverModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div className={styles.card} style={{ width: '100%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto' }}>
                        <h3 className={styles.cardTitle}>Assign Driver</h3>
                        <p style={{ marginBottom: '1rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                            Select a driver in the same region ({shipment.currentLocation || shipment.origin}).
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {drivers.map(driver => {
                                const isSameRegion = (driver.location && shipment.currentLocation && driver.location.toLowerCase().includes(shipment.currentLocation.split(',')[0].toLowerCase())) ||
                                    (driver.location && shipment.origin && driver.location.toLowerCase().includes(shipment.origin.split(',')[0].toLowerCase()));

                                return (
                                    <div key={driver.id} style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
                                        backgroundColor: isSameRegion ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                                        borderColor: isSameRegion ? 'var(--color-success)' : 'var(--color-border)'
                                    }}>
                                        <div>
                                            <strong>{driver.name}</strong>
                                            {isSameRegion && <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--color-success)', background: '#d1fae5', padding: '2px 6px', borderRadius: '4px' }}>Recommended</span>}
                                            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>📍 {driver.location || 'Unknown'}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                assignShipmentToDriver(driver.id, shipment.id, shipment.status);
                                                setIsDriverModalOpen(false);
                                            }}
                                            className={styles.primaryButton}
                                            style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                                        >
                                            {currentDriver && currentDriver.id === driver.id ? 'Assigned' : 'Assign'}
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                        <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                            <button onClick={() => setIsDriverModalOpen(false)} className={styles.secondaryButton}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
`;

fs.writeFileSync(FILE_PATH, newContent);
console.log("File completely overwritten with structurally valid code.");
