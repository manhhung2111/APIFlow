import '../styles/modals.scss';
import {Button, Modal} from "antd";

export default function AppDeleteModal({title, content, extraContent = "", visible, setVisible, callback = function() {}}) {
	const handleCancel = () => {
		setVisible(false);
	}

	return (
		<Modal title={title} open={visible}
			   className="app-delete-modal"
			   onOk={callback}
			   onCancel={handleCancel}
			   centered
			   maskClosable={false}
			   footer={[
				   <Button key="cancel"  color="default" className="cancel-btn" variant={"filled"} onClick={handleCancel}>
					   Cancel
				   </Button>,
				   <Button
					   key="delete"
					   className="delete-btn"
					   color="default"
					   variant={"filled"}
					   onClick={callback}
				   >
					   Delete
				   </Button>,
			   ]}
		>
			<p className="modal-content">{content}</p>
		</Modal>
	)
}