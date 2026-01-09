// ============================================
// Routes Configuration
// ============================================
import { createBrowserRouter } from 'react-router-dom';
import SurveyPage from './pages/SurveyPage/SurveyPage';
import SuccessPage from './pages/SuccessPage/SuccessPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <SurveyPage />,
        errorElement: <div>404 - Page Not Found</div>,
    },
    {
        path: '/success',
        element: <SuccessPage />,
    },
    {
        path: '/dashboard',
        element: <DashboardPage />,
    },
]);

export default router;