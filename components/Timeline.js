import styles from "./Timeline.module.css";

export default function Timeline({ events }) {
    return (
        <div className={styles.timeline}>
            {events.map((event, index) => (
                <div key={index} className={styles.event}>
                    <div className={styles.marker}>
                        <div className={styles.dot}></div>
                        {index !== events.length - 1 && <div className={styles.line}></div>}
                    </div>
                    <div className={styles.content}>
                        <div className={styles.date}>
                            {new Date(event.date).toLocaleString()}
                        </div>
                        <h3 className={styles.status}>{event.status}</h3>
                        <p className={styles.location}>{event.location}</p>
                        <p className={styles.description}>{event.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
