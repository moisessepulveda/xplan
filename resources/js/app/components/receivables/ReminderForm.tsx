import React from 'react';
import { Form, DatePicker, Input, Button, Modal } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: { remind_at: string; message: string }) => void;
    loading: boolean;
}

export function ReminderForm({ open, onClose, onSubmit, loading }: Props) {
    const [remindAt, setRemindAt] = React.useState('');
    const [message, setMessage] = React.useState('');

    const handleSubmit = () => {
        onSubmit({ remind_at: remindAt, message });
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <BellOutlined />
                    <span>Programar Recordatorio</span>
                </div>
            }
            centered
            styles={{ content: { borderRadius: 16 } }}
        >
            <Form layout="vertical" onFinish={handleSubmit} style={{ marginTop: 16 }}>
                <Form.Item label="Fecha y hora del recordatorio" required>
                    <DatePicker
                        showTime
                        size="large"
                        style={{ width: '100%' }}
                        value={remindAt ? dayjs(remindAt) : null}
                        onChange={(date) => setRemindAt(date?.toISOString() || '')}
                        placeholder="Seleccionar fecha y hora"
                        disabledDate={(current) => current && current < dayjs().startOf('day')}
                    />
                </Form.Item>

                <Form.Item label="Mensaje (opcional)">
                    <Input.TextArea
                        placeholder="Ej: Recordar cobro a Juan"
                        rows={2}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, marginTop: 16 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        block
                        loading={loading}
                    >
                        Programar Recordatorio
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}
