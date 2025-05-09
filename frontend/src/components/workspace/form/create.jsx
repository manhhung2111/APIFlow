import {Button, Form, Input, Modal} from 'antd';
import '../styles/form.scss'
import WorkspaceService from "@services/workspace.js";
import {toast} from "react-toastify";
import {useContext, useState} from "react";
import {AppContext} from "@contexts/app.jsx";
import {useNavigate} from "react-router";
import AppMarkdownEditor from "@components/app/editor/markdown.edtior.jsx";

export default function WorkspaceFormCreate({visible, setVisible}){
	const [form] = Form.useForm();
	const {setWorkspaces} = useContext(AppContext);
	const [content, setContent] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async(values) => {
		const response = await WorkspaceService.create(values['name'], content);

		if(response.code === 0){
			toast.success(response.message);
			handleCancel();
			setWorkspaces(prev => ([...prev, response.data.workspace]));
			navigate(`/workspace/${response.data.workspace._id}`);
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
				setContent(quill.root.innerHTML);
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
					<AppMarkdownEditor value={content} onChange={setContent} height={200}/>
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