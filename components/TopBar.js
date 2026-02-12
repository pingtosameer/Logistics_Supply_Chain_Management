"use client";

import styles from "./TopBar.module.css";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useSidebar } from "./SidebarContext";

export default function TopBar() {
    const pathname = usePathname();
    const router = useRouter();
    const { toggleSidebar } = useSidebar();
    const [searchQuery, setSearchQuery] = useState("");
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, title: "New shipment TRK-IN-8899 assigned", time: "2 mins ago" },
        { id: 2, title: "Driver Suresh reported delay", time: "1 hour ago" },
        { id: 3, title: "System update scheduled", time: "5 hours ago" },
    ]);

    // Simple way to get page title
    const getTitle = () => {
        if (pathname === '/dashboard') return 'Overview';
        if (pathname.startsWith('/dashboard/shipments')) return 'Shipment Management';
        if (pathname.startsWith('/dashboard/drivers')) return 'Driver Fleet';
        if (pathname.startsWith('/dashboard/settings')) return 'Settings';
        return 'Dashboard';
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            // Redirect to shipments page with search (mock functionality)
            console.log("Searching for:", searchQuery);
            router.push(`/dashboard/shipments?search=${searchQuery}`);
        }
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    return (
        <header className={styles.header}>
            <div className={styles.leftSection}>
                <button className={styles.menuBtn} onClick={toggleSidebar}>
                    ☰
                </button>
                <h2 className={styles.title}>{getTitle()}</h2>
            </div>

            <div className={styles.actions}>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search..."
                        className={styles.searchInput}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                </div>

                <div style={{ position: 'relative' }}>
                    <button
                        className={styles.notificationBtn}
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        🔔
                        {notifications.length > 0 && <span className={styles.badge}></span>}
                    </button>

                    {showNotifications && (
                        <div className={styles.dropdown}>
                            <div className={styles.dropdownHeader}>
                                <span>Notifications</span>
                                <span className={styles.clearAll} onClick={clearNotifications}>Clear All</span>
                            </div>
                            <div className={styles.notificationList}>
                                {notifications.length === 0 ? (
                                    <div className={styles.notificationItem} style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                        No new notifications
                                    </div>
                                ) : (
                                    notifications.map(notif => (
                                        <div key={notif.id} className={styles.notificationItem} onClick={() => setShowNotifications(false)}>
                                            <div className={styles.notifTitle}>{notif.title}</div>
                                            <div className={styles.notifTime}>{notif.time}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
