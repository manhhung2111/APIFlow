import {useState} from 'react';
import {AppstoreOutlined, FolderOutlined, MoreOutlined, SettingOutlined} from '@ant-design/icons';
import {Button, Dropdown, Menu} from 'antd';
import CollectionIcon from "@assets/icons/collection";

const ActionMenu = ({itemKey}) => {
	const actions = (
		<Menu
			items={[
				{
					key: `${itemKey}-edit`,
					label: 'Edit',
					onClick: () => console.log(`Edit clicked for ${itemKey}`),
				},
				{
					key: `${itemKey}-delete`,
					label: 'Delete',
					onClick: () => console.log(`Delete clicked for ${itemKey}`),
				},
			]}
		/>
	);

	const handleClick = (event) => {
		event.stopPropagation(); // Prevent the parent menu from triggering
	};

	return (
		<Dropdown overlay={actions} trigger={['click']}>
			<Button
				type="text"
				icon={<MoreOutlined/>}
				onClick={handleClick} // Stop propagation on button click
			/>
		</Dropdown>
	);
};

const items = [
	{
		key: '1',
		icon: <CollectionIcon style={{fontSize: "14px"}}/>,
		label: (
			<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
				<span>Navigation One</span>
				<ActionMenu itemKey="1"/>
			</div>
		),
		children: [
			{
				key: '11',
				label: 'Option 1',
			},
			{
				key: '12',
				label: 'Option 2',
			},
			{
				key: '13',
				label: 'Option 3',
			},
			{
				key: '14',
				label: 'Option 4',
			},
		],
	},
	{
		key: '2',
		icon: <AppstoreOutlined/>,
		label: (
			<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
				<span>Navigation Two</span>
				<ActionMenu itemKey="2"/>
			</div>
		),
		children: [
			{
				key: '21',
				label: 'Option 1',
				icon: <FolderOutlined/>,
			},
			{
				key: '22',
				label: 'Option 2',
				icon: <FolderOutlined/>,
			},
			{
				key: '23',
				label: 'Submenu',
				icon: <FolderOutlined/>,
				children: [
					{
						key: '231',
						label: 'Option 1',
					},
					{
						key: '232',
						label: 'Option 2',
					},
					{
						key: '233',
						label: 'Option 3',
					},
				],
			},
			{
				key: '24',
				label: 'Submenu 2',
				children: [
					{
						key: '241',
						label: 'Option 1',
					},
					{
						key: '242',
						label: 'Option 2',
					},
					{
						key: '243',
						label: 'Option 3',
					},
				],
			},
		],
	},
	{
		key: '3',
		icon: <SettingOutlined/>,
		label: (
			<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
				<span>Navigation Three</span>
				<ActionMenu itemKey="3"/>
			</div>
		),
		children: [
			{
				key: '31',
				label: 'Option 1',
			},
			{
				key: '32',
				label: 'Option 2',
			},
			{
				key: '33',
				label: 'Option 3',
			},
			{
				key: '34',
				label: 'Option 4',
			},
		],
	},
];

const PrimaryMenu = () => {
	const [stateOpenKeys, setStateOpenKeys] = useState(['2', '23']);
	const onOpenChange = (openKeys) => {
		setStateOpenKeys(openKeys);
	};

	return (
		<div className="primary-menu">
			<Menu
				mode="inline"
				defaultSelectedKeys={['231']}
				openKeys={stateOpenKeys}
				onOpenChange={onOpenChange}
				items={items}
			/>
		</div>
	);
};

export default PrimaryMenu;
