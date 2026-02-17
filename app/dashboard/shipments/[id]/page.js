
import { getShipmentById } from "@/lib/data";
import Timeline from "@/components/Timeline";
import ShipmentActions from "@/components/ShipmentActions";
import ClientShipmentView from "@/components/ClientShipmentView";
import styles from "./page.module.css";
import Link from "next/link";

export default async function ShipmentDetailPage({ params, searchParams }) {
    const { id } = await params;
    const { returnTo } = await searchParams || {};
    const shipment = await getShipmentById(id);

    if (!shipment) {
        return <ClientShipmentView id={id} />;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <Link href={returnTo || "/dashboard/shipments"} className={styles.backLink}>← Back</Link>
                    <h1 className={styles.title}>Shipment {shipment.id}</h1>
                </div>
                <div className={styles.actions}>
                    <ShipmentActions />
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
                                <p className={styles.value}>{new Date(shipment.estimatedDelivery).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Tracking History</h3>
                        <Timeline events={shipment.events} />
                    </div>
                </div>

                <div className={styles.sidebar}>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Current Status</h3>
                        <div className={styles.statusBox}>
                            <p className={styles.statusText}>{shipment.status}</p>
                            <p className={styles.locationText}>{shipment.currentLocation}</p>
                            <p className={styles.timeText}>Last updated: {new Date(shipment.lastUpdated).toLocaleString()}</p>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Assigned Driver</h3>
                        <div className={styles.driverInfo}>
                            <div className={styles.driverAvatar}>MS</div>
                            <div>
                                <p className={styles.driverName}>Mike Smith</p>
                                <p className={styles.driverId}>ID: DRV-442</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
