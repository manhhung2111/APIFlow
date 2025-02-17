import {createContext, useContext, useEffect, useState} from "react";
import {useParams} from "react-router";
import RequestService from "@services/request.jsx";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import {toast} from "react-toastify";
import {setSelectionNoUndo} from "codemirror/src/model/selection_updates.js";

export const RequestContext = createContext({});

export default function RequestContextProvider(props){
	const {children} = props;
	const {workspace} = useContext(WorkspaceContext);

	let [request, setRequest] = useState(null);
	let [name, setName] = useState("");
	let [url, setUrl] = useState("");
	let [params, setParams] = useState(null);
	let [authorization, setAuthorization] = useState(null);
	let [headers, setHeaders] = useState(null);

	let [body, setBody] = useState(null);

	let [scripts, setScripts] = useState({
		pre_request: "",
		post_response: ""
	});

	let [response, setResponse] = useState({
		"body": {
			"id": 1,
			"title": "Essence Mascara Lash Princess",
			"description": "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.",
			"category": "beauty",
			"price": 9.99,
			"discountPercentage": 7.17,
			"rating": 4.94,
			"stock": 5,
			"tags": [
				"beauty",
				"mascara"
			],
			"brand": "Essence",
			"sku": "RCH45Q1A",
			"weight": 2,
			"dimensions": {
				"width": 23.17,
				"height": 14.43,
				"depth": 28.01
			},
			"warrantyInformation": "1 month warranty",
			"shippingInformation": "Ships in 1 month",
			"availabilityStatus": "Low Stock",
			"reviews": [
				{
					"rating": 2,
					"comment": "Very unhappy with my purchase!",
					"date": "2024-05-23T08:56:21.618Z",
					"reviewerName": "John Doe",
					"reviewerEmail": "john.doe@x.dummyjson.com"
				},
				{
					"rating": 2,
					"comment": "Not as described!",
					"date": "2024-05-23T08:56:21.618Z",
					"reviewerName": "Nolan Gonzalez",
					"reviewerEmail": "nolan.gonzalez@x.dummyjson.com"
				},
				{
					"rating": 5,
					"comment": "Very satisfied!",
					"date": "2024-05-23T08:56:21.618Z",
					"reviewerName": "Scarlett Wright",
					"reviewerEmail": "scarlett.wright@x.dummyjson.com"
				}
			],
			"returnPolicy": "30 days return policy",
			"minimumOrderQuantity": 24,
			"meta": {
				"createdAt": "2024-05-23T08:56:21.618Z",
				"updatedAt": "2024-05-23T08:56:21.618Z",
				"barcode": "9164035109868",
				"qrCode": "..."
			},
			"thumbnail": "...",
			"images": ["...", "...", "..."]
		},
		"headers": {
			"cache-control": "no-store, no-cache, must-revalidate, proxy-revalidate",
			"content-type": "application/json; charset=utf-8",
			"content-length": "1234",
			"date": "Mon, 05 Feb 2024 12:34:56 GMT",
			"etag": "W/\"abcdef123456\"",
			"expires": "0",
			"pragma": "no-cache",
			"server": "nginx/1.21.6",
			"x-powered-by": "Express",
			"Set-Cookie": [
				"sessionId=abcdef123456; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=Tue, 06 Feb 2024 12:34:56 GMT",
				"userId=789xyz; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=Tue, 06 Feb 2024 12:34:56 GMT",
				"token=securetoken; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=Tue, 06 Feb 2024 12:34:56 GMT"
			]
		},
		"status": "201",
		"statusText": "Created",
		"time": 23000,
		"request_size": {headers: 2000, body: 1400},
		"response_size": {headers: 2000, body: 1400},
	})

	const {request_id} = useParams();
	useEffect(() => {
		const fetchData = async() => {
			const response = await RequestService.getById(request_id, workspace._id);

			if(response.code === 0){
				const request = response.data.request;
				setRequest(request);
				setName(request.name);
				setUrl(request.url);
				setParams([...request.params, {selected: 0, key: '', value: '', content: ''}]);
				setAuthorization(request.authorization);
				setHeaders([...request.headers, {selected: 0, key: '', value: '', content: ''}]);
				setBody({
					type: request.body.type,
					data: {
						form_data: [...request.body.data.form_data, {selected: 0, key: '', type: 'text', value: '', content: ''}],
						form_encoded: [...request.body.data.form_encoded, {selected: 0, key: '', value: '', content: ''}],
						form_raw: request.body.data.form_raw
					}
				});
				setScripts(request.scripts);
			} else {
				toast.error(response.message);
			}
		}

		if (workspace) {
			fetchData();
		}
	}, [request_id, workspace]);

	return (
		<RequestContext.Provider value={{
			name, setName,
			url,
			setUrl,
			params,
			setParams,
			authorization,
			setAuthorization,
			headers,
			setHeaders,
			body,
			setBody,
			scripts,
			setScripts,
			response,
			setResponse,
			request,
			setRequest
		}}>
			{children}
		</RequestContext.Provider>
	);
}