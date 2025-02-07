import {Button, Form, Input, Modal} from 'antd';
import TextEditor from "@components/app/editor/text.editor.jsx";
import '../styles/form.scss'
import WorkspaceService from "@services/workspace.js";
import {toast} from "react-toastify";
import {useContext} from "react";
import {AppContext} from "@contexts/app.jsx";

export default function WorkspaceFormCreate({visible, setVisible}){
	const [form] = Form.useForm();
	const {setWorkspaces} = useContext(AppContext);

	const handleSubmit = async (values) => {
		console.log(values);
		const response = await WorkspaceService.create(values['name']);

		if (response.code === 0) {
			toast.success(response.message);
			handleCancel();
			setWorkspaces(prev => ([...prev, response.data.workspace]));
		} else {
			toast.error(response.message);
		}
	}

	const handleCancel = () => {
		form.resetFields();
		setVisible(false);
	}

	const handleChangeContent = (quill, quillRef) => {
		if(quill){
			quill.on('text-change', (delta, oldDelta, source) => {
				console.log('Text change!');
				console.log(quill.getText()); // Get text only
				console.log(quill.getContents()); // Get delta contents
				console.log(quill.root.innerHTML); // Get innerHTML using quill
				console.log(quillRef.current.firstChild.innerHTML); // Get innerHTML using quillRef
			});
		}
	}

	return (
		<Modal
			title="Create a new workspace"
			open={visible}
			onCancel={handleCancel}
			footer={null}
			maskClosable={false}
			width={600}
			className="workspace-form-create"
		>
			<Form
				name="basic"
				onFinish={handleSubmit}
				autoComplete="off"
				layout="vertical"
				form={form}
			>
				<Form.Item label="Name" name="name">
					<Input placeholder={"Workspace name"}/>
				</Form.Item>
				<Form.Item label="Description" name="content">
					<TextEditor handleChange={handleChangeContent}/>
				</Form.Item>
				<div className="footer">
					<Button color="default" variant="filled" onClick={handleCancel}>
						Cancel
					</Button>
					<Button className="submit-btn" color="geekblue" variant="solid" htmlType="submit">
						Submit
					</Button>
				</div>
			</Form>
		</Modal>
	);
}