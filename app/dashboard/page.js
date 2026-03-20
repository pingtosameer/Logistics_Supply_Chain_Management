"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllShipments } from "@/lib/data";
import { ref, get } from "firebase/database";
import { database } from "@/lib/firebase";
import StatsCard from "@/components/StatsCard";
import RecentActivityChart from "@/components/RecentActivityChart";
import styles from "./page.module.css";

export default function DashboardPage() {
    const [stats, setStats] = useState({
        total: 0,
        inTransit: 0,
        delivered: 0,
        delayed: 0,
        exceptions: 0,
        actionRequired: 0,
        openPickups: 0
    });

    // Chart Filters State
    const [chartRegion, setChartRegion] = useState("All");
    const [chartStatus, setChartStatus] = useState("All");
    const [availableRegions, setAvailableRegions] = useState([]);

    const [allShipmentsRaw, setAllShipmentsRaw] = useState([]);
    const [chartData1, setChartData1] = useState([]);
    const [chartData2, setChartData2] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadInitialData = async () => {
            const serverShipments = await getAllShipments();

            const shipmentsRef = ref(database, 'shipments');
            const snapshot = await get(shipmentsRef);
            let localShipments = [];
            if (snapshot.exists()) {
                const data = snapshot.val();
                localShipments = Array.isArray(data) ? data.filter(Boolean) : Object.values(data);
            }

            // Deduplicate: local overrides server
            const localIds = new Set(localShipments.map(s => s.id));
            const filteredServer = serverShipments.filter(s => !localIds.has(s.id));

            const allShipments = [...localShipments, ...filteredServer];

            // Extract unique regions properly by taking the state/city from origin
            const regions = new Set();
            allShipments.forEach(s => {
                if (s.origin) {
                    const parts = s.origin.split(',');
                    const region = parts[parts.length - 1].trim();
                    regions.add(region);
                }
            });
            setAvailableRegions(Array.from(regions).sort());
            setAllShipmentsRaw(allShipments);

            // Calculate Open Pickups 
            const mockPickups = [
                { id: "PU-10023", status: "Shipment Created & Pick Up Pending" },
                { id: "PU-10024", status: "Shipment Created & Pick Up Pending" },
                { id: "PU-10025", status: "Shipment Created & Pick Up Pending" },
                { id: "PU-10026", status: "Shipment Created & Pick Up Pending" },
                { id: "PU-10027", status: "Shipment Created & Pick Up Pending" }
            ];

            let activeOpenPickups = 0;
            mockPickups.forEach(p => {
                const localMatch = localShipments.find(s => s.id === p.id);
                if (!localMatch || localMatch.status === "Shipment Created & Pick Up Pending") {
                    activeOpenPickups++;
                }
            });

            // Calculate Global Granular Stats
            const exceptionsCount = allShipments.filter(s => s.status === 'Misrouted' || s.status === 'Returned').length;
            const actionRequiredCount = allShipments.filter(s => s.status === 'Shipment Created & Pick Up Pending' || s.status === 'Delayed').length;

            setStats({
                total: allShipments.length,
                inTransit: allShipments.filter(s => s.status === 'In Transit').length,
                delivered: allShipments.filter(s => s.status === 'Delivered').length,
                delayed: allShipments.filter(s => s.status === 'Delayed').length,
                exceptions: exceptionsCount,
                actionRequired: actionRequiredCount,
                openPickups: activeOpenPickups
            });

            setLoading(false);
        };

        loadInitialData();
    }, []);

    // Effect for re-calculating chart data when filters change
    useEffect(() => {
        if (allShipmentsRaw.length === 0) return;

        // Apply filters
        const filteredShipments = allShipmentsRaw.filter(s => {
            let matchesRegion = true;
            if (chartRegion !== "All" && s.origin) {
                const parts = s.origin.split(',');
                const region = parts[parts.length - 1].trim();
                matchesRegion = region === chartRegion;
            }

            let matchesStatus = true;
            if (chartStatus !== "All") {
                matchesStatus = s.status === chartStatus;
            }

            return matchesRegion && matchesStatus;
        });

        const today = new Date();
        const volumeMap = {};
        const valueMap = {};

        // Initialize last 7 days
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' });
            volumeMap[dateStr] = { volume: 0, value: 0 };
            valueMap[dateStr] = { exceptions: 0, delivered: 0 };
        }

        filteredShipments.forEach(shipment => {
            // Generate deterministic value
            const pseudoValue = (shipment.id.charCodeAt(shipment.id.length - 1) * 150) + 500;

            if (shipment.events) {
                shipment.events.forEach(event => {
                    const eventDate = new Date(event.date || event.timestamp);
                    const diffTime = Math.abs(today - eventDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays <= 7) {
                        const dateKey = eventDate.toLocaleDateString('en-US', { weekday: 'short' });
                        if (volumeMap[dateKey]) {
                            // Graph 1: Volume vs Value
                            if (event.status === 'Shipment Created & Pick Up Pending' || event.status === 'Order Placed' || event.status === 'Label Created' || event.status === 'Pickup Done') {
                                volumeMap[dateKey].volume++;
                                volumeMap[dateKey].value += pseudoValue;
                            }
                            // Graph 2: Valuable Information (Health)
                            if (event.status === 'Delivered') {
                                valueMap[dateKey].delivered++;
                            } else if (event.status === 'Misrouted' || event.status === 'Returned' || event.status === 'Delayed') {
                                valueMap[dateKey].exceptions++;
                            }
                        }
                    }
                });
            }
        });

        // Format for Recharts
        const cData1 = Object.keys(volumeMap).map(key => ({
            name: key,
            Volume: volumeMap[key].volume,
            Value: volumeMap[key].value
        }));

        const cData2 = Object.keys(valueMap).map(key => ({
            name: key,
            Delivered: valueMap[key].delivered,
            Exceptions: valueMap[key].exceptions
        }));

        setChartData1(cData1);
        setChartData2(cData2);

    }, [chartRegion, chartStatus, allShipmentsRaw]);

    if (loading) {
        return <div style={{ padding: '2rem' }}>Loading dashboard statistics...</div>;
    }

    return (
        <div>
            <div className={styles.grid}>
                <Link href="/dashboard/shipments" style={{ textDecoration: 'none' }}>
                    <StatsCard
                        title="Total Shipments"
                        value={stats.total}
                        icon="📦"
                        trend="12% vs last month"
                        trendUp={true}
                    />
                </Link>
                <Link href="/dashboard/pickups" style={{ textDecoration: 'none' }}>
                    <StatsCard
                        title="Open Pickups"
                        value={stats.openPickups}
                        icon="🏪"
                        trend="Awaiting Assignment"
                        trendUp={false}
                    />
                </Link>
                <Link href="/dashboard/shipments?status=In%20Transit" style={{ textDecoration: 'none' }}>
                    <StatsCard
                        title="In Transit"
                        value={stats.inTransit}
                        icon="🚚"
                        trend="5% vs last week"
                        trendUp={true}
                    />
                </Link>
                <Link href="/dashboard/shipments?status=Delivered" style={{ textDecoration: 'none' }}>
                    <StatsCard
                        title="Delivered"
                        value={stats.delivered}
                        icon="✅"
                    />
                </Link>
                <Link href="/dashboard/shipments?status=ActionRequired" style={{ textDecoration: 'none' }}>
                    <StatsCard
                        title="Action Required"
                        value={stats.actionRequired}
                        icon="⚡"
                        trend="Pending pickups/delays"
                        trendUp={false}
                    />
                </Link>
                <Link href="/dashboard/shipments?status=Exceptions" style={{ textDecoration: 'none' }}>
                    <StatsCard
                        title="Exceptions"
                        value={stats.exceptions}
                        icon="⚠️"
                        trend="Misrouted/Returned"
                        trendUp={false}
                    />
                </Link>
            </div>

            <div className={styles.section}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h2 className={styles.sectionTitle} style={{ margin: 0 }}>Analytics Dashboards</h2>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <select
                            value={chartRegion}
                            onChange={e => setChartRegion(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)' }}
                        >
                            <option value="All">All Regions (Origin)</option>
                            {availableRegions.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <select
                            value={chartStatus}
                            onChange={e => setChartStatus(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)' }}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Shipment Created & Pick Up Pending">Pending Pickups</option>
                            <option value="In Transit">In Transit</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Delayed">Delayed</option>
                        </select>
                    </div>
                </div>

                {/* 1 Row 1 Graph layout */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <RecentActivityChart data1={chartData1} data2={chartData2} />
                </div>
            </div>
        </div>
    );
}
