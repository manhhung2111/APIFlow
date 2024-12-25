import {useState} from 'react';
import {Menu} from 'antd';
import {DownOutlined} from "@ant-design/icons";

const PrimaryMenu = (props) => {
	const {items} = props;
	const [stateOpenKeys, setStateOpenKeys] = useState([]);
	const onOpenChange = (openKeys) => {
		setStateOpenKeys(openKeys);
	};

	return (
		<div className="primary-menu">
			<Menu
				mode="inline"
				openKeys={stateOpenKeys}
				onOpenChange={onOpenChange}
				items={items}
				inlineIndent={16}
				expandIcon={
					<DownOutlined
						style={{fontSize: "10px"}}
						className={"menu-item-icon"}
					/>
				}
			/>
		</div>
	);
};

export default PrimaryMenu;
