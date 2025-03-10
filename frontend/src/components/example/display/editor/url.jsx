import {Button, Select, Skeleton, Space} from "antd";
import {useContext, useState} from "react";
import Request from "@components/request/request.jsx";
import AppInputVariable from "@components/app/input/variable/input.jsx";
import {ExampleContext} from "@contexts/example.jsx";
import NorthEastIcon from "@assets/icons/north.east.jsx";
import {WorkspaceContext} from "@contexts/workspace.jsx";

export default function ExampleEditorUrl(){
	const {workspace} = useContext(WorkspaceContext);
	const {example, url, setUrl, params, setParams, method, setMethod} = useContext(ExampleContext);

	const [options, setOptions] = useState(Object.values(Request.METHODS));

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

	const handleChangeUrl = (newUrl) => {
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

	const handleSearch = (query) => {
		let temp =  Object.values(Request.METHODS).filter(method => {
				return method.value.toLowerCase().includes(query.toLowerCase())
			}
		);
		setOptions(temp);
	};


	return (
		<div className="request-editor-url">
			<Space.Compact className="editor-url">
				{example && <>
					<Select
						showSearch
						placeholder="Search to Select"
						optionFilterProp="value"
						defaultValue={method || "GET"}
						options={options}
						onChange={handleChangeMethod}
						onSearch={handleSearch}
						disabled={!workspace?.can?.editable}
					/>
					<div className="url">
						<AppInputVariable placeholder="Enter URL or paste text"
										  setText={(value) => handleChangeUrl(value)} text={url} disabled={!workspace?.can?.editable}/>
					</div>
				</>}
				{!example && <Skeleton.Input style={{width: "60vw"}} active={true}/>}
			</Space.Compact>
			<div className="editor-action">
				{!example && <Skeleton.Button/>}
				{example && <Button type="primary" icon={<NorthEastIcon/>}>
					Try
				</Button>}
			</div>

		</div>
	);
};