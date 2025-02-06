import {createRoot} from "react-dom/client";
import {BrowserRouter, Route, Routes} from "react-router";
import LoginPage from "@pages/authentication/login";
import RegisterPage from "@pages/authentication/register";
import ForbiddenPage from "@pages/error/forbidden";
import NotFoundPage from "@pages/error/not.found";
import AppContextProvider from "@contexts/app.jsx";
import App from "./app.jsx";
import { ToastContainer } from 'react-toastify';

const root = document.getElementById('root');
if (!root) throw new Error('No root element found');

createRoot(root).render(
    <AppContextProvider>
        <BrowserRouter>
            <Routes>
                <Route path="login" element={<LoginPage/>}/>
                <Route path="register" element={<RegisterPage/>}/>

                <Route path="/">
                    <Route index element={<App />}/>
                </Route>

                <Route path="forbidden" element={<ForbiddenPage/>}/>
                <Route path="*" element={<NotFoundPage/>}/>
            </Routes>
        </BrowserRouter>
        <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />
    </AppContextProvider>,
);
