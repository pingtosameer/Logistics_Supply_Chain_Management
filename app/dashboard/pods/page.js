"use client";

import styles from "./page.module.css";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function PodsPage() {
    const [pods, setPods] = useState([]);
    const [selectedPod, setSelectedPod] = useState(null);

    useEffect(() => {
        // Fetch PODs and filter out any invalid entries
        const fetchPods = () => {
            const localPods = JSON.parse(localStorage.getItem('local_pods') || '[]');
            setPods(localPods);
        };
        fetchPods();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Uploaded PODs</h1>
                <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                    View and download Proof of Delivery documents.
                </p>
            </div>

            <div className={styles.grid}>
                {pods.map((pod, index) => (
                    <div key={index} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.trackingId}>{pod.shipmentId}</span>
                            <span className={styles.date}>{new Date(pod.date).toLocaleDateString()}</span>
                        </div>

                        <div
                            className={styles.documentPreview}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setSelectedPod(pod)}
                        >
                            <div style={{ textAlign: 'center' }}>
                                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>📄</span>
                                <span style={{ fontSize: '0.85rem' }}>Click to view Receipt</span>
                            </div>
                        </div>

                        <div className={styles.actions}>
                            <Link href={`/dashboard/shipments/${pod.shipmentId}`} style={{ textDecoration: 'none' }}>
                                <button className={styles.actionBtn}>
                                    View Shipment Details
                                </button>
                            </Link>
                        </div>
                    </div>
                ))}

                {pods.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)' }}>
                        <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📭</span>
                        <h3 style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>No PODs Uploaded Yet</h3>
                        <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                            Documents will appear here once drivers mark shipments as Delivered and upload their receipts.
                        </p>
                    </div>
                )}
            </div>

            {selectedPod && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000,
                    display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem'
                }} onClick={() => setSelectedPod(null)}>
                    <div style={{
                        background: 'white', padding: '2rem', borderRadius: '12px',
                        maxWidth: '600px', width: '100%', position: 'relative'
                    }} onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedPod(null)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                        >✕</button>

                        <h2 style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                            POD Receipt: {selectedPod.shipmentId}
                        </h2>

                        <div style={{
                            width: '100%', height: '400px', backgroundColor: '#f9fafb',
                            border: '2px dashed #ddd', borderRadius: '8px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <span style={{ fontSize: '4rem', marginBottom: '1rem' }}>🧾</span>
                            <h3 style={{ color: '#6b7280' }}>Mock Document Graphic</h3>
                            <p style={{ color: '#9ca3af', marginTop: '0.5rem' }}>Uploaded on: {new Date(selectedPod.date).toLocaleString()}</p>
                        </div>

                        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                className={styles.actionBtn}
                                style={{ width: 'auto', padding: '0.75rem 2rem' }}
                                onClick={() => {
                                    if (selectedPod.fileData && selectedPod.fileData.startsWith('data:')) {
                                        // Real file uploaded
                                        const a = document.createElement('a');
                                        a.href = selectedPod.fileData;
                                        a.download = selectedPod.fileName || `POD_${selectedPod.shipmentId}`;
                                        document.body.appendChild(a);
                                        a.click();
                                        document.body.removeChild(a);
                                    } else {
                                        // Fallback for old mock data
                                        const content = `Proof of Delivery Receipt\n\nTracking ID: ${selectedPod.shipmentId}\nDate Uploaded: ${new Date(selectedPod.date).toLocaleString()}\nStatus: Delivered\n\n[MOCK SIGNATURE/DOCUMENT DATA]`;
                                        const blob = new Blob([content], { type: 'text/plain' });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `POD_${selectedPod.shipmentId}.txt`;
                                        document.body.appendChild(a);
                                        a.click();
                                        document.body.removeChild(a);
                                        URL.revokeObjectURL(url);
                                    }
                                }}
                            >
                                Download Receipt
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
