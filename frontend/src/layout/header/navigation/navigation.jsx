import {useDebounce} from "@uidotdev/usehooks";
import {Button, Dropdown, Space} from "antd";
import {useNavigate} from "react-router";
import {DownOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import WorkspaceSelectionModal from "@layout/header/navigation/modal.jsx";

export default function SuperHeaderNavs(){
	const [searchTerm, setSearchTerm] = useState("");
	const debouncedSearchTerm = useDebounce(searchTerm, 500);
	const navigate = useNavigate();

	useEffect(() => {
		console.log(`Search workspaces with ${debouncedSearchTerm}`);
	}, [debouncedSearchTerm])

	return (
		<div className="super-header-navs">
			<Button type="text" onClick={() => navigate("/")}>Home</Button>

			<Dropdown
				dropdownRender={() => (<WorkspaceSelectionModal setSearchTerm={setSearchTerm}/>)}
				trigger={['click']}
				placement="bottomLeft"
				className="workspace-btn"
			>
				<Space>
					<Button type="text">
						Workspaces
						<DownOutlined className="dropdown-icon"/>
					</Button>
				</Space>
			</Dropdown>
		</div>

	);
};