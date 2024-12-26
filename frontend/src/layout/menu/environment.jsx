import {useState} from 'react';
import {Divider, Menu} from 'antd';

const EnvironmentMenu = (props) => {
	const {globalEnv, environments} = props;
	const [stateOpenKeys, setStateOpenKeys] = useState([]);
	const onOpenChange = (openKeys) => {
		setStateOpenKeys(openKeys);
	};

	return (
		<div className="environment-menu">
			<Menu
				mode="inline"
				openKeys={stateOpenKeys}
				onOpenChange={onOpenChange}
				items={globalEnv}
			/>
			<Divider />
			<Menu
				mode="inline"
				openKeys={stateOpenKeys}
				onOpenChange={onOpenChange}
				items={environments}
			/>
		</div>
	);
};

export default EnvironmentMenu;
