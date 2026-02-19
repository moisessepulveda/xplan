import React from 'react';
import { Card, Skeleton, Row, Col } from 'antd';

interface Props {
    type?: 'dashboard' | 'list' | 'detail' | 'form';
}

export function PageSkeleton({ type = 'list' }: Props) {
    if (type === 'dashboard') {
        return (
            <div style={{ padding: 16 }}>
                <Card style={{ borderRadius: 16, marginBottom: 16 }} styles={{ body: { padding: 20 } }}>
                    <Skeleton active paragraph={{ rows: 2 }} />
                </Card>
                <Row gutter={12} style={{ marginBottom: 16 }}>
                    <Col span={12}>
                        <Card style={{ borderRadius: 12 }} styles={{ body: { padding: 16 } }}>
                            <Skeleton active paragraph={false} />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card style={{ borderRadius: 12 }} styles={{ body: { padding: 16 } }}>
                            <Skeleton active paragraph={false} />
                        </Card>
                    </Col>
                </Row>
                <Card style={{ borderRadius: 12, marginBottom: 16 }} styles={{ body: { padding: 16 } }}>
                    <Skeleton active paragraph={{ rows: 3 }} />
                </Card>
            </div>
        );
    }

    if (type === 'detail') {
        return (
            <div style={{ padding: 16 }}>
                <Card style={{ borderRadius: 12, marginBottom: 16 }} styles={{ body: { padding: 16 } }}>
                    <Skeleton active paragraph={{ rows: 4 }} />
                </Card>
                <Card style={{ borderRadius: 12 }} styles={{ body: { padding: 16 } }}>
                    <Skeleton active paragraph={{ rows: 6 }} />
                </Card>
            </div>
        );
    }

    if (type === 'form') {
        return (
            <div style={{ padding: 16 }}>
                <Card style={{ borderRadius: 12 }} styles={{ body: { padding: 16 } }}>
                    <Skeleton active paragraph={{ rows: 8 }} />
                </Card>
            </div>
        );
    }

    // Default: list
    return (
        <div style={{ padding: 16 }}>
            {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} style={{ borderRadius: 12, marginBottom: 8 }} styles={{ body: { padding: 12 } }}>
                    <Skeleton avatar active paragraph={{ rows: 1 }} />
                </Card>
            ))}
        </div>
    );
}
