import React from 'react';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

interface Props {
    reportType: string;
    params?: Record<string, string | number>;
}

export function ExportButton({ reportType, params = {} }: Props) {
    const handleExport = () => {
        const searchParams = new URLSearchParams({
            type: reportType,
            ...Object.fromEntries(
                Object.entries(params).map(([k, v]) => [k, String(v)])
            ),
        });

        window.location.href = `/reports/export?${searchParams.toString()}`;
    };

    return (
        <Button
            icon={<DownloadOutlined />}
            onClick={handleExport}
            size="small"
        >
            Exportar CSV
        </Button>
    );
}
