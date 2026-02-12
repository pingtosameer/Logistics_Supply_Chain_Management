
import styles from "./page.module.css";
import TrackingInput from "@/components/TrackingInput";
import Link from "next/link";

export default function Home() {
    return (
        <main className={styles.container}>
            {/* Section 1: Customer Tracking */}
            <section className={styles.trackSection}>
                <div className={styles.contentWrapper}>
                    <div className={styles.badge}>Live Tracking</div>
                    <h1 className={styles.trackTitle}>
                        Track your <br />
                        <span className={styles.highlight}>Indian Shipment.</span>
                    </h1>
                    <p className={styles.trackSubtitle}>
                        Enter your tracking ID (e.g., TRK-IN-849201) to get real-time updates from our courier partners.
                    </p>
                    <TrackingInput />
                    <div className={styles.partners}>
                        <span>Powered by:</span>
                        <div className={styles.partnerList}>
                            <span>Delhivery</span>
                            <span>BlueDart</span>
                            <span>Ecom Express</span>
                            <span>XpressBees</span>
                        </div>
                    </div>

                    <div className={styles.demoIdsContainer}>
                        <span className={styles.demoLabel}>Try these Demo IDs:</span>
                        <div className={styles.marquee}>
                            <div className={styles.marqueeContent}>
                                <span>TRK-IN-849201 (In Transit)</span>
                                <span>TRK-IN-392104 (Delayed)</span>
                                <span>TRK-IN-102938 (Delivered)</span>
                                <span>TRK-IN-556677 (Pending)</span>
                                {/* Duplicate for seamless loop */}
                                <span>TRK-IN-849201 (In Transit)</span>
                                <span>TRK-IN-392104 (Delayed)</span>
                                <span>TRK-IN-102938 (Delivered)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2 & 3: Role Selection */}
            <section className={styles.rolesSection}>
                <div className={styles.roleCard}>
                    <div className={styles.roleIcon}>🏢</div>
                    <h2 className={styles.roleTitle}>For Brands & Sellers</h2>
                    <p className={styles.roleDesc}>
                        Manage your bulk shipments, book new pickups, and view analytics.
                    </p>
                    <Link href="/brand" className={styles.roleBtn}>Seller Login</Link>
                </div>

                <div className={styles.roleCard}>
                    <div className={styles.roleIcon}>🚚</div>
                    <h2 className={styles.roleTitle}>Partner & Employee</h2>
                    <p className={styles.roleDesc}>
                        Internal dashboard for logistics operations, riders, and hub managers.
                    </p>
                    <Link href="/dashboard" className={`${styles.roleBtn} ${styles.primaryBtn}`}>
                        Employee Login
                    </Link>
                </div>
            </section>

            <div className={styles.backgroundDecoration}></div>
        </main>
    );
}
