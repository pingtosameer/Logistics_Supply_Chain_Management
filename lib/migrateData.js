import { ref, get, set } from 'firebase/database';
import { database } from './firebase';

export async function runMigration() {
    if (typeof window === 'undefined') return;

    // Check if migration already done
    if (localStorage.getItem('firebase_migration_done') === 'true') {
        return;
    }

    try {
        console.log("Checking Firebase to see if migration is needed...");

        // We will check shipments, pods, and drivers
        const shipmentsRef = ref(database, 'shipments');
        const podsRef = ref(database, 'pods');
        const driversRef = ref(database, 'drivers');

        const [shipmentsSnap, podsSnap, driversSnap] = await Promise.all([
            get(shipmentsRef),
            get(podsRef),
            get(driversRef)
        ]);

        let migratedAny = false;

        // Migrate shipments
        if (!shipmentsSnap.exists()) {
            const localShipments = localStorage.getItem('local_shipments');
            if (localShipments) {
                const parsed = JSON.parse(localShipments);
                if (parsed.length > 0) {
                    console.log(`Migrating ${parsed.length} shipments to Firebase...`);
                    await set(shipmentsRef, parsed);
                    migratedAny = true;
                }
            }
        }

        // Migrate pods
        if (!podsSnap.exists()) {
            const localPods = localStorage.getItem('local_pods');
            if (localPods) {
                const parsed = JSON.parse(localPods);
                if (Object.keys(parsed).length > 0) {
                    console.log(`Migrating pods to Firebase...`);
                    await set(podsRef, parsed);
                    migratedAny = true;
                }
            }
        }

        // Migrate drivers
        if (!driversSnap.exists()) {
            const localDrivers = localStorage.getItem('drivers');
            if (localDrivers) {
                const parsed = JSON.parse(localDrivers);
                if (parsed.length > 0) {
                    console.log(`Migrating ${parsed.length} drivers to Firebase...`);
                    await set(driversRef, parsed);
                    migratedAny = true;
                }
            }
        }

        if (migratedAny) {
            console.log("Migration to Firebase complete!");
        } else {
            console.log("Firebase already has data or local storage is empty. No migration needed.");
        }

        // Mark as done so we don't query Firebase structure unnecessarily on every reload
        localStorage.setItem('firebase_migration_done', 'true');

    } catch (error) {
        console.error("Migration failed:", error);
    }
}
