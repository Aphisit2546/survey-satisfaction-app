// ============================================
// Routes Configuration
// ============================================
import { createBrowserRouter } from 'react-router-dom';
import SurveyPage from './pages/SurveyPage/SurveyPage';
import SuccessPage from './pages/SuccessPage/SuccessPage';

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
]);

export default router;