import {Button, Input, Select, Skeleton, Space} from "antd";
import {SendOutlined} from "@ant-design/icons";
import {useContext} from "react";
import {RequestContext} from "@contexts/request.jsx";
import Request from "@components/request/request.jsx";

export default function RequestEditorUrl(){
	const {request, url, setUrl, params, setParams, handleSend, method, setMethod} = useContext(RequestContext);

	const buildParamsFromUrl = (url) => {
		const params = [];

		try {
			const queryStartIndex = url.indexOf("?");
			if(queryStartIndex !== -1){
				const queryString = url.substring(queryStartIndex + 1);
				const pairs = queryString.split("&");

				for (const pair of pairs) {
					const [key, value] = pair.split("=");
					params.push({selected: 1, key: key || "", value: value || ""});
				}
			}
		} catch (error) {
			console.warn("Error extracting parameters from URL:", error.message);
		}

		return params;
	};

	const handleChangeUrl = (e) => {
		const newUrl = e.target.value;

		const newParams = buildParamsFromUrl(newUrl);

		// Handle update existing params, only update selected params and index remained the same
		let i = 0, j = 0;
		let mergedParams = [];
		while (i < params.length && j < newParams.length) {
			if(!params[i].selected){
				mergedParams.push(params[i]);
				i++;
			} else {
				mergedParams.push({
					selected: 1,
					key: newParams[j].key,
					value: newParams[j].value,
					content: newParams[j].key === params[i].key ? params[i].content : ""
				});
				i++;
				j++;
			}
		}

		while (i < params.length) {
			if(!params[i].selected) mergedParams.push(params[i]);
			i++;
		}

		while (j < newParams.length) {
			mergedParams.push(newParams[j]);
			j++;
		}

		mergedParams.push({selected: 1, key: '', value: '', content: ''});

		setParams(mergedParams);
		setUrl(newUrl)
	}

	const handleChangeMethod = (value) => {
		setMethod(value);
	}

	return (
		<div className="request-editor-url">
			<Space.Compact className="editor-url">
				{request && <>
					<Select
						showSearch
						placeholder="Search to Select"
						optionFilterProp="label"
						defaultValue={method || "GET"}
						options={Object.values(Request.METHODS)}
						onChange={handleChangeMethod}
					/>
					<Input className="url" placeholder="Enter URL or paste text" value={url}
						   onChange={handleChangeUrl}/>
				</>}
				{!request && <Skeleton.Input style={{width: "60vw"}} active={true} />}
			</Space.Compact>
			<div className="editor-action">
				{!request && <Skeleton.Button />}
				{request && <Button type="primary" icon={<SendOutlined />} onClick={handleSend}>
					Send
				</Button>}
			</div>

		</div>
	);
};