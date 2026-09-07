import { createBrowserRouter, RouterProvider } from 'react-router';
import { routes } from '@/routes';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import './styles/slds.css';

// Normalize basename: strip trailing slash so it matches URLs like /lwr/application/ai/c-app.
// Inside Salesforce the LWR runtime injects SFDC_ENV.basePath. When the bundle is served
// standalone under a sub-path (GitHub project Pages, e.g. /multiframework-recipes/), the
// build sets VITE_PAGES_BASE so react-router can match the sub-path. (import.meta.env.BASE_URL
// can't be used here: the UI-bundle plugin forces base "./", so BASE_URL isn't the sub-path.)
const sfdcBasePath = (globalThis as any).SFDC_ENV?.basePath;
const pagesBase = import.meta.env.VITE_PAGES_BASE as string | undefined;
const rawBasePath =
  typeof sfdcBasePath === 'string' ? sfdcBasePath : pagesBase || undefined;
const basename =
  typeof rawBasePath === 'string' ? rawBasePath.replace(/\/+$/, '') : undefined;
const router = createBrowserRouter(routes, { basename });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
