import {useContext} from "react";
import {RequestContext} from "@contexts/request.jsx";
import {Table} from "antd";

export default function RequestResponseHeaders(){
	let {response} = useContext(RequestContext);

	const columns = [
		{
			title: 'Key',
			dataIndex: 'headers_key',
			key: 'headers_key',
			ellipsis: true,
		},
		{
			title: 'Value',
			dataIndex: 'headers_value',
			key: 'headers_value',
			ellipsis: true,
		},
	];

	function getHeadersData(){
		const data = [];
		for (const [key, value] of Object.entries(response.headers)) {
			data.push({
				key: data.length,
				headers_key: key,
				headers_value: value
			})
		}

		return data;
	}

	return (
		<div className="request-response-content request-response-headers">
			<Table bordered columns={columns} dataSource={getHeadersData()}
				   pagination={false}/>
		</div>
	);
}