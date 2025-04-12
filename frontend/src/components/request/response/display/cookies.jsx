import {useContext} from "react";
import {RequestContext} from "@contexts/request.jsx";
import {Table} from "antd";
import {value} from "lodash/seq.js";

export default function RequestResponseCookies(){
	let {response} = useContext(RequestContext);

	const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			ellipsis: true,
		},
		{
			title: 'Value',
			dataIndex: 'value',
			key: 'value',
			ellipsis: true,
		},
		{
			title: 'Domain',
			dataIndex: 'domain',
			key: 'domain',
			ellipsis: true,
		},
		{
			title: 'Path',
			dataIndex: 'path',
			key: 'path',
			ellipsis: true,
		},
		{
			title: 'Expires',
			dataIndex: 'expires',
			key: 'expires',
			ellipsis: true,
		},
		{
			title: 'HttpOnly',
			dataIndex: 'httpOnly',
			key: 'httpOnly',
			ellipsis: true,
		},
		{
			title: 'Secure',
			dataIndex: 'secure',
			key: 'secure',
			ellipsis: true,
		},
	];

	// function getCookiesData(){
	// 	function parseCookie(cookie_string) {
	// 		let cookie_obj = {
	// 			name: '',
	// 			value: '',
	// 			expires: '',
	// 			domain: '',
	// 			path: '',
	// 			secure: false,
	// 			httpOnly: false
	// 		};
	//
	// 		let cookie_parts = cookie_string.split(';');
	//
	// 		for (let i = 0; i < cookie_parts.length; i++) {
	// 			let part = cookie_parts[i].trim();
	//
	// 			// Split only on the first "=" to preserve values containing "="
	// 			let [key, ...rest] = part.split('=');
	// 			let value = rest.length > 0 ? rest.join('=') : true;
	//
	// 			key = key.trim().toLowerCase();
	// 			if (typeof value === "string") value = value.trim();
	//
	// 			switch (key) {
	// 				case 'expires': {
	// 					const expires_date = new Date(value);
	// 					cookie_obj.expires = Math.floor(expires_date.getTime() / 1000); // Convert to UNIX timestamp (seconds)
	// 					break;
	// 				}
	// 				case 'path':
	// 					cookie_obj.path = value;
	// 					break;
	// 				case 'domain':
	// 					cookie_obj.domain = value;
	// 					break;
	// 				case 'secure':
	// 					cookie_obj.secure = true;
	// 					break;
	// 				case 'httponly':
	// 					cookie_obj.httpOnly = true;
	// 					break;
	// 				default:
	// 					if (!cookie_obj.name) {
	// 						cookie_obj.name = key;
	// 						cookie_obj.value = value;
	// 					}
	// 			}
	// 		}
	//
	// 		return cookie_obj;
	// 	}
	//
	// 	const data = [];
	//
	// 	const cookies = response.headers["Set-Cookie"] ?? response.headers["set-cookie"] ?? [];
	// 	for (const cookie of cookies) {
	// 		console.log(parseCookie(cookie));
	// 		data.push(parseCookie(cookie))
	// 	}
	//
	// 	return data;
	// }

	function getCookiesData() {
		function parseCookie(cookie_string) {
			let cookie_obj = {
				name: '',
				value: '',
				expires: 'Session',
				domain: '',
				path: '',
				secure: "false",
				httpOnly: "false"
			};

			let cookie_parts = cookie_string.split(';');

			for (let i = 0; i < cookie_parts.length; i++) {
				let part = cookie_parts[i].trim();

				// Split only on the first "=" to preserve values containing "="
				let [key, ...rest] = part.split('=');
				let value = rest.length > 0 ? rest.join('=') : true;

				key = key.trim().toLowerCase();
				if (typeof value === "string") value = value.trim();

				switch (key) {
					case 'expires': {
						const expires_date = new Date(value);
						cookie_obj.expires = Math.floor(expires_date.getTime() / 1000); // Convert to UNIX timestamp (seconds)
						break;
					}
					case 'path':
						cookie_obj.path = value;
						break;
					case 'domain':
						cookie_obj.domain = value;
						break;
					case 'secure':
						cookie_obj.secure = "true";
						break;
					case 'httponly':
						cookie_obj.httpOnly = "true";
						break;
					default:
						if (!cookie_obj.name) {
							cookie_obj.name = key;
							cookie_obj.value = value;
						}
				}
			}

			return cookie_obj;
		}

		// Ensure headers exist
		if (!response || !response.headers) return [];

		const cookiesHeader = response.headers["set-cookie"] ?? response.headers["Set-Cookie"];
		if (!cookiesHeader) return [];

		const cookiesArray = Array.isArray(cookiesHeader) ? cookiesHeader : [cookiesHeader];
		return cookiesArray.map(parseCookie);
	}

	return (
		<div className="request-response-content request-response-cookies">
			<Table bordered columns={columns} dataSource={getCookiesData()}
				   pagination={false}/>
		</div>
	);
}