import {createRoot} from "react-dom/client";
import {BrowserRouter, Route, Routes} from "react-router";
import LoginPage from "@pages/authentication/login";
import RegisterPage from "@pages/authentication/register";
import ForbiddenPage from "@pages/error/forbidden";
import NotFoundPage from "@pages/error/not.found";
import AppContextProvider from "@contexts/app.jsx";
import App from "./app.jsx";
import { ToastContainer } from 'react-toastify';
import AxiosOverlay from "@components/app/utils/axios.overlay.jsx";
import ProtectedRoute from "@layout/routes/protected.jsx";

const root = document.getElementById('root');
if (!root) throw new Error('No root element found');

createRoot(root).render(
    <AppContextProvider>
        <App />
        <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            draggable
            pauseOnHover
            theme="light"
        />
        <AxiosOverlay />
    </AppContextProvider>,
);
