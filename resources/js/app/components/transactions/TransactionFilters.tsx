import React from 'react';
import { Select, DatePicker, Input, Button, Drawer } from 'antd';
import { FilterOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons';
import { Account, Category, TransactionTypeOption } from '@/app/types';
import dayjs from 'dayjs';

interface FilterValues {
    type?: string;
    account_id?: number;
    category_id?: number;
    date_from?: string;
    date_to?: string;
    search?: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    filters: FilterValues;
    onApply: (filters: FilterValues) => void;
    onClear: () => void;
    transactionTypes: TransactionTypeOption[];
    accounts: Account[];
    categories: Category[];
}

export function TransactionFilters({
    open,
    onClose,
    filters,
    onApply,
    onClear,
    transactionTypes,
    accounts,
    categories,
}: Props) {
    const [localFilters, setLocalFilters] = React.useState<FilterValues>(filters);

    React.useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    const updateFilter = (key: string, value: unknown) => {
        setLocalFilters((prev) => ({ ...prev, [key]: value || undefined }));
    };

    const handleApply = () => {
        onApply(localFilters);
        onClose();
    };

    const handleClear = () => {
        setLocalFilters({});
        onClear();
        onClose();
    };

    // Flatten categories for select
    const flatCategories = categories.flatMap((cat) => [
        cat,
        ...(cat.children || []),
    ]);

    return (
        <Drawer
            title="Filtros"
            placement="bottom"
            open={open}
            onClose={onClose}
            height="auto"
            styles={{
                body: { padding: 16 },
                content: { borderRadius: '16px 16px 0 0' },
            }}
            extra={
                <Button type="text" size="small" onClick={handleClear}>
                    Limpiar
                </Button>
            }
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                    <label style={{ display: 'block', marginBottom: 4, fontSize: 13, fontWeight: 500 }}>
                        Tipo
                    </label>
                    <Select
                        size="large"
                        allowClear
                        placeholder="Todos los tipos"
                        style={{ width: '100%' }}
                        value={localFilters.type}
                        onChange={(value) => updateFilter('type', value)}
                        options={transactionTypes.map((t) => ({
                            value: t.value,
                            label: t.label,
                        }))}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 4, fontSize: 13, fontWeight: 500 }}>
                        Cuenta
                    </label>
                    <Select
                        size="large"
                        allowClear
                        placeholder="Todas las cuentas"
                        style={{ width: '100%' }}
                        value={localFilters.account_id}
                        onChange={(value) => updateFilter('account_id', value)}
                        options={accounts.map((a) => ({
                            value: a.id,
                            label: a.name,
                        }))}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 4, fontSize: 13, fontWeight: 500 }}>
                        Categoría
                    </label>
                    <Select
                        size="large"
                        allowClear
                        placeholder="Todas las categorías"
                        style={{ width: '100%' }}
                        value={localFilters.category_id}
                        onChange={(value) => updateFilter('category_id', value)}
                        options={flatCategories.map((c) => ({
                            value: c.id,
                            label: c.full_name || c.name,
                        }))}
                    />
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: 4, fontSize: 13, fontWeight: 500 }}>
                            Desde
                        </label>
                        <DatePicker
                            size="large"
                            style={{ width: '100%' }}
                            value={localFilters.date_from ? dayjs(localFilters.date_from) : null}
                            onChange={(date) => updateFilter('date_from', date?.format('YYYY-MM-DD'))}
                            placeholder="Fecha inicio"
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: 4, fontSize: 13, fontWeight: 500 }}>
                            Hasta
                        </label>
                        <DatePicker
                            size="large"
                            style={{ width: '100%' }}
                            value={localFilters.date_to ? dayjs(localFilters.date_to) : null}
                            onChange={(date) => updateFilter('date_to', date?.format('YYYY-MM-DD'))}
                            placeholder="Fecha fin"
                        />
                    </div>
                </div>

                <Button
                    type="primary"
                    size="large"
                    block
                    onClick={handleApply}
                >
                    Aplicar Filtros
                </Button>
            </div>
        </Drawer>
    );
}
