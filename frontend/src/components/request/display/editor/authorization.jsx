import {useContext} from "react";
import {RequestContext} from "@contexts/request.jsx";

export default function RequestEditorAuthorization() {
	let {authorization, setAuthorization} = useContext(RequestContext);
}