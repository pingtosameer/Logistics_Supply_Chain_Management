
import { getShipmentById } from "@/lib/data";
import styles from "./page.module.css";
import Link from "next/link";
import Timeline from "@/components/Timeline";

export default async function TrackingPage({ params, searchParams }) {
    const { id } = await params;
    const { returnTo } = await searchParams || {};
    const shipment = await getShipmentById(id);

    if (!shipment) {
        return (
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.errorCard}>
                        <h1>Shipment Not Found</h1>
                        <p>We could not find a shipment with ID: <strong>{id}</strong></p>
                        <Link href="/" className={styles.backButton}>Try Another ID</Link>
                    </div>
                </div>
            </main>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "Delivered": return "var(--color-success)";
            case "In Transit": return "var(--color-secondary)";
            case "Delayed": return "var(--color-error)";
            case "Shipment Created & Pick Up Pending": return "var(--color-accent)";
            default: return "var(--color-text-muted)";
        }
    };

    // Determine progress percentage based on status
    const getProgress = (status) => {
        switch (status) {
            case "Shipment Created & Pick Up Pending": return 10;
            case "In Transit": return 60;
            case "Delayed": return 60;
            case "Delivered": return 100;
            default: return 0;
        }
    };

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <Link href={returnTo || "/"} className={styles.backLink}>← Back</Link>

                <div className={styles.header}>
                    <div>
                        <span className={styles.label}>Tracking ID</span>
                        <h1 className={styles.trackingId}>{shipment.id}</h1>
                    </div>
                    <div className={styles.statusBadge} style={{ backgroundColor: getStatusColor(shipment.status) }}>
                        {shipment.status}
                    </div>
                </div>

                {/* Visual Journey Map */}
                <div className={styles.journeyMap}>
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${getProgress(shipment.status)}%`, backgroundColor: getStatusColor(shipment.status) }}></div>
                    </div>
                    <div className={styles.points}>
                        <div className={styles.point}>
                            <div className={`${styles.dot} ${styles.activePoint}`}></div>
                            <span className={styles.pointLabel}>{shipment.origin.split(',')[0]}</span>
                        </div>
                        <div className={styles.point}>
                            <div className={`${styles.dot} ${shipment.status !== 'Shipment Created & Pick Up Pending' ? styles.activePoint : ''}`} style={{ borderColor: getStatusColor(shipment.status) }}></div>
                            <span className={styles.pointLabel}>In Transit</span>
                        </div>
                        <div className={styles.point}>
                            <div className={`${styles.dot} ${shipment.status === 'Delivered' ? styles.activePoint : ''}`}></div>
                            <span className={styles.pointLabel}>{shipment.destination.split(',')[0]}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.detailsGrid}>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Current Status</h3>
                        <p className={styles.cardValue}>{shipment.status}</p>
                        <p className={styles.cardSub}>{shipment.currentLocation}</p>
                        <p className={styles.timestamp}>Last updated: {new Date(shipment.lastUpdated).toLocaleString()}</p>
                    </div>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Estimated Delivery</h3>
                        <p className={styles.cardValue}>{new Date(shipment.estimatedDelivery).toLocaleDateString()}</p>
                        <p className={styles.cardSub}>By End of Day</p>
                    </div>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Courier Partner</h3>
                        <p className={styles.cardValue}>{shipment.courier || "Unknown"}</p>
                        <p className={styles.cardSub}>Expedited Service</p>
                    </div>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Origin & Destination</h3>
                        <div className={styles.route}>
                            <span>{shipment.origin}</span>
                            <span className={styles.arrow}>→</span>
                            <span>{shipment.destination}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.timelineSection}>
                    <h2 className={styles.sectionTitle}>Shipment Progress</h2>
                    <Timeline events={shipment.events} />
                </div>
            </div>
        </main>
    );
}
