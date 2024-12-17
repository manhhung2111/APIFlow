import {Input, Modal, Select} from "antd";
import {useState} from "react";

export default function UniversalSearchModal(props){
	const {modalState, toggleModalState} = props;
	const [globalSearch, setGlobalSearch] = useState("all");
	const [searchTerm, setSearchTerm] = useState("");
	const [searchFor, setSearchFor] = useState("");

	const globalSearchOptions = [
		{value: "all", label: "All of APIFlow"},
		{value: "personal", label: "Personal Space"},
	];

	const localSearchOptions = [
		{id: 1, value: "workspaces", label: "Workspaces"},
		{id: 1, value: "collections", label: "Collections"},
		{id: 1, value: "requests", label: "Requests"},
	]

	return (
		<Modal
			open={modalState}
			style={{top: 0, left: "50%"}}
			closable={false}
			afterClose={() => toggleModalState(false)}
			footer={null}
			mask={false}
			className={"universal-search-modal"}
		>
			<div className="usm-header">
				<Select
					defaultValue={globalSearch || ""}
					style={{width: 120}}
					options={globalSearchOptions || []}
					onChange={(value) => setGlobalSearch(value)}
				/>

				<Input.Search placeholder={"Search for workspaces, collections, and requests"} defaulValue={searchTerm}
							  onSearch={(value) => setSearchTerm(value)}/>
			</div>
			<div className="usm-main">
				<div className="header">
					{/*{Tab systems go here}*/}
				</div>
			</div>
		</Modal>
	)
}