"use client";

import { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart } from 'recharts';

const fallbackData1 = [
    { name: 'Mon', Volume: 15, Value: 12500 },
    { name: 'Tue', Volume: 20, Value: 18000 },
    { name: 'Wed', Volume: 28, Value: 24500 },
    { name: 'Thu', Volume: 25, Value: 21000 },
    { name: 'Fri', Volume: 35, Value: 30000 },
    { name: 'Sat', Volume: 18, Value: 14000 },
    { name: 'Sun', Volume: 12, Value: 9500 },
];

const fallbackData2 = [
    { name: 'Mon', Delivered: 15, Exceptions: 2 },
    { name: 'Tue', Delivered: 20, Exceptions: 1 },
    { name: 'Wed', Delivered: 28, Exceptions: 3 },
    { name: 'Thu', Delivered: 25, Exceptions: 0 },
    { name: 'Fri', Delivered: 35, Exceptions: 4 },
    { name: 'Sat', Delivered: 18, Exceptions: 1 },
    { name: 'Sun', Delivered: 12, Exceptions: 0 },
];

const DarkTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '12px', boxShadow: 'var(--shadow-md)' }}>
                <p style={{ color: 'var(--color-text)', margin: '0 0 8px 0', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                {payload.map((entry, index) => (
                    <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.color }}></div>
                        <span style={{ color: 'var(--color-text)', fontSize: '14px', fontWeight: '500' }}>
                            {entry.name}: {entry.name.includes('Value') ? `₹${entry.value.toLocaleString()}` : entry.value}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default function RecentActivityChart({ data1, data2 }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleResize = () => setIsMobile(window.innerWidth < 768);
            handleResize();
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    const chartData1 = data1 && data1.length > 0 ? data1 : fallbackData1;
    const chartData2 = data2 && data2.length > 0 ? data2 : fallbackData2;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>

            {/* Chart 1: Volume vs Value */}
            {!isMobile ? (
                <div style={{ width: '100%', height: 420, background: '#ffffff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', color: '#1e293b', margin: 0, fontWeight: 700, letterSpacing: '-0.02em' }}>Shipments & Value Overview</h3>
                    </div>

                    <div style={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', height: '88%' }}>
                        <div style={{ minWidth: '600px', height: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={chartData1} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />

                                    <XAxis
                                        dataKey="name"
                                        stroke="var(--color-text-muted)"
                                        tick={{ fill: 'var(--color-text-muted)', fontSize: 13, fontWeight: 500 }}
                                        axisLine={{ stroke: 'var(--color-border)' }}
                                        tickLine={false}
                                        dy={15}
                                    />
                                    <YAxis
                                        yAxisId="left"
                                        stroke="var(--color-text-muted)"
                                        allowDecimals={false}
                                        tick={{ fill: 'var(--color-text-muted)', fontSize: 13 }}
                                        axisLine={false}
                                        tickLine={false}
                                        dx={-15}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        stroke="var(--color-text-muted)"
                                        tick={{ fill: 'var(--color-text-muted)', fontSize: 13 }}
                                        axisLine={false}
                                        tickLine={false}
                                        dx={15}
                                        tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                                    />

                                    <Tooltip content={<DarkTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                    <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '25px', fontSize: '13px', fontWeight: 500, color: '#334155' }} />

                                    <Area yAxisId="left" type="linear" dataKey="Volume" name="Shipment Volume" stroke="#2563eb" strokeWidth={3} fill="#2563eb" fillOpacity={0.08} activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }} />
                                    <Area yAxisId="right" type="linear" dataKey="Value" name="Total Value (₹)" stroke="#059669" strokeWidth={3} fill="#059669" fillOpacity={0.08} activeDot={{ r: 6, strokeWidth: 0, fill: '#059669' }} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Chart 1a: Volume Only */}
                    <div style={{ width: '100%', height: 360, background: '#ffffff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', color: '#1e293b', margin: 0, fontWeight: 700, letterSpacing: '-0.02em' }}>Shipment Volume</h3>
                        </div>

                        <div style={{ width: '100%', height: '88%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData1} margin={{ top: 10, right: 0, left: -25, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
                                    <XAxis dataKey="name" stroke="var(--color-text-muted)" tick={{ fill: 'var(--color-text-muted)', fontSize: 10, fontWeight: 500 }} axisLine={{ stroke: 'var(--color-border)' }} tickLine={false} dy={10} interval={0} />
                                    <YAxis stroke="var(--color-text-muted)" allowDecimals={false} tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} dx={-5} />
                                    <Tooltip content={<DarkTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                    <Legend verticalAlign="top" align="center" iconType="circle" wrapperStyle={{ paddingBottom: '15px', fontSize: '11px', fontWeight: 500, color: '#334155', width: '100%' }} />
                                    <Area type="linear" dataKey="Volume" name="Shipment Volume" stroke="#2563eb" strokeWidth={3} fill="#2563eb" fillOpacity={0.08} activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Chart 1b: Value Only */}
                    <div style={{ width: '100%', height: 360, background: '#ffffff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', color: '#1e293b', margin: 0, fontWeight: 700, letterSpacing: '-0.02em' }}>Total Value</h3>
                        </div>

                        <div style={{ width: '100%', height: '88%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData1} margin={{ top: 10, right: 0, left: -10, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
                                    <XAxis dataKey="name" stroke="var(--color-text-muted)" tick={{ fill: 'var(--color-text-muted)', fontSize: 10, fontWeight: 500 }} axisLine={{ stroke: 'var(--color-border)' }} tickLine={false} dy={10} interval={0} />
                                    <YAxis stroke="var(--color-text-muted)" tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} dx={-5} tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
                                    <Tooltip content={<DarkTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                    <Legend verticalAlign="top" align="center" iconType="circle" wrapperStyle={{ paddingBottom: '15px', fontSize: '11px', fontWeight: 500, color: '#334155', width: '100%' }} />
                                    <Area type="linear" dataKey="Value" name="Total Value (₹)" stroke="#059669" strokeWidth={3} fill="#059669" fillOpacity={0.08} activeDot={{ r: 6, strokeWidth: 0, fill: '#059669' }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}

            {/* Chart 2: Health Info */}
            <div style={{ width: '100%', height: 420, background: 'var(--color-surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text)', margin: 0, fontWeight: 700, letterSpacing: '-0.02em' }}>Delivery Health & Exception Tracking</h3>
                </div>

                <div style={{ width: '100%', height: '88%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData2} margin={{ top: 10, right: isMobile ? 0 : 10, left: isMobile ? -25 : 10, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />

                            <XAxis
                                dataKey="name"
                                stroke="var(--color-text-muted)"
                                tick={{ fill: 'var(--color-text-muted)', fontSize: isMobile ? 10 : 13, fontWeight: 500 }}
                                axisLine={{ stroke: 'var(--color-border)' }}
                                tickLine={false}
                                dy={10}
                                interval={isMobile ? 0 : 'preserveStartEnd'}
                            />
                            <YAxis
                                stroke="var(--color-text-muted)"
                                allowDecimals={false}
                                tick={{ fill: 'var(--color-text-muted)', fontSize: isMobile ? 10 : 13 }}
                                axisLine={false}
                                tickLine={false}
                                dx={-5}
                            />

                            <Tooltip content={<DarkTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                            <Legend verticalAlign="top" align={isMobile ? "center" : "right"} iconType="circle" wrapperStyle={{ paddingBottom: '15px', fontSize: isMobile ? '11px' : '13px', fontWeight: 500, color: '#334155', width: '100%', left: 0 }} />

                            <Area type="linear" dataKey="Delivered" name="Completed Deliveries" stroke="#4f46e5" strokeWidth={3} fill="#4f46e5" fillOpacity={0.08} activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }} />
                            <Area type="linear" dataKey="Exceptions" name="Exceptions (Delayed/Returned)" stroke="#dc2626" strokeWidth={3} fill="#dc2626" fillOpacity={0.08} activeDot={{ r: 6, strokeWidth: 0, fill: '#dc2626' }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
}
