import './app/styles/global.css';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@/app/contexts/ThemeContext';

createInertiaApp({
    title: (title) => (title ? `${title} - XPlan` : 'XPlan'),
    resolve: (name) => {
        const pages = import.meta.glob('./app/pages/**/*.tsx', { eager: true });
        return pages[`./app/pages/${name}.tsx`];
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <ThemeProvider>
                <App {...props} />
            </ThemeProvider>
        );
    },
    progress: {
        color: '#1677ff',
    },
});
