"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "./SidebarContext";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
    const pathname = usePathname();
    const { isSidebarOpen, closeSidebar } = useSidebar();

    const links = [
        { href: "/dashboard", label: "Overview", icon: "📊" },
        { href: "/dashboard/shipments", label: "Shipments", icon: "📦" },
        { href: "/dashboard/pickups", label: "Open Pickups", icon: "🏭" },
        { href: "/dashboard/drivers", label: "Drivers", icon: "🚚" },
        { href: "/dashboard/pods", label: "Uploaded PODs", icon: "📄" },
        { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`${styles.overlay} ${isSidebarOpen ? styles.visible : ''}`}
                onClick={closeSidebar}
            />

            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
                <div className={styles.logo}>
                    <div className={styles.logoIcon}>L</div>
                    <span className={styles.logoText}>LogiTrack</span>
                    <button className={styles.closeBtn} onClick={closeSidebar}>×</button>
                </div>

                <nav className={styles.nav}>
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`${styles.link} ${isActive ? styles.active : ""}`}
                            >
                                <span className={styles.icon}>{link.icon}</span>
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className={styles.footer}>
                    <Link href="/" className={styles.homeBtn}>
                        <span className={styles.icon}>🏠</span>
                        Track Shipment
                    </Link>
                    <div className={styles.user} style={{ marginTop: '1rem' }}>
                        <div className={styles.avatar}>JD</div>
                        <div className={styles.userInfo}>
                            <p className={styles.userName}>John Doe</p>
                            <p className={styles.userRole}>Logistics Manager</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
