import Link from "next/link";
import styles from "./page.module.css";

export default function BrandDashboard() {
    return (
        <div className={styles.page}>
            <header className={styles.navbar}>
                <div className={styles.logo}>BrandPortal</div>
                <div className={styles.navLinks}>
                    <span className={styles.navLink}>Dashboard</span>
                    <span className={styles.navLink}>Shipments</span>
                    <span className={styles.navLink}>Billing</span>
                </div>
                <div className={styles.profile}>Myntra Designs</div>
            </header>

            <main className={styles.main}>
                <div className={styles.hero}>
                    <h1>Welcome back, Myntra!</h1>
                    <p>Here is what's happening with your shipments today.</p>
                    <button className={styles.createBtn}>+ Book New Shipment</button>
                </div>

                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <h3>Active Shipments</h3>
                        <div className={styles.statValue}>124</div>
                        <div className={styles.statTrend}>↑ 12 this week</div>
                    </div>
                    <div className={styles.statCard}>
                        <h3>Pending Pickup</h3>
                        <div className={styles.statValue}>45</div>
                        <div className={styles.statTrend}>Urgent</div>
                    </div>
                    <div className={styles.statCard}>
                        <h3>Total Spend</h3>
                        <div className={styles.statValue}>₹45.2k</div>
                        <div className={styles.statTrend}>This Month</div>
                    </div>
                </div>

                <div className={styles.recentOrders}>
                    <h2>Recent Orders</h2>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>ORD-9981</td>
                                <td>Priya Patel</td>
                                <td>Bangalore</td>
                                <td><span className={styles.tag}>Processing</span></td>
                                <td>₹1,299</td>
                            </tr>
                            <tr>
                                <td>ORD-9982</td>
                                <td>Amit Sharma</td>
                                <td>Delhi</td>
                                <td><span className={styles.tag}>Shipped</span></td>
                                <td>₹899</td>
                            </tr>
                            <tr>
                                <td>ORD-9983</td>
                                <td>Rahul Verma</td>
                                <td>Mumbai</td>
                                <td><span className={styles.tag}>Delivered</span></td>
                                <td>₹2,499</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
