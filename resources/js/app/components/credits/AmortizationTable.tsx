import React from 'react';
import { Typography, Tag } from 'antd';
import type { CreditInstallment } from '@/app/types';

interface AmortizationTableProps {
    installments: CreditInstallment[];
    formatCurrency: (amount: number) => string;
    onPayClick?: (installment: CreditInstallment) => void;
}

export function AmortizationTable({ installments, formatCurrency, onPayClick }: AmortizationTableProps) {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr + 'T12:00:00');
        return date.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: '2-digit' });
    };

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                    <tr style={{ backgroundColor: '#fafafa', borderBottom: '2px solid #f0f0f0' }}>
                        <th style={{ padding: '8px 6px', textAlign: 'left' }}>#</th>
                        <th style={{ padding: '8px 6px', textAlign: 'left' }}>Vencimiento</th>
                        <th style={{ padding: '8px 6px', textAlign: 'right' }}>Capital</th>
                        <th style={{ padding: '8px 6px', textAlign: 'right' }}>Interés</th>
                        <th style={{ padding: '8px 6px', textAlign: 'right' }}>Cuota</th>
                        <th style={{ padding: '8px 6px', textAlign: 'center' }}>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {installments.map((inst) => (
                        <tr
                            key={inst.id}
                            style={{
                                borderBottom: '1px solid #f5f5f5',
                                backgroundColor: inst.status === 'paid' ? '#f6ffed' : inst.is_overdue ? '#fff2f0' : 'transparent',
                                cursor: onPayClick && inst.status !== 'paid' ? 'pointer' : 'default',
                            }}
                            onClick={() => {
                                if (onPayClick && inst.status !== 'paid') {
                                    onPayClick(inst);
                                }
                            }}
                        >
                            <td style={{ padding: '8px 6px' }}>
                                <Typography.Text style={{ fontSize: 12 }}>{inst.number}</Typography.Text>
                            </td>
                            <td style={{ padding: '8px 6px' }}>
                                <Typography.Text style={{ fontSize: 12 }}>{formatDate(inst.due_date)}</Typography.Text>
                            </td>
                            <td style={{ padding: '8px 6px', textAlign: 'right' }}>
                                <Typography.Text style={{ fontSize: 12 }}>{formatCurrency(inst.principal)}</Typography.Text>
                            </td>
                            <td style={{ padding: '8px 6px', textAlign: 'right' }}>
                                <Typography.Text style={{ fontSize: 12 }}>{formatCurrency(inst.interest)}</Typography.Text>
                            </td>
                            <td style={{ padding: '8px 6px', textAlign: 'right' }}>
                                <Typography.Text strong style={{ fontSize: 12 }}>{formatCurrency(inst.amount)}</Typography.Text>
                            </td>
                            <td style={{ padding: '8px 6px', textAlign: 'center' }}>
                                <Tag
                                    color={inst.status_color}
                                    style={{ fontSize: 10, margin: 0, lineHeight: '18px', padding: '0 4px' }}
                                >
                                    {inst.status_label}
                                </Tag>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
