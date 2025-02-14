import {Button, Dropdown} from "antd";
import MoreHorizontalIcon from "@assets/icons/more.horizontal.jsx";
import "@styles/utiles/am/am.scss"

export default function ActionManager({am}){
	const handleClick = (event) => {
		event.stopPropagation(); // Prevent the parent menu from triggering
	};

	return (
		<>
			{am && (
				<Dropdown menu={{ items: am }} placement="bottomRight" className="action-manager" trigger={"click"} overlayClassName="action-manager-dd">
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