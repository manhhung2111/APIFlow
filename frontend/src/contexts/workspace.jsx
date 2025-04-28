import {createContext, useContext, useEffect, useState} from 'react';
import {useParams} from "react-router";
import WorkspaceService from "@services/workspace.js";
import io from "socket.io-client";
import {toast} from 'react-toastify';
import {AppContext} from '@contexts/app.jsx';

export const WorkspaceContext = createContext({});

export default function WorkspaceContextProvider(props){
	const {children} = props;
	const {workspace_id, collection_id} = useParams();
	const {user} = useContext(AppContext);

	const [workspace, setWorkspace] = useState(null);
	const [activeEnvironment, setActiveEnvironment] = useState(-1);
	const [activeCollection, setActiveCollection] = useState(null);
	const [activePersona, setActivePersona] = useState(-1);

	const [collections, setCollections] = useState([]);
	const [folders, setFolders] = useState([]);
	const [requests, setRequests] = useState([]);
	const [environments, setEnvironments] = useState([]);
	const [examples, setExamples] = useState([]);
	const [personas, setPersonas] = useState([]);

	const [variables, setVariables] = useState([]);
	const [activeMenuKey, setActiveMenuKey] = useState(1);
	const [socketId, setSocketId] = useState("");

	useEffect(() => {
		const socket = io("http://localhost:8080");
		
		socket.on("connect", () => {
			setSocketId(socket.id);
		});
		
		
		socket.on("collection.import", (data) => {
			setCollections(prev => [...prev, data?.data?.collection || []]);
			setFolders(prev => [...prev, ...data?.data?.folders || []]);
			setRequests(prev => [...prev, ...data?.data?.requests || []]);
			setExamples(prev => [...prev, ...data?.data?.examples || []]);
			toast.success(data?.message);
		})

		return () => {
			socket.off("collection.import");
		}
	}, [])

	useEffect(() => {
		const getWorkspace = async() => {
			const response = await WorkspaceService.getById(workspace_id);

			if(response.code === 0){
				const workspace = response.data.workspace;
				setWorkspace(workspace);
				setCollections(response.data.collections);
				setFolders(response.data.folders);
				setRequests(response.data.requests);
				setEnvironments(response.data.environments);
				setExamples(response.data.examples);
				setPersonas(response.data.personas);
			} else {
				console.error(response.message);
			}
		}

		setWorkspace(null);
		setActiveEnvironment(null);
		setActiveCollection(null);
		getWorkspace();
	}, [workspace_id]);

	useEffect(() => {
		let _variables = getVariablesList();
		console.log("Update variable list");
		setVariables(_variables);
	}, [activeEnvironment, activeCollection, environments]);



	function processVariables(variables_list, scope, seen_variables){
		let result = [];

		for (let i = variables_list.length - 1 ; i >= 0 ; i--) {
			const variable = variables_list[i];
			if(!variable.selected) continue; // Skip unselected variables

			let existing = seen_variables.get(variable.variable);

			let temp_var = {
				scope: scope,
				name: variable.variable,
				type: variable.type || "",
				initial_value: variable.initial_value,
				current_value: variable.current_value,
				is_overridden: ''
			};

			// Check if the variable is overridden by an earlier scope
			if(existing !== undefined){
				temp_var.is_overridden = existing.scope;
			} else {
				// Add the variable to the seen list if not overridden
				seen_variables.set(variable.variable, {
					scope: scope,
					name: variable.variable,
					initial_value: variable.initial_value,
					current_value: variable.current_value
				});
			}

			// Add the variable to the temporary list
			result.push(temp_var);
		}

		// Return the reversed list (since we iterate backward)
		return result;
	}

	function getVariablesList(){
		const globalEnv = environments.find(e => e.scope === 0) || {};

		let activeEnv = {};
		if(activeEnvironment != -1){
			activeEnv = environments.find(e => e.scope === 1 && e._id === activeEnvironment) || {};
		}

		let collectionVariables = [];
		if(activeCollection){
			collectionVariables = activeCollection.variables;
		}

		let _variables = [];
		let seenVariables = new Map();

		_variables.push(...processVariables(activeEnv?.variables || [], 'Environment', seenVariables));
		_variables.push(...processVariables(collectionVariables, 'Collection', seenVariables));
		_variables.push(...processVariables(globalEnv?.variables || [], 'Global', seenVariables));

		_variables = _variables.reverse();

		return _variables;
	}

	return (
		<WorkspaceContext.Provider value={{
			workspace,
			setWorkspace,
			collections,
			setCollections,
			folders,
			setFolders,
			requests,
			setRequests,
			environments,
			setEnvironments,
			activeMenuKey,
			setActiveMenuKey,
			activeEnvironment, setActiveEnvironment,
			activeCollection, setActiveCollection,
			variables, setVariables,
			examples, setExamples,
			personas, setPersonas,
			activePersona, setActivePersona, socketId
		}}>
			{children}
		</WorkspaceContext.Provider>
	);
}