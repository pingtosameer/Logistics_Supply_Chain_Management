"use client";

import { useEffect } from 'react';
import { runMigration } from '@/lib/migrateData';

export default function MigrationRunner() {
    useEffect(() => {
        runMigration();
    }, []);

    return null;
}
