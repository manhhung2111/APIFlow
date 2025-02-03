import {Tabs} from "antd";
import {useContext, useState} from "react";
import {RequestContext} from "@contexts/request.jsx";
import Request from "@components/request/request.js";
import RequestBodyTypeSelector from "@components/request/display/editor/body/type.selector.jsx";
import RequestEditorBodyNone from "@components/request/display/editor/body/none.jsx";
import RequestEditorBodyFormData from "@components/request/display/editor/body/form.data.jsx";
import RequestEditorBodyFormEncoded from "@components/request/display/editor/body/form.encoded.jsx";
import RequestEditorBodyFormRaw from "@components/request/display/editor/body/form.raw.jsx";

export default function RequestEditorBody(){
	let {body, setBody} = useContext(RequestContext);
	let [activeTab, setActiveTab] = useState(body.type || 0);

	const items = Object.values(Request.BODY_TYPES).map((bodyType) => {
		let html = <RequestEditorBodyNone/>;
		if(bodyType.value === Request.BODY_TYPES.FormData.value){
			html = <RequestEditorBodyFormData/>;
		} else if(bodyType.value === Request.BODY_TYPES.FormEncoded.value){
			html = <RequestEditorBodyFormEncoded/>;
		} else if(bodyType.value === Request.BODY_TYPES.FormRaw.value){
			html = <RequestEditorBodyFormRaw/>;
		}

		return {
			label: <RequestBodyTypeSelector bodyType={bodyType} checked={activeTab === bodyType.value}/>,
			key: bodyType.value,
			children: html
		}
	});

	const handleSetActiveTab = (key) => {
		setActiveTab(key);
		setBody(prev => ({...prev, type: key}));
	}

	return (
		<div className="request-editor request-editor-body">
			<Tabs items={items} activeKey={activeTab} onChange={(key) => handleSetActiveTab(key)} size={"small"}
				  tabBarGutter={16}/>
		</div>
	);
}