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
				inlineIndent={16}
			/>
			<Divider />
			<Menu
				mode="inline"
				openKeys={stateOpenKeys}
				onOpenChange={onOpenChange}
				items={environments}
				inlineIndent={16}
			/>
		</div>
	);
};

export default EnvironmentMenu;
