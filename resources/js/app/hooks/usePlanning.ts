import { usePage, router } from '@inertiajs/react';
import type { PageProps, Planning } from '@/app/types';

export function usePlanning() {
    const { planning, plannings } = usePage<PageProps>().props;

    const switchPlanning = (planningId: number) => {
        router.post(`/plannings/${planningId}/switch`);
    };

    return {
        planning,
        plannings: plannings || [],
        switchPlanning,
        hasPlanning: !!planning,
    };
}

export function useActivePlanning(): Planning | null {
    const { planning } = usePlanning();
    return planning;
}
