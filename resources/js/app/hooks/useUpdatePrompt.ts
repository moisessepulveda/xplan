import { useState, useEffect } from 'react';

export function useUpdatePrompt() {
    const [hasUpdate, setHasUpdate] = useState(false);

    useEffect(() => {
        const handleUpdate = () => setHasUpdate(true);
        window.addEventListener('sw-update-available', handleUpdate);

        return () => {
            window.removeEventListener('sw-update-available', handleUpdate);
        };
    }, []);

    const applyUpdate = () => {
        window.location.reload();
    };

    return { hasUpdate, applyUpdate };
}
