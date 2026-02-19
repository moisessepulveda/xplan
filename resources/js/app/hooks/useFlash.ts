import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { message } from 'antd';
import type { PageProps } from '@/app/types';

export function useFlash() {
    const { flash } = usePage<PageProps>().props;

    useEffect(() => {
        if (flash.success) {
            message.success(flash.success);
        }
        if (flash.error) {
            message.error(flash.error);
        }
        if (flash.warning) {
            message.warning(flash.warning);
        }
        if (flash.info) {
            message.info(flash.info);
        }
    }, [flash]);

    return flash;
}
