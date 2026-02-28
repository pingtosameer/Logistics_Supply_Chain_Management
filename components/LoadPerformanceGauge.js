"use client";

import styles from "./DashboardBottomCards.module.css";
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Loaded', value: 7.43 },
    { name: 'Remaining', value: 7.57 }, // 15 - 7.43 to make a half circle represent 15000 scale appropriately
];

// Recharts doesn't have a native Gauge, but we can fake it with a half pie chart
const COLORS = ['#8B5CF6', '#E5E7EB'];

export default function LoadPerformanceGauge() {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Load performance</h3>
            </div>
            <div className={styles.gaugeContainer} style={{ position: 'relative', height: '250px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="100%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={80}
                            outerRadius={100}
                            paddingAngle={0}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                {/* Custom Labels for the Gauge */}
                <div style={{ position: 'absolute', bottom: '10px', width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0 20%' }}>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>7.43</span>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>tons</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>15000</span>
                </div>
            </div>
        </div>
    );
}
