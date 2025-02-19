import {useContext} from "react";
import {RequestContext} from "@contexts/request.jsx";
import {Table} from "antd";

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

	function getCookiesData(){
		function parseCookie(cookie_string){
			let cookie_obj = {
				name: '',
				value: '',
				expires: '',
				domain: '',
				path: '',
				secure: false,
				httpOnly: false
			};

			let cookie_parts = cookie_string.split(';');

			for (let i = 0 ; i < cookie_parts.length ; i++) {
				let part = cookie_parts[i].trim();
				let keyValue = part.split('=');
				let key = keyValue[0].trim().toLowerCase();
				let value = keyValue[1] ? keyValue[1].trim() : true;

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
						cookie_obj.secure = true;
						break;
					case 'httponly':
						cookie_obj.httpOnly = true;
						break;
					default:
						if(!cookie_obj.name){
							cookie_obj.name = key;
							cookie_obj.value = value;
						}
				}
			}

			cookie_obj.httpOnly = cookie_obj.httpOnly ? "true" : "false";
			cookie_obj.secure = cookie_obj.secure ? "true" : "false";

			return cookie_obj;
		};

		const data = [];

		if (response.headers["Set-Cookie"]) {
			for (const cookie of response.headers["Set-Cookie"]) {
				data.push(parseCookie(cookie))
			}
		}

		return data;
	}

	return (
		<div className="request-response-content request-response-cookies">
			<Table bordered columns={columns} dataSource={getCookiesData()}
				   pagination={false}/>
		</div>
	);
}