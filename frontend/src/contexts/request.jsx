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
			form_raw: ""
		}
	});

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

	return (
		<RequestContext.Provider value={{
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
			setResponse
		}}>
			{children}
		</RequestContext.Provider>
	);
}