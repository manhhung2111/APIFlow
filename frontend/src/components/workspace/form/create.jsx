import {Button, Checkbox, Form, Input, Modal} from 'antd';
import { useState } from 'react';

export default function WorkspaceFormCreate({visible, setVisible}) {
	const [confirmLoading, setConfirmLoading] = useState(false);

	const handleSubmit = (values) => {
		console.log(values);
		setConfirmLoading(true)
		setTimeout(() => {
			setVisible(false);
			setConfirmLoading(false);
		}, 2000);
	}

	const handleCancel = () => {

	}

	return (
		<Modal
			title="Create a new workspace"
			open={visible}
			confirmLoading={confirmLoading}
			onCancel={() => setVisible(false)}
			footer={null}
			maskClosable={false}
		>
			<Form
				name="basic"
				onFinish={handleSubmit}
				autoComplete="off"
				layout="vertical"
			>
				<Form.Item label="Name" name="username">
					<Input placeholder={"Workspace name"}/>
				</Form.Item>



				<Form.Item label={null}>
					<Button type="primary" htmlType="submit" loading={confirmLoading}>
						Submit
					</Button>
				</Form.Item>
			</Form>
		</Modal>
	);
}