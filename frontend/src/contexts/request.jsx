import {createContext, useState} from "react";

export const RequestContext = createContext({});

export default function RequestContextProvider(props){
	const {children} = props;

	let [url, setUrl] = useState("https://www.google.com");
	let [params, setParams] = useState([
		{selected: 1, key: "name", value: "hung", content: "This is name"},
		{selected: 0, key: "age", value: 20, content: "This is age"},
		{selected: 0, key: '', value: '', content: ''}
	]);

	let [authorization, setAuthorization] = useState({
		type: 0,
		data: {}
	})

	return (
		<RequestContext.Provider value={{url, setUrl, params, setParams, authorization, setAuthorization}}>
			{children}
		</RequestContext.Provider>
	);
}