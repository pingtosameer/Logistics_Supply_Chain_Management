"use client";

import styles from "./DashboardCards.module.css";

export default function WalletSummaryCard({ cargoBalance = "₹31,470", shiprocketBalance = "-₹66,31,439" }) {
    return (
        <div className={`${styles.card} ${styles.greenBorder}`} style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 className={styles.cardTitle}>Wallet Summary</h3>
            <div className={styles.walletContent}>
                <div className={styles.walletDetails}>
                    <div className={styles.walletRow}>
                        <span className={styles.walletLabel}>Cargo Wallet Balance</span>
                        <span className={styles.walletValue}>{cargoBalance}</span>
                    </div>
                    <div className={styles.walletRow}>
                        <span className={styles.walletLabel}>Shiprocket Wallet Balance</span>
                        <span className={styles.walletValueNegative}>{shiprocketBalance}</span>
                    </div>
                </div>
                <div className={styles.walletAction}>
                    <button className={styles.rechargeBtn}>⚡ Recharge Wallet</button>
                </div>
            </div>
            <div className={styles.cardFooter} style={{ borderTop: '1px solid var(--color-border)', marginTop: 'auto', paddingTop: 'var(--spacing-md)' }}>
                <span className={styles.billedInfo}>🕒 Billed ₹0 • Un billed ₹2,14,416 (approx.)</span>
            </div>
        </div>
    );
}
