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

	return (
		<RequestContext.Provider value={{params, url, setUrl, setParams}}>
			{children}
		</RequestContext.Provider>
	);
}