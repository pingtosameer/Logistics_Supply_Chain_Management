"use client";

import { useState } from "react";
import ShipmentTable from "./ShipmentTable";
import AssignDriverModal from "./AssignDriverModal";
import { useDriver } from "@/components/DriverContext";
import styles from "@/app/dashboard/shipments/page.module.css";

export default function ShipmentList({ initialShipments }) {
    const { drivers } = useDriver();
    const [filter, setFilter] = useState("all");
    const [assignmentFilter, setAssignmentFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [selectedShipmentForAssign, setSelectedShipmentForAssign] = useState(null);
    const [currentDriverForReassign, setCurrentDriverForReassign] = useState(null);

    const filteredShipments = initialShipments.filter(s => {
        const matchesStatus = filter === "all" || s.status === filter;
        const matchesSearch = s.id.toLowerCase().includes(search.toLowerCase()) ||
            s.recipient.toLowerCase().includes(search.toLowerCase());

        // Check assignment status
        const isAssigned = drivers.some(d => (d.recentAssignments || []).some(a => a.id === s.id));
        const matchesAssignment =
            assignmentFilter === "all" ||
            (assignmentFilter === "assigned" && isAssigned) ||
            (assignmentFilter === "unassigned" && !isAssigned);

        return matchesStatus && matchesSearch && matchesAssignment;
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
                    value={assignmentFilter}
                    onChange={(e) => setAssignmentFilter(e.target.value)}
                >
                    <option value="all">All Assignments</option>
                    <option value="assigned">Assigned Drivers</option>
                    <option value="unassigned">Unassigned Drivers</option>
                </select>
                <select
                    className={styles.filterSelect}
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">All Statuses</option>
                    <option value="Shipment Created & Pick Up Pending">Shipment Created & Pick Up Pending</option>
                    <option value="Pickup Done">Pickup Done</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Misrouted">Misrouted</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Returned">Returned</option>
                </select>
            </div>
            {filteredShipments.length > 0 ? (
                <ShipmentTable
                    shipments={filteredShipments}
                    drivers={drivers}
                    onAssign={(shipment, currentDriver) => {
                        setSelectedShipmentForAssign(shipment);
                        setCurrentDriverForReassign(currentDriver || null);
                    }}
                />
            ) : (
                <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-muted)" }}>
                    No shipments found matching your filters.
                </div>
            )}

            {selectedShipmentForAssign && (
                <AssignDriverModal
                    shipment={selectedShipmentForAssign}
                    currentDriver={currentDriverForReassign}
                    onClose={() => {
                        setSelectedShipmentForAssign(null);
                        setCurrentDriverForReassign(null);
                    }}
                />
            )}
        </div>
    );
}
