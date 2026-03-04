"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ShipmentTable from "./ShipmentTable";
import AssignDriverModal from "./AssignDriverModal";
import { useDriver } from "@/components/DriverContext";
import styles from "@/app/dashboard/shipments/page.module.css";

function ShipmentListContent({ initialShipments }) {
    const searchParams = useSearchParams();
    const statusQuery = searchParams.get('status');
    const { drivers } = useDriver();
    const [filter, setFilter] = useState(statusQuery || "all");
    const [assignmentFilter, setAssignmentFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [selectedShipmentForAssign, setSelectedShipmentForAssign] = useState(null);
    const [currentDriverForReassign, setCurrentDriverForReassign] = useState(null);

    useEffect(() => {
        if (statusQuery) {
            setFilter(statusQuery);
        }
    }, [statusQuery]);

    const filteredShipments = initialShipments.filter(s => {
        let matchesStatus = false;
        if (filter === "all") matchesStatus = true;
        else if (filter === "ActionRequired") {
            matchesStatus = s.status === 'Shipment Created & Pick Up Pending' || s.status === 'Delayed';
        } else if (filter === "Exceptions") {
            matchesStatus = s.status === 'Misrouted' || s.status === 'Returned';
        } else {
            matchesStatus = s.status === filter;
        }

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
                    <option value="ActionRequired">Action Required (Pending/Delayed)</option>
                    <option value="Exceptions">Exceptions (Misrouted/Returned)</option>
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

export default function ShipmentList({ initialShipments }) {
    return (
        <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading shipments...</div>}>
            <ShipmentListContent initialShipments={initialShipments} />
        </Suspense>
    );
}
