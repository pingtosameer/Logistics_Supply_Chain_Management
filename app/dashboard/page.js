
import { getDashboardStats } from "@/lib/data";
import StatsCard from "@/components/StatsCard";
import RecentActivityChart from "@/components/RecentActivityChart";
import styles from "./page.module.css";

export default async function DashboardPage() {
    const stats = await getDashboardStats();

    return (
        <div>
            <h1 className={styles.pageTitle}>Dashboard Overview</h1>
            <div className={styles.grid}>
                <StatsCard
                    title="Total Shipments"
                    value={stats.total}
                    icon="📦"
                    trend="12% vs last month"
                    trendUp={true}
                />
                <StatsCard
                    title="In Transit"
                    value={stats.inTransit}
                    icon="🚚"
                    trend="5% vs last week"
                    trendUp={true}
                />
                <StatsCard
                    title="Delivered"
                    value={stats.delivered}
                    icon="✅"
                />
                <StatsCard
                    title="Delayed"
                    value={stats.delayed}
                    icon="⚠️"
                    trend="2% vs last week"
                    trendUp={false}
                />
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Recent Activity</h2>
                <div className={styles.chartContainer}>
                    <RecentActivityChart />
                </div>
            </div>
        </div>
    );
}
