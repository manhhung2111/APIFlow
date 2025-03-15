import {useDebounce} from "@uidotdev/usehooks";
import {Button, Dropdown, Space} from "antd";
import {useNavigate} from "react-router";
import {DownOutlined} from "@ant-design/icons";
import {useContext, useEffect, useState} from "react";
import WorkspaceSelectionModal from "@layout/header/navigation/modal.jsx";
import {AppContext} from "@contexts/app.jsx";
import _ from "lodash";

export default function SuperHeaderNavs(){
	const [searchTerm, setSearchTerm] = useState("");
	const debouncedSearchTerm = useDebounce(searchTerm, 500);
	const navigate = useNavigate();
	const [dropdownVisible, setDropdownVisible] = useState(false);
	const {workspaces} = useContext(AppContext);

	const [filterWorkspaces, setFilterWorkspaces] = useState(workspaces);

	useEffect(() => {
		let clone = _.cloneDeep(workspaces);
		const filteredClone = clone.filter(workspace =>
			workspace.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
		);

		setFilterWorkspaces(filteredClone);

	}, [debouncedSearchTerm])

	const handleDropdownVisibleChange = (visible) => {
		setDropdownVisible(visible);
	};

	return (
		<div className="super-header-navs">
			<Button type="text" onClick={() => navigate("/")}>Home</Button>

			<Dropdown
				dropdownRender={() => (
					<WorkspaceSelectionModal setSearchTerm={setSearchTerm} setDropdownVisible={setDropdownVisible}
											 workspaces={filterWorkspaces}/>)}
				trigger={['click']}
				placement="bottomLeft"
				className="workspace-btn"
				open={dropdownVisible}
				onOpenChange={handleDropdownVisibleChange}
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