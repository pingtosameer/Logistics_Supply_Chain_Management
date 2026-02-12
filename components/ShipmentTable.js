import Link from "next/link";
import styles from "./ShipmentTable.module.css";

export default function ShipmentTable({ shipments }) {
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
                            <td data-label="Actions">
                                <Link href={`/tracking/${shipment.id}`} className={styles.actionLink}>
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
