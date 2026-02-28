import { getShipmentById } from "@/lib/data";
import ClientTrackingView from "@/components/ClientTrackingView";

export default async function TrackingPage({ params, searchParams }) {
    const { id } = await params;
    const { returnTo } = await searchParams || {};
    const shipment = await getShipmentById(id);

    return (
        <ClientTrackingView id={id} initialShipment={shipment} returnTo={returnTo} />
    );
}
