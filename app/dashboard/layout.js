import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { SidebarProvider } from "@/components/SidebarContext";
import styles from "./layout.module.css";

export default function DashboardLayout({ children }) {
    return (
        <SidebarProvider>
            <div className={styles.container}>
                <Sidebar />
                <div className={styles.mainContent}>
                    <TopBar />
                    <main className={styles.pageContent}>
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
