import {createRoot} from "react-dom/client";
import AppContextProvider from "@contexts/app.jsx";
import App from "./app.jsx";
import {ToastContainer} from 'react-toastify';
import AxiosOverlay from "@components/app/utils/axios.overlay.jsx";

const root = document.getElementById('root');
if(!root) throw new Error('No root element found');

createRoot(root).render(
	<AppContextProvider>
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
	</AppContextProvider>,
);
