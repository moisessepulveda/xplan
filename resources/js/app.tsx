import './app/styles/global.css';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@/app/contexts/ThemeContext';
import { ErrorBoundary } from '@/app/components/common/ErrorBoundary';

createInertiaApp({
    title: (title) => (title ? `${title} - XPlan` : 'XPlan'),
    resolve: (name) => {
        const pages = import.meta.glob('./app/pages/**/*.tsx', { eager: true });
        return pages[`./app/pages/${name}.tsx`];
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <ErrorBoundary>
                <ThemeProvider>
                    <App {...props} />
                </ThemeProvider>
            </ErrorBoundary>
        );
    },
    progress: {
        color: '#1677ff',
    },
});

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/sw.js')
            .then((registration) => {
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'activated' && navigator.serviceWorker.controller) {
                                window.dispatchEvent(new CustomEvent('sw-update-available'));
                            }
                        });
                    }
                });
            })
            .catch((error) => {
                console.warn('SW registration failed:', error);
            });
    });
}
