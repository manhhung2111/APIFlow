import {createContext, useState} from "react";

export const RequestContext = createContext({});

export default function RequestContextProvider(props){
	const {children} = props;

	let [url, setUrl] = useState("https://www.google.com");
	let [params, setParams] = useState([
		{selected: 0, key: '', value: '', content: ''}
	]);

	let [authorization, setAuthorization] = useState({type: 0, data: {}});
	let [headers, setHeaders] = useState([
		{selected: 0, key: '', value: '', content: ''}
	]);

	return (
		<RequestContext.Provider value={{url, setUrl, params, setParams, authorization, setAuthorization, headers, setHeaders}}>
			{children}
		</RequestContext.Provider>
	);
}