import {createRoot} from "react-dom/client";
import "./index.css";
import {BrowserRouter, Route, Routes} from "react-router";
import LoginPage from "@pages/authentication/login";
import RegisterPage from "@pages/authentication/register";
import ForbiddenPage from "@pages/error/forbidden";
import NotFoundPage from "@pages/error/not.found";

const root = document.getElementById('root');
if (!root) throw new Error('No root element found');

createRoot(root).render(
    <BrowserRouter>
        <Routes>
            <Route path="login" element={<LoginPage/>}/>
            <Route path="register" element={<RegisterPage/>}/>


            <Route path="forbidden" element={<ForbiddenPage/>}/>
            <Route path="*" element={<NotFoundPage/>}/>
        </Routes>
    </BrowserRouter>,
);
