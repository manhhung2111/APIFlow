import {Breadcrumb, Dropdown, Typography} from 'antd';
import HttpIcon from "@assets/icons/http.jsx";
import {NavLink} from "react-router";
import {DeleteOutlined, EditOutlined, SaveOutlined} from "@ant-design/icons";

const {Text} = Typography;
export default function RequestDisplayHeader(){
	const requestActions = [
		{label: 'Edit', key: '1', icon: <EditOutlined />,},
		{label: 'Delete', key: '2', icon: <DeleteOutlined />, danger: 1},
	]

	return (
		<div className='request-display-header'>
			<Breadcrumb
				className="rdh-breadcrumb"
				separator=""
				items={[{
					title: <Text><HttpIcon style={{fontSize: "30px", marginRight: "5px", color: "#1F509A"}}/></Text>,
				}, {
					title: <NavLink to={"collection/1"}>Collection 1</NavLink>
				}, {
					type: 'separator',
				}, {
					title: <NavLink to={"request/1"}>Request 1</NavLink>
				}]}
			/>
			<Dropdown.Button
				className="rdh-actions"
				menu={{items: requestActions}}
				type="default"
			>
				<SaveOutlined style={{fontSize: "14px"}} /> Actions
			</Dropdown.Button>
		</div>
	);
};