import styles from "./StatsCard.module.css";

export default function StatsCard({ title, value, icon, trend, trendUp }) {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <span className={styles.title}>{title}</span>
                <span className={styles.icon}>{icon}</span>
            </div>
            <div className={styles.body}>
                <h3 className={styles.value}>{value}</h3>
                {trend && (
                    <span className={`${styles.trend} ${trendUp ? styles.up : styles.down}`}>
                        {trendUp ? '↑' : '↓'} {trend}
                    </span>
                )}
            </div>
        </div>
    );
}
