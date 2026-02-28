import Link from "next/link";
import styles from "./ShipmentTable.module.css";

export default function ShipmentTable({ shipments, drivers = [], onAssign }) {
    const getStatusClass = (status) => {
        switch (status) {
            case "Delivered": return styles.statusDelivered;
            case "In Transit": return styles.statusInTransit;
            case "Delayed": return styles.statusDelayed;
            case "Pending": return styles.statusPending;
            default: return "";
        }
    };

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Tracking ID</th>
                        <th>Status</th>
                        <th>Origin</th>
                        <th>Destination</th>
                        <th>Est. Delivery</th>
                        <th>Assigned Driver</th>
                        <th>Assignment</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {shipments.map((shipment) => (
                        <tr key={shipment.id}>
                            <td className={styles.idCell} data-label="Tracking ID">{shipment.id}</td>
                            <td data-label="Status">
                                <span className={`${styles.statusBadge} ${getStatusClass(shipment.status)}`}>
                                    {shipment.status}
                                </span>
                            </td>
                            <td data-label="Origin">{shipment.origin}</td>
                            <td data-label="Destination">{shipment.destination}</td>
                            <td data-label="Est. Delivery">{new Date(shipment.estimatedDelivery).toLocaleDateString()}</td>
                            <td data-label="Assigned Driver">
                                {(() => {
                                    const assignedDriver = drivers.find(d =>
                                        (d.recentAssignments || []).some(a => a.id === shipment.id)
                                    );

                                    if (assignedDriver) {
                                        return <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{assignedDriver.name}</span>;
                                    }

                                    return <span style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', fontSize: '0.85rem' }}>Unassigned</span>;
                                })()}
                            </td>
                            <td data-label="Assignment">
                                {(() => {
                                    const assignedDriver = drivers.find(d =>
                                        (d.recentAssignments || []).some(a => a.id === shipment.id)
                                    );

                                    const isDelivered = shipment.status === 'Delivered';

                                    if (assignedDriver) {
                                        return (
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                {!isDelivered ? (
                                                    <button className={styles.assignLink} style={{ padding: '0.15rem 0.4rem', fontSize: '0.75rem', marginLeft: 0 }} onClick={() => onAssign(shipment, assignedDriver)}>
                                                        Reassign
                                                    </button>
                                                ) : (
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600 }}>Completed</span>
                                                )}
                                            </div>
                                        );
                                    }

                                    return (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                            <button className={styles.assignLink} style={{ padding: '0.15rem 0.4rem', fontSize: '0.75rem', marginLeft: 0 }} onClick={() => onAssign(shipment)}>
                                                Assign
                                            </button>
                                        </div>
                                    );
                                })()}
                            </td>
                            <td data-label="Actions">
                                <Link href={`/dashboard/shipments/${shipment.id}`} className={styles.actionLink}>
                                    View
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
