import {Input, Modal, Select, Typography, Radio, Space} from "antd";
import {useState} from "react";
import {UserOutlined} from "@ant-design/icons";
import CollectionIcon from "@assets/icons/collection.jsx";
import RequestIcon from "@assets/icons/request.jsx";
import EmptySearchImg from "@assets/images/empty.search.svg";

const {Text} = Typography;

export default function UniversalSearchModal(props){
	const {modalState, toggleModalState} = props;
	const [globalSearch, setGlobalSearch] = useState("all");
	const [searchTerm, setSearchTerm] = useState("");
	const [searchFor, setSearchFor] = useState("workspaces");

	const globalSearchOptions = [
		{value: "all", label: "All of APIFlow", className: "global-select-item"},
		{value: "personal", label: "Personal Space", className: "global-select-item"},
	];



	return (
		<Modal
			open={modalState} closable={false} onCancel={() => toggleModalState(false)}
			footer={null} width={700} className={"universal-search-modal"}
		>
			<div className="usm-header">
				<Select
					defaultValue={globalSearch || ""} options={globalSearchOptions || []}
					onChange={(value) => setGlobalSearch(value)}
					variant="filled"
					style={{width: "150px"}}
				/>
				<Input placeholder="Search for workspaces, collections, and requests" allowClear
					   value={searchTerm}
					   onChange={(e) => setSearchTerm(e.target.value)} variant="borderless"/>
			</div>
			<div className="usm-main">
				<div className="header">
					<Space size={"middle"}>
						<Text color="#6B6B6B">Search for:</Text>
						<Radio.Group onChange={(e) => setSearchFor(e.target.value)} defaultValue={searchFor} className={"radio-group"}>
							<Space size={"small"}>
								<Radio.Button variant={"filled"} value="workspaces"><UserOutlined style={{fontSize: "14px"}}/> Workspaces</Radio.Button>
								<Radio.Button variant={"filled"} value="collections"><CollectionIcon style={{fontSize: "14px"}}/> Collections</Radio.Button>
								<Radio.Button variant={"filled"} value="requests"><RequestIcon style={{fontSize: "14px"}}/> Requests</Radio.Button>
							</Space>
						</Radio.Group>
					</Space>
				</div>
				<div className="main">
					<img src={EmptySearchImg} alt={"Empty search image"}/>
				</div>
			</div>
		</Modal>
	)
}