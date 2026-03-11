import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router';

import App from './app';
import { routesSection } from './routes/sections';
import { ErrorBoundary } from './routes/components';

import { LanguageProvider } from './context/language-context';

const router = createBrowserRouter([
  {
    Component: () => (
      <LanguageProvider>
        <App>
          <Outlet />
        </App>
      </LanguageProvider>
    ),
    errorElement: <ErrorBoundary />,
    children: routesSection,
  },
]);

const root = createRoot(document.getElementById('root')!);

root.render(
    <RouterProvider router={router} />
);
