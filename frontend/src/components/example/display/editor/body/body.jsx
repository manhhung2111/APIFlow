import {Tabs} from "antd";
import {useContext, useState} from "react";
import Request from "@components/request/request.jsx";
import RequestBodyTypeSelector from "@components/request/display/editor/body/type.selector.jsx";
import RequestEditorBodyNone from "@components/request/display/editor/body/none.jsx";
import {ExampleContext} from "@contexts/example.jsx";
import ExampleEditorBodyFormData from "@components/example/display/editor/body/form.data.jsx";
import ExampleEditorBodyFormEncoded from "@components/example/display/editor/body/form.encoded.jsx";
import ExampleEditorBodyFormRaw from "@components/example/display/editor/body/form.raw.jsx";

export default function ExampleEditorBody(){
	let {body, setBody} = useContext(ExampleContext);
	let [activeTab, setActiveTab] = useState(body.type || 0);

	const items = Object.values(Request.BODY_TYPES).map((bodyType) => {
		let html = <RequestEditorBodyNone/>;
		if(bodyType.value === Request.BODY_TYPES.FormData.value){
			html = <ExampleEditorBodyFormData/>;
		} else if(bodyType.value === Request.BODY_TYPES.FormEncoded.value){
			html = <ExampleEditorBodyFormEncoded/>;
		} else if(bodyType.value === Request.BODY_TYPES.FormRaw.value){
			html = <ExampleEditorBodyFormRaw/>;
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