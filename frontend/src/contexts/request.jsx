import {createContext, useState} from "react";

export const RequestContext = createContext({});

export default function RequestContextProvider(props){
	const {children} = props;

	let [url, setUrl] = useState("");
	let [params, setParams] = useState([{selected: 1, key: '', value: '', content: ''}]);

	let [authorization, setAuthorization] = useState({type: 0, data: {}});
	let [headers, setHeaders] = useState([
		{selected: 1, key: 'Accept', value: '*/*', content: '', disabled: true},
		{selected: 1, key: 'Accept-Encoding', value: 'gzip, deflate, br', content: '', disabled: true},
		{selected: 1, key: 'Connection', value: 'keep-alive', content: '', disabled: true},
		{selected: 0, key: '', value: '', content: ''}
	]);

	let [body, setBody] = useState({
		type: 0,
		data: {
			form_data: [{selected: 1, key: '', type: 'text', value: '', content: ''}],
			form_encoded: [{selected: 1, key: '', value: '', content: ''}],
			form_raw: {}
		}
	});

	return (
		<RequestContext.Provider value={{url, setUrl, params, setParams, authorization, setAuthorization, headers, setHeaders, body, setBody}}>
			{children}
		</RequestContext.Provider>
	);
}