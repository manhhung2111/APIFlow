import {Button, Dropdown} from "antd";
import MoreHorizontalIcon from "@assets/icons/more.horizontal.jsx";

export default function ActionManager(props){
	const {am} = props;

	const handleClick = (event) => {
		event.stopPropagation(); // Prevent the parent menu from triggering
	};

	return (
		<>
			{am && (
				<Dropdown menu={{ items: am }} placement="bottomRight" className="action-manager">
					<Button
						type="text"
						icon={<MoreHorizontalIcon/>}
						onClick={handleClick} // Stop propagation on button click
					/>
				</Dropdown>
			)}
		</>
	);
}