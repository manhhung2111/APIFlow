import {createContext, useContext, useEffect, useState} from "react";
import {useParams} from "react-router";
import RequestService from "@services/request.jsx";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import {toast} from "react-toastify";
import _ from "lodash";
import Request from "@components/request/request.jsx";

export const RequestContext = createContext({});

export default function RequestContextProvider(props){
	const {children} = props;
	const {workspace, requests, setRequests} = useContext(WorkspaceContext);

	let [request, setRequest] = useState(null);
	let [requestFolder, setRequestFolder] = useState(null);
	let [requestCollection, setRequestCollection] = useState(null);

	let [name, setName] = useState("");
	let [method, setMethod] = useState("");
	let [url, setUrl] = useState("");
	let [params, setParams] = useState(null);
	let [authorization, setAuthorization] = useState(null);
	let [headers, setHeaders] = useState(null);

	let [body, setBody] = useState(null);

	let [scripts, setScripts] = useState({
		pre_request: "",
		post_response: ""
	});

	let [response, setResponse] = useState(null)

	const {request_id} = useParams();

	const updateRequest = async (request) => {
		setRequest(request);
		setName(request.name);
		setUrl(request.url);
		setMethod(request.method);
		setParams([...request.params, {selected: 1, key: '', value: '', content: ''}]);
		setAuthorization(request.authorization);
		setHeaders([...request.headers, {selected: 1, key: '', value: '', content: ''}]);
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
		setScripts(request.scripts);
	}

	useEffect(() => {
		const fetchData = async() => {
			const response = await RequestService.getById(request_id, workspace._id);

			if(response.code === 0){
				const request = response.data.request;
				await updateRequest(request);

				setRequestFolder(response.data?.folder ?? null);
				setRequestCollection(response.data.collection);
			} else {
				toast.error(response.message);
			}
		}

		if(workspace){
			setRequest(null);
			setResponse(null);
			fetchData();
		}
	}, [request_id, workspace]);

	const handleSave = async () => {
		const response = await RequestService.save(request, method, url, params, authorization, headers, body, scripts);

		if (response.code === 0) {
			toast.success(response.message);
			let request = response.data.request;
			await updateRequest(request);

			const clone = _.cloneDeep(requests);
			for (const e of clone) {
				if(e._id === request._id){
					e.method = method;
				}
			}
			setRequests(clone);
		} else {
			toast.error(response.message);
		}
	}

	const handleAddExample = () => {

	}

	const handleDelete = () => {

	}

	const handleSend = async () => {
		// Construct authorization type and data if the authorization type is inherit
		let refactor_auth = _.cloneDeep(authorization);
		if (authorization.type === Request.AUTHORIZATION.InheritAuth.value) {
			if (requestFolder?.authorization.type !== Request.AUTHORIZATION.InheritAuth.value) {
				refactor_auth.type = requestFolder.authorization.type;
				refactor_auth.data = requestFolder.authorization.data;
			} else {
				refactor_auth.type = requestCollection.authorization.type;
				refactor_auth.data = requestCollection.authorization.data;
			}
		}

		const response = await RequestService.send(request, method, url, params, refactor_auth, headers, body, scripts);

		if (response.code === 0) {
			setResponse(response.data.response);
		} else {
			toast.error(response.message);
		}
	}


	const handleChangeName = async (value) => {
		if (value == name) return;
		const response = await RequestService.updateName(request, value);

		if (response.code === 0) {
			setName(response.data.request.name);
			setRequest(response.data.request);

			const clone = _.cloneDeep(requests);
			for (const e of clone) {
				if(e._id === request._id){
					e.name = value;
				}
			}
			setRequests(clone);
		} else {
			toast.error(response.message);
		}
	}

	const actionManagers = [
		{key: `add_example_${request?._id}`, label: "Add example", onClick: handleAddExample},
		{key: `duplicate_${request?._id}`, label: "Duplicate",},
		{key: `delete_${request?._id}`, label: "Delete", onClick: handleDelete, danger: 1},
	]


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
			setRequest,
			requestFolder, setRequestFolder,
			requestCollection, setRequestCollection,
			handleSave, actionManagers, handleSend, method, setMethod, handleChangeName
		}}>
			{children}
		</RequestContext.Provider>
	);
}