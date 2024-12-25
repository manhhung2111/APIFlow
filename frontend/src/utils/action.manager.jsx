import {Button, Dropdown} from "antd";
import {MoreOutlined} from "@ant-design/icons";

export default function ActionManager(props){
	const {am} = props;

	const handleClick = (event) => {
		event.stopPropagation(); // Prevent the parent menu from triggering
	};

	return (
		<Dropdown menu={{items: am}} placement="bottomRight" className="action-manager">
			<Button
				type="text"
				icon={<MoreOutlined/>}
				onClick={handleClick} // Stop propagation on button click
			/>
		</Dropdown>
	);
}