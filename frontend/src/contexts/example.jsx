import {createContext, useContext, useEffect, useState} from "react";
import {useParams} from "react-router";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import {toast} from "react-toastify";
import _ from "lodash";
import ExampleService from "@services/example.js";

export const ExampleContext = createContext({});

export default function ExampleContextProvider(props){
	const {children} = props;
	const {workspace, examples, setExamples, setActiveCollection} = useContext(WorkspaceContext);

	let [example, setExample] = useState(null);
	let [request, setRequest] = useState(null);
	let [exampleFolder, setExampleFolder] = useState(null);

	let [name, setName] = useState("");
	let [method, setMethod] = useState("");
	let [url, setUrl] = useState("");
	let [params, setParams] = useState(null);
	let [headers, setHeaders] = useState(null);
	let [body, setBody] = useState(null);
	let [responseBody, setResponseBody] = useState(null);
	let [responseHeaders, setResponseHeaders] = useState(null);
	let [responseStatus, setResponseStatus] = useState("");
	const {example_id} = useParams();

	const updateExample = async(example) => {
		let request = example.request;

		setExample(example);
		setName(example.name);
		setUrl(request.url);
		setMethod(request.method);
		setParams([...request.params, {key: '', value: ''}]);
		setHeaders([...request.headers, {key: '', value: ''}]);
		setBody({
			type: request.body.type,
			data: {
				form_data: [...request.body.data.form_data, {
					selected: 1,
					key: '',
					type: 'text',
					value: '',
					content: ''
				}],
				form_encoded: [...request.body.data.form_encoded, {
					selected: 1,
					key: '',
					value: '',
					content: ''
				}],
				form_raw: request.body.data.form_raw
			}
		});
		setResponseBody(example.response.body);
		setResponseHeaders([...Object.entries(example.response.headers).map(([key, value]) => ({key, value})), {
			key: "",
			value: ""
		}]);
		setResponseStatus(example.response.status);
	}

	useEffect(() => {
		const fetchData = async() => {
			const result = await ExampleService.getById(example_id, workspace._id);

			if(result.code === 0){
				const example = result.data.example;
				await updateExample(example);

				setRequest(result.data.request);
				setExampleFolder(result.data?.folder ?? null);
				setActiveCollection(result.data.collection);
			} else {
				toast.error(result.message);
			}
		}

		if(workspace){
			setExample(null);
			setResponseBody(null);
			setResponseHeaders(null);
			setResponseStatus("");
			fetchData();
		}
	}, [example_id, workspace]);

	const handleSave = async() => {
		const response = {
			body: responseBody,
			headers: Object.fromEntries(responseHeaders.slice(0, -1).map(({key, value}) => [key, value])),
			status: responseStatus
		};

		const result = await ExampleService.save(example, method, url, params, headers, body, response);

		if(result.code === 0){
			toast.success(result.message);
			let example = result.data.example;
			await updateExample(example);

			const clone = _.cloneDeep(examples);
			for (const e of clone) {
				if(e._id === example._id){
					e.method = method;
				}
			}
			setExamples(clone);
		} else {
			toast.error(result.message);
		}
	}

	const handleDelete = () => {

	}

	const handleChangeName = async(value) => {
		if(value == name) return;
		const response = await ExampleService.updateName(example, value);

		if(response.code === 0){
			setName(response.data.example.name);
			setExample(response.data.example);

			const clone = _.cloneDeep(examples);
			for (const e of clone) {
				if(e._id === example._id){
					e.name = value;
				}
			}
			setExamples(clone);
		} else {
			toast.error(response.message);
		}
	}

	const actionManagers = [
		// {key: `add_example_${request?._id}`, label: "Add example", onClick: handleAddExample},
		// {key: `duplicate_${request?._id}`, label: "Duplicate",},
		// {key: `delete_${request?._id}`, label: "Delete", onClick: handleDelete, danger: 1},
	]

	return (
		<ExampleContext.Provider value={{
			name, setName,
			url,
			setUrl,
			params,
			setParams,
			headers,
			setHeaders,
			body,
			setBody,
			responseBody, setResponseBody,
			responseHeaders, setResponseHeaders,
			responseStatus, setResponseStatus,
			request,
			setRequest,
			exampleFolder, setExampleFolder,
			example, setExample,
			handleSave, actionManagers, method, setMethod, handleChangeName
		}}>
			{children}
		</ExampleContext.Provider>
	);
}