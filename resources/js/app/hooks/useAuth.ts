import { usePage } from '@inertiajs/react';
import type { PageProps, User } from '@/app/types';

export function useAuth() {
    const { auth } = usePage<PageProps>().props;

    return {
        user: auth.user,
        isAuthenticated: !!auth.user,
    };
}

export function useUser(): User | null {
    const { user } = useAuth();
    return user;
}
