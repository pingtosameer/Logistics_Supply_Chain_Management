"use client";

import { useState } from "react";
import ShipmentTable from "./ShipmentTable";
import styles from "@/app/dashboard/shipments/page.module.css";

export default function ShipmentList({ initialShipments }) {
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");

    const filteredShipments = initialShipments.filter(s => {
        const matchesStatus = filter === "all" || s.status === filter;
        const matchesSearch = s.id.toLowerCase().includes(search.toLowerCase()) ||
            s.recipient.toLowerCase().includes(search.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <div className={styles.content}>
            <div className={styles.filters}>
                <input
                    type="text"
                    placeholder="Search shipments..."
                    className={styles.searchInput}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className={styles.filterSelect}
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">All Statuses</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Pending">Pending</option>
                </select>
            </div>
            {filteredShipments.length > 0 ? (
                <ShipmentTable shipments={filteredShipments} />
            ) : (
                <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-muted)" }}>
                    No shipments found matching your filters.
                </div>
            )}
        </div>
    );
}
