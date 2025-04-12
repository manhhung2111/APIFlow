import {createRoot} from "react-dom/client";
import App from "./app.jsx";
import {ToastContainer} from 'react-toastify';
import AxiosOverlay from "@components/app/utils/axios.overlay.jsx";
import {BrowserRouter} from "react-router";
import {GoogleOAuthProvider} from "@react-oauth/google";

const root = document.getElementById('root');
if(!root) throw new Error('No root element found');

createRoot(root).render(
	<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
		<BrowserRouter>
			<App/>
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
			<AxiosOverlay/>
		</BrowserRouter>
	</GoogleOAuthProvider>
);
