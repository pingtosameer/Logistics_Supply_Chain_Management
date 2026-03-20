import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DriverProvider } from "@/components/DriverContext";
import MigrationRunner from "@/components/MigrationRunner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Logistics Dashboard",
    description: "Internal dashboard and shipment tracking",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                <DriverProvider>
                    <MigrationRunner />
                    {children}
                </DriverProvider>
            </body>
        </html>
    );
}
