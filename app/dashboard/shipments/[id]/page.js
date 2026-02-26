
import { getShipmentById } from "@/lib/data";
import Timeline from "@/components/Timeline";
import ShipmentActions from "@/components/ShipmentActions";
import ClientShipmentView from "@/components/ClientShipmentView";
import styles from "./page.module.css";
import Link from "next/link";

export default async function ShipmentDetailPage({ params, searchParams }) {
    const { id } = await params;
    const { returnTo } = await searchParams || {};
    const shipment = await getShipmentById(id);

    return (
        <ClientShipmentView id={id} initialShipment={shipment} returnTo={returnTo} />
    );
}
